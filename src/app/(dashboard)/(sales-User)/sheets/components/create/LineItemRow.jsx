"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const r2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

const pn = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const s = String(v)
    .replace(/[$,\s%"']/g, "")
    .trim();
  if (s === "-" || s === "") return 0;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

/**
 * Parse percent cell → store as PLAIN 0-100 number.
 * Text paste "18.00%"  → 18
 * Text paste "0.80%"   → 0.80
 * xlsx decimal 0.18    → 18
 * Plain number 50      → 50
 */
const pctToPlain = (raw) => {
  const str = String(raw ?? "").trim();
  const n = pn(raw);
  if (str.includes("%")) return n;
  if (n > 0 && n <= 1) return +(n * 100).toFixed(6);
  return n;
};

const fmtAED = (v) =>
  `AED ${Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ─── CALCULATION ENGINE ───────────────────────────────────────────────────────
// All % stored 0-100 in state → divide by 100 before math
//
// EXCEL COLUMN MAP (0-indexed):
//  0  Part Number       ← INPUT
//  1  Item Name         ← INPUT
//  2  Unit Net USD      ← INPUT
//  3  Unit ERP USD      ← INPUT
//  4  Default Markup %  ← SKIP (calc)
//  5  MS Discount %     ← INPUT  stored 0-100
//  6  Crayon Markup %   ← INPUT  stored 0-100
//  7  Unit Type         ← INPUT
//  8-11                 ← SKIP (calc)
//  12 Qty               ← INPUT
//  13-15                ← SKIP (calc)
//  16 Rebate %          ← INPUT  stored 0-100
//  17-18                ← SKIP (calc)
//  19 SWO GP %          ← INPUT  stored 0-100 (PER YEAR)

export function calcLineItem(
  item,
  exchangeRate = 3.6725,
  dealType = "NORMAL",
  yearSuffix = "",
) {
  const s = yearSuffix;

  const unitNet = Number(item[`unit_net_usd${s}`] ?? item.unit_net_usd ?? 0);
  const unitErp = Number(item[`unit_erp_usd${s}`] ?? item.unit_erp_usd ?? 0);
  // FIX: /100 — all % stored as 0-100 plain number
  const msDiscPct =
    Number(item[`ms_discount${s}`] ?? item.ms_discount ?? 0) / 100;
  const crayonMuPct =
    Number(item[`crayon_markup${s}`] ?? item.crayon_markup ?? 0) / 100;
  const rebatePct =
    Number(item[`rebate_percent${s}`] ?? item.rebate_percent ?? 0) / 100;
  const qty = Number(item[`qty${s}`] ?? item.qty ?? 0);
  const unitType = Number(item.unit_type ?? 0);
  // FIX: swo_gp_percent is PER YEAR → swo_gp_percent | swo_gp_percent_y2 | swo_gp_percent_y3
  const swoGpPct =
    Number(item[`swo_gp_percent${s}`] ?? item.swo_gp_percent ?? 0) / 100;

  const msDiscNet = r2(unitNet * (1 - msDiscPct) * exchangeRate);
  const msDiscErp = r2(unitErp * (1 - msDiscPct) * exchangeRate);
  const totalNet = r2(msDiscNet * unitType * qty);
  const totalErp = r2(msDiscErp * unitType * qty);

  const hasDefaultMarkup = Math.abs(unitErp - unitNet) > 0.001;
  let eupUnit;
  if (hasDefaultMarkup && crayonMuPct > 0) {
    eupUnit =
      dealType === "RAMPED"
        ? r2(msDiscNet / (1 - crayonMuPct))
        : r2(msDiscNet * (1 + crayonMuPct));
  } else {
    eupUnit = msDiscErp;
  }

  const totalEup = r2(eupUnit * qty * unitType);
  const rebateAmt = r2(totalNet * rebatePct);
  const gp = r2(totalEup - totalNet);
  const swoGp = r2(gp * swoGpPct);
  const partnerGp = r2(gp - swoGp);

  const defaultMarkup = unitNet > 0 ? ((unitErp - unitNet) / unitNet) * 100 : 0;
  const calcMarkupPct =
    msDiscNet > 0 ? ((eupUnit - msDiscNet) / msDiscNet) * 100 : 0;

  return {
    msDiscNet,
    msDiscErp,
    totalNet,
    totalErp,
    eupUnit,
    totalEup,
    rebateAmt,
    gp,
    swoGp,
    partnerGp,
    defaultMarkup,
    calcMarkupPct,
  };
}

// ─── ROW COMPONENT ────────────────────────────────────────────────────────────

export function LineItemRow({
  item,
  index,
  onUpdate,
  onRemove,
  region,
  onBatchPaste,
  activeYear,
  exchangeRate = 3.6725,
  dealType = "NORMAL",
}) {
  const isAfrica = region === "AFRICA";

  const suf =
    activeYear === "year2" ? "_y2" : activeYear === "year3" ? "_y3" : "";
  const yf = (base) => `${base}${suf}`;
  const yv = (base) => {
    const val = item[yf(base)];
    return val !== undefined && val !== null ? val : (item[base] ?? 0);
  };

  const calc = calcLineItem(item, exchangeRate, dealType, suf);

  // ── PASTE HANDLER ─────────────────────────────────────────────────────────
  const handlePaste = (e) => {
    const raw = e.clipboardData.getData("text");
    if (!raw || !raw.includes("\t")) return;
    e.preventDefault();

    const genId = () =>
      Math.random().toString(36).slice(2) + Date.now().toString(36);

    const lines = raw.split(/\r?\n/);
    const joined = [];
    let buf = "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const firstCol = (line.split("\t")[0] || "").trim();
      const isPartRow = /^[A-Z0-9]{2,}-[A-Z0-9]+$/i.test(firstCol);

      if (isPartRow) {
        if (buf) joined.push(buf);
        buf = line;
      } else if (buf) {
        buf += " " + line;
      } else {
        buf = line;
      }
    }
    if (buf) joined.push(buf);

    const parsed = [];
    let cat = "Enterprise Online";

    for (const line of joined) {
      const cols = line
        .split("\t")
        .map((c) => c.replace(/^["'\s]+|["'\s]+$/g, "").trim());
      const partNo = cols[0] || "";
      const name = (cols[1] || "").replace(/\n/g, " ").trim();
      const text = `${partNo} ${name}`.toLowerCase();

      if (!partNo) {
        if (/enterprise online/i.test(text)) cat = "Enterprise Online";
        else if (/on.?premise/i.test(text)) cat = "Additional On Premise";
        else if (/additional/i.test(text)) cat = "Additional";
        continue;
      }
      if (!/^[A-Z0-9]{2,}-[A-Z0-9]+$/i.test(partNo)) continue;
      if (/total|grand|year\s?[123]/i.test(text)) continue;

      const swoVal =
        cols[19] !== "" && cols[19] !== null && cols[19] !== undefined
          ? pctToPlain(cols[19])
          : 0;

      const newItem = {
        id: genId(),
        category: cat,
        part_number: partNo,
        item_name: name,

        // FIX: swo_gp_percent — 3 separate year fields, default 50
        unit_type: parseInt(pn(cols[7])) || 0,
        swo_gp_percent: 0,
        swo_gp_percent_y2: 0,
        swo_gp_percent_y3: 0,

        qty: 0,
        unit_net_usd: 0,
        unit_erp_usd: 0,
        ms_discount: 0,
        crayon_markup: 0,
        rebate_percent: 0,
        qty_y2: 0,
        unit_net_usd_y2: 0,
        unit_erp_usd_y2: 0,
        ms_discount_y2: 0,
        crayon_markup_y2: 0,
        rebate_percent_y2: 0,
        qty_y3: 0,
        unit_net_usd_y3: 0,
        unit_erp_usd_y3: 0,
        ms_discount_y3: 0,
        crayon_markup_y3: 0,
        rebate_percent_y3: 0,
      };

      // Populate active-year fields
      newItem[yf("unit_net_usd")] = pn(cols[2]);
      newItem[yf("unit_erp_usd")] = pn(cols[3]);
      newItem[yf("ms_discount")] = pctToPlain(cols[5]);
      newItem[yf("crayon_markup")] = pctToPlain(cols[6]);
      newItem[yf("qty")] = parseInt(pn(cols[12])) || 0;
      newItem[yf("rebate_percent")] = pctToPlain(cols[16]);
      newItem[yf("swo_gp_percent")] = swoVal; // FIX: active-year bucket

      parsed.push(newItem);
    }

    if (parsed.length > 0 && onBatchPaste) onBatchPaste(parsed, index);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  const inputCls = "h-9 text-[11px] w-full border-slate-300";
  const numInputCls = `${inputCls} text-right`;
  const calcCell = "text-[11px] text-center font-mono whitespace-nowrap px-2";

  return (
    <TableRow className="hover:bg-blue-50/20 border-b border-slate-200">
      {/* Category */}
      <TableCell className="min-w-42.5 px-1 py-1">
        <Select
          value={item.category || "Enterprise Online"}
          onValueChange={(v) => onUpdate("category", v)}
        >
          <SelectTrigger className="h-9 text-[11px] w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Enterprise Online">Enterprise Online</SelectItem>
            <SelectItem value="Additional">Additional</SelectItem>
            <SelectItem value="Additional On Premise">
              Additional On Premise
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Part Number – paste target */}
      <TableCell className="min-w-35 px-1 py-1 bg-green-50/40">
        <Input
          className={`${inputCls} border-green-300`}
          value={item.part_number || ""}
          onChange={(e) => onUpdate("part_number", e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste here"
        />
      </TableCell>

      {/* Item Name */}
      <TableCell className="min-w-60 px-1 py-1">
        <Input
          className={inputCls}
          value={item.item_name || ""}
          onChange={(e) => onUpdate("item_name", e.target.value)}
          placeholder="Item name"
        />
      </TableCell>

      {/* Unit Net USD */}
      <TableCell className="min-w-25 px-1 py-1">
        <Input
          className={numInputCls}
          type="number"
          step="0.01"
          value={yv("unit_net_usd")}
          onChange={(e) =>
            onUpdate(yf("unit_net_usd"), parseFloat(e.target.value) || 0)
          }
        />
      </TableCell>

      {/* Unit ERP USD */}
      <TableCell className="min-w-25 px-1 py-1">
        <Input
          className={numInputCls}
          type="number"
          step="0.01"
          value={yv("unit_erp_usd")}
          onChange={(e) =>
            onUpdate(yf("unit_erp_usd"), parseFloat(e.target.value) || 0)
          }
        />
      </TableCell>

      {/* Default Markup % – read-only */}
      <TableCell
        className={`min-w-20 ${calcCell} bg-slate-50 text-slate-500`}
      >
        {calc.defaultMarkup.toFixed(2)}%
      </TableCell>

      {/* MS Discount % */}
      <TableCell className="min-w-22.5 px-1 py-1">
        <Input
          className={numInputCls}
          type="number"
          step="0.01"
          value={yv("ms_discount")}
          onChange={(e) =>
            onUpdate(yf("ms_discount"), parseFloat(e.target.value) || 0)
          }
        />
      </TableCell>

      {/* Crayon Markup % */}
      <TableCell className="min-w-22.5 px-1 py-1">
        <Input
          className={numInputCls}
          type="number"
          step="0.001"
          value={yv("crayon_markup")}
          onChange={(e) =>
            onUpdate(yf("crayon_markup"), parseFloat(e.target.value) || 0)
          }
        />
      </TableCell>

      {/* Unit Type */}
      <TableCell className="min-w-18.75 px-1 py-1">
        <Input
          className="h-9 text-[11px] text-center w-full border-slate-300"
          inputMode="numeric"
          value={
            item.unit_type === undefined || item.unit_type === null
              ? 12
              : item.unit_type
          }
          onChange={(e) => {
            const raw = e.target.value;
            onUpdate("unit_type", raw === "" ? "" : parseInt(raw) || 12);
          }}
          onBlur={(e) => onUpdate("unit_type", parseInt(e.target.value) || 12)}
        />
      </TableCell>

      {/* MS Disc Net – calc */}
      <TableCell
        className={`min-w-23.75 ${calcCell} bg-blue-50/40 text-blue-700`}
      >
        {calc.msDiscNet.toFixed(3)}
      </TableCell>

      {/* MS Disc ERP – calc */}
      <TableCell
        className={`min-w-23.75 ${calcCell} bg-blue-50/40 text-blue-700 border-r`}
      >
        {calc.msDiscErp.toFixed(2)}
      </TableCell>

      {/* Total Net – calc */}
      <TableCell
        className={`min-w-32.5 ${calcCell} bg-blue-100/60 font-bold text-slate-800`}
      >
        {fmtAED(calc.totalNet)}
      </TableCell>

      {/* Total ERP – calc */}
      <TableCell
        className={`min-w-32.5 ${calcCell} bg-blue-100/60 font-bold text-slate-800 border-r`}
      >
        {fmtAED(calc.totalErp)}
      </TableCell>

      {/* Qty */}
      <TableCell className="min-w-20 px-1 py-1 bg-yellow-50/60">
        <Input
          className="h-9 text-[11px] text-center font-bold w-full border-yellow-300"
          inputMode="numeric"
          value={yv("qty")}
          onChange={(e) => onUpdate(yf("qty"), parseInt(e.target.value) || 0)}
        />
      </TableCell>

      {/* EUP unit – calc */}
      <TableCell className={`min-w-23.75 ${calcCell} text-green-700`}>
        {calc.eupUnit.toFixed(2)}
      </TableCell>

      {/* Total EUP – calc */}
      <TableCell
        className={`min-w-32.5 ${calcCell} bg-green-100/60 font-bold text-green-900 border-x`}
      >
        {fmtAED(calc.totalEup)}
      </TableCell>

      {/* Calc Markup % – read-only */}
      <TableCell
        className={`min-w-20 ${calcCell} bg-slate-50 text-slate-500`}
      >
        {calc.calcMarkupPct.toFixed(2)}%
      </TableCell>

      {/* Rebate % */}
      <TableCell className="min-w-21.25 px-1 py-1 border-l">
        <Input
          className={numInputCls}
          type="number"
          step="0.01"
          value={yv("rebate_percent")}
          onChange={(e) =>
            onUpdate(yf("rebate_percent"), parseFloat(e.target.value) || 0)
          }
        />
      </TableCell>

      {/* Rebate Amount – calc */}
      <TableCell
        className={`min-w-30 ${calcCell} bg-yellow-50/60 text-yellow-800`}
      >
        {fmtAED(calc.rebateAmt)}
      </TableCell>

      {/* Africa GP columns — only when region === "AFRICA" */}
      {isAfrica && (
        <>
          <TableCell
            className={`min-w-30 ${calcCell} bg-purple-50/50 text-purple-800`}
          >
            {fmtAED(calc.gp)}
          </TableCell>
          {/* FIX: year-aware via yv/yf */}
          <TableCell className="min-w-20 px-1 py-1 bg-purple-100/50">
            <Input
              className="h-9 text-[11px] text-center w-full"
              type="number"
              value={yv("swo_gp_percent")}
              onChange={(e) =>
                onUpdate(yf("swo_gp_percent"), parseFloat(e.target.value) || 0)
              }
            />
          </TableCell>
          <TableCell
            className={`min-w-30 ${calcCell} bg-purple-50/50 text-purple-800`}
          >
            {fmtAED(calc.swoGp)}
          </TableCell>
          <TableCell
            className={`min-w-30 ${calcCell} bg-orange-50/50 text-orange-800`}
          >
            {fmtAED(calc.partnerGp)}
          </TableCell>
        </>
      )}

      {/* Delete */}
      <TableCell className="px-1 py-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
          onClick={onRemove}
        >
          <Trash2 size={14} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
