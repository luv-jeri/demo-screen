"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  Upload,
  FolderPlus,
  Share2,
  Download,
  Search,
  Tags,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Types & Data
// ============================================================================

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "upload", label: "Upload", icon: Upload, href: "/upload", color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" },
  { id: "search", label: "Search", icon: Search, href: "/search", color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" },
  { id: "new-folder", label: "New Folder", icon: FolderPlus, href: "/folders/new", color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20" },
  { id: "share", label: "Share", icon: Share2, href: "/share", color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" },
  { id: "download", label: "Export", icon: Download, href: "/download", color: "bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20" },
  { id: "tags", label: "Tags", icon: Tags, href: "/tags", color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20" },
];

// ============================================================================
// Quick Actions Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: 4 icon buttons in a row
// - md: 4-6 icon buttons with labels
// - lg: Full grid with descriptions
//

export function QuickActionsWidget({ title, size }: WidgetProps) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const displayActions = isSmall ? QUICK_ACTIONS.slice(0, 4) : isMedium ? QUICK_ACTIONS.slice(0, 6) : QUICK_ACTIONS;

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Zap className={cn(
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
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Icon-only row
          <div className="flex items-center justify-between h-full gap-1">
            {displayActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className={cn(
                  "flex-1 flex items-center justify-center h-full transition-colors",
                  action.color
                )}
              >
                <action.icon className="size-5" />
              </Link>
            ))}
          </div>
        ) : isMedium ? (
          // MEDIUM: Icon + label grid
          <div className="grid grid-cols-3 gap-2 h-full content-center">
            {displayActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
                  action.color
                )}
              >
                <action.icon className="size-5" />
                <span className="text-[10px] font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        ) : (
          // LARGE: Full grid with hover effects
          <div className="grid grid-cols-3 gap-2 h-full content-start overflow-auto scrollbar-none">
            {displayActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-3 transition-all border border-transparent hover:border-border",
                  action.color
                )}
              >
                <action.icon className="size-6" />
                <span className="text-xs font-semibold text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
