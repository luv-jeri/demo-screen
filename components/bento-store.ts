"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type WidgetType = 
  | "trend-radar"
  | "workspace-health"
  | "compliance"
  | "scratchpad"
  | "spotlight"
  | "promo"
  | "activity"
  | "quick-actions"
  | "storage"
  | "system"
  | "time"
  | "welcome";

export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "4x1" | "4x2";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  size: WidgetSize;
}

export interface BentoState {
  isEditMode: boolean;
  widgets: WidgetConfig[];
  
  // Actions
  toggleEditMode: () => void;
  setWidgets: (widgets: WidgetConfig[]) => void;
  updateWidgetSize: (id: string, size: WidgetSize) => void;
  removeWidget: (id: string) => void;
  addWidget: (type: WidgetType) => void;
  resetLayout: () => void;
}

// ============================================================================
// Initial State - ALL 12 WIDGETS
// ============================================================================

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "w-spotlight", type: "spotlight", size: "4x2" },
  { id: "w-welcome", type: "welcome", size: "2x1" },
  { id: "w-promo", type: "promo", size: "2x1" },
  { id: "w-trend", type: "trend-radar", size: "2x2" },
  { id: "w-health", type: "workspace-health", size: "2x2" },
  { id: "w-compliance", type: "compliance", size: "1x2" },
  { id: "w-activity", type: "activity", size: "1x2" },
  { id: "w-scratch", type: "scratchpad", size: "2x2" },
  { id: "w-storage", type: "storage", size: "1x1" },
  { id: "w-system", type: "system", size: "1x1" },
  { id: "w-time", type: "time", size: "1x1" },
  { id: "w-quick", type: "quick-actions", size: "1x1" },
];

// ============================================================================
// Store
// ============================================================================

export const useBentoStore = create<BentoState>()(
  persist(
    (set) => ({
      isEditMode: false,
      widgets: DEFAULT_WIDGETS,

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      
      setWidgets: (widgets) => set({ widgets }),

      updateWidgetSize: (id, size) => set((state) => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, size } : w)
      })),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter(w => w.id !== id)
      })),

      addWidget: (type) => set((state) => {
        const id = `${type}-${Date.now()}`;
        // Default size logic could be smarter, but 1x1 is safe
        return { widgets: [...state.widgets, { id, type, size: "1x1" }] };
      }),

      resetLayout: () => set({ widgets: DEFAULT_WIDGETS }),
    }),
    {
      name: "bento-storage",
      partialize: (state) => ({ widgets: state.widgets }), // Only persist widgets
    }
  )
);
