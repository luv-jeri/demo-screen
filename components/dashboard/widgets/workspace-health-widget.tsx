"use client";

import { Activity, Database, Users, Server, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { type WidgetSize } from "@/components/bento-store";

interface HealthWidgetProps {
  size: WidgetSize;
}

export function WorkspaceHealthWidget({ size }: HealthWidgetProps) {
  const stats = {
    healthScore: 94,
    storageUsed: 78, // %
    seatsUsed: 12,
    seatsTotal: 15,
    apiCalls: "1.2M" // monthly
  };

  /* 
     SIZE: 1x1 (Small) - Gauge
  */
  if (size === "1x1") {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (stats.healthScore / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center h-full space-y-3">
         <div className="relative size-20 flex items-center justify-center">
             {/* Background Circle */}
             <svg className="size-full transform -rotate-90">
                <defs>
                   <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                   </linearGradient>
                   <filter id="gaugeGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                </defs>
                <circle
                  cx="40" cy="40" r={radius}
                  className="stroke-white/5 fill-none"
                  strokeWidth="6"
                />
                {/* Progress Circle */}
                <circle
                  cx="40" cy="40" r={radius}
                  className="fill-none transition-all duration-1000 ease-out"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  filter="url(#gaugeGlow)"
                />
             </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-xl font-bold text-white">{stats.healthScore}</span>
               <span className="text-[9px] text-muted-foreground uppercase">Score</span>
            </div>
         </div>
         <div className="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="size-3" />
            Healthy
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x1 (Medium) - Category Breakdown
  */
  if (size === "2x1") {
    return (
      <div className="h-full flex flex-col justify-between">
         <div className="flex items-center gap-2">
            <Activity className="size-4 text-emerald-500" />
            <span className="text-sm font-semibold text-white">System Health</span>
         </div>
         
         <div className="space-y-4">
             {/* Storage */}
             <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                   <span className="text-muted-foreground flex items-center gap-1.5">
                      <Database className="size-3" /> Storage
                   </span>
                   <span className="text-white">{stats.storageUsed}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.storageUsed}%` }} />
                </div>
             </div>
             
             {/* Seats */}
             <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                   <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="size-3" /> Seats
                   </span>
                   <span className="text-white">{stats.seatsUsed}/{stats.seatsTotal}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(stats.seatsUsed/stats.seatsTotal) * 100}%` }} />
                </div>
             </div>
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x2 (Large) - Detailed Analytics + Action
  */
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Activity className="size-5" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white">Workspace Health</h3>
                <p className="text-xs text-muted-foreground">Weekly Performance</p>
             </div>
          </div>
          <div className="text-2xl font-bold text-white">{stats.healthScore}</div>
       </div>

       {/* Simplified Line Chart Visualization */}
       <div className="flex-1 flex items-end gap-2 px-1 pb-4 border-b border-white/5 relative">
          {[40, 65, 55, 80, 70, 94, 91].map((h, i) => (
             <div key={i} className="flex-1 group relative">
                <div 
                  className="w-full bg-emerald-500/20 rounded-sm hover:bg-emerald-500 transition-colors duration-300"
                  style={{ height: `${h}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-black px-1.5 py-0.5 rounded text-white font-mono">
                   {h}
                </div>
             </div>
          ))}
       </div>

       <div className="pt-4 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-xs text-muted-foreground">Pending Actions</span>
             <span className="text-sm font-medium text-white">2 Optimizations</span>
          </div>
          <button className="text-xs font-semibold bg-white text-black px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors">
             Run Cleanup AI
          </button>
       </div>
    </div>
  );
}
