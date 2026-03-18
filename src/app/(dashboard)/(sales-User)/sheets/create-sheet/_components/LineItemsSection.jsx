"use client";
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Plus, Info, FileUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineItemRow, calcLineItem } from "./LineItemRow";

// ─── SUMMARY FOOTER ───────────────────────────────────────────────────────────

export function SummaryFooter({
  items,
  region,
  activeYear,
  dealType,
  exchangeRate = 3.6725,
}) {
  const isAfrica = region === "AFRICA";
  const suf =
    activeYear === "year2" ? "_y2" : activeYear === "year3" ? "_y3" : "";
  const valid = items.filter((i) => i.part_number || i.item_name);

  let totNet = 0,
    totErp = 0,
    totQty = 0,
    totEup = 0,
    totRebate = 0;
  let totGp = 0,
    totSwoGp = 0,
    totPartnerGp = 0;

  valid.forEach((item) => {
    const c = calcLineItem(item, exchangeRate, dealType, suf);
    totNet += c.totalNet;
    totErp += c.totalErp;
    totEup += c.totalEup;
    totRebate += c.rebateAmt;
    totGp += c.gp;
    totSwoGp += c.swoGp;
    totPartnerGp += c.partnerGp;
    totQty += Number(item[`qty${suf}`] ?? item.qty ?? 0);
  });

  const fmt = (v) =>
    `AED ${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <TableRow className="bg-muted border-t-2 border-border font-bold text-[11px]">
      <TableCell
        colSpan={11}
        className="py-2 pr-4 text-right text-muted-foreground uppercase tracking-wide text-xs"
      >
        TOTALS:
      </TableCell>
      <TableCell className="bg-secondary/20 text-center text-secondary py-2 whitespace-nowrap">
        {fmt(totNet)}
      </TableCell>
      <TableCell className="bg-secondary/20 text-center text-secondary py-2 whitespace-nowrap border-r">
        {fmt(totErp)}
      </TableCell>
      <TableCell className="bg-muted text-center py-2">
        {totQty.toLocaleString()}
      </TableCell>
      <TableCell />
      <TableCell className="bg-primary/10 text-center text-primary py-2 whitespace-nowrap border-x">
        {fmt(totEup)}
      </TableCell>
      <TableCell className="bg-muted" />
      <TableCell className="bg-muted border-l" />
      <TableCell className="bg-muted text-center text-foreground py-2 whitespace-nowrap">
        {fmt(totRebate)}
      </TableCell>
      {isAfrica && (
        <>
          <TableCell className="bg-secondary/10 text-center text-secondary py-2 whitespace-nowrap">
            {fmt(totGp)}
          </TableCell>
          <TableCell className="bg-secondary/10" />
          <TableCell className="bg-secondary/10 text-center text-secondary py-2 whitespace-nowrap">
            {fmt(totSwoGp)}
          </TableCell>
          <TableCell className="bg-primary/10 text-center text-primary py-2 whitespace-nowrap">
            {fmt(totPartnerGp)}
          </TableCell>
        </>
      )}
      <TableCell />
    </TableRow>
  );
}

// ─── EMPTY ROW FACTORY ────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const emptyRow = () => ({
  id: uid(),
  category: "Enterprise Online",
  part_number: "",
  item_name: "",
  unit_type: 0,

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
});

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────

export function LineItemsSection({
  items,
  onChange,
  region,
  dealType,
  exchangeRate = 3.6725,
}) {
  const [activeYear, setActiveYear] = useState("year1");
  const fileInputRef = useRef(null);

  const isAfrica = region === "AFRICA";
  const isRamped = dealType === "RAMPED";

  const addRow = () => onChange([...items, emptyRow()]);

  useEffect(() => {
    if (items.length === 0) onChange([emptyRow()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleBatchPaste = (parsedItems, currentIndex) => {
    const updated = [...items];
    if (updated[currentIndex]) {
      updated.splice(
        currentIndex,
        1,
        ...parsedItems.map((p, i) => ({
          ...emptyRow(),
          ...p,
          id: i === 0 ? updated[currentIndex].id : uid(),
        })),
      );
    } else {
      updated.push(
        ...parsedItems.map((p) => ({ ...emptyRow(), ...p, id: uid() })),
      );
    }
    onChange(updated);
  };

  // ── EXCEL IMPORT ──────────────────────────────────────────────────────────
  const handleExcelImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(new Uint8Array(evt.target.result), {
          type: "array",
        });
        const ws = wb.Sheets["Costing"] || wb.Sheets[wb.SheetNames[0]];
        if (!ws) {
          alert("Sheet 'Costing' not found.");
          return;
        }

        const rows = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
          raw: true,
        });

        const pn = (v) => {
          if (v === null || v === undefined || v === "") return 0;
          if (typeof v === "number") return +v.toFixed(10); // ← raw numeric, just clean floating point
          const s = String(v)
            .replace(/[$,\s%"']/g, "")
            .trim();
          const n = parseFloat(s);
          return isNaN(n) ? 0 : n;
        };

        const pp = (v) => {
          const str = String(v ?? "").trim();
          const n = pn(v);
          if (str.includes("%")) return n;
          if (n > 0 && n <= 1) return +(n * 100).toFixed(6);
          return n;
        };
        // const pp = (v) => {
        //   if (typeof v === "number") {
        //     // Excel raw percent: 0.20 → 20, plain number 50 → 50
        //     return (v > 0 && v <= 1) ? +(v * 100).toFixed(6) : +v.toFixed(6);
        //   }
        //   const str = String(v ?? "").trim();
        //   const n   = pn(v);
        //   if (str.includes("%")) return n;
        //   if (n > 0 && n <= 1) return +(n * 100).toFixed(6);
        //   return n;
        // };

        const isPartNo = (v) =>
          /^[A-Z0-9]{2,}-[A-Z0-9]+$/i.test(String(v || "").trim());

        let y2HeaderRow = -1,
          y3HeaderRow = -1;
        for (let i = 0; i < rows.length; i++) {
          const text = (rows[i] || []).join(" ").toLowerCase();
          if (
            y2HeaderRow < 0 &&
            /year\s*2/.test(text) &&
            !isPartNo(rows[i]?.[0])
          )
            y2HeaderRow = i;
          if (
            y3HeaderRow < 0 &&
            /year\s*3/.test(text) &&
            !isPartNo(rows[i]?.[0])
          )
            y3HeaderRow = i;
        }
        const isRampedFile = y2HeaderRow > 0;

        // FIX: parseSection now returns swo_gp_percent from col 19 per section
        const parseSection = (startRow, endRow = rows.length) => {
          const section = [];
          let cat = "Enterprise Online";

          for (let i = startRow; i < Math.min(endRow, rows.length); i++) {
            const row = rows[i] || [];
            const col0 = String(row[0] || "").trim();
            const col1 = String(row[1] || "").trim();
            const text = `${col0} ${col1}`.toLowerCase();

            if (!col0) {
              if (/enterprise online/i.test(text)) cat = "Enterprise Online";
              else if (/on.?premise/i.test(text)) cat = "Additional On Premise";
              else if (/additional/i.test(text)) cat = "Additional";
              continue;
            }

            if (!isPartNo(col0)) continue;
            if (/total|grand/i.test(text)) continue;

            section.push({
              category: cat,
              part_number: col0,
              item_name: col1.replace(/\n/g, " "),
              unit_type: parseInt(pn(row[7])) || 0,
              unit_net_usd: pn(row[2]),
              unit_erp_usd: pn(row[3]),
              ms_discount: pp(row[5]),
              crayon_markup: pp(row[6]),
              qty: parseInt(pn(row[12])) || 0,
              rebate_percent: pp(row[16]),
              swo_gp_percent:
                row[19] !== "" && row[19] !== null && row[19] !== undefined
                  ? pp(row[19])
                  : 0,
            });
          }
          return section;
        };

        const y1End = isRampedFile ? y2HeaderRow : rows.length;
        const y2End = y3HeaderRow > 0 ? y3HeaderRow : rows.length;

        const y1 = parseSection(0, y1End);
        const y2 = isRampedFile ? parseSection(y2HeaderRow + 1, y2End) : [];
        const y3 =
          isRampedFile && y3HeaderRow > 0 ? parseSection(y3HeaderRow + 1) : [];

        if (y1.length === 0) {
          alert(
            "No valid products found.\nMake sure the sheet has part numbers like 'AAA-00000'.",
          );
          return;
        }

        // FIX: merge — swo_gp stored per year separately
        const merged = {};
        y1.forEach((it) => {
          merged[it.part_number] = {
            ...emptyRow(),
            category: it.category,
            part_number: it.part_number,
            item_name: it.item_name,
            unit_type: it.unit_type,
            swo_gp_percent: it.swo_gp_percent, // Y1
            unit_net_usd: it.unit_net_usd,
            unit_erp_usd: it.unit_erp_usd,
            ms_discount: it.ms_discount,
            crayon_markup: it.crayon_markup,
            qty: it.qty,
            rebate_percent: it.rebate_percent,
          };
        });
        y2.forEach((it) => {
          const k = it.part_number;
          if (!merged[k])
            merged[k] = {
              ...emptyRow(),
              category: it.category,
              part_number: k,
              item_name: it.item_name,
              unit_type: it.unit_type,
            };
          Object.assign(merged[k], {
            unit_net_usd_y2: it.unit_net_usd,
            unit_erp_usd_y2: it.unit_erp_usd,
            ms_discount_y2: it.ms_discount,
            crayon_markup_y2: it.crayon_markup,
            qty_y2: it.qty,
            rebate_percent_y2: it.rebate_percent,
            swo_gp_percent_y2: it.swo_gp_percent, // FIX: Y2 from its own section
          });
        });
        y3.forEach((it) => {
          const k = it.part_number;
          if (!merged[k])
            merged[k] = {
              ...emptyRow(),
              category: it.category,
              part_number: k,
              item_name: it.item_name,
              unit_type: it.unit_type,
            };
          Object.assign(merged[k], {
            unit_net_usd_y3: it.unit_net_usd,
            unit_erp_usd_y3: it.unit_erp_usd,
            ms_discount_y3: it.ms_discount,
            crayon_markup_y3: it.crayon_markup,
            qty_y3: it.qty,
            rebate_percent_y3: it.rebate_percent,
            swo_gp_percent_y3: it.swo_gp_percent, // FIX: Y3 from its own section
          });
        });

        const final = Object.values(merged).map((it) => ({ ...it, id: uid() }));
        onChange(final);
        alert(
          `✅ Imported ${final.length} products${isRampedFile ? " (Ramped 3-Year)" : ""}`,
        );
      } catch (err) {
        console.error("Import error:", err);
        alert("❌ Import failed: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = null;
  };

  // ── API PAYLOAD BUILDER ───────────────────────────────────────────────────
  LineItemsSection.buildPayload = (lineItems) =>
    lineItems
      .filter((i) => i.part_number?.trim() || i.item_name?.trim())
      .map((item) => ({
        part_number: item.part_number || "N/A",
        product_name: item.item_name || "Unknown",
        product_type: (() => {
          const cat = item.category || "Enterprise Online";
          if (/enterprise online/i.test(cat)) return "ENTERPRISE_ONLINE";
          if (/on.?premise/i.test(cat)) return "ON_PREMISE";
          if (/additional/i.test(cat)) return "ADDITIONAL_ONLINE";
          return "OTHER";
        })(),
        unit_type: Number(item.unit_type || 0),

        // Year 1
        quantity_y1: Number(item.qty || 0),
        unit_net_usd_y1: Number(item.unit_net_usd || 0),
        unit_erp_usd_y1: Number(item.unit_erp_usd || 0),
        ms_discount_percentage_y1: Number(item.ms_discount || 0) / 100,
        markup_percentage_y1: Number(item.crayon_markup || 0) / 100,
        rebate_percentage_y1: Number(item.rebate_percent || 0) / 100,
        swo_gp_percentage_y1: Number(item.swo_gp_percent || 0) / 100, // FIX: per year

        // Year 2
        quantity_y2: Number(item.qty_y2 || 0),
        unit_net_usd_y2: Number(item.unit_net_usd_y2 || 0),
        unit_erp_usd_y2: Number(item.unit_erp_usd_y2 || 0),
        ms_discount_percentage_y2: Number(item.ms_discount_y2 || 0) / 100,
        markup_percentage_y2: Number(item.crayon_markup_y2 || 0) / 100,
        rebate_percentage_y2: Number(item.rebate_percent_y2 || 0) / 100,
        swo_gp_percentage_y2: Number(item.swo_gp_percent_y2 || 0) / 100, // FIX: per year

        // Year 3
        quantity_y3: Number(item.qty_y3 || 0),
        unit_net_usd_y3: Number(item.unit_net_usd_y3 || 0),
        unit_erp_usd_y3: Number(item.unit_erp_usd_y3 || 0),
        ms_discount_percentage_y3: Number(item.ms_discount_y3 || 0) / 100,
        markup_percentage_y3: Number(item.crayon_markup_y3 || 0) / 100,
        rebate_percentage_y3: Number(item.rebate_percent_y3 || 0) / 100,
        swo_gp_percentage_y3: Number(item.swo_gp_percent_y3 || 0) / 100, // FIX: per year
      }));

  // ── RENDER ────────────────────────────────────────────────────────────────
  const thCls = "text-[10px] font-bold text-center whitespace-nowrap px-2 py-2";

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-blue-100 flex-wrap gap-3">
        <div className="flex gap-3 items-center flex-wrap">
          {isRamped && (
            <Tabs value={activeYear} onValueChange={setActiveYear}>
              <TabsList className="grid grid-cols-3 h-9">
                <TabsTrigger value="year1" className="text-xs font-bold px-4">
                  Year 1
                </TabsTrigger>
                <TabsTrigger value="year2" className="text-xs font-bold px-4">
                  Year 2
                </TabsTrigger>
                <TabsTrigger value="year3" className="text-xs font-bold px-4">
                  Year 3
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-secondary bg-muted border-border gap-2 h-9 font-semibold"
          >
            <FileUp size={14} /> Import Excel
          </Button>
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Info size={13} className="text-secondary" />
          {isRamped ? (
            <span className="font-bold text-secondary">
              {activeYear.replace("year", "Year ")} active
            </span>
          ) : (
            <span>Normal Deal · Rate: {exchangeRate}</span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-slate-200 overflow-x-auto">
        <Table
          className="border-collapse"
          style={{ minWidth: isAfrica ? "1800px" : "1400px" }}
        >
          <TableHeader className="bg-secondary text-white ">
            <TableRow>
              <TableHead
                className={`${thCls} text-white min-w-42.5  text-[12px] h-11`}
              >
                Category
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-35 text-[12px] h-11 bg-secondary`}
              >
                Part No.
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-60 text-[12px] h-11 text-left`}
              >
                Item Name
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-25 text-[12px] h-11`}
              >
                Unit Net
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-25 text-[12px] h-11`}
              >
                Unit ERP
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-20 text-[12px] h-11 bg-secondary`}
              >
                Def MU%
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-22.5 text-[12px] h-11`}
              >
                MS Disc%
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-22.5 text-[12px] h-11`}
              >
                Crayon MU%
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-18.75 text-[12px] h-11`}
              >
                Type
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-23.75 text-[12px] h-11 bg-secondary`}
              >
                Disc Net
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-23.75 text-[12px] h-11 bg-secondary`}
              >
                Disc ERP
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-32.5 bg-secondary text-[12px] h-11`}
              >
                Total Net
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-32.5 bg-secondary text-[12px] h-11`}
              >
                Total ERP
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-20 bg-secondary text-[12px] h-11`}
              >
                Qty
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-23.75 bg-secondary text-[12px] h-11`}
              >
                EUP
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-32.5 bg-secondary text-[12px] h-11`}
              >
                Total EUP
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-20 bg-secondary text-[12px] h-11`}
              >
                MU%
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-21.25 text-[12px] h-11`}
              >
                Reb%
              </TableHead>
              <TableHead
                className={`${thCls} text-white min-w-30 bg-secondary text-[12px] h-11`}
              >
                Rebate
              </TableHead>
              {isAfrica && (
                <>
                  <TableHead
                    className={`${thCls} text-white min-w-30 text-[12px] h-11 bg-secondary`}
                  >
                    GP
                  </TableHead>
                  <TableHead
                    className={`${thCls} text-white min-w-20 text-[12px] h-11 bg-secondary`}
                  >
                    SWO%
                  </TableHead>
                  <TableHead
                    className={`${thCls} text-white min-w-30 text-[12px] h-11 bg-secondary`}
                  >
                    SWO GP
                  </TableHead>
                  <TableHead
                    className={`${thCls} text-white min-w-30 text-[13px] h-11 bg-secondary`}
                  >
                    Part GP
                  </TableHead>
                </>
              )}
              <TableHead className="w-10 bg-secondary" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <LineItemRow
                key={item.id}
                item={item}
                index={index}
                activeYear={activeYear}
                exchangeRate={exchangeRate}
                dealType={dealType}
                region={region}
                onUpdate={(field, value) =>
                  onChange(
                    items.map((i) =>
                      i.id === item.id ? { ...i, [field]: value } : i,
                    ),
                  )
                }
                onRemove={() => onChange(items.filter((i) => i.id !== item.id))}
                onBatchPaste={handleBatchPaste}
              />
            ))}
            <SummaryFooter
              items={items}
              region={region}
              activeYear={activeYear}
              dealType={dealType}
              exchangeRate={exchangeRate}
            />
          </TableBody>
        </Table>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addRow}
        className="text-secondary border-secondary/30 font-semibold gap-2"
      >
        <Plus size={13} /> Add Product Row
      </Button>
    </div>
  );
}
