// ============================================================================
// Widget System v2.0 - Production-Ready Widget Framework
// ============================================================================
// 
// Design Philosophy:
// - Widgets are SECONDARY to search (subtle, compact, glanceable)
// - iPhone-like size variants (sm/md/lg) with distinct content density
// - Icon-forward design reduces cognitive load
// - Consistent anatomy across all widgets
// - Bento-grid friendly with responsive sizing
//

// ============================================================================
// Widget Type Enum
// ============================================================================

export const WIDGET_TYPES = {
  NOTIFICATIONS: "notifications",
  TEAMMATES: "teammates",
  TODO: "todo",
  RECENT_SEARCHES: "recent-searches",
  IMPORTANT: "important",
  QUICK_ACTIONS: "quick-actions",
  STATS: "stats",
} as const;

export type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES];

// ============================================================================
// Widget Size System (iPhone-inspired: sm/md/lg)
// ============================================================================

export const WIDGET_SIZES = {
  SMALL: "sm",    // Ultra-compact: icon + primary value only
  MEDIUM: "md",   // Balanced: icon + value + secondary info
  LARGE: "lg",    // Rich: full content with actions
} as const;

export type WidgetSize = (typeof WIDGET_SIZES)[keyof typeof WIDGET_SIZES];

// Size Display Names
export const SIZE_LABELS: Record<WidgetSize, string> = {
  [WIDGET_SIZES.SMALL]: "Small",
  [WIDGET_SIZES.MEDIUM]: "Medium",
  [WIDGET_SIZES.LARGE]: "Large",
};

// ============================================================================
// Grid Layout Configuration
// ============================================================================

// Grid span classes per size (bento-grid compatible)
export const SIZE_GRID_CLASSES: Record<WidgetSize, string> = {
  [WIDGET_SIZES.SMALL]: "col-span-1",                       // 1 column
  [WIDGET_SIZES.MEDIUM]: "col-span-1 lg:col-span-2",        // 1-2 columns
  [WIDGET_SIZES.LARGE]: "col-span-1 md:col-span-2 lg:col-span-3", // 1-3 columns
};

// Fixed heights per size (compact, predictable)
export const SIZE_HEIGHTS: Record<WidgetSize, string> = {
  [WIDGET_SIZES.SMALL]: "h-[120px]",   // Compact - glanceable
  [WIDGET_SIZES.MEDIUM]: "h-[180px]",  // Balanced - scannable
  [WIDGET_SIZES.LARGE]: "h-[260px]",   // Rich - explorable
};

// Min widths to prevent cramping
export const SIZE_MIN_WIDTHS: Record<WidgetSize, string> = {
  [WIDGET_SIZES.SMALL]: "min-w-[140px]",
  [WIDGET_SIZES.MEDIUM]: "min-w-[200px]",
  [WIDGET_SIZES.LARGE]: "min-w-[280px]",
};

// ============================================================================
// Widget Configuration
// ============================================================================

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  visible: boolean;
  size: WidgetSize;
}

// ============================================================================
// Widget Definition (for registry)
// ============================================================================

export interface WidgetDefinition {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
}

// ============================================================================
// Widget Definitions Registry
// ============================================================================

export const WIDGET_DEFINITIONS: Record<WidgetType, WidgetDefinition> = {
  [WIDGET_TYPES.NOTIFICATIONS]: {
    type: WIDGET_TYPES.NOTIFICATIONS,
    title: "Notifications",
    description: "Recent alerts and updates",
    icon: "Bell",
    defaultSize: WIDGET_SIZES.SMALL,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  [WIDGET_TYPES.TEAMMATES]: {
    type: WIDGET_TYPES.TEAMMATES,
    title: "Team",
    description: "Who's online now",
    icon: "Users",
    defaultSize: WIDGET_SIZES.SMALL,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM],
  },
  [WIDGET_TYPES.TODO]: {
    type: WIDGET_TYPES.TODO,
    title: "Tasks",
    description: "Your active tasks",
    icon: "CheckSquare",
    defaultSize: WIDGET_SIZES.MEDIUM,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  [WIDGET_TYPES.RECENT_SEARCHES]: {
    type: WIDGET_TYPES.RECENT_SEARCHES,
    title: "Recent",
    description: "Recent searches",
    icon: "Clock",
    defaultSize: WIDGET_SIZES.SMALL,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  [WIDGET_TYPES.IMPORTANT]: {
    type: WIDGET_TYPES.IMPORTANT,
    title: "Starred",
    description: "Pinned items",
    icon: "Star",
    defaultSize: WIDGET_SIZES.SMALL,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  [WIDGET_TYPES.QUICK_ACTIONS]: {
    type: WIDGET_TYPES.QUICK_ACTIONS,
    title: "Quick Actions",
    description: "Common actions",
    icon: "Zap",
    defaultSize: WIDGET_SIZES.MEDIUM,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  [WIDGET_TYPES.STATS]: {
    type: WIDGET_TYPES.STATS,
    title: "Stats",
    description: "Library overview",
    icon: "BarChart3",
    defaultSize: WIDGET_SIZES.SMALL,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM],
  },
};

// ============================================================================
// Default Widgets (empty by default - cleaner initial experience)
// ============================================================================

export const DEFAULT_WIDGETS: WidgetConfig[] = [];

// Full widget preset (for "Reset" / "Add All" functionality)
export const ALL_WIDGETS_PRESET: WidgetConfig[] = [
  { id: "stats-1", type: WIDGET_TYPES.STATS, title: "Stats", visible: true, size: WIDGET_SIZES.SMALL },
  { id: "notifications-1", type: WIDGET_TYPES.NOTIFICATIONS, title: "Notifications", visible: true, size: WIDGET_SIZES.SMALL },
  { id: "teammates-1", type: WIDGET_TYPES.TEAMMATES, title: "Team", visible: true, size: WIDGET_SIZES.SMALL },
  { id: "todo-1", type: WIDGET_TYPES.TODO, title: "Tasks", visible: true, size: WIDGET_SIZES.MEDIUM },
  { id: "recent-searches-1", type: WIDGET_TYPES.RECENT_SEARCHES, title: "Recent", visible: true, size: WIDGET_SIZES.SMALL },
  { id: "quick-actions-1", type: WIDGET_TYPES.QUICK_ACTIONS, title: "Quick Actions", visible: true, size: WIDGET_SIZES.MEDIUM },
];

// ============================================================================
// Dashboard State
// ============================================================================

export interface DashboardState {
  version: number;
  widgets: WidgetConfig[];
  widgetOrder: string[];
}

export const DEFAULT_DASHBOARD_STATE: DashboardState = {
  version: 6,  // Bumped for new widget system
  widgets: DEFAULT_WIDGETS,
  widgetOrder: [],
};

// ============================================================================
// Storage Key
// ============================================================================

export const DASHBOARD_STORAGE_KEY = "mediavault-dashboard-v6";

// ============================================================================
// Widget States (for loading, empty, error handling)
// ============================================================================

export type WidgetState = "idle" | "loading" | "error" | "empty";

export interface WidgetStateConfig {
  state: WidgetState;
  message?: string;
  retryAction?: () => void;
}
