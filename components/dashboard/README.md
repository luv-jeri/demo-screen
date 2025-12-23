# Widget Dashboard System

A modular, draggable, and resizable widget dashboard system for MediaVault.

## Architecture Overview

### Core Components

1. **`widget-dashboard.tsx`** - Main dashboard container with grid layout
2. **`widget-context.tsx`** - React context for dashboard state management
3. **`widget-frame.tsx`** - Reusable wrapper component for all widgets
4. **`widget-registry.tsx`** - Maps widget types to their components
5. **`widget-types.ts`** - Type definitions and default configurations

### Data Flow

```
DashboardProvider (Context)
  ↓
WidgetDashboard (Grid Container)
  ↓
WidgetRegistry (Type → Component mapping)
  ↓
Individual Widget Components
```

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
    icon: "Zap", // Lucide icon name
    defaultLayout: { w: 4, h: 4, minW: 3, minH: 3, maxW: 6, maxH: 6 },
  },
};
```

### Step 3: Create Widget Component

Create `components/dashboard/widgets/my-new-widget.tsx`:

```typescript
"use client";

import * as React from "react";
import { WidgetFrame } from "../widget-frame";

interface MyNewWidgetProps {
  id: string;
  title: string;
}

export function MyNewWidget({ id, title }: MyNewWidgetProps) {
  return (
    <WidgetFrame
      id={id}
      title={title}
      icon={<YourIcon className="size-4" />}
    >
      {/* Your widget content */}
    </WidgetFrame>
  );
}
```

### Step 4: Register Widget

Add to `widget-registry.tsx`:

```typescript
import { MyNewWidget } from "./widgets/my-new-widget";

const WIDGET_REGISTRY: Record<WidgetType, WidgetComponent> = {
  // ... existing widgets
  [WIDGET_TYPES.MY_NEW_WIDGET]: MyNewWidget,
};
```

### Step 5: Add Icon to Menu

Add icon mapping in `widget-dashboard.tsx`:

```typescript
const WIDGET_ICONS: Record<WidgetType, LucideIcon> = {
  // ... existing icons
  [WIDGET_TYPES.MY_NEW_WIDGET]: YourIcon,
};
```

### Step 6: (Optional) Add to Default Layout

If you want the widget to appear by default, add it to `DEFAULT_DASHBOARD_STATE` in `widget-types.ts`.

## Widget Frame Props

The `WidgetFrame` component provides:

- **Header** with title, icon, and actions
- **Drag handle** (shown in edit mode)
- **Remove button** (shown in edit mode)
- **Consistent styling** and borders
- **Responsive padding**

```typescript
<WidgetFrame
  id={id}                    // Required: unique widget ID
  title={title}              // Required: widget title
  icon={<Icon />}            // Optional: header icon
  className="..."            // Optional: additional classes
  headerActions={<... />}    // Optional: custom header actions
  noPadding={false}          // Optional: remove default padding
/>
```

## Persistence

Widget layouts and visibility are automatically saved to `localStorage` with key `mediavault-dashboard-v1`.

- **Debounced saves** (500ms delay) prevent excessive writes
- **Version field** enables future migrations
- **Responsive layouts** stored separately for `lg`, `md`, `sm` breakpoints

## Edit Mode

Users can:

- **Toggle edit mode** via "Edit Widgets" button
- **Drag widgets** to reorder (only in edit mode)
- **Resize widgets** using bottom-right handle (only in edit mode)
- **Add widgets** from dropdown menu (only in edit mode)
- **Remove widgets** via X button in header (only in edit mode)
- **Reset layout** to default (only in edit mode)

## Grid Breakpoints

- **lg**: ≥1200px (12 columns)
- **md**: 768px-1199px (8 columns)
- **sm**: <768px (4 columns)

Row height: 80px (each widget height unit = 80px)

## Best Practices

1. **Keep widgets lightweight** - Avoid heavy computations in render
2. **Use WidgetFrame** - Ensures consistent styling and edit mode support
3. **Handle loading states** - Show skeletons while data loads
4. **Responsive content** - Test widgets at all breakpoints
5. **Accessible** - Use semantic HTML and ARIA labels
6. **Type-safe** - Always use TypeScript types from `widget-types.ts`

## Example: Complete Widget

```typescript
"use client";

import * as React from "react";
import { WidgetFrame } from "../widget-frame";
import { Button } from "@/components/ui/button";

interface ExampleWidgetProps {
  id: string;
  title: string;
}

export function ExampleWidget({ id, title }: ExampleWidgetProps) {
  const [count, setCount] = React.useState(0);

  return (
    <WidgetFrame
      id={id}
      title={title}
      icon={<Zap className="size-4" />}
      headerActions={
        <span className="text-xs text-muted-foreground">{count}</span>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This is an example widget.
        </p>
        <Button onClick={() => setCount(c => c + 1)}>
          Increment: {count}
        </Button>
      </div>
    </WidgetFrame>
  );
}
```

## Troubleshooting

### Widget not appearing?
- Check it's registered in `widget-registry.tsx`
- Verify widget type is in `WIDGET_TYPES`
- Ensure component is exported correctly

### Layout not saving?
- Check browser console for localStorage errors
- Verify `DashboardProvider` wraps the dashboard
- Check if widget is marked as `visible: true`

### Drag/resize not working?
- Ensure edit mode is enabled
- Check `react-grid-layout` CSS is imported
- Verify widget has valid layout in `layouts` object

