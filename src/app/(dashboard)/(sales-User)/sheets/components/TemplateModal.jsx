"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Layers, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const TemplateModal = ({ isOpen, onClose, onSelect }) => {
  const templates = [
    { 
      id: 'FEWA', 
      title: 'FEWA Template', 
      desc: 'Middle East local compliance', 
      icon: <FileText size={24} /> 
    },
    { 
      id: 'MCC', 
      title: 'MCC Template', 
      desc: 'Africa GP split calculation', 
      icon: <Layers size={24} /> 
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-border bg-background shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-secondary font-black text-xl tracking-tight uppercase flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
            Select Template
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {templates.map((t) => (
            <button 
              key={t.id} 
              onClick={() => onSelect(t.id)}
              className={cn(
                "group relative text-left border border-border p-6 rounded-2xl transition-all duration-300",
                "hover:border-primary hover:bg-primary/[0.02] hover:shadow-lg hover:shadow-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            >
              {/* Icon Container with Muted Secondary Background */}
              <div className="bg-secondary/5 w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-secondary">
                {t.icon}
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base flex items-center justify-between">
                  {t.title}
                  <ChevronRight size={16} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {t.desc}
                </p>
              </div>

              {/* Background Accent Blur (Subtle) */}
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};