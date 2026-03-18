"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      position="top-right"
      expand={true}
   
      closeButton
      className="toaster group"
      icons={{
        success: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <CircleCheckIcon className="size-4 text-green-600" />
          </div>
        ),
        info: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
            <InfoIcon className="size-4 text-secondary" />
          </div>
        ),
        warning: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
            <TriangleAlertIcon className="size-4 text-yellow-600" />
          </div>
        ),
        error: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <OctagonXIcon className="size-4 text-primary" />
          </div>
        ),
        loading: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <Loader2Icon className="size-4 animate-spin text-secondary" />
          </div>
        ),
      }}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: [
            "group toast",
            "group-[.toaster]:bg-white",
            "group-[.toaster]:border group-[.toaster]:border-border",
            "group-[.toaster]:shadow-2xl group-[.toaster]:shadow-secondary/10",
            "group-[.toaster]:rounded-xl",
            "px-4 py-3.5",
            "min-w-[320px]",
          ].join(" "),
          title: "text-[13px] font-bold text-foreground tracking-tight",
          description: "text-[11px] text-muted-foreground mt-0.5 leading-relaxed",
          actionButton: "bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-secondary/90 transition-colors",
          cancelButton: "bg-muted text-muted-foreground rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-muted/80 transition-colors",
          closeButton: "text-muted-foreground hover:text-foreground transition-colors",
          // Success
          success: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-green-500",
          // Error — primary (Scarlet #FF370F)
          error: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-primary",
          // Info — secondary (Deep Blue)
          info: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-secondary",
          // Warning
          warning: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-yellow-500",
          // Loading
          loading: "group-[.toaster]:border-l-4 group-[.toaster]:border-l-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }