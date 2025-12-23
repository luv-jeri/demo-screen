"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Users,
  CheckSquare,
  Clock,
  Star,
  Zap,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WIDGET_TYPES,
  WIDGET_SIZES,
  SIZE_HEIGHTS,
  type WidgetSize,
  type WidgetType,
  type WidgetState,
} from "./widget-types";

// ============================================================================
// Icon Registry
// ============================================================================

const WIDGET_ICONS: Record<string, LucideIcon> = {
  Bell,
  Users,
  CheckSquare,
  Clock,
  Star,
  Zap,
  BarChart3,
};

// ============================================================================
// Widget Card Props
// ============================================================================

interface WidgetCardProps {
  type: WidgetType;
  size: WidgetSize;
  title?: string;
  icon?: string;
  value?: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  state?: WidgetState;
  stateMessage?: string;
  onRetry?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  // For edit mode
  isEditing?: boolean;
  onRemove?: () => void;
}

// ============================================================================
// Widget Skeleton (Loading State)
// ============================================================================

function WidgetSkeleton({ size }: { size: WidgetSize }) {
  const isSmall = size === WIDGET_SIZES.SMALL;
  
  return (
    <div className="h-full w-full flex flex-col p-3 gap-2 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-2">
        <div className="size-5 bg-muted/60 rounded" />
        <div className="h-3 w-16 bg-muted/60 rounded" />
      </div>
      
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="h-6 w-20 bg-muted/40 rounded" />
        {!isSmall && <div className="h-3 w-24 bg-muted/30 rounded" />}
      </div>
    </div>
  );
}

// ============================================================================
// Widget Empty State
// ============================================================================

function WidgetEmpty({ message }: { message?: string }) {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <p className="text-xs text-muted-foreground text-center">
        {message || "No data"}
      </p>
    </div>
  );
}

// ============================================================================
// Widget Error State
// ============================================================================

function WidgetError({ 
  message, 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void;
}) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-3 gap-2">
      <AlertCircle className="size-5 text-destructive/60" />
      <p className="text-xs text-muted-foreground text-center">
        {message || "Failed to load"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="size-3" />
          Retry
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Trend Indicator
// ============================================================================

function TrendIndicator({ trend }: { 
  trend: { value: number; label: string; direction: "up" | "down" | "neutral" };
}) {
  const colors = {
    up: "text-emerald-600",
    down: "text-rose-600",
    neutral: "text-muted-foreground",
  };
  
  const arrows = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };
  
  return (
    <span className={cn("text-[10px] font-medium", colors[trend.direction])}>
      {arrows[trend.direction]} {Math.abs(trend.value)}% {trend.label}
    </span>
  );
}

// ============================================================================
// Widget Card Component
// ============================================================================
// 
// Anatomy (consistent across all widgets):
// ┌─────────────────────────────────┐
// │ [Icon] Title          [Status] │  ← Header (always visible)
// ├─────────────────────────────────┤
// │                                 │
// │     PRIMARY VALUE / CONTENT    │  ← Main content area
// │     Subtitle / Trend           │  
// │                                 │
// ├─────────────────────────────────┤
// │ [Footer Actions]               │  ← Footer (optional, lg only)
// └─────────────────────────────────┘
//

export function WidgetCard({
  type,
  size,
  title,
  icon,
  value,
  subtitle,
  trend,
  state = "idle",
  stateMessage,
  onRetry,
  children,
  footer,
  className,
  isEditing,
}: WidgetCardProps) {
  const Icon = icon ? WIDGET_ICONS[icon] : null;
  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  // Handle states
  if (state === "loading") {
    return (
      <div className={cn(
        "relative overflow-hidden",
        "bg-card/50 border border-border/40",
        SIZE_HEIGHTS[size],
        className
      )}>
        <WidgetSkeleton size={size} />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={cn(
        "relative overflow-hidden",
        "bg-card/50 border border-border/40",
        SIZE_HEIGHTS[size],
        className
      )}>
        <WidgetError message={stateMessage} onRetry={onRetry} />
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className={cn(
        "relative overflow-hidden",
        "bg-card/50 border border-border/40",
        SIZE_HEIGHTS[size],
        className
      )}>
        <WidgetEmpty message={stateMessage} />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        // Subtle, glanceable design
        "bg-card/60 border border-border/50",
        // Hover state (only when not editing)
        !isEditing && "hover:bg-card/80 hover:border-border/70 transition-all duration-200",
        // Size-based height
        SIZE_HEIGHTS[size],
        className
      )}
      whileHover={!isEditing ? { y: -1 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="h-full flex flex-col">
        {/* ============================================ */}
        {/* HEADER - Icon + Title (always visible)      */}
        {/* ============================================ */}
        <div className={cn(
          "flex items-center gap-2 shrink-0",
          isSmall ? "px-3 pt-3 pb-1" : "px-4 pt-3 pb-2"
        )}>
          {/* Icon */}
          {Icon && (
            <div className={cn(
              "shrink-0",
              isSmall ? "size-4" : "size-5",
              "text-muted-foreground/70"
            )}>
              <Icon className="size-full" />
            </div>
          )}
          
          {/* Title */}
          <h3 className={cn(
            "flex-1 font-semibold tracking-tight truncate",
            isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
          )}>
            {title}
          </h3>
        </div>

        {/* ============================================ */}
        {/* MAIN CONTENT AREA                           */}
        {/* ============================================ */}
        <div className={cn(
          "flex-1 min-h-0 overflow-hidden",
          isSmall ? "px-3 pb-3" : "px-4 pb-3"
        )}>
          {/* If children are provided, render them */}
          {children ? (
            <div className="h-full overflow-auto scrollbar-none">
              {children}
            </div>
          ) : (
            /* Otherwise, render default value/subtitle layout */
            <div className="h-full flex flex-col justify-center">
              {/* Primary Value */}
              {value !== undefined && (
                <div className={cn(
                  "font-bold text-foreground tracking-tight leading-none",
                  isSmall ? "text-2xl" : isMedium ? "text-3xl" : "text-4xl"
                )}>
                  {value}
                </div>
              )}
              
              {/* Subtitle */}
              {subtitle && !isSmall && (
                <p className={cn(
                  "text-muted-foreground mt-1",
                  isMedium ? "text-xs" : "text-sm"
                )}>
                  {subtitle}
                </p>
              )}
              
              {/* Trend */}
              {trend && !isSmall && (
                <div className="mt-2">
                  <TrendIndicator trend={trend} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* FOOTER - Actions (lg only)                  */}
        {/* ============================================ */}
        {isLarge && footer && (
          <div className="shrink-0 px-4 pb-3 pt-2 border-t border-border/30">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Compact Widget Wrapper (for consistent sizing in grid)
// ============================================================================

export function WidgetWrapper({
  size,
  children,
  className,
}: {
  size: WidgetSize;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(SIZE_HEIGHTS[size], className)}>
      {children}
    </div>
  );
}

