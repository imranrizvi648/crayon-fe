"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EditSheetModal({ isOpen, onClose, formData, setFormData, onSave }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* bg-card aur border-border variables use kiye hain */}
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          {/* text-foreground auto-adjust hoga light/dark ke liye */}
          <DialogTitle className="text-foreground font-bold">
            Update Costing Sheet
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Opportunity Name</Label>
            <Input 
              className="bg-background border-input focus:ring-ring"
              value={formData.opportunity_name} 
              onChange={(e) => setFormData({...formData, opportunity_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Discount Year 1 (%)</Label>
            <Input 
              className="bg-background border-input focus:ring-ring"
              type="number"
              value={formData.discount_year_1} 
              onChange={(e) => setFormData({...formData, discount_year_1: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Internal Notes</Label>
            <Textarea 
              className="bg-background border-input focus:ring-ring min-h-[100px]"
              value={formData.internal_notes} 
              onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {/* variant="outline" automatically border-input use karega */}
          <Button variant="outline" onClick={onClose} className="hover:bg-accent">
            Cancel
          </Button>
          
          {/* bg-primary ab aapka Scarlet (#FF370F) ya Deep Blue ban jayega config ke mutabiq */}
          <Button 
            className="bg-primary text-primary-foreground hover:opacity-90 transition-all font-semibold" 
            onClick={onSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}