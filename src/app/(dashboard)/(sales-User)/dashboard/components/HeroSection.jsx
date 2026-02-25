"use client";

import { MapPin, Calendar, User, LayoutDashboard } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HeroSection({ user }) {
  // Locale-based date calculation
  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // BG ab sidebar/secondary variable se lega (#27455C equivalent)
      className="bg-secondary rounded-xl p-8 mb-8 text-secondary-foreground flex justify-between items-center shadow-xl relative overflow-hidden border border-white/5"
    >
      {/* Dynamic Background Blurs - Primary color (Scarlet) ka touch diya hai */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />

      <div className="z-10">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold mb-2 flex items-center gap-2"
        >
          Welcome back, <span className="text-primary-foreground">{user?.name || "User"}</span>! 
        </motion.h1>

        <p className="text-secondary-foreground/70 mb-6 text-sm font-medium">
          Here's your sales activity overview for today
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          {/* Badge Style Info Chips */}
          {[
            { icon: MapPin, text: `Region: ${user?.region || "N/A"}` },
            { icon: Calendar, text: today },
            { icon: User, text: `Role: ${user?.role || "Team Member"}` }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 hover:bg-white/15 transition-colors">
              <item.icon size={16} className="text-primary" /> {/* Primary Red Icon */}
              <span className="capitalize font-medium text-secondary-foreground/90">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

   
    </motion.div>
  );
}