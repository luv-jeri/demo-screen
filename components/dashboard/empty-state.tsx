"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Plus, Sparkles } from "lucide-react";
import { useBentoStore } from "@/components/bento-store";

export function EmptyState() {
  const toggleEditMode = useBentoStore((state) => state.toggleEditMode);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="flex flex-col items-center justify-center py-12 relative z-10"
    >
      <button 
        onClick={toggleEditMode}
        className="group relative flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-500 backdrop-blur-sm"
      >
         <div className="flex items-center justify-center p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <Plus className="size-4 text-white/50 group-hover:text-white transition-colors duration-300" />
         </div>
         <span className="text-sm font-light text-white/60 group-hover:text-white tracking-widest uppercase transition-colors duration-300">
            Start Building
         </span>
         
         <Sparkles className="size-3 text-white/20 group-hover:text-emerald-400/50 transition-all duration-500 opacity-0 group-hover:opacity-100 -ml-1 scale-75 group-hover:scale-100" />
      </button>
    </motion.div>
  );
}
