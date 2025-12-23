# Widget Dashboard - Quick Reference Card

A condensed reference for quickly setting up the widget dashboard in a new project.

---

## 1. Install Dependencies

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities motion
```

---

## 2. File Structure (Copy This)

```
components/dashboard/
├── widget-types.ts          # Types, enums, constants
├── widget-context.tsx       # State management
├── widget-dashboard.tsx     # Main component
├── widget-registry.tsx      # Type → Component map
├── widget-frame.tsx         # Widget wrapper
├── sortable-widget.tsx      # DnD wrapper
├── index.ts                 # Exports
└── widgets/
    └── [your-widgets].tsx
```

---

## 3. Essential Types

```typescript
// widget-types.ts
export const WIDGET_TYPES = { TODO: "todo", NOTIF: "notifications" } as const;
export type WidgetType = (typeof WIDGET_TYPES)[keyof typeof WIDGET_TYPES];

export const WIDGET_SIZES = { SMALL: "small", MEDIUM: "medium", LARGE: "large", WIDE: "wide", TALL: "tall" } as const;
export type WidgetSize = (typeof WIDGET_SIZES)[keyof typeof WIDGET_SIZES];

export interface WidgetConfig {
  id: string; type: WidgetType; title: string; visible: boolean; size: WidgetSize;
}
```

---

## 4. Context Pattern

```typescript
// widget-context.tsx
const DashboardContext = React.createContext<ContextType | null>(null);

export function useDashboard() {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be within DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }) {
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  // ... actions
  return <DashboardContext.Provider value={{ widgets, ... }}>{children}</DashboardContext.Provider>;
}
```

---

## 5. DnD Setup

```typescript
// widget-dashboard.tsx
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";

const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
    {widgets.map(w => <SortableWidget key={w.id} widget={w} />)}
  </SortableContext>
</DndContext>
```

---

## 6. Sortable Item

```typescript
// sortable-widget.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });
const style = { transform: CSS.Transform.toString(transform), transition };

<motion.div ref={setNodeRef} style={style} layout>
  <button {...attributes} {...listeners}>Drag</button>
  {children}
</motion.div>
```

---

## 7. Grid Layout (Tailwind)

```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

Size classes:
```typescript
const SIZE_CLASSES = {
  small: "col-span-1",
  medium: "col-span-1", 
  large: "col-span-1 md:col-span-2 lg:row-span-2",
  wide: "col-span-1 md:col-span-2",
  tall: "col-span-1 row-span-2",
};
```

---

## 8. LocalStorage Persistence

```typescript
// Load
useEffect(() => {
  const data = JSON.parse(localStorage.getItem(KEY) || "null");
  setWidgets(data?.widgets || DEFAULTS);
  setLoaded(true);
}, []);

// Save (debounced)
useEffect(() => {
  if (!loaded) return;
  const t = setTimeout(() => localStorage.setItem(KEY, JSON.stringify({ widgets })), 300);
  return () => clearTimeout(t);
}, [widgets, loaded]);
```

---

## 9. Add New Widget Checklist

1. ☐ Add to `WIDGET_TYPES` enum
2. ☐ Add to `WIDGET_DEFINITIONS`
3. ☐ Create component in `widgets/`
4. ☐ Add to `WIDGET_REGISTRY`
5. ☐ Add icon mapping
6. ☐ (Optional) Add to `DEFAULT_WIDGETS`

---

## 10. Key Animation Props

```typescript
<motion.div
  layout                        // Animate position changes
  initial={{ opacity: 0 }}      // Enter from
  animate={{ opacity: 1 }}      // Animate to
  exit={{ opacity: 0 }}         // Exit to (needs AnimatePresence)
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

---

## Common Gotchas

| Issue | Fix |
|-------|-----|
| Hydration mismatch | Return skeleton until `isLoaded` |
| Drag not working | Check `isEditMode` + `listeners` attached |
| Order not saving | Verify `widgetOrder` in save payload |
| Jittery animations | Lower stiffness, higher damping |

---

## Minimal Working Example

```typescript
// App.tsx
import { DashboardProvider } from "./widget-context";
import { WidgetDashboard } from "./widget-dashboard";

export default function App() {
  return (
    <DashboardProvider>
      <WidgetDashboard />
    </DashboardProvider>
  );
}
```

That's it! The full guide has complete implementations.

