"use client";

import * as React from "react";
import {
  type WidgetConfig,
  type WidgetType,
  type WidgetSize,
  DEFAULT_WIDGETS,
  ALL_WIDGETS_PRESET,
  DASHBOARD_STORAGE_KEY,
  WIDGET_DEFINITIONS,
} from "./widget-types";

// ============================================================================
// Dashboard State
// ============================================================================

interface DashboardState {
  version: number;
  widgets: WidgetConfig[];
  widgetOrder: string[];
}

const DEFAULT_STATE: DashboardState = {
  version: 6,
  widgets: DEFAULT_WIDGETS,
  widgetOrder: DEFAULT_WIDGETS.map((w) => w.id),
};

// ============================================================================
// Context Type
// ============================================================================

interface DashboardContextType {
  // State
  widgets: WidgetConfig[];
  isEditMode: boolean;

  // Actions
  setEditMode: (editing: boolean) => void;
  toggleEditMode: () => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (widgetId: string) => void;
  removeAllWidgets: () => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  reorderWidgets: (newOrder: string[]) => void;
  resizeWidget: (widgetId: string, size: WidgetSize) => void;
  resetToDefault: () => void;

  // Helpers
  getVisibleWidgets: () => WidgetConfig[];
  canAddWidget: (type: WidgetType) => boolean;
  getWidgetDefinition: (type: WidgetType) => typeof WIDGET_DEFINITIONS[WidgetType];
}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

// ============================================================================
// Hook
// ============================================================================

export function useDashboard() {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}

// ============================================================================
// Storage Utilities
// ============================================================================

function loadFromStorage(): DashboardState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;

    const parsed = JSON.parse(stored) as DashboardState;

    // Version check - reset if old version
    if (parsed.version !== DEFAULT_STATE.version) {
      console.log("Dashboard version mismatch, resetting to default");
      return DEFAULT_STATE;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load dashboard state:", error);
    return DEFAULT_STATE;
  }
}

function saveToStorage(state: DashboardState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save dashboard state:", error);
  }
}

// ============================================================================
// Provider Component
// ============================================================================

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [widgets, setWidgets] = React.useState<WidgetConfig[]>([]);
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from storage on mount
  React.useEffect(() => {
    const state = loadFromStorage();
    setWidgets(state.widgets);
    setWidgetOrder(state.widgetOrder);
    setIsLoaded(true);
  }, []);

  // Save to storage when state changes (debounced)
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const state: DashboardState = {
        version: DEFAULT_STATE.version,
        widgets,
        widgetOrder,
      };
      saveToStorage(state);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [widgets, widgetOrder, isLoaded]);

  // ============================================================================
  // Actions
  // ============================================================================

  const setEditMode = React.useCallback((editing: boolean) => {
    setIsEditMode(editing);
  }, []);

  const toggleEditMode = React.useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  const addWidget = React.useCallback((type: WidgetType) => {
    const definition = WIDGET_DEFINITIONS[type];
    if (!definition) return;

    const id = `${type}-${Date.now()}`;
    const newWidget: WidgetConfig = {
      id,
      type,
      title: definition.title,
      visible: true,
      size: definition.defaultSize,
    };

    setWidgets((prev) => [...prev, newWidget]);
    setWidgetOrder((prev) => [...prev, id]);
  }, []);

  const removeWidget = React.useCallback((widgetId: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
    setWidgetOrder((prev) => prev.filter((id) => id !== widgetId));
  }, []);

  const removeAllWidgets = React.useCallback(() => {
    setWidgets([]);
    setWidgetOrder([]);
  }, []);

  const toggleWidgetVisibility = React.useCallback((widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, visible: !w.visible } : w))
    );
  }, []);

  const reorderWidgets = React.useCallback((newOrder: string[]) => {
    setWidgetOrder(newOrder);
  }, []);

  const resizeWidget = React.useCallback((widgetId: string, size: WidgetSize) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, size } : w))
    );
  }, []);

  const resetToDefault = React.useCallback(() => {
    // Reset loads all widgets (full preset)
    setWidgets(ALL_WIDGETS_PRESET);
    setWidgetOrder(ALL_WIDGETS_PRESET.map((w) => w.id));
  }, []);

  // ============================================================================
  // Helpers
  // ============================================================================

  const getVisibleWidgets = React.useCallback(() => {
    const visibleIds = new Set(
      widgets.filter((w) => w.visible).map((w) => w.id)
    );
    
    // Return widgets in order, filtering out hidden ones
    return widgetOrder
      .filter((id) => visibleIds.has(id))
      .map((id) => widgets.find((w) => w.id === id)!)
      .filter(Boolean);
  }, [widgets, widgetOrder]);

  const canAddWidget = React.useCallback(
    (type: WidgetType) => {
      const count = widgets.filter((w) => w.type === type).length;
      return count < 2;
    },
    [widgets]
  );

  const getWidgetDefinition = React.useCallback(
    (type: WidgetType) => WIDGET_DEFINITIONS[type],
    []
  );

  // ============================================================================
  // Context Value
  // ============================================================================

  const value = React.useMemo<DashboardContextType>(
    () => ({
      widgets,
      isEditMode,
      setEditMode,
      toggleEditMode,
      addWidget,
      removeWidget,
      removeAllWidgets,
      toggleWidgetVisibility,
      reorderWidgets,
      resizeWidget,
      resetToDefault,
      getVisibleWidgets,
      canAddWidget,
      getWidgetDefinition,
    }),
    [
      widgets,
      isEditMode,
      setEditMode,
      toggleEditMode,
      addWidget,
      removeWidget,
      removeAllWidgets,
      toggleWidgetVisibility,
      reorderWidgets,
      resizeWidget,
      resetToDefault,
      getVisibleWidgets,
      canAddWidget,
      getWidgetDefinition,
    ]
  );

  // Loading state - minimal since default is empty
  if (!isLoaded) {
    return null;
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
