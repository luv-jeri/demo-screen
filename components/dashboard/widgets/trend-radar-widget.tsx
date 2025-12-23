"use client";

import { TrendingUp, ArrowUpRight, Hash } from "lucide-react";

import { type WidgetSize } from "@/components/bento-store";

interface TrendRadarProps {
  size: WidgetSize;
}

export function TrendRadarWidget({ size }: TrendRadarProps) {
  // Mock Data
  const topTrend = { keyword: "Generative AI", growth: 124 };
  const trends = [
    { keyword: "Generative AI", growth: 124 },
    { keyword: "Neural rendering", growth: 86 },
    { keyword: "Motion synthesis", growth: 54 },
    { keyword: "Audio sync", growth: 32 },
  ];

  /* 
     SIZE: 1x1 (Small) - Top Trend
  */
  if (size === "1x1") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
         <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400 mb-1">
            <TrendingUp className="size-6" />
         </div>
         <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Trend</div>
         <div className="font-bold text-white text-lg leading-none">{topTrend.keyword}</div>
         <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ArrowUpRight className="size-3" />
            +{topTrend.growth}%
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x1 (Medium) - Trend List
  */
  if (size === "2x1") {
    return (
      <div className="h-full flex flex-col">
         <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
               <Hash className="size-4" />
            </div>
            <span className="text-sm font-semibold text-white">Trending Keywords</span>
         </div>
         
         <div className="flex-1 space-y-3">
             {trends.slice(0, 3).map((t, i) => (
               <div key={t.keyword} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-mono text-muted-foreground w-4">0{i+1}</span>
                     <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{t.keyword}</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-500">+{t.growth}%</div>
               </div>
             ))}
         </div>
      </div>
    );
  }

  /* 
     SIZE: 2x2, 4x1 (Large) - Interactive Map Visual (Mock)
  */
  return (
    <div className="h-full flex flex-col relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 z-10">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-muted-foreground">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             Live Analysis
          </div>
       </div>

       <div className="mt-2 mb-6">
          <h3 className="text-lg font-bold text-white mb-1">Trend Radar</h3>
          <p className="text-xs text-muted-foreground">Real-time keyword spikes across workspace</p>
       </div>

       {/* Visual Representation of Radar */}
       <div className="flex-1 relative flex items-center justify-center">
          {/* Concentric Circles with Gradient Borders */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
             <div className="w-[180px] h-[180px] rounded-full border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]" />
             <div className="absolute w-[120px] h-[120px] rounded-full border border-indigo-500/40" />
             <div className="absolute w-[60px] h-[60px] rounded-full border border-indigo-500/30 bg-indigo-500/5" />
             {/* Scanning Line */}
             <div className="absolute w-[180px] h-[180px] rounded-full overflow-hidden animate-spin-slow opacity-20">
                <div className="w-1/2 h-1/2 bg-linear-to-br from-indigo-500 via-transparent to-transparent absolute top-0 left-0 origin-bottom-right" />
             </div>
          </div>

          {/* Data Points */}
          <div className="relative w-full h-full">
              {trends.map((t, i) => {
                 // Randomize positions
                 const top = [20, 60, 30, 70][i] + "%";
                 const left = [70, 20, 80, 40][i] + "%";
                 
                 return (
                    <div 
                      key={t.keyword}
                      className="absolute group cursor-pointer"
                      style={{ top, left }}
                    >
                       <div className="relative flex items-center justify-center">
                          <span className="absolute w-12 h-12 bg-indigo-500/20 rounded-full blur-md group-hover:bg-indigo-500/40 transition-all duration-500 animate-pulse-slow" />
                          <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] group-hover:scale-150 group-hover:bg-white transition-all duration-300 ring-2 ring-transparent group-hover:ring-indigo-500/50" />
                          
                          {/* Tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                             <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs shadow-xl">
                                <span className="text-white font-bold block">{t.keyword}</span>
                                <span className="text-emerald-400 font-mono">+{t.growth}%</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 );
              })}
          </div>
       </div>
    </div>
  );
}
