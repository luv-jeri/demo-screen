"use client";

import { HardDrive, Cloud } from "lucide-react";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function StorageWidget({ size }: WidgetProps) {
  /* 
     SIZE: 1x1 (Small)
  */
  if (size === "1x1") {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (45 / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2 relative">
         <div className="relative size-16 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="size-full transform -rotate-90">
               <circle cx="32" cy="32" r={radius} className="stroke-white/10 fill-none" strokeWidth="5" />
               <circle 
                 cx="32" cy="32" r={radius} 
                 className="stroke-blue-500 fill-none transition-all duration-1000 ease-out" 
                 strokeWidth="5" 
                 strokeDasharray={circumference} 
                 strokeDashoffset={offset} 
                 strokeLinecap="round" 
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className="text-sm font-bold text-white">45%</span>
            </div>
         </div>
         <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider">Storage</span>
      </div>
    );
  }

  /* 
     SIZE: 2x1 (Wide)
  */
  return (
    <div className="h-full flex flex-col justify-center gap-2">
       <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5 text-zinc-300">
             <HardDrive className="size-3.5" />
             <span className="font-medium">OSMO Cloud</span>
          </div>
          <span className="text-zinc-400">450GB / 1TB</span>
       </div>
       
       {/* Progress Bar */}
       <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 w-[45%]" />
       </div>
       
       <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
          <Cloud className="size-3" />
          <span>Auto-backup enabled</span>
       </div>
    </div>
  );
}
