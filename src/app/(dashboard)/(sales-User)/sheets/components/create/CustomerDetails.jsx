"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCostingSheets } from "../../hooks/useCostingSheets";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomerDetails({ data, onChange }) {
  const { searchCustomers, fetchExchangeRates } = useCostingSheets();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [exchangeRates, setExchangeRates] = useState([]);

  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

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
        } catch (error) {
          console.error("Search failed", error);
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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const loadRates = async () => {
      const rates = await fetchExchangeRates();
      setExchangeRates(rates);
    };
    loadRates();
  }, []);

  const handleCurrencySelect = (currencyCode) => {
    onChange("currency", currencyCode);
    const selectedData = exchangeRates.find((r) => r.to_currency === currencyCode);
    if (selectedData) onChange("exchange_rate", selectedData.rate);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-y-6 gap-x-4 p-5 bg-white relative">

      {/* Customer Name */}
      <div className="md:col-span-2 space-y-1.5 relative" ref={dropdownRef}>
        <Label className="text-[11px] text-slate-600 font-semibold">Customer Name *</Label>
        <div className="relative">
          <Input
            name="customer_name"
            value={data.customer_name || ""}
            onChange={handleCustomerSearch}
            placeholder="Type to search..."
            className="h-9"
            autoComplete="off"
          />
          {isSearching && <Loader2 className="absolute right-2 top-2 h-5 w-5 animate-spin text-slate-400" />}
        </div>
        {showDropdown && (
          <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => selectCustomer(customer)}
                  className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-none flex justify-between"
                >
                  <span className="font-medium text-slate-700">{customer.name}</span>
                  <span className="text-[10px] text-slate-400 italic">ID: {customer.id}</span>
                </div>
              ))
            ) : (
              !isSearching && (
                <div className="px-3 py-4 text-xs text-slate-500 text-center">No customers found</div>
              )
            )}
          </div>
        )}
      </div>

      {/* Customer ID */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Customer ID (Auto) *</Label>
        <Input
          type="number"
          name="customer_id"
          value={data.customer_id || ""}
          readOnly
          className="h-9"
        />
      </div>

      {/* Opportunity ID */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Opportunity ID</Label>
        <Input
          name="opportunity_id"
          value={data.opportunity_id || ""}
          onChange={handleInputChange}
          className="h-9"
        />
      </div>

      {/* Customer Segment */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Customer Segment</Label>
        <Select
          value={data.customer_segment}
          onValueChange={(v) => handleSelectChange("customer_segment", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
            <SelectItem value="SMB">SMB</SelectItem>
            <SelectItem value="GOVERNMENT">GOVERNMENT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Area */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Business Area</Label>
        <Input
          name="business_area"
          value={data.business_area || ""}
          onChange={handleInputChange}
          className="h-9"
        />
      </div>

      {/* Region — backend enum: UAE | KSA | AFRICA | GLOBAL */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Region</Label>
        <Select
          value={data.region}
          onValueChange={(v) => handleSelectChange("region", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="KSA">KSA</SelectItem>
            <SelectItem value="AFRICA">AFRICA</SelectItem>
            <SelectItem value="GLOBAL">GLOBAL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deal Type */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Deal Type</Label>
        <Select
          value={data.deal_type}
          onValueChange={(v) => handleSelectChange("deal_type", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NORMAL">NORMAL</SelectItem>
            <SelectItem value="RAMPED">RAMPED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Location */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Sales Location</Label>
        <Input
          name="sales_location"
          value={data.sales_location || ""}
          onChange={handleInputChange}
          placeholder="UAE"
          className="h-9"
        />
      </div>

      {/* Agreement Type */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Type</Label>
        <Input
          name="agreement_type"
          value={data.agreement_type || ""}
          onChange={handleInputChange}
          placeholder="Enterprise Enrollment"
          className="h-9"
        />
      </div>

      {/* New / Renewal */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">New/Renewal</Label>
        <Select
          value={data.new_renewal}
          onValueChange={(v) => handleSelectChange("new_renewal", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Renewal">Renewal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Currency */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Currency</Label>
        <Select value={data.currency} onValueChange={handleCurrencySelect}>
          <SelectTrigger className="h-9 bg-white">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {exchangeRates.map((rate) => (
              <SelectItem key={rate.id} value={rate.to_currency}>
                {rate.to_currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exchange Rate */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Exchange Rate</Label>
        <Input
          type="number"
          name="exchange_rate"
          step="0.000001"
          value={data.exchange_rate}
          onChange={handleInputChange}
          className="h-9"
        />
      </div>

      {/* VAT % */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">VAT %</Label>
        <Input
          type="number"
          name="vat_percent"
          value={data.vat_percent}
          onChange={handleInputChange}
          className="h-9"
        />
      </div>

      {/* Agreement Level System */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - System</Label>
        <Select
          value={data.agreement_level_system}
          onValueChange={(v) => handleSelectChange("agreement_level_system", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agreement Level Server */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Server</Label>
        <Select
          value={data.agreement_level_server}
          onValueChange={(v) => handleSelectChange("agreement_level_server", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agreement Level Application */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Application</Label>
        <Select
          value={data.agreement_level_application}
          onValueChange={(v) => handleSelectChange("agreement_level_application", v)}
        >
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}