"use client";

import * as React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Mock Data
// ============================================================================

interface Teammate {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  activity?: string;
}

const TEAMMATES: Teammate[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", status: "online", activity: "Editing brand guidelines" },
  { id: "2", name: "Mike Peters", avatar: "MP", status: "online", activity: "Reviewing uploads" },
  { id: "3", name: "Emma Wilson", avatar: "EW", status: "away", activity: "Away" },
  { id: "4", name: "Alex Kumar", avatar: "AK", status: "online", activity: "In meeting" },
];

const STATUS_COLORS: Record<Teammate["status"], string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/30",
};

// ============================================================================
// Teammates Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Stacked avatars + online count
// - md: Avatar row + names + status
// - lg: Full list with activity
//

export function TeammatesWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const onlineCount = TEAMMATES.filter(t => t.status === "online").length;
  const displayTeammates = isSmall ? TEAMMATES.slice(0, 4) : isMedium ? TEAMMATES.slice(0, 3) : TEAMMATES;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Users className={cn(
          "text-muted-foreground/70",
          isSmall ? "size-4" : "size-5"
        )} />
        <span className={cn(
          "font-semibold tracking-tight truncate flex-1",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
        <span className={cn(
          "font-medium text-emerald-600",
          isSmall ? "text-[10px]" : "text-xs"
        )}>
          {onlineCount} online
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Stacked avatars
          <div className="flex items-center h-full">
            <div className="flex -space-x-2">
              {displayTeammates.map((teammate, idx) => (
                <div
                  key={teammate.id}
                  className={cn(
                    "relative size-8 flex items-center justify-center bg-muted text-xs font-semibold text-foreground border-2 border-background",
                    "z-[10]"
                  )}
                  style={{ zIndex: 10 - idx }}
                >
                  {teammate.avatar}
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
                    STATUS_COLORS[teammate.status]
                  )} />
                </div>
              ))}
              {TEAMMATES.length > 4 && (
                <div className="size-8 flex items-center justify-center bg-muted/50 text-[10px] font-medium text-muted-foreground border-2 border-background">
                  +{TEAMMATES.length - 4}
                </div>
              )}
            </div>
          </div>
        ) : isMedium ? (
          // MEDIUM: Compact list
          <div className="space-y-1.5 overflow-auto h-full scrollbar-none">
            {displayTeammates.map((teammate) => (
              <div
                key={teammate.id}
                className="flex items-center gap-2 py-1"
              >
                <div className="relative size-6 flex items-center justify-center bg-muted text-[10px] font-semibold text-foreground">
                  {teammate.avatar}
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-background",
                    STATUS_COLORS[teammate.status]
                  )} />
                </div>
                <span className="text-xs font-medium text-foreground truncate">{teammate.name}</span>
              </div>
            ))}
          </div>
        ) : (
          // LARGE: Full list with activity
          <div className="space-y-2 overflow-auto h-full scrollbar-none">
            {displayTeammates.map((teammate) => (
              <div
                key={teammate.id}
                className="flex items-center gap-3 p-2 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="relative size-8 flex items-center justify-center bg-muted text-xs font-semibold text-foreground">
                  {teammate.avatar}
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background",
                    STATUS_COLORS[teammate.status]
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{teammate.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{teammate.activity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
