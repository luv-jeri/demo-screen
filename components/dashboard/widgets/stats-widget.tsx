"use client";

import * as React from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Mock Data
// ============================================================================

const STATS = {
  totalAssets: 2847,
  trend: { value: 12, direction: "up" as const },
  breakdown: [
    { label: "Images", count: 1523, color: "bg-blue-500" },
    { label: "Videos", count: 892, color: "bg-purple-500" },
    { label: "Docs", count: 432, color: "bg-amber-500" },
  ],
};

// ============================================================================
// Stats Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Icon + primary value only (ultra-compact)
// - md: Value + trend + mini breakdown
// - lg: Full breakdown with bars
//

export function StatsWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <BarChart3 className={cn(
          "text-muted-foreground/70",
          isSmall ? "size-4" : "size-5"
        )} />
        <span className={cn(
          "font-semibold tracking-tight truncate",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center mt-2">
        {/* Primary Value */}
        <div className={cn(
          "font-bold text-foreground tracking-tight leading-none",
          isSmall ? "text-2xl" : isMedium ? "text-3xl" : "text-4xl"
        )}>
          {STATS.totalAssets.toLocaleString()}
        </div>

        {/* Trend (md/lg only) */}
        {!isSmall && (
          <div className="flex items-center gap-1 mt-1">
            {STATS.trend.direction === "up" ? (
              <TrendingUp className="size-3 text-emerald-600" />
            ) : (
              <TrendingDown className="size-3 text-rose-600" />
            )}
            <span className={cn(
              "text-[10px] font-medium",
              STATS.trend.direction === "up" ? "text-emerald-600" : "text-rose-600"
            )}>
              {STATS.trend.value}% this week
            </span>
          </div>
        )}

        {/* Breakdown (md/lg) */}
        {(isMedium || isLarge) && (
          <div className={cn("mt-3", isLarge && "mt-4")}>
            {isLarge ? (
              // Full breakdown with bars
              <div className="space-y-2">
                {STATS.breakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={cn("size-2 rounded-full", item.color)} />
                    <span className="text-xs text-muted-foreground flex-1">{item.label}</span>
                    <span className="text-xs font-medium text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              // Compact breakdown
              <div className="flex items-center gap-3">
                {STATS.breakdown.map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className={cn("size-1.5 rounded-full", item.color)} />
                    <span className="text-[10px] text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

