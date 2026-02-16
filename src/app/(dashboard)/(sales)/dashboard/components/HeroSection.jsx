"use client";

import { MapPin, Calendar, User, LayoutDashboard } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function HeroSection({ user }) {
  /* Fallback user data */
  const fallbackUser = {
    name: "Ahmed Hassan",
    region: "Middle East (UAE)",
    role: "Senior Sales Representative",
  };

  const currentUser = user || fallbackUser;

  /* Auto Date calculation using en-GB locale */
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
      className="bg-[#1e2d3d] rounded-2xl p-8 mb-8 text-white flex justify-between items-center shadow-xl relative overflow-hidden"
    >
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-3xl" />

      {/* Left Side Content */}
      <div className="z-10">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold mb-2 flex items-center gap-2"
        >
          Welcome back, {currentUser.name}! 👋
        </motion.h1>

        <p className="text-gray-300 mb-6 text-sm">
          Here's your sales activity overview for today
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <MapPin size={16} className="text-blue-400" />
            <span>Region: {currentUser.region}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Calendar size={16} className="text-blue-400" />
            <span>{today}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <User size={16} className="text-blue-400" />
            <span>{currentUser.role}</span>
          </div>
        </div>
      </div>

      {/* Right Decorative Icon */}
      <motion.div 
        whileHover={{ rotate: 5, scale: 1.05 }}
        className="hidden md:block bg-white/10 p-6 rounded-full border border-white/5 backdrop-blur-sm shadow-2xl"
      >
        <LayoutDashboard size={48} className="text-white opacity-80" />
      </motion.div>
    </motion.div>
  );
}