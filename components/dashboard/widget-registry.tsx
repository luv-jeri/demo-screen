"use client";

import * as React from "react";
import { WIDGET_TYPES, type WidgetConfig, type WidgetSize } from "./widget-types";

// Import widgets
import { NotificationsWidget } from "./widgets/notifications-widget";
import { TeammatesWidget } from "./widgets/teammates-widget";
import { TodoWidget } from "./widgets/todo-widget";
import { RecentSearchesWidget } from "./widgets/recent-searches-widget";
import { ImportantWidget } from "./widgets/important-widget";
import { QuickActionsWidget } from "./widgets/quick-actions-widget";
import { StatsWidget } from "./widgets/stats-widget";

// ============================================================================
// Widget Props Interface
// ============================================================================

export interface WidgetProps {
  title: string;
  size: WidgetSize;
  isEditMode?: boolean;
}

// ============================================================================
// Render Widget Function
// ============================================================================

export function renderWidget(
  widget: WidgetConfig,
  props?: { isEditMode?: boolean; size?: WidgetSize }
): React.ReactNode {
  const baseProps: WidgetProps = {
    title: widget.title,
    size: props?.size || widget.size,
    isEditMode: props?.isEditMode,
  };

  switch (widget.type) {
    case WIDGET_TYPES.NOTIFICATIONS:
      return <NotificationsWidget {...baseProps} />;

    case WIDGET_TYPES.TEAMMATES:
      return <TeammatesWidget {...baseProps} />;

    case WIDGET_TYPES.TODO:
      return <TodoWidget {...baseProps} />;

    case WIDGET_TYPES.RECENT_SEARCHES:
      return <RecentSearchesWidget {...baseProps} />;

    case WIDGET_TYPES.IMPORTANT:
      return <ImportantWidget {...baseProps} />;

    case WIDGET_TYPES.QUICK_ACTIONS:
      return <QuickActionsWidget {...baseProps} />;

    case WIDGET_TYPES.STATS:
      return <StatsWidget {...baseProps} />;

    default:
      return (
        <div className="h-full flex items-center justify-center p-4 text-muted-foreground text-sm">
          Unknown widget type
        </div>
      );
  }
}
