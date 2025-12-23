// Main Dashboard Export
export { WidgetDashboard, useHasWidgets } from "./widget-dashboard";

// Context & Provider
export { DashboardProvider, useDashboard } from "./widget-context";

// Types
export * from "./widget-types";

// Widget Registry
export { renderWidget, getWidgetComponent, isValidWidgetType } from "./widget-registry";

// Sortable Widget
export { SortableWidget, WidgetCard } from "./sortable-widget";

// Widget Frame
export { WidgetFrame, WidgetSkeleton } from "./widget-frame";

// Individual Widgets
export { NotificationsWidget } from "./widgets/notifications-widget";
export { TeammatesWidget } from "./widgets/teammates-widget";
export { TodoWidget } from "./widgets/todo-widget";
export { RecentSearchesWidget } from "./widgets/recent-searches-widget";
export { ImportantWidget } from "./widgets/important-widget";
export { QuickActionsWidget } from "./widgets/quick-actions-widget";
