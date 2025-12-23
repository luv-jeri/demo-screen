# Widget Dashboard System

A modular, draggable, and resizable widget dashboard system for MediaVault.

## Architecture Overview

### Core Components

1. **`widget-dashboard.tsx`** - Main dashboard container with controls and grid layout
2. **`widget-context.tsx`** - React context for dashboard state management
3. **`widget-frame.tsx`** - Reusable wrapper component for all widgets
4. **`widget-registry.tsx`** - Maps widget types to their components via `renderWidget()`
5. **`widget-types.ts`** - Type definitions, size configurations, and widget definitions
6. **`sortable-widget.tsx`** - Sortable widget wrapper with drag-and-drop and resize support

### Data Flow

```
DashboardProvider (Context)
  ↓
WidgetDashboard (Controls + Grid)
  ↓
SortableWidget (DnD wrapper)
  ↓
renderWidget() (Type → Component)
  ↓
Individual Widget Components
```

## Widget Sizes

The system uses three iPhone-inspired sizes:

| Size | Key | Grid Span | Height | Use Case |
|------|-----|-----------|--------|----------|
| Small | `sm` | 1 column | 120px | Ultra-compact, glanceable |
| Medium | `md` | 1-2 columns | 180px | Balanced, scannable |
| Large | `lg` | 1-3 columns | 260px | Rich, explorable |

```typescript
import { WIDGET_SIZES } from "./widget-types";

WIDGET_SIZES.SMALL  // "sm"
WIDGET_SIZES.MEDIUM // "md"
WIDGET_SIZES.LARGE  // "lg"
```

## Available Widgets

| Type | Title | Icon | Default Size | Description |
|------|-------|------|--------------|-------------|
| `notifications` | Notifications | Bell | Small | Recent alerts and updates |
| `teammates` | Team | Users | Small | Who's online now |
| `todo` | Tasks | CheckSquare | Medium | Your active tasks |
| `recent-searches` | Recent | Clock | Small | Recent searches |
| `important` | Starred | Star | Small | Pinned items |
| `quick-actions` | Quick Actions | Zap | Medium | Common actions |
| `stats` | Stats | BarChart3 | Small | Library overview |

## Adding a New Widget

### Step 1: Define Widget Type

Add your widget type to `widget-types.ts`:

```typescript
export const WIDGET_TYPES = {
  // ... existing types
  MY_NEW_WIDGET: "my-new-widget",
} as const;
```

### Step 2: Create Widget Definition

Add widget metadata to `WIDGET_DEFINITIONS`:

```typescript
export const WIDGET_DEFINITIONS: Record<WidgetType, WidgetDefinition> = {
  // ... existing definitions
  [WIDGET_TYPES.MY_NEW_WIDGET]: {
    type: WIDGET_TYPES.MY_NEW_WIDGET,
    title: "My New Widget",
    description: "A custom widget for...",
    icon: "Zap", // Lucide icon name (string)
    defaultSize: WIDGET_SIZES.MEDIUM,
    allowedSizes: [WIDGET_SIZES.SMALL, WIDGET_SIZES.MEDIUM, WIDGET_SIZES.LARGE],
  },
};
```

### Step 3: Create Widget Component

Create `components/dashboard/widgets/my-new-widget.tsx`:

```typescript
"use client";

import * as React from "react";
import { WidgetFrame } from "../widget-frame";
import { YourIcon } from "lucide-react";
import type { WidgetProps } from "../widget-registry";

export function MyNewWidget({ title, size, isEditMode }: WidgetProps) {
  return (
    <WidgetFrame
      title={title}
      icon={<YourIcon className="size-4" />}
    >
      {/* Your widget content */}
      <div className="text-sm text-muted-foreground">
        Widget content here
      </div>
    </WidgetFrame>
  );
}
```

### Step 4: Register Widget

Add to `widget-registry.tsx`:

```typescript
import { MyNewWidget } from "./widgets/my-new-widget";

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
    // ... existing cases
    case WIDGET_TYPES.MY_NEW_WIDGET:
      return <MyNewWidget {...baseProps} />;
    // ...
  }
}
```

### Step 5: Add Icon to Dashboard Controls

Add icon mapping in `widget-dashboard.tsx`:

```typescript
import { YourIcon } from "lucide-react";

const WIDGET_ICONS: Record<string, LucideIcon> = {
  // ... existing icons
  YourIcon, // Match the string name from widget definition
};
```

### Step 6: Export Widget (Optional)

Add to `index.ts` for external access:

```typescript
export { MyNewWidget } from "./widgets/my-new-widget";
```

## Widget Props Interface

Widgets receive these props from `widget-registry.tsx`:

```typescript
interface WidgetProps {
  title: string;        // Widget display title
  size: WidgetSize;     // Current size ("sm" | "md" | "lg")
  isEditMode?: boolean; // Whether dashboard is in edit mode
}
```

## Widget Frame Component

The `WidgetFrame` component provides consistent styling:

```typescript
<WidgetFrame
  title={title}              // Required: widget title (displayed in header)
  icon={<Icon />}            // Optional: header icon
  className="..."            // Optional: additional classes
  headerActions={<... />}    // Optional: custom header actions (right side)
  noPadding={false}          // Optional: remove default content padding
>
  {children}
</WidgetFrame>
```

**Features:**
- Understated header with icon and title
- Subtle separator line
- Scrollable content area
- Responsive padding

## Persistence

Widget configuration is automatically saved to `localStorage` with key `mediavault-dashboard-v6`.

- **Debounced saves** (300ms delay) prevent excessive writes
- **Version field** (v6) enables future migrations
- **Widget order** preserved separately from widget configs

## Edit Mode

Users can:

- **Toggle edit mode** via "Edit" / "Done" button
- **Drag widgets** to reorder (only in edit mode)
- **Resize widgets** via dropdown or drag handle (only in edit mode)
- **Add widgets** from dropdown menu (always available)
- **Remove widgets** via X button (only in edit mode)
- **Clear all** - Remove all widgets (only in edit mode)
- **Reset** - Restore default widget preset (only in edit mode)

## Context API

```typescript
import { useDashboard } from "./widget-context";

function MyComponent() {
  const {
    // State
    widgets,        // WidgetConfig[]
    isEditMode,     // boolean

    // Actions
    setEditMode,            // (editing: boolean) => void
    toggleEditMode,         // () => void
    addWidget,              // (type: WidgetType) => void
    removeWidget,           // (widgetId: string) => void
    removeAllWidgets,       // () => void
    toggleWidgetVisibility, // (widgetId: string) => void
    reorderWidgets,         // (newOrder: string[]) => void
    resizeWidget,           // (widgetId: string, size: WidgetSize) => void
    resetToDefault,         // () => void

    // Helpers
    getVisibleWidgets,   // () => WidgetConfig[]
    canAddWidget,        // (type: WidgetType) => boolean
    getWidgetDefinition, // (type: WidgetType) => WidgetDefinition
  } = useDashboard();
}
```

## Grid Layout

Uses CSS Grid with Tailwind classes:

```typescript
// Grid container
"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"

// Size grid classes
SIZE_GRID_CLASSES = {
  sm: "col-span-1",
  md: "col-span-1 lg:col-span-2",
  lg: "col-span-1 md:col-span-2 lg:col-span-3",
}
```

## Best Practices

1. **Keep widgets lightweight** - Avoid heavy computations in render
2. **Use WidgetFrame** - Ensures consistent styling across widgets
3. **Handle loading states** - Use `WidgetSkeleton` while data loads
4. **Responsive content** - Adapt content based on `size` prop
5. **Respect edit mode** - Check `isEditMode` for interactive elements
6. **Type-safe** - Always use TypeScript types from `widget-types.ts`

## Example: Complete Widget

```typescript
"use client";

import * as React from "react";
import { WidgetFrame, WidgetSkeleton } from "../widget-frame";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WidgetProps } from "../widget-registry";
import { WIDGET_SIZES } from "../widget-types";

export function ExampleWidget({ title, size, isEditMode }: WidgetProps) {
  const [count, setCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <WidgetSkeleton />;
  }

  return (
    <WidgetFrame
      title={title}
      icon={<Zap className="size-4" />}
      headerActions={
        <span className="text-xs text-muted-foreground">{count}</span>
      }
    >
      <div className="space-y-4">
        {/* Adapt content based on size */}
        {size === WIDGET_SIZES.SMALL ? (
          <p className="text-2xl font-bold">{count}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              This is an example widget.
            </p>
            <Button 
              onClick={() => setCount(c => c + 1)}
              disabled={isEditMode}
            >
              Increment: {count}
            </Button>
          </>
        )}
      </div>
    </WidgetFrame>
  );
}
```

## Troubleshooting

### Widget not appearing?
- Check it's registered in `widget-registry.tsx` switch statement
- Verify widget type is in `WIDGET_TYPES`
- Ensure component is exported correctly
- Check icon name matches in `WIDGET_ICONS`

### Layout not saving?
- Check browser console for localStorage errors
- Verify `DashboardProvider` wraps the dashboard
- Check if widget is marked as `visible: true`
- Ensure version matches (currently v6)

### Drag/resize not working?
- Ensure edit mode is enabled
- Check `@dnd-kit` packages are installed
- Verify `SortableContext` wraps the grid

### Widget not resizing?
- Check `allowedSizes` in widget definition
- Verify size is valid (`sm`, `md`, or `lg`)
