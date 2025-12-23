# Widget Dashboard System - Complete Implementation Guide

A comprehensive guide to building a modular, drag-and-drop, resizable widget dashboard in React/Next.js.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Step-by-Step Implementation](#4-step-by-step-implementation)
5. [Component Deep Dive](#5-component-deep-dive)
6. [State Management](#6-state-management)
7. [Drag & Drop System](#7-drag--drop-system)
8. [Resizing System](#8-resizing-system)
9. [Persistence Layer](#9-persistence-layer)
10. [Styling & Animations](#10-styling--animations)
11. [Adding New Widgets](#11-adding-new-widgets)
12. [Best Practices](#12-best-practices)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Overview

### What We Built
A dashboard system where users can:
- ✅ View multiple widgets in a responsive grid
- ✅ **Drag & drop** to reorder widgets
- ✅ **Resize** widgets (small, medium, large, wide, tall)
- ✅ **Add/remove** widgets dynamically
- ✅ **Edit mode** toggle for safe editing
- ✅ **Persist** layout to localStorage
- ✅ Smooth **animations** throughout

### Why These Choices

| Feature | Library | Why |
|---------|---------|-----|
| Drag & Drop | `@dnd-kit` | Modern, accessible, lightweight, excellent React integration |
| Animations | `framer-motion` | Production-ready, spring physics, layout animations |
| Grid Layout | CSS Grid | Native, performant, flexible, responsive |
| State | React Context | Simple, no external deps, SSR-friendly |
| Persistence | localStorage | No backend needed, instant, user-specific |

---

## 2. Technology Stack

### Required Dependencies

```bash
# Core drag and drop
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Animations (you may already have this)
pnpm add framer-motion
# OR if using motion/react
pnpm add motion
```

### Project Structure

```
components/dashboard/
├── widget-dashboard.tsx      # Main container + DnD context
├── widget-context.tsx        # React context for state
├── widget-types.ts           # TypeScript types & constants
├── widget-registry.tsx       # Widget type → Component mapping
├── widget-frame.tsx          # Reusable widget wrapper
├── sortable-widget.tsx       # DnD wrapper + resize controls
├── index.ts                  # Barrel exports
└── widgets/                  # Individual widget components
    ├── notifications-widget.tsx
    ├── teammates-widget.tsx
    ├── todo-widget.tsx
    ├── recent-searches-widget.tsx
    ├── important-widget.tsx
    └── quick-actions-widget.tsx
```

---

## 3. Architecture

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       DashboardProvider                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    React Context                             ││
│  │  • widgets: WidgetConfig[]                                   ││
│  │  • widgetOrder: string[]                                     ││
│  │  • isEditMode: boolean                                       ││
│  │  • actions: add, remove, reorder, resize                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    WidgetDashboard                           ││
│  │  • DashboardControls (edit button, add menu)                 ││
│  │  • DashboardGrid (DnD context)                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    DndContext                                ││
│  │  ┌──────────────────────────────────────────────────────┐   ││
│  │  │              SortableContext                          │   ││
│  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │   ││
│  │  │  │ Sortable   │ │ Sortable   │ │ Sortable   │        │   ││
│  │  │  │ Widget 1   │ │ Widget 2   │ │ Widget 3   │  ...   │   ││
│  │  │  └────────────┘ └────────────┘ └────────────┘        │   ││
│  │  └──────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    localStorage                              ││
│  │  { version, widgets, widgetOrder }                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
WidgetDashboard
├── DashboardProvider (context wrapper)
│   ├── DashboardControls
│   │   ├── Title + Edit Mode Badge
│   │   ├── Add Widget Dropdown (edit mode only)
│   │   ├── Reset Button (edit mode only)
│   │   └── Edit/Done Toggle Button
│   │
│   └── DashboardGrid
│       └── DndContext
│           └── SortableContext
│               └── SortableWidget[] (one per visible widget)
│                   └── WidgetCard
│                       ├── Edit Controls (resize, drag, remove)
│                       ├── Size Badge
│                       └── WidgetFrame
│                           └── [Actual Widget Content]
```

---

## 4. Step-by-Step Implementation

### Step 1: Define Types (`widget-types.ts`)

```typescript
// 1. Widget type enum - all possible widget types
export const WIDGET_TYPES = {
  NOTIFICATIONS: "notifications",
  TODO: "todo",
  // Add more as needed
} as const;

export type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES];

// 2. Widget sizes
export const WIDGET_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  WIDE: "wide",
  TALL: "tall",
} as const;

export type WidgetSize = (typeof WIDGET_SIZES)[keyof typeof WIDGET_SIZES];

// 3. Size to CSS class mapping
export const SIZE_CLASSES: Record<WidgetSize, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1",
  large: "col-span-1 md:col-span-2 row-span-1 lg:row-span-2",
  wide: "col-span-1 md:col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
};

// 4. Widget configuration (what gets saved)
export interface WidgetConfig {
  id: string;           // Unique ID (e.g., "todo-1698234567890")
  type: WidgetType;     // Widget type from enum
  title: string;        // Display title
  visible: boolean;     // Is it shown?
  size: WidgetSize;     // Current size
}

// 5. Widget definition (metadata for the registry)
export interface WidgetDefinition {
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];  // Which sizes this widget supports
}

// 6. Registry of all widget definitions
export const WIDGET_DEFINITIONS: Record<WidgetType, WidgetDefinition> = {
  [WIDGET_TYPES.NOTIFICATIONS]: {
    type: WIDGET_TYPES.NOTIFICATIONS,
    title: "Notifications",
    description: "Recent alerts",
    icon: "Bell",
    defaultSize: WIDGET_SIZES.MEDIUM,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
  // ... more widgets
};

// 7. Default widgets (initial state)
export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { 
    id: "notifications-1", 
    type: WIDGET_TYPES.NOTIFICATIONS, 
    title: "Notifications", 
    visible: true, 
    size: WIDGET_SIZES.MEDIUM 
  },
  // ... more defaults
];

// 8. Storage key (increment version when schema changes)
export const DASHBOARD_STORAGE_KEY = "my-app-dashboard-v1";
```

**Why this structure?**
- Enums as const objects → type-safe, no runtime cost
- Separate `WidgetConfig` (runtime state) from `WidgetDefinition` (static metadata)
- `allowedSizes` lets each widget type control its valid sizes
- Version in storage key enables future migrations

---

### Step 2: Create Context (`widget-context.tsx`)

```typescript
"use client";

import * as React from "react";
import { WidgetConfig, WidgetType, WidgetSize, DEFAULT_WIDGETS, ... } from "./widget-types";

// 1. Define context shape
interface DashboardContextType {
  widgets: WidgetConfig[];
  isEditMode: boolean;
  
  // Actions
  toggleEditMode: () => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (newOrder: string[]) => void;
  resizeWidget: (id: string, size: WidgetSize) => void;
  resetToDefault: () => void;
  
  // Helpers
  getVisibleWidgets: () => WidgetConfig[];
  canAddWidget: (type: WidgetType) => boolean;
}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

// 2. Custom hook (with error if used outside provider)
export function useDashboard() {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}

// 3. Provider component
export function DashboardProvider({ children }) {
  const [widgets, setWidgets] = React.useState<WidgetConfig[]>([]);
  const [widgetOrder, setWidgetOrder] = React.useState<string[]>([]);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setWidgets(parsed.widgets);
      setWidgetOrder(parsed.widgetOrder);
    } else {
      setWidgets(DEFAULT_WIDGETS);
      setWidgetOrder(DEFAULT_WIDGETS.map(w => w.id));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage (debounced)
  React.useEffect(() => {
    if (!isLoaded) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify({
        version: 1,
        widgets,
        widgetOrder,
      }));
    }, 300);
    return () => clearTimeout(timeout);
  }, [widgets, widgetOrder, isLoaded]);

  // Actions (all wrapped in useCallback for stability)
  const addWidget = React.useCallback((type: WidgetType) => {
    const def = WIDGET_DEFINITIONS[type];
    const id = `${type}-${Date.now()}`;
    setWidgets(prev => [...prev, { id, type, title: def.title, visible: true, size: def.defaultSize }]);
    setWidgetOrder(prev => [...prev, id]);
  }, []);

  const removeWidget = React.useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    setWidgetOrder(prev => prev.filter(i => i !== id));
  }, []);

  const reorderWidgets = React.useCallback((newOrder: string[]) => {
    setWidgetOrder(newOrder);
  }, []);

  const resizeWidget = React.useCallback((id: string, size: WidgetSize) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
  }, []);

  // Helper to get widgets in order, filtered by visibility
  const getVisibleWidgets = React.useCallback(() => {
    const visible = new Set(widgets.filter(w => w.visible).map(w => w.id));
    return widgetOrder
      .filter(id => visible.has(id))
      .map(id => widgets.find(w => w.id === id)!)
      .filter(Boolean);
  }, [widgets, widgetOrder]);

  // Don't render until loaded (prevents hydration mismatch)
  if (!isLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <DashboardContext.Provider value={{ widgets, isEditMode, ... }}>
      {children}
    </DashboardContext.Provider>
  );
}
```

**Why this pattern?**
- Context avoids prop drilling
- Separate `widgets` (config) from `widgetOrder` (ordering) for flexibility
- Debounced saves prevent excessive localStorage writes
- Loading state prevents SSR hydration issues

---

### Step 3: Create Widget Registry (`widget-registry.tsx`)

```typescript
import { WIDGET_TYPES, WidgetType, WidgetConfig } from "./widget-types";
import { NotificationsWidget } from "./widgets/notifications-widget";
import { TodoWidget } from "./widgets/todo-widget";
// ... import all widgets

// Type for widget components
type WidgetComponent = React.ComponentType<{ title: string }>;

// Map type → component
const WIDGET_REGISTRY: Record<WidgetType, WidgetComponent> = {
  [WIDGET_TYPES.NOTIFICATIONS]: NotificationsWidget,
  [WIDGET_TYPES.TODO]: TodoWidget,
  // ... all widgets
};

// Render function used by the grid
export function renderWidget(widget: WidgetConfig): React.ReactNode {
  const Component = WIDGET_REGISTRY[widget.type];
  if (!Component) {
    console.warn(`Unknown widget: ${widget.type}`);
    return <WidgetSkeleton />;
  }
  return <Component title={widget.title} />;
}
```

**Why a registry?**
- Single source of truth for widget type → component mapping
- Easy to add new widgets (just add to enum + registry)
- Graceful fallback for unknown types

---

### Step 4: Create Widget Frame (`widget-frame.tsx`)

```typescript
// Reusable wrapper for consistent widget styling
export function WidgetFrame({
  title,
  icon,
  children,
  headerActions,
  noPadding = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <h3 className="flex-1 text-sm font-semibold truncate">{title}</h3>
        {headerActions}
      </div>
      
      {/* Content */}
      <div className={cn("flex-1 overflow-auto", !noPadding && "p-4")}>
        {children}
      </div>
    </div>
  );
}
```

**Why a frame component?**
- Consistent header styling across all widgets
- Widgets only need to provide content
- Easy to add global features (loading states, errors, etc.)

---

### Step 5: Create Sortable Widget (`sortable-widget.tsx`)

```typescript
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";

export function SortableWidget({ widget, isEditMode }) {
  // 1. Hook into dnd-kit sortable
  const {
    attributes,      // ARIA attributes for accessibility
    listeners,       // Mouse/touch event handlers
    setNodeRef,      // Ref to attach to the element
    transform,       // Current transform (during drag)
    transition,      // Transition string
    isDragging,      // Is this item being dragged?
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditMode,  // Only draggable in edit mode
  });

  // 2. Convert transform to CSS
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // 3. Apply size classes from widget config
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout  // Enable Framer Motion layout animations
      className={cn(
        SIZE_CLASSES[widget.size],  // e.g., "col-span-2 row-span-1"
        isDragging && "z-50 opacity-50"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <WidgetCard
        widget={widget}
        isEditMode={isEditMode}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
}
```

**Key concepts:**
- `useSortable` from @dnd-kit/sortable provides all DnD logic
- `CSS.Transform.toString()` converts transform object to CSS string
- `layout` prop on motion.div enables smooth reordering animations
- Drag handle props are passed down to a specific handle element

---

### Step 6: Create Widget Card with Controls

```typescript
export function WidgetCard({ widget, isEditMode, dragHandleProps }) {
  const { removeWidget, resizeWidget } = useDashboard();
  
  return (
    <div className={cn(
      "h-full rounded-lg border bg-card",
      SIZE_HEIGHTS[widget.size],  // Min height based on size
      isEditMode && "ring-2 ring-accent/20"
    )}>
      {/* Edit mode controls */}
      {isEditMode && (
        <div className="absolute top-2 right-2 flex gap-1">
          {/* Resize dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="size-8 rounded bg-background/90">
                <Maximize2 />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ALLOWED_SIZES.map(size => (
                <DropdownMenuItem 
                  key={size}
                  onClick={() => resizeWidget(widget.id, size)}
                >
                  {SIZE_LABELS[size]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Drag handle */}
          <button {...dragHandleProps} className="cursor-grab">
            <GripVertical />
          </button>
          
          {/* Remove button */}
          <button onClick={() => removeWidget(widget.id)}>
            <X />
          </button>
        </div>
      )}
      
      {/* Actual widget content */}
      {renderWidget(widget)}
    </div>
  );
}
```

---

### Step 7: Create Main Dashboard (`widget-dashboard.tsx`)

```typescript
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";

function DashboardGrid() {
  const { getVisibleWidgets, reorderWidgets, isEditMode } = useDashboard();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const visibleWidgets = getVisibleWidgets();
  const activeWidget = visibleWidgets.find(w => w.id === activeId);

  // Configure sensors (how drag is activated)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },  // 8px movement to start drag
    })
  );

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = visibleWidgets.findIndex(w => w.id === active.id);
      const newIndex = visibleWidgets.findIndex(w => w.id === over.id);
      const newOrder = arrayMove(visibleWidgets, oldIndex, newIndex);
      reorderWidgets(newOrder.map(w => w.id));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleWidgets.map(w => w.id)}
        strategy={rectSortingStrategy}  // For grid layouts
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleWidgets.map(widget => (
            <SortableWidget key={widget.id} widget={widget} isEditMode={isEditMode} />
          ))}
        </div>
      </SortableContext>
      
      {/* Drag overlay - shows the dragged item */}
      <DragOverlay>
        {activeWidget && (
          <WidgetCard widget={activeWidget} isEditMode isDragging />
        )}
      </DragOverlay>
    </DndContext>
  );
}

// Main export
export function WidgetDashboard() {
  return (
    <DashboardProvider>
      <DashboardControls />
      <DashboardGrid />
    </DashboardProvider>
  );
}
```

---

## 5. Component Deep Dive

### WidgetFrame
- **Purpose**: Consistent styling wrapper for all widgets
- **Props**: `title`, `icon`, `children`, `headerActions`, `noPadding`
- **Used by**: All widget components

### SortableWidget
- **Purpose**: Wraps WidgetCard with dnd-kit sortable behavior
- **Key hook**: `useSortable()` from @dnd-kit/sortable
- **Responsibilities**: Transform styles, layout animation, size classes

### WidgetCard
- **Purpose**: Visual card with edit controls
- **Features**: Resize dropdown, drag handle, remove button, size badge
- **State aware**: Shows different UI in edit mode vs view mode

### DashboardGrid
- **Purpose**: Manages the DnD context and grid layout
- **Key components**: DndContext, SortableContext, DragOverlay
- **Collision detection**: `closestCenter` works well for grids

---

## 6. State Management

### State Shape

```typescript
{
  widgets: [
    { id: "todo-1", type: "todo", title: "Todo", visible: true, size: "medium" },
    { id: "notif-1", type: "notifications", title: "Alerts", visible: true, size: "small" },
  ],
  widgetOrder: ["notif-1", "todo-1"],  // Display order
  isEditMode: false,
}
```

### Why Separate `widgetOrder`?
- Reordering only changes the order array (fast)
- Widget config stays stable (no object recreation)
- Easy to implement: just `arrayMove()` on the order

### State Actions

| Action | What it does |
|--------|-------------|
| `addWidget(type)` | Creates new widget with unique ID, adds to end |
| `removeWidget(id)` | Filters out from both widgets and order |
| `reorderWidgets(order)` | Replaces order array |
| `resizeWidget(id, size)` | Updates size property on widget |
| `toggleEditMode()` | Flips isEditMode boolean |
| `resetToDefault()` | Restores DEFAULT_WIDGETS |

---

## 7. Drag & Drop System

### @dnd-kit Overview

```
DndContext              # Root provider, handles all DnD logic
├── sensors             # How drag is detected (pointer, keyboard)
├── collisionDetection  # How drop targets are determined
├── onDragStart/End     # Event handlers
│
└── SortableContext     # For sortable lists/grids
    └── useSortable()   # Hook for each sortable item
        ├── attributes  # ARIA for accessibility
        ├── listeners   # Event handlers (attach to drag handle)
        ├── setNodeRef  # Ref for the element
        ├── transform   # Current position during drag
        └── isDragging  # Boolean state
```

### Key Concepts

1. **Sensors**: Define how drag starts
   ```typescript
   useSensor(PointerSensor, {
     activationConstraint: { distance: 8 }  // Prevents accidental drags
   })
   ```

2. **Collision Detection**: How to determine drop target
   - `closestCenter` - Best for grids
   - `closestCorners` - Good for nested containers
   - `rectIntersection` - Precise rectangle overlap

3. **Sorting Strategy**: How items rearrange
   - `rectSortingStrategy` - For 2D grids
   - `verticalListSortingStrategy` - For vertical lists
   - `horizontalListSortingStrategy` - For horizontal lists

4. **DragOverlay**: Shows the dragged item
   - Renders outside normal flow
   - Can have different styling (shadow, rotation)

---

## 8. Resizing System

### Size Configuration

```typescript
// Sizes available
export const WIDGET_SIZES = {
  SMALL: "small",     // 1x1
  MEDIUM: "medium",   // 1x1 (taller)
  LARGE: "large",     // 2x2
  WIDE: "wide",       // 2x1
  TALL: "tall",       // 1x2
} as const;

// CSS Grid classes per size
export const SIZE_CLASSES: Record<WidgetSize, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1",
  large: "col-span-1 md:col-span-2 lg:row-span-2",
  wide: "col-span-1 md:col-span-2",
  tall: "col-span-1 row-span-2",
};

// Min heights per size
export const SIZE_HEIGHTS: Record<WidgetSize, string> = {
  small: "min-h-[280px]",
  medium: "min-h-[320px]",
  large: "min-h-[600px]",
  wide: "min-h-[280px]",
  tall: "min-h-[560px]",
};
```

### Per-Widget Allowed Sizes

```typescript
// In WIDGET_DEFINITIONS
{
  type: "quick-actions",
  allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.WIDE],
  // This widget can only be small or wide
}
```

### Resize UI Flow

1. User clicks resize icon (edit mode only)
2. Dropdown shows allowed sizes for this widget type
3. User selects new size
4. `resizeWidget(id, size)` is called
5. Widget config updates
6. CSS class changes via `SIZE_CLASSES[widget.size]`
7. Framer Motion's `layout` prop animates the change

---

## 9. Persistence Layer

### Storage Schema

```typescript
interface StoredDashboard {
  version: number;           // For migrations
  widgets: WidgetConfig[];   // Widget configurations
  widgetOrder: string[];     // Display order
}
```

### Loading Flow

```typescript
React.useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    
    // Version check for migrations
    if (data.version !== CURRENT_VERSION) {
      // Run migration or reset to default
      return setToDefault();
    }
    
    setWidgets(data.widgets);
    setWidgetOrder(data.widgetOrder);
  } else {
    setToDefault();
  }
  setIsLoaded(true);
}, []);
```

### Saving Flow (Debounced)

```typescript
React.useEffect(() => {
  if (!isLoaded) return;  // Don't save during initial load
  
  const timeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: CURRENT_VERSION,
      widgets,
      widgetOrder,
    }));
  }, 300);  // 300ms debounce
  
  return () => clearTimeout(timeout);
}, [widgets, widgetOrder, isLoaded]);
```

### Migration Strategy

When you need to change the schema:

1. Increment version: `STORAGE_KEY = "my-app-dashboard-v2"`
2. Add migration logic:
   ```typescript
   if (data.version === 1) {
     // Migrate v1 → v2
     data.widgets = data.widgets.map(w => ({
       ...w,
       size: w.size || "medium",  // Add new field with default
     }));
     data.version = 2;
   }
   ```

---

## 10. Styling & Animations

### Framer Motion Key Props

```typescript
<motion.div
  layout                    // Enable layout animations
  initial={{ opacity: 0 }}  // Starting state
  animate={{ opacity: 1 }}  // Animated state
  exit={{ opacity: 0 }}     // Exit state (needs AnimatePresence parent)
  transition={{ 
    type: "spring",         // Spring physics
    stiffness: 500,         // Higher = snappier
    damping: 30             // Higher = less bouncy
  }}
/>
```

### AnimatePresence for Exit Animations

```typescript
<AnimatePresence mode="popLayout">
  {widgets.map(w => (
    <motion.div key={w.id} exit={{ opacity: 0, scale: 0.9 }}>
      ...
    </motion.div>
  ))}
</AnimatePresence>
```

### CSS Grid for Layout

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

With Tailwind:
```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 11. Adding New Widgets

### Quick Checklist

1. **Add to enum** (`widget-types.ts`):
   ```typescript
   export const WIDGET_TYPES = {
     // ... existing
     MY_WIDGET: "my-widget",
   } as const;
   ```

2. **Add definition** (`widget-types.ts`):
   ```typescript
   export const WIDGET_DEFINITIONS = {
     // ... existing
     [WIDGET_TYPES.MY_WIDGET]: {
       type: WIDGET_TYPES.MY_WIDGET,
       title: "My Widget",
       description: "Does something cool",
       icon: "Star",
       defaultSize: WIDGET_SIZES.MEDIUM,
       allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
     },
   };
   ```

3. **Create component** (`widgets/my-widget.tsx`):
   ```typescript
   import { WidgetFrame } from "../widget-frame";
   import { Star } from "lucide-react";

   export function MyWidget({ title }: { title: string }) {
     return (
       <WidgetFrame title={title} icon={<Star className="size-4" />}>
         {/* Your content here */}
       </WidgetFrame>
     );
   }
   ```

4. **Register** (`widget-registry.tsx`):
   ```typescript
   import { MyWidget } from "./widgets/my-widget";

   const WIDGET_REGISTRY = {
     // ... existing
     [WIDGET_TYPES.MY_WIDGET]: MyWidget,
   };
   ```

5. **Add icon** (`widget-dashboard.tsx`):
   ```typescript
   const WIDGET_ICONS = {
     // ... existing
     [WIDGET_TYPES.MY_WIDGET]: Star,
   };
   ```

6. **(Optional) Add to defaults** (`widget-types.ts`):
   ```typescript
   export const DEFAULT_WIDGETS = [
     // ... existing
     { id: "my-widget-1", type: WIDGET_TYPES.MY_WIDGET, ... },
   ];
   ```

---

## 12. Best Practices

### Performance

- ✅ Use `React.memo()` for widget components if they're expensive
- ✅ Keep `useSortable()` items lightweight
- ✅ Debounce localStorage saves
- ✅ Use `layout` prop sparingly (only on elements that move)

### Accessibility

- ✅ dnd-kit provides ARIA attributes automatically
- ✅ Support keyboard navigation via KeyboardSensor
- ✅ Ensure edit controls are focusable
- ✅ Use semantic HTML in widgets

### Code Organization

- ✅ Keep widget types in a single file
- ✅ Use barrel exports (`index.ts`)
- ✅ Separate concerns (types, context, components)
- ✅ Widget components only receive `title` prop (keep simple)

### State Management

- ✅ Single source of truth in context
- ✅ Immutable updates
- ✅ Version storage schema for migrations
- ✅ Handle loading state explicitly

---

## 13. Troubleshooting

### Common Issues

**"useDashboard must be used within DashboardProvider"**
- Ensure `DashboardProvider` wraps your dashboard component

**Widgets not saving**
- Check browser console for localStorage errors
- Verify `isLoaded` is true before saving
- Check storage key hasn't changed

**Drag not working**
- Ensure `isEditMode` is true
- Check `useSortable({ disabled: !isEditMode })`
- Verify `listeners` are attached to drag handle

**Layout jumps on load**
- Return loading skeleton until `isLoaded` is true
- Use consistent initial state

**Animations janky**
- Reduce stiffness/damping for smoother motion
- Avoid animating expensive properties
- Use `will-change: transform` for GPU acceleration

### Debug Tips

```typescript
// Log all drag events
<DndContext
  onDragStart={(e) => console.log('start', e)}
  onDragMove={(e) => console.log('move', e)}
  onDragEnd={(e) => console.log('end', e)}
>
```

```typescript
// Check stored data
console.log(JSON.parse(localStorage.getItem(STORAGE_KEY)));
```

---

## Summary

This widget dashboard system provides:

1. **Modular architecture** - Easy to add new widgets
2. **Drag & drop** - Smooth reordering with dnd-kit
3. **Resizing** - Multiple size options per widget
4. **Edit mode** - Safe editing experience
5. **Persistence** - Layout saved to localStorage
6. **Animations** - Polished feel with Framer Motion
7. **Type safety** - Full TypeScript coverage
8. **Accessibility** - Keyboard navigation support

The pattern can be adapted to any React/Next.js application by following the step-by-step implementation guide above.

