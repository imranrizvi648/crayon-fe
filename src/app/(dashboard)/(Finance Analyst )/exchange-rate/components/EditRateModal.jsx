"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function EditRateModal({ isOpen, onClose, rateData, onSave, loading }) {
  const [newRate, setNewRate] = useState("");

  // Jab bhi rateData change ho (yaani naya row select ho), input reset karein
  useEffect(() => {
    if (rateData) {
      setNewRate(rateData.rate);
    }
  }, [rateData]);

  const handleUpdate = () => {
    if (!newRate) return;
    onSave(rateData.id, newRate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Edit Exchange Rate
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center text-sm bg-slate-100 p-3 rounded-lg border border-slate-200">
            <span className="font-medium text-slate-600">
              {rateData?.from_currency} to {rateData?.to_currency}
            </span>
            <span className="font-bold text-secondary bg-blue-50 px-2 py-1 rounded">
              Current: {rateData?.rate}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate" className="text-slate-700 font-semibold">
              New Conversion Rate
            </Label>
            <Input 
              id="rate" 
              type="number" 
              step="0.0001"
              autoFocus
              value={newRate} 
              onChange={(e) => setNewRate(e.target.value)} 
              placeholder="e.g. 3.6750"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={loading}
            className="text-slate-500"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={loading || !newRate || newRate == rateData?.rate}
            className=" text-white min-w-[100px]"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}