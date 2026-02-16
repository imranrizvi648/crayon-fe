import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EditSheetModal({ isOpen, onClose, formData, setFormData, onSave }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#1a3556]">Update Costing Sheet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Opportunity Name</Label>
            <Input 
              value={formData.opportunity_name} 
              onChange={(e) => setFormData({...formData, opportunity_name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Year 1</Label>
            <Input 
              type="number"
              value={formData.discount_year_1} 
              onChange={(e) => setFormData({...formData, discount_year_1: parseFloat(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <Label>Internal Notes</Label>
            <Textarea 
              value={formData.internal_notes} 
              onChange={(e) => setFormData({...formData, internal_notes: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-[#1a3556] text-white" onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}