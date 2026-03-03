"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, // Import lazmi karein
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"; // npm install @radix-ui/react-visually-hidden
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AddMemberModal({ isOpen, onOpenChange, onCreate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    employee_id: "",
    phone: "",
    department: "",
    region: "",
    is_active: true,
    role_ids: [] 
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    const finalValue = name === "role_ids" ? [parseInt(value)] : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await onCreate(formData);
    setIsSubmitting(false);
    if (result?.success) {
      onOpenChange(false);
      setFormData(initialFormState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 border-none shadow-2xl rounded-2xl bg-white overflow-hidden">
        
        {/* ASLI FIX: Ye accessibility ke liye zaroori hai */}
        <VisuallyHidden.Root>
          <DialogTitle>Add New Team Member Form</DialogTitle>
        </VisuallyHidden.Root>

        {/* Header (Aapka visual title yahan hai) */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Add New Member</h2>
          <p className="text-xs text-slate-500 font-medium">Create a new user account for your team.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">First Name</Label>
              <Input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Ahmed" required className="h-10 bg-white border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">Last Name</Label>
              <Input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Hassan" required className="h-10 bg-white border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">Email Address</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ahmed@crayon.com" required className="h-10 bg-white border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="SecurePass@123" required className="h-10 bg-white border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">Employee ID</Label>
              <Input name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="EMP123" required className="h-10 bg-white border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-600">Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+971..." required className="h-10 bg-white border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <SelectBox label="Region" name="region" options={["UAE", "AFRICA"]} onSelect={handleSelectChange} />
            <SelectBox label="Dept" name="department" options={["SALES", "OPERATIONS"]} onSelect={handleSelectChange} />
            <SelectBox label="Role" name="role_ids" options={[{l: "SALES_USER", v: "2"}, {l: "SALES_MANAGER", v: "3"},{l: "FINANCE_ANALYST", v: "4"},{l: "FINANCE_MANAGER", v: "5"},{l: "OPERATIONS", v: "6"},{l: "EXECUTIVE", v: "7"},{l: "ADMIN", v: "1"}]} onSelect={handleSelectChange} isRole />
          </div>

          <div className="pt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-6 font-semibold text-slate-600">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-10 px-8 bg-primary font-bold shadow-md text-white">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SelectBox({ label, name, options, onSelect, isRole = false }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold text-slate-600">{label}</Label>
      <Select onValueChange={(v) => onSelect(name, v)} required>
        <SelectTrigger className="h-10 bg-white border-slate-200 text-xs font-semibold">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt, i) => (
            <SelectItem key={i} value={isRole ? opt.v : opt} className="text-xs">
              {isRole ? opt.l : opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}