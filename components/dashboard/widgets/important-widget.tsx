"use client";

import * as React from "react";
import { Star, FileImage, Film, FileText, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Types & Mock Data
// ============================================================================

type ItemType = "image" | "video" | "document";

interface ImportantItem {
  id: string;
  name: string;
  type: ItemType;
  addedAt: string;
}

const IMPORTANT_ITEMS: ImportantItem[] = [
  { id: "1", name: "Brand Guidelines 2024.pdf", type: "document", addedAt: "2h" },
  { id: "2", name: "Product Hero Shot.jpg", type: "image", addedAt: "1d" },
  { id: "3", name: "Launch Video Final.mp4", type: "video", addedAt: "2d" },
  { id: "4", name: "Logo Pack.zip", type: "document", addedAt: "3d" },
];

const TYPE_ICONS: Record<ItemType, typeof Star> = {
  image: FileImage,
  video: Film,
  document: FileText,
};

const TYPE_COLORS: Record<ItemType, string> = {
  image: "bg-blue-500/10 text-blue-600",
  video: "bg-purple-500/10 text-purple-600",
  document: "bg-amber-500/10 text-amber-600",
};

// ============================================================================
// Important Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Star icon + count + top item name
// - md: 2-3 items with icons
// - lg: Full list with type icons and time
//

export function ImportantWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const displayItems = isSmall ? IMPORTANT_ITEMS.slice(0, 1) : isMedium ? IMPORTANT_ITEMS.slice(0, 3) : IMPORTANT_ITEMS;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Star className={cn(
          "text-amber-500 fill-amber-500",
          isSmall ? "size-4" : "size-5"
        )} />
        <span className={cn(
          "font-semibold tracking-tight truncate flex-1",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
        <span className={cn(
          "font-medium text-muted-foreground",
          isSmall ? "text-[10px]" : "text-xs"
        )}>
          {IMPORTANT_ITEMS.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Top item name
          <div className="flex items-center h-full">
            <p className="text-xs text-muted-foreground truncate">
              {IMPORTANT_ITEMS[0]?.name}
            </p>
          </div>
        ) : (
          // MEDIUM/LARGE: Item list
          <div className="space-y-1 overflow-auto h-full scrollbar-none">
            {displayItems.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 py-1.5 cursor-pointer group hover:bg-muted/50 transition-colors",
                    isLarge && "py-2 px-1"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center shrink-0",
                    isLarge ? "size-8" : "size-6",
                    TYPE_COLORS[item.type]
                  )}>
                    <Icon className={isLarge ? "size-4" : "size-3"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "font-medium text-foreground truncate block",
                      isLarge ? "text-sm" : "text-xs"
                    )}>
                      {item.name}
                    </span>
                    {isLarge && (
                      <p className="text-[10px] text-muted-foreground">{item.addedAt} ago</p>
                    )}
                  </div>
                  <Star className={cn(
                    "shrink-0 fill-amber-500 text-amber-500",
                    isLarge ? "size-4" : "size-3"
                  )} />
                </div>
              );
            })}

            {isMedium && IMPORTANT_ITEMS.length > 3 && (
              <button className="w-full py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                +{IMPORTANT_ITEMS.length - 3} more
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer (lg only) */}
      {isLarge && (
        <div className="shrink-0 pt-2 mt-1 border-t border-border/30">
          <button className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all starred
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
