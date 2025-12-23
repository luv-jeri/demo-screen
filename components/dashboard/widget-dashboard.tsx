"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  RotateCcw,
  Trash2,
  GripVertical,
  X,
  Pencil,
  Check,
  Bell,
  Users,
  CheckSquare,
  Clock,
  Star,
  Zap,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useDashboard } from "./widget-context";
import {
  WIDGET_TYPES,
  WIDGET_SIZES,
  WIDGET_DEFINITIONS,
  SIZE_GRID_CLASSES,
  SIZE_HEIGHTS,
  SIZE_LABELS,
  type WidgetConfig,
  type WidgetSize,
  type WidgetType,
} from "./widget-types";
import { renderWidget } from "./widget-registry";

// ============================================================================
// Icon Registry
// ============================================================================

const WIDGET_ICONS: Record<string, LucideIcon> = {
  Bell,
  Users,
  CheckSquare,
  Clock,
  Star,
  Zap,
  BarChart3,
};

// ============================================================================
// Size Icons for Resize Menu
// ============================================================================

const SIZE_ICONS: Record<WidgetSize, React.ReactNode> = {
  [WIDGET_SIZES.SMALL]: <div className="size-3 border border-current" />,
  [WIDGET_SIZES.MEDIUM]: <div className="size-3.5 border border-current" />,
  [WIDGET_SIZES.LARGE]: <div className="size-4 border border-current" />,
};

// ============================================================================
// Dashboard Controls
// ============================================================================

function DashboardControls() {
  const {
    isEditMode,
    toggleEditMode,
    addWidget,
    resetToDefault,
    removeAllWidgets,
    canAddWidget,
    widgets,
  } = useDashboard();

  const availableWidgets = Object.values(WIDGET_TYPES).filter(canAddWidget);
  const hasWidgets = widgets.length > 0;

  return (
    <div className="flex items-center justify-end gap-2 mb-4">
      {/* Edit Mode Toggle */}
      {hasWidgets && (
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={toggleEditMode}
          className="h-8 px-3 text-xs gap-1.5"
        >
          {isEditMode ? (
            <>
              <Check className="size-3.5" />
              Done
            </>
          ) : (
            <>
              <Pencil className="size-3.5" />
              Edit
            </>
          )}
        </Button>
      )}

      {/* Edit Mode Actions */}
      <AnimatePresence>
        {isEditMode && hasWidgets && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={removeAllWidgets}
              className="h-8 px-3 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="h-8 px-3 text-xs"
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Reset
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Widget Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs gap-1.5">
            <Plus className="size-3.5" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Add Widget
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableWidgets.length > 0 ? (
            availableWidgets.map((type) => {
              const def = WIDGET_DEFINITIONS[type];
              const Icon = WIDGET_ICONS[def.icon];
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => addWidget(type)}
                  className="gap-3 cursor-pointer"
                >
                  {Icon && <Icon className="size-4 text-muted-foreground" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{def.title}</p>
                    <p className="text-xs text-muted-foreground">{def.description}</p>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              All widgets added
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ============================================================================
// Sortable Widget Item
// ============================================================================

interface SortableWidgetProps {
  widget: WidgetConfig;
  isEditMode: boolean;
  index: number;
}

function SortableWidget({ widget, isEditMode, index }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const { removeWidget, resizeWidget, getWidgetDefinition } = useDashboard();
  const definition = getWidgetDefinition(widget.type);
  const allowedSizes = definition?.allowedSizes || Object.values(WIDGET_SIZES);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Staggered entrance animation
  const entranceDelay = index * 0.05;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        delay: entranceDelay,
      }}
      className={cn(
        "relative",
        SIZE_GRID_CLASSES[widget.size],
        isDragging && "z-50"
      )}
    >
      {/* Widget Card */}
      <div
        className={cn(
          "relative overflow-hidden",
          // Subtle, glanceable design
          "bg-card/60 border border-border/50",
          SIZE_HEIGHTS[widget.size],
          // Hover state (only when not editing)
          !isEditMode && "hover:bg-card/80 hover:border-border/70 transition-all duration-200",
          // Edit mode styling
          isEditMode && "ring-1 ring-accent/30",
          isDragging && "shadow-lg ring-2 ring-accent"
        )}
      >
        {/* Edit Mode Controls */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-background/95 backdrop-blur-sm border border-border shadow-sm p-1"
            >
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="flex items-center justify-center size-6 text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-grab active:cursor-grabbing transition-colors"
              >
                <GripVertical className="size-3.5" />
              </button>

              {/* Size Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center size-6 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
                    {SIZE_ICONS[widget.size]}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  {allowedSizes.map((size) => (
                    <DropdownMenuItem
                      key={size}
                      onClick={() => resizeWidget(widget.id, size)}
                      className={cn(
                        "cursor-pointer gap-2 text-xs",
                        widget.size === size && "bg-accent text-accent-foreground"
                      )}
                    >
                      {SIZE_ICONS[size]}
                      {SIZE_LABELS[size]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Remove Button */}
              <button
                onClick={() => removeWidget(widget.id)}
                className="flex items-center justify-center size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Size Badge (Edit Mode) */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute top-2 left-2 z-20"
            >
              <span className="text-[9px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-1.5 py-0.5">
                {SIZE_LABELS[widget.size]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Mode Overlay */}
        {isEditMode && (
          <div
            className="absolute inset-0 z-10 bg-transparent pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}

        {/* Widget Content */}
        <div className={cn("h-full", isEditMode && "pointer-events-none")}>
          {renderWidget(widget, { isEditMode, size: widget.size })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Widget Grid
// ============================================================================

function WidgetGrid() {
  const { getVisibleWidgets, reorderWidgets, isEditMode } = useDashboard();
  const visibleWidgets = getVisibleWidgets();

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = visibleWidgets.findIndex((w) => w.id === active.id);
      const newIndex = visibleWidgets.findIndex((w) => w.id === over.id);

      const newOrder = [...visibleWidgets.map((w) => w.id)];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id as string);

      reorderWidgets(newOrder);
    }
  };

  if (visibleWidgets.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleWidgets.map((w) => w.id)}
        strategy={rectSortingStrategy}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min"
          style={{ gridAutoFlow: "dense" }}
        >
          <AnimatePresence mode="popLayout">
            {visibleWidgets.map((widget, index) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && (() => {
          const widget = visibleWidgets.find((w) => w.id === activeId);
          if (!widget) return null;
          
          return (
            <div
              className={cn(
                "bg-card border border-accent shadow-2xl opacity-90",
                SIZE_HEIGHTS[widget.size],
                "w-full max-w-[300px]"
              )}
            >
              <div className="h-full p-4 flex items-center justify-center text-muted-foreground">
                <GripVertical className="size-6" />
              </div>
            </div>
          );
        })()}
      </DragOverlay>
    </DndContext>
  );
}


// ============================================================================
// Main Dashboard Component
// ============================================================================

export function WidgetDashboard() {
  const { widgets } = useDashboard();
  const hasWidgets = widgets.length > 0;

  // Don't render anything if no widgets - keep focus on search
  if (!hasWidgets) {
    return null;
  }

  return (
    <div>
      <DashboardControls />
      <WidgetGrid />
    </div>
  );
}

// Legacy export for backwards compatibility
export { WidgetDashboard as WidgetDashboardInner };
