"use client";

import { Activity, TrendingUp, AlertTriangle, Sparkles, Star, FileText, Zap, HardDrive, Cpu, Clock, Home } from "lucide-react";

import { TrendRadarWidget } from "./dashboard/widgets/trend-radar-widget";
import { WorkspaceHealthWidget } from "./dashboard/widgets/workspace-health-widget";
import { ComplianceWidget } from "./dashboard/widgets/compliance-widget";
import { ScratchpadWidget } from "./dashboard/widgets/scratchpad-widget";
import { SpotlightWidget } from "./dashboard/widgets/spotlight-widget";
import { PromoWidget } from "./dashboard/widgets/promo-widget";
import { ActivityWidget } from "./dashboard/widgets/activity-widget";
import { QuickActionsWidget } from "./dashboard/widgets/quick-actions-widget";
import { StorageWidget } from "./dashboard/widgets/storage-widget";
import { SystemWidget } from "./dashboard/widgets/system-widget";
import { TimeWidget } from "./dashboard/widgets/time-widget";
import { WelcomeWidget } from "./dashboard/widgets/welcome-widget";

import { WidgetSize } from "./bento-store";

// Map Widget Type to Component
export const WIDGET_COMPONENTS: Record<string, React.ComponentType<{ size: WidgetSize, id: string }>> = {
  "trend-radar": TrendRadarWidget,
  "workspace-health": WorkspaceHealthWidget,
  "compliance": ComplianceWidget,
  "scratchpad": ScratchpadWidget,
  "spotlight": SpotlightWidget,
  "promo": PromoWidget,
  "activity": ActivityWidget,
  "quick-actions": QuickActionsWidget,
  "storage": StorageWidget,
  "system": SystemWidget,
  "time": TimeWidget,
  "welcome": WelcomeWidget,
};

// Widget Background Styles (Glassmorphism & Gradients)
export const WIDGET_BGS: Record<string, string> = {
  "trend-radar": "bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20",
  "workspace-health": "bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20",
  "compliance": "bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10",
  "scratchpad": "bg-zinc-900/40 border-white/5",
  "spotlight": "bg-black border-transparent", 
  "promo": "bg-zinc-900/40 border-white/5",
  "activity": "bg-gradient-to-br from-indigo-500/5 to-transparent",
  "quick-actions": "bg-zinc-900/40",
  "storage": "bg-gradient-to-br from-blue-500/5 to-transparent",
  "system": "bg-gradient-to-br from-emerald-500/5 to-transparent",
  "time": "bg-zinc-900/40",
  "welcome": "bg-gradient-to-br from-amber-500/5 to-transparent",
};

export const AVAILABLE_WIDGETS = [
  { type: "spotlight", label: "Featured Spotlight", icon: Star, defaultSize: "4x2", description: "Hero content" },
  { type: "promo", label: "Discover", icon: Sparkles, defaultSize: "2x1", description: "Feature highlights" },
  { type: "trend-radar", label: "Trend Radar", icon: TrendingUp, defaultSize: "2x2", description: "Market data" },
  { type: "workspace-health", label: "Workspace Health", icon: Activity, defaultSize: "2x2", description: "Team metrics" },
  { type: "compliance", label: "Compliance", icon: AlertTriangle, defaultSize: "1x2", description: "Expiry alerts" },
  { type: "scratchpad", label: "AI Scratchpad", icon: FileText, defaultSize: "2x2", description: "Quick notes" },
  { type: "activity", label: "Recent Activity", icon: FileText, defaultSize: "1x2", description: "Team updates" },
  { type: "quick-actions", label: "Quick Actions", icon: Zap, defaultSize: "1x1", description: "Shortcuts" },
  { type: "storage", label: "Storage", icon: HardDrive, defaultSize: "1x1", description: "Disk usage" },
  { type: "system", label: "System Status", icon: Cpu, defaultSize: "1x1", description: "System health" },
  { type: "time", label: "Clock", icon: Clock, defaultSize: "1x1", description: "Current time" },
  { type: "welcome", label: "Welcome Card", icon: Home, defaultSize: "2x1", description: "Greeting" },
] as const;
