"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "motion/react";
import { 
  GripVertical, 
  X, 
  Maximize2, 
  Minimize2,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  GripHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "./widget-context";
import { renderWidget } from "./widget-registry";
import { 
  SIZE_GRID_CLASSES,
  SIZE_HEIGHTS,
  WIDGET_SIZES, 
  WIDGET_DEFINITIONS,
  type WidgetConfig, 
  type WidgetSize 
} from "./widget-types";

// ============================================================================
// Size Icons
// ============================================================================

const SIZE_ICONS: Record<WidgetSize, React.ReactNode> = {
  [WIDGET_SIZES.SMALL]: <Minimize2 className="size-4" />,
  [WIDGET_SIZES.MEDIUM]: <Square className="size-4" />,
  [WIDGET_SIZES.LARGE]: <Maximize2 className="size-4" />,
};

const SIZE_LABELS: Record<WidgetSize, string> = {
  [WIDGET_SIZES.SMALL]: "Small",
  [WIDGET_SIZES.MEDIUM]: "Medium",
  [WIDGET_SIZES.LARGE]: "Large",
};

// Ordered sizes for resize handle cycling
const SIZE_ORDER: WidgetSize[] = [
  WIDGET_SIZES.SMALL,
  WIDGET_SIZES.MEDIUM,
  WIDGET_SIZES.LARGE,
];

// ============================================================================
// Sortable Widget Wrapper
// ============================================================================

interface SortableWidgetProps {
  widget: WidgetConfig;
  isEditMode: boolean;
  index?: number;
}

export function SortableWidget({ widget, isEditMode, index = 0 }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const definition = WIDGET_DEFINITIONS[widget.type];

  // Staggered entrance delay (max 400ms total for 6 widgets)
  const entranceDelay = Math.min(index * 0.06, 0.4);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        zIndex: isDragging ? 50 : 1,
      }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
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
      <WidgetCard
        widget={widget}
        isEditMode={isEditMode}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </motion.div>
  );
}

// ============================================================================
// Resize Handle Component (like textarea)
// ============================================================================

interface ResizeHandleProps {
  onResize: (direction: "increase" | "decrease") => void;
  className?: string;
}

function ResizeHandle({ onResize, className }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPosRef = React.useRef({ x: 0, y: 0 });
  const thresholdRef = React.useRef(0);
  const DRAG_THRESHOLD = 50; // pixels needed to trigger a size change

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    thresholdRef.current = 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startPosRef.current.x;
      const deltaY = moveEvent.clientY - startPosRef.current.y;
      const delta = deltaX + deltaY; // Combined movement

      // Check if we've crossed the threshold
      if (Math.abs(delta - thresholdRef.current) >= DRAG_THRESHOLD) {
        if (delta > thresholdRef.current) {
          onResize("increase");
          thresholdRef.current = delta;
        } else {
          onResize("decrease");
          thresholdRef.current = delta;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <motion.div
      className={cn(
        "absolute bottom-0 right-0 z-30",
        "w-6 h-6 cursor-se-resize",
        "flex items-center justify-center",
        "bg-accent/80 text-accent-foreground",
        "hover:bg-accent transition-colors",
        isDragging && "bg-accent scale-110",
        className
      )}
      onMouseDown={handleMouseDown}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Resize grip icon (like textarea) */}
      <svg 
        width="10" 
        height="10" 
        viewBox="0 0 10 10" 
        className="text-current"
      >
        <path
          d="M 1 9 L 9 1 M 5 9 L 9 5 M 9 9 L 9 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

// ============================================================================
// Widget Card Component
// ============================================================================

interface WidgetCardProps {
  widget: WidgetConfig;
  isEditMode: boolean;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
}

export function WidgetCard({
  widget,
  isEditMode,
  isDragging,
  dragHandleProps,
}: WidgetCardProps) {
  const { removeWidget, resizeWidget, getWidgetDefinition } = useDashboard();
  const definition = getWidgetDefinition(widget.type);
  const allowedSizes = definition?.allowedSizes || Object.values(WIDGET_SIZES);

  // Handle resize by cycling through sizes
  const handleResize = React.useCallback((direction: "increase" | "decrease") => {
    const currentIndex = SIZE_ORDER.indexOf(widget.size);
    let newIndex: number;
    
    if (direction === "increase") {
      newIndex = Math.min(currentIndex + 1, SIZE_ORDER.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    const newSize = SIZE_ORDER[newIndex];
    
    // Only resize if the new size is allowed
    if (newSize && allowedSizes.includes(newSize) && newSize !== widget.size) {
      resizeWidget(widget.id, newSize);
    }
  }, [widget.size, widget.id, allowedSizes, resizeWidget]);

  return (
    <motion.div
      className={cn(
        "relative",
        "h-full overflow-hidden",
        // Subtle background, softer border, minimal shadow
        "bg-background/50 border border-border/40",
        SIZE_HEIGHTS[widget.size],
        !isEditMode && "hover:bg-background hover:border-border/60 transition-all duration-200",
        // Edit mode ring
        isEditMode && !isDragging && "ring-1 ring-accent/30 ring-offset-1 ring-offset-background",
        isDragging && "shadow-lg ring-2 ring-accent ring-offset-2 ring-offset-background cursor-grabbing bg-background",
      )}
      whileHover={!isEditMode ? { y: -1 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* ================================================================== */}
      {/* EDIT MODE CONTROLS - Fixed position, always accessible           */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-30 flex items-center gap-1.5 p-1",
              "bg-background/95 backdrop-blur-sm border border-border shadow-lg",
              // Position at top-right, with enough padding from edge
              "top-3 right-3",
              // Ensure pointer events work
              "pointer-events-auto"
            )}
          >
            {/* Drag Handle */}
            <button
              {...dragHandleProps}
              className={cn(
                "flex items-center justify-center size-7",
                "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                "cursor-grab active:cursor-grabbing transition-colors",
                isDragging && "cursor-grabbing text-foreground bg-muted"
              )}
            >
              <GripVertical className="size-4" />
            </button>

            {/* Resize Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-center size-7",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                    "transition-colors"
                  )}
                >
                  {SIZE_ICONS[widget.size]}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {allowedSizes.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => resizeWidget(widget.id, size)}
                    className={cn(
                      "cursor-pointer gap-2",
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
              className={cn(
                "flex items-center justify-center size-7",
                "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                "transition-colors"
              )}
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* EDIT MODE: Size Badge                                             */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute top-3 left-3 z-20 pointer-events-none"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-1">
              {SIZE_LABELS[widget.size]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* EDIT MODE: Resize Handle (bottom-right corner, like textarea)     */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <ResizeHandle onResize={handleResize} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* EDIT MODE: Overlay to block widget interactions                   */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 z-10",
              "bg-transparent",
              // Block ALL pointer events on widget content
              "pointer-events-auto"
            )}
            // Capture and stop all interactions from reaching the widget
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* WIDGET CONTENT                                                    */}
      {/* ================================================================== */}
      <div 
        className={cn(
          "h-full",
          // In edit mode, content is below the overlay (z-10) so it can't be interacted with
          isEditMode && "pointer-events-none"
        )}
      >
        {renderWidget(widget, { isEditMode })}
      </div>
    </motion.div>
  );
}
