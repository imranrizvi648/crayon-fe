import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Layers, X } from "lucide-react";

export const TemplateModal = ({ isOpen, onClose, onSelect }) => {
  const templates = [
    { id: 'FEWA', title: 'FEWA Template', desc: 'Middle East local compliance', icon: <FileText className="text-blue-500"/> },
    { id: 'MCC', title: 'MCC Template', desc: 'Africa GP split calculation', icon: <Layers className="text-green-500"/> }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Select Template</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {templates.map((t) => (
            <div 
              key={t.id} 
              onClick={() => onSelect(t.id)}
              className="border p-6 rounded-xl cursor-pointer hover:border-[#dc1e25] transition-all group"
            >
              <div className="bg-slate-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-50">
                {t.icon}
              </div>
              <h3 className="font-bold text-[#1a3556]">{t.title}</h3>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};