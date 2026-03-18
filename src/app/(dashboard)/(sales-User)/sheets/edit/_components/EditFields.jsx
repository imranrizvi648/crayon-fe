"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const EditField = ({ label, name, value, onChange, type = "text", required = false }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
      {label} {required && <span className="text-primary">*</span>}
    </Label>
    <Input
      name={name}
      type={type}
      value={value ?? ""}
      onChange={e => onChange(name, e.target.value)}
      className="h-9 bg-white border-border text-sm text-foreground font-medium"
    />
  </div>
);

export const EditSelect = ({ label, name, value, onChange, options, required = false }) => (
  <div className="flex flex-col gap-1.5">
    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
      {label} {required && <span className="text-primary">*</span>}
    </Label>
    <Select value={String(value || "")} onValueChange={v => onChange(name, v)}>
      <SelectTrigger className="h-9 bg-white border-border text-sm text-foreground font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);