"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Widget Frame Props
// ============================================================================

interface WidgetFrameProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}

// ============================================================================
// Widget Frame Component
// ============================================================================
// 
// Design Philosophy: Widgets should be SECONDARY to search.
// - Minimal visual weight (no heavy borders, subtle backgrounds)
// - Clean typography hierarchy
// - Ample whitespace for breathing room
// - Header is understated, not prominent
//

export function WidgetFrame({
  title,
  icon,
  children,
  className,
  headerActions,
  noPadding = false,
}: WidgetFrameProps) {
  return (
    <div
      className={cn(
        "h-full flex flex-col",
        // Removed bg-card - now transparent/subtle
        className
      )}
    >
      {/* Header - Minimal & Light */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        {/* Icon - Subtle */}
        {icon && (
          <div className="text-muted-foreground/60 shrink-0">
            {icon}
          </div>
        )}

        {/* Title - Understated */}
        <h3 className="flex-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          {title}
        </h3>

        {/* Custom Header Actions */}
        {headerActions && (
          <div className="text-xs text-muted-foreground/60">
            {headerActions}
          </div>
        )}
      </div>

      {/* Subtle separator */}
      <div className="mx-4 h-px bg-border/30" />

      {/* Content */}
      <div
        className={cn(
          "flex-1 overflow-auto",
          !noPadding && "p-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Widget Skeleton (for loading states)
// ============================================================================

export function WidgetSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-full overflow-hidden",
        "animate-pulse",
        className
      )}
    >
      <div className="h-10 border-b border-border/20 px-4 flex items-center gap-2">
        <div className="size-4 bg-muted/50 rounded" />
        <div className="h-3 bg-muted/50 rounded w-24" />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted/30 rounded w-3/4" />
        <div className="h-4 bg-muted/30 rounded w-1/2" />
        <div className="h-4 bg-muted/30 rounded w-5/6" />
      </div>
    </div>
  );
}
