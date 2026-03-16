
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCostingSheets } from "../../hooks/useCostingSheets";
import { Loader2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export function CustomerDetails({ data, onChange }) {
  const { searchCustomers, fetchExchangeRates } = useCostingSheets();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [exchangeRates, setExchangeRates] = useState([]);

  // ← Local state sirf text/number inputs ke liye
  const [local, setLocal] = useState({
    opportunity_id:   data.opportunity_id   || "",
    business_area:    data.business_area    || "",
    sales_location:   data.sales_location   || "",
    agreement_type:   data.agreement_type   || "",
    exchange_rate:    data.exchange_rate     ?? 3.6725,
    vat_percent:      data.vat_percent       ?? 5,
  });

  useEffect(() => {
    setLocal({
      opportunity_id:   data.opportunity_id   || "",
      business_area:    data.business_area    || "",
      sales_location:   data.sales_location   || "",
      agreement_type:   data.agreement_type   || "",
      exchange_rate:    data.exchange_rate     ?? 3.6725,
      vat_percent:      data.vat_percent       ?? 5,
    });
  }, [
    data.opportunity_id, data.business_area,
    data.sales_location, data.agreement_type,
    data.exchange_rate,  data.vat_percent,
  ]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalBlur = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

  // ── Customer search (turant onChange pe — search ke liye zaroori) ──
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleCustomerSearch = async (e) => {
    const value = e.target.value;
    onChange("customer_name", value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.trim().length > 0) {
      setIsSearching(true);
      setShowDropdown(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchCustomers(value);
          setSearchResults(results);
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setShowDropdown(false);
    }
  };

  const selectCustomer = (customer) => {
    onChange("customer_name", customer.name);
    onChange("customer_id", customer.id);
    if (customer.region) onChange("region", customer.region);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    fetchExchangeRates().then(setExchangeRates).catch(console.error);
  }, []);

  const handleCurrencySelect = (currencyCode) => {
    onChange("currency", currencyCode);
    const found = exchangeRates.find((r) => r.to_currency === currencyCode);
    if (found) {
      onChange("exchange_rate", found.rate);
      setLocal(prev => ({ ...prev, exchange_rate: found.rate }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-y-6 gap-x-4 p-5 bg-white relative">

      {/* Customer Name — search, direct onChange */}
      <div className="md:col-span-2 space-y-1.5 relative" ref={dropdownRef}>
        <Label className="text-[11px] text-slate-600 font-semibold">Customer Name *</Label>
        <div className="relative">
          <Input
            name="customer_name"
            value={data.customer_name || ""}
            onChange={handleCustomerSearch}
            placeholder="Type to search..."
            className="h-9" autoComplete="off"
          />
          {isSearching && <Loader2 className="absolute right-2 top-2 h-5 w-5 animate-spin text-slate-400" />}
        </div>
        {showDropdown && (
          <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {searchResults.length > 0 ? searchResults.map((c) => (
              <div key={c.id} onClick={() => selectCustomer(c)}
                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-none flex justify-between">
                <span className="font-medium text-slate-700">{c.name}</span>
                <span className="text-[10px] text-slate-400 italic">ID: {c.id}</span>
              </div>
            )) : !isSearching && (
              <div className="px-3 py-4 text-xs text-slate-500 text-center">No customers found</div>
            )}
          </div>
        )}
      </div>

      {/* Customer ID — readOnly */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Customer ID (Auto) *</Label>
        <Input type="number" name="customer_id"
          value={data.customer_id || ""} readOnly className="h-9" />
      </div>

      {/* Opportunity ID — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Opportunity ID</Label>
        <Input name="opportunity_id"
          value={local.opportunity_id}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          className="h-9" />
      </div>

      {/* Customer Segment — select, direct */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Customer Segment</Label>
        <Select value={data.customer_segment} onValueChange={(v) => handleSelectChange("customer_segment", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
            <SelectItem value="SMB">SMB</SelectItem>
            <SelectItem value="GOVERNMENT">GOVERNMENT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Area — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Business Area</Label>
        <Input name="business_area"
          value={local.business_area}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          className="h-9" />
      </div>

      {/* Region — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Region</Label>
        <Select value={data.region} onValueChange={(v) => handleSelectChange("region", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="KSA">KSA</SelectItem>
            <SelectItem value="AFRICA">AFRICA</SelectItem>
            <SelectItem value="GLOBAL">GLOBAL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deal Type — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Deal Type</Label>
        <Select value={data.deal_type} onValueChange={(v) => handleSelectChange("deal_type", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NORMAL">NORMAL</SelectItem>
            <SelectItem value="RAMPED">RAMPED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Location — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Sales Location</Label>
        <Input name="sales_location"
          value={local.sales_location}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          placeholder="UAE" className="h-9" />
      </div>

      {/* Agreement Type — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Type</Label>
        <Input name="agreement_type"
          value={local.agreement_type}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          placeholder="Enterprise Enrollment" className="h-9" />
      </div>

      {/* New/Renewal — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">New/Renewal</Label>
        <Select value={data.new_renewal} onValueChange={(v) => handleSelectChange("new_renewal", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Renewal">Renewal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Currency — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Currency</Label>
        <Select value={data.currency} onValueChange={handleCurrencySelect}>
          <SelectTrigger className="h-9 bg-white"><SelectValue placeholder="Select Currency" /></SelectTrigger>
          <SelectContent>
            {exchangeRates.map((rate) => (
              <SelectItem key={rate.id} value={rate.to_currency}>{rate.to_currency}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exchange Rate — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Exchange Rate</Label>
        <Input type="number" name="exchange_rate" step="0.000001"
          value={local.exchange_rate}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          className="h-9" />
      </div>

      {/* VAT % — local + blur */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">VAT %</Label>
        <Input type="number" name="vat_percent"
          value={local.vat_percent}
          onChange={handleLocalChange} onBlur={handleLocalBlur}
          className="h-9" />
      </div>

      {/* Agreement Level System — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - System</Label>
        <Select value={data.agreement_level_system} onValueChange={(v) => handleSelectChange("agreement_level_system", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["A","B","C","D"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Agreement Level Server — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Server</Label>
        <Select value={data.agreement_level_server} onValueChange={(v) => handleSelectChange("agreement_level_server", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["A","B","C","D"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Agreement Level Application — select */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Application</Label>
        <Select value={data.agreement_level_application} onValueChange={(v) => handleSelectChange("agreement_level_application", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {["A","B","C","D"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}
