"use client";

import { Calendar, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { type WidgetSize } from "@/components/bento-store";

interface ComplianceWidgetProps {
  size: WidgetSize;
}

export function ComplianceWidget({ size }: ComplianceWidgetProps) {
  const expiringCount = 3;
  const critical = true;
  
  const assets = [
    { name: "Hero_Bckgrnd_v2", days: 1, type: "Image" },
    { name: "Intro_Music_Final", days: 3, type: "Audio" },
    { name: "Talent_Release_John", days: 5, type: "Doc" },
  ];

  /* 
     SIZE: 1x1 (Small) - Urgent Alert
  */
  if (size === "1x1") {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center h-full text-center space-y-1 relative overflow-hidden -m-6 p-6",
        critical ? "bg-red-500/10" : ""
      )}>
         {critical && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent animate-pulse-slow" />
         )}
         
         <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Expires In</span>
            <div className="text-4xl font-black text-white leading-none tracking-tighter">
               02
            </div>
            <span className="text-xs font-medium text-red-300">Days</span>
         </div>
      </div>
    );
  }

  /* 
     SIZE: 1x2 or 2x1 (Medium) - Top 3 List
  */
  if (size === "1x2" || size === "2x1") {
    return (
      <div className="h-full flex flex-col">
         <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="size-4 text-red-500" />
            <span className="text-sm font-semibold text-white">Compliance</span>
         </div>
         
         <div className="flex-1 space-y-2">
             {assets.map((a, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                   <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-200 truncate max-w-[100px]">{a.name}</span>
                      <span className="text-[10px] text-muted-foreground">{a.type}</span>
                   </div>
                   <div className={cn(
                      "text-xs font-bold px-2 py-1 rounded",
                      a.days <= 2 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                   )}>
                      {a.days}d
                   </div>
                </div>
             ))}
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x2 (Large) - Calendar/Grid View
  */
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
             <Calendar className="size-5 text-zinc-400" />
             <h3 className="text-sm font-bold text-white">Expiry Calendar</h3>
          </div>
          <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
             {expiringCount} Critical
          </span>
       </div>

       {/* Mock Calendar Grid */}
       <div className="flex-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }).map((_, i) => {
             const day = i + 1;
             const isToday = day === 14;
             const hasEvent = [15, 18, 22].includes(day);
             const isCritical = day === 15; // Tomorrow

             return (
                <div 
                  key={i} 
                  className={cn(
                     "rounded-sm flex items-center justify-center text-[10px] relative transition-colors cursor-default",
                     isToday ? "bg-white text-black font-bold" : "bg-white/5 text-muted-foreground hover:bg-white/10",
                     (hasEvent || isCritical) && !isToday ? "bg-white/10 text-zinc-200" : ""
                  )}
                >
                   {day}
                   {isCritical && (
                      <span className="absolute bottom-0.5 right-0.5 size-1.5 bg-red-500 rounded-full animate-pulse" />
                   )}
                   {hasEvent && !isCritical && (
                      <span className="absolute bottom-0.5 right-0.5 size-1.5 bg-orange-400 rounded-full" />
                   )}
                </div>
             );
          })}
       </div>
       
       <div className="pt-3 text-[10px] text-muted-foreground flex gap-4">
          <div className="flex items-center gap-1">
             <span className="size-2 rounded-full bg-red-500" /> Critical
          </div>
          <div className="flex items-center gap-1">
             <span className="size-2 rounded-full bg-orange-400" /> Warning
          </div>
       </div>
    </div>
  );
}
