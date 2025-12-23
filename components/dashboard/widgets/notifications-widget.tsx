"use client";

import * as React from "react";
import { Bell, Upload, MessageSquare, Users, Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Types & Mock Data
// ============================================================================

type NotificationType = "upload" | "comment" | "share" | "star";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", type: "upload", title: "New assets uploaded", time: "2m" },
  { id: "2", type: "comment", title: "Sarah commented on design", time: "5m" },
  { id: "3", type: "share", title: "Marketing folder shared", time: "1h" },
  { id: "4", type: "star", title: "Logo marked as important", time: "2h" },
];

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  upload: Upload,
  comment: MessageSquare,
  share: Users,
  star: Star,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  upload: "bg-emerald-500/10 text-emerald-600",
  comment: "bg-blue-500/10 text-blue-600",
  share: "bg-purple-500/10 text-purple-600",
  star: "bg-amber-500/10 text-amber-600",
};

// ============================================================================
// Notifications Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Icon + count badge (ultra-compact)
// - md: Icon + count + 2-3 items preview
// - lg: Full list with all items and actions
//

export function NotificationsWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const unreadCount = NOTIFICATIONS.length;
  const previewItems = isMedium ? NOTIFICATIONS.slice(0, 2) : NOTIFICATIONS;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <Bell className={cn(
            "text-muted-foreground/70",
            isSmall ? "size-4" : "size-5"
          )} />
          {/* Notification dot */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 size-2 bg-accent rounded-full" />
          )}
        </div>
        <span className={cn(
          "font-semibold tracking-tight truncate flex-1",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
        {/* Count badge */}
        <span className={cn(
          "font-bold bg-accent text-accent-foreground px-1.5 py-0.5",
          isSmall ? "text-[10px]" : "text-xs"
        )}>
          {unreadCount}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Just show latest notification text
          <div className="flex items-center h-full">
            <p className="text-xs text-muted-foreground truncate">
              {NOTIFICATIONS[0]?.title}
            </p>
          </div>
        ) : (
          // MEDIUM/LARGE: Show notification list
          <div className="space-y-1.5 overflow-auto h-full scrollbar-none">
            {previewItems.map((notification) => {
              const Icon = TYPE_ICONS[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors cursor-pointer group",
                    isLarge && "p-2.5"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center shrink-0",
                    isLarge ? "size-8" : "size-6",
                    TYPE_COLORS[notification.type]
                  )}>
                    <Icon className={isLarge ? "size-4" : "size-3"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-foreground truncate",
                      isLarge ? "text-sm" : "text-xs"
                    )}>
                      {notification.title}
                    </p>
                    {isLarge && (
                      <p className="text-[10px] text-muted-foreground">{notification.time} ago</p>
                    )}
                  </div>
                  {!isLarge && (
                    <span className="text-[10px] text-muted-foreground shrink-0">{notification.time}</span>
                  )}
                </div>
              );
            })}

            {/* Show more indicator (medium only) */}
            {isMedium && NOTIFICATIONS.length > 2 && (
              <button className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                +{NOTIFICATIONS.length - 2} more
                <ArrowUpRight className="size-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer (lg only) */}
      {isLarge && (
        <div className="shrink-0 pt-2 mt-1 border-t border-border/30">
          <button className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all notifications
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
