"use client";

import * as React from "react";
import { Clock, Search, ArrowUpRight, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Mock Data
// ============================================================================

interface RecentSearch {
  id: string;
  query: string;
  time: string;
  results: number;
  pinned?: boolean;
}

const RECENT_SEARCHES: RecentSearch[] = [
  { id: "1", query: "brand guidelines 2024", time: "2m", results: 24, pinned: true },
  { id: "2", query: "product photos Q4", time: "15m", results: 156 },
  { id: "3", query: "logo transparent", time: "1h", results: 12, pinned: true },
  { id: "4", query: "marketing banner", time: "2h", results: 89 },
  { id: "5", query: "social media templates", time: "3h", results: 34 },
];

// ============================================================================
// Recent Searches Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Icon + latest search
// - md: 3-4 recent searches
// - lg: Full list with results count and pinned
//

export function RecentSearchesWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const displaySearches = isSmall ? RECENT_SEARCHES.slice(0, 1) : isMedium ? RECENT_SEARCHES.slice(0, 3) : RECENT_SEARCHES;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Clock className={cn(
          "text-muted-foreground/70",
          isSmall ? "size-4" : "size-5"
        )} />
        <span className={cn(
          "font-semibold tracking-tight truncate flex-1",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
        {!isSmall && (
          <span className="text-[10px] text-muted-foreground">
            {RECENT_SEARCHES.length} items
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Latest search
          <div className="flex items-center h-full gap-2">
            <Search className="size-3 text-muted-foreground/50 shrink-0" />
            <p className="text-xs text-muted-foreground truncate">
              {RECENT_SEARCHES[0]?.query}
            </p>
          </div>
        ) : (
          // MEDIUM/LARGE: Search list
          <div className="space-y-1 overflow-auto h-full scrollbar-none">
            {displaySearches.map((search) => (
              <div
                key={search.id}
                className={cn(
                  "flex items-center gap-2 py-1.5 cursor-pointer group hover:bg-muted/50 transition-colors",
                  isLarge && "py-2 px-1"
                )}
              >
                <Search className={cn(
                  "shrink-0 text-muted-foreground/50",
                  isLarge ? "size-4" : "size-3"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "font-medium text-foreground truncate",
                      isLarge ? "text-sm" : "text-xs"
                    )}>
                      {search.query}
                    </span>
                    {search.pinned && (
                      <Pin className="size-3 text-accent shrink-0" />
                    )}
                  </div>
                  {isLarge && (
                    <p className="text-[10px] text-muted-foreground">
                      {search.results} results • {search.time} ago
                    </p>
                  )}
                </div>
                {!isLarge && (
                  <span className="text-[10px] text-muted-foreground shrink-0">{search.time}</span>
                )}
                <ArrowUpRight className={cn(
                  "shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors",
                  isLarge ? "size-4" : "size-3"
                )} />
              </div>
            ))}

            {isMedium && RECENT_SEARCHES.length > 3 && (
              <button className="w-full py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                +{RECENT_SEARCHES.length - 3} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer (lg only) */}
      {isLarge && (
        <div className="shrink-0 pt-2 mt-1 border-t border-border/30">
          <button className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all history
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
