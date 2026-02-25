"use client";
import React, { useState, useEffect, useRef } from "react"; // useRef yahan shamil hai
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCostingSheets } from "../hooks/useCostingSheets"; 
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; 



export function CustomerDetails({ data, onChange }) {
  const { searchCustomers } = useCostingSheets();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // --- FIXED: Ye dono refs yahan define hona lazmi hain ---
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

    // Purana timeout clear karein agar user tezi se type kar raha hai
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 0) {
      setIsSearching(true);
      setShowDropdown(true);

      // Postman ke mutabiq search logic
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Sirf search query bhej rahe hain bina region filter ke
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
    
    // Selection par region automatic update hoga
    if (customer.region) {
      onChange("region", customer.region);
    }
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
      // Cleanup timeout on unmount
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-y-6 gap-x-4 p-5 bg-white relative">
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
              !isSearching && <div className="px-3 py-4 text-xs text-slate-500 text-center">No customers found</div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Customer ID (Auto) *</Label>
        <Input 
          type="number" 
          name="customer_id" 
          value={data.customer_id || ""} 
          readOnly 
          className="h-9  " 
        />
      </div>

      {/* Baqi normal inputs ke liye handleInputChange use karein */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Opportunity ID</Label>
        <Input 
          name="opportunity_id" 
          value={data.opportunity_id || ""} 
          onChange={handleInputChange} 
          className="h-9" 
        />
      </div>

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

      {/* ROW 2: Business Area etc. (Jahan handleInputChange use ho raha hai) */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Business Area</Label>
        <Input name="business_area" value={data.business_area || ""} onChange={handleInputChange} className="h-9" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Region</Label>
        <Select value={data.region} onValueChange={(v) => handleSelectChange("region", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Producer Name</Label>
        <Input 
          name="producer_name" 
          value={data.producer_name || ""} 
          onChange={handleInputChange} 
          placeholder="Producer" 
          className="h-9" 
        />
      </div> */}

      {/* ROW 3 */}
      {/* <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Account Manager</Label>
        <Input 
          name="account_manager" 
          value={data.account_manager || ""} 
          onChange={handleInputChange} 
          placeholder="Name" 
          className="h-9" 
        />
      </div> */}

      {/* <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Account Manager ID</Label>
        <Input 
          name="account_manager_id" 
          value={data.account_manager_id || ""} 
          onChange={handleInputChange} 
          placeholder="AM ID" 
          className="h-9" 
        />
      </div> */}

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

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Currency</Label>
        <Input name="currency" value={data.currency} readOnly className="h-9 bg-slate-50" />
      </div>

      {/* ROW 4 */}
      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Exchange Rate</Label>
        <Input 
          type="number" 
          name="exchange_rate" 
          value={data.exchange_rate} 
          onChange={handleInputChange} 
          className="h-9" 
        />
      </div>

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

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - System</Label>
        <Select value={data.agreement_level_system} onValueChange={(v) => handleSelectChange("agreement_level_system", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Server</Label>
        <Select value={data.agreement_level_server} onValueChange={(v) => handleSelectChange("agreement_level_server", v)}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[11px] text-slate-600 font-semibold">Agreement Level - Application</Label>
        <Select value={data.agreement_level_application} onValueChange={(v) => handleSelectChange("agreement_level_application", v)}>
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