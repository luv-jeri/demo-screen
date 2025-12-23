"use client";

import { Wifi, Battery, Cpu } from "lucide-react";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function SystemWidget({ size }: WidgetProps) {
  if (size === "1x1") {
    return (
      <div className="flex flex-col justify-between h-full p-1 -m-6 relative overflow-hidden group">
         <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent" />
         
         <div className="p-4 z-10">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">CPU Load</div>
            <div className="text-2xl font-bold text-emerald-400">34%</div>
         </div>

         {/* Mini Sparkline */}
         <div className="h-12 w-full flex items-end gap-0.5 px-4 pb-0 opacity-50 group-hover:opacity-100 transition-opacity">
            {[20, 45, 30, 60, 40, 75, 50, 34].map((h, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-emerald-500 rounded-t-sm" 
                 style={{ height: `${h}%` }} 
               />
            ))}
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center gap-3">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
             <Wifi className="size-3.5" />
             <span>Network</span>
          </div>
          <span className="text-xs font-bold text-emerald-500">1.2 Gbps</span>
       </div>
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
             <Cpu className="size-3.5" />
             <span>CPU Load</span>
          </div>
          <span className="text-xs font-bold text-yellow-500">34%</span>
       </div>
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300">
             <Battery className="size-3.5" />
             <span>Battery</span>
          </div>
          <span className="text-xs font-bold text-white">98%</span>
       </div>
    </div>
  );
}
