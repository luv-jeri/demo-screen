"use client";

import { Zap, Cloud, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { type WidgetSize } from "@/components/bento-store";

interface WidgetProps {
  id?: string;
  size: WidgetSize;
}

export function WelcomeWidget({ size }: WidgetProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const isFull = size === "4x1";

  return (
    <div className="h-full flex flex-col justify-between">
      <div className={cn("flex justify-between items-start", isFull && "items-center")}>
        <div>
           <h3 className="text-sm font-medium text-indigo-300 mb-1 flex items-center gap-2">
              <Zap className="size-4" /> 
              Daily Brief
           </h3>
           <h2 className={cn("font-light text-white tracking-tight", isFull ? "text-4xl" : "text-3xl")}>
             {greeting}, <span className="font-semibold">Sanjay</span>
           </h2>
        </div>
        
        {/* Productivity Badge - Shows different data on Full size */}
        <div className="text-right">
           <div className={cn("font-bold text-white", isFull ? "text-4xl" : "text-3xl")}>
             {isFull ? "92%" : "84%"}
           </div>
           <div className="text-xs text-muted-foreground">Productivity</div>
        </div>
      </div>
      
      {/* Footer / Status Area */}
      <div className={cn("mt-auto flex items-center gap-4 text-sm text-muted-foreground", isFull ? "pt-0" : "pt-4")}>
         <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Optimal</span>
         </div>
         <div className="flex items-center gap-2">
            <Cloud className="size-4" />
            <span>24°C Sunny</span>
         </div>
         
         {isFull && (
           <>
             <div className="h-4 w-px bg-white/10 mx-2" />
             <div className="flex items-center gap-2">
                <Calendar className="size-3.5" />
                <span>5 Events Today</span>
             </div>
           </>
         )}
      </div>
    </div>
  );
}
