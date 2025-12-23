"use client";

import * as React from "react";
import { 
  motion, 
  AnimatePresence, 
} from "motion/react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  MeasuringStrategy,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Pencil, 
  Check, 
  GripVertical, 
  Trash2,
  BoxSelect,
  Plus,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useBentoStore, type WidgetConfig, type WidgetSize } from "./bento-store";
import { WIDGET_COMPONENTS, WIDGET_BGS, AVAILABLE_WIDGETS } from "./bento-registry";

// ============================================================================
// Constants & Utilities
// ============================================================================

const SIZE_CLASSES: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x1": "col-span-1 md:col-span-2 row-span-1",
  "1x2": "col-span-1 row-span-2",
  "2x2": "col-span-1 md:col-span-2 row-span-2",
  "4x1": "col-span-1 md:col-span-3 lg:col-span-4 row-span-1",
  "4x2": "col-span-1 md:col-span-3 lg:col-span-4 row-span-2",
};

const NEXT_SIZE: Record<WidgetSize, WidgetSize> = {
  "1x1": "2x1",
  "2x1": "1x2",
  "1x2": "2x2", 
  "2x2": "4x1",
  "4x1": "4x2",
  "4x2": "1x1",
};

// ============================================================================
// Sortable Bento Item
// ============================================================================

interface BentoItemProps {
  widget: WidgetConfig;
  isEditMode: boolean;
  onResize: (id: string, newSize: WidgetSize) => void;
  onRemove: (id: string) => void;
}

function BentoItem({ widget, isEditMode, onResize, onRemove }: BentoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  const Component = WIDGET_COMPONENTS[widget.type];
  const customBg = WIDGET_BGS[widget.type];

  const cycleSize = () => {
    onResize(widget.id, NEXT_SIZE[widget.size]);
  };

  if (!Component) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative overflow-hidden rounded-4xl bg-zinc-900/40 backdrop-blur-md transition-all duration-500 will-change-transform",
        SIZE_CLASSES[widget.size],
        !isDragging && !isEditMode && "hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:bg-zinc-800/50",
        isDragging && "shadow-2xl shadow-black/50 ring-2 ring-accent opacity-80 z-50 scale-105",
        isEditMode && "ring-1 ring-white/10 hover:ring-white/20",
        customBg
      )}
    >
       {/* Background Glow - Intensified on Hover */}
       <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />

       {/* Edit Overlays */}
       <AnimatePresence>
         {isEditMode && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40 flex items-center justify-center gap-2"
           >
              {/* Drag Handle (Center) */}
              <div 
                 {...attributes} 
                 {...listeners}
                 className="p-3 bg-white/10 rounded-full cursor-grab active:cursor-grabbing hover:bg-white/20 transition-colors"
              >
                 <GripVertical className="size-5 text-white" />
              </div>

              {/* Resize Button */}
              <button 
                 onClick={(e) => { e.stopPropagation(); cycleSize(); }}
                 className="p-3 bg-white/10 rounded-full hover:bg-blue-500/20 hover:text-blue-400 transition-colors"
                 title="Change Size"
              >
                 <BoxSelect className="size-5" />
              </button>

              {/* Remove Button */}
              <button 
                 onClick={(e) => { e.stopPropagation(); onRemove(widget.id); }}
                 className="p-3 bg-white/10 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                 title="Remove Widget"
              >
                 <Trash2 className="size-5" />
              </button>
              
              {/* Size Badge */}
              <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-black/50 px-2 py-1 rounded-full">
                {widget.size}
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Widget Content */}
       <div className={cn("relative h-full p-6", isEditMode && "opacity-40 blur-[1px]")}>
          <Component id={widget.id} size={widget.size} />
       </div>
    </div>
  );
}

// Performance: Memoize to prevent rerenders when parent state changes
const MemoizedBentoItem = React.memo(BentoItem);

// ============================================================================
// Main Application Grid
// ============================================================================

export function BentoGrid() {
  // Performance: Use atomic Zustand selectors to minimize rerender scope
  const widgets = useBentoStore((state) => state.widgets);
  const isEditMode = useBentoStore((state) => state.isEditMode);
  const toggleEditMode = useBentoStore((state) => state.toggleEditMode);
  const setWidgets = useBentoStore((state) => state.setWidgets);
  const updateWidgetSize = useBentoStore((state) => state.updateWidgetSize);
  const removeWidget = useBentoStore((state) => state.removeWidget);
  const addWidget = useBentoStore((state) => state.addWidget);
  const resetLayout = useBentoStore((state) => state.resetLayout);

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = React.useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((item) => item.id === active.id);
      const newIndex = widgets.findIndex((item) => item.id === over.id);
      const newWidgets = arrayMove(widgets, oldIndex, newIndex);
      setWidgets(newWidgets);
    }
    setActiveId(null);
  }, [widgets, setWidgets]);

  // Performance: Memoize handlers passed to children
  const handleResize = React.useCallback((id: string, size: WidgetSize) => {
    updateWidgetSize(id, size);
  }, [updateWidgetSize]);

  const handleRemove = React.useCallback((id: string) => {
    removeWidget(id);
  }, [removeWidget]);
  



  // DndKit expects pure array modification in dragEnd, simplified here by using the store's setWidgets with sorting logic inside the event handler above,
  // but arrayMove returns a new array, so we need to bridge it.
  // We actually need to patch the store to accept the *result* of arrayMove.
  // The store's setWidgets accepts WidgetConfig[]. Correct.

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4">

      {/* Edit Bar */}
      <div className="flex justify-end mb-4 gap-2">
         {(isEditMode || widgets.length > 0) && (
             <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xl p-1.5 rounded-full border border-white/5">
                {isEditMode && (
                   <>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <button className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300">
                            <Plus className="size-3.5" />
                            Add
                         </button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-48 bg-zinc-900/90 border-white/10 backdrop-blur-xl">
                         {AVAILABLE_WIDGETS.map((widget) => {
                           const isAdded = widgets.some(w => w.type === widget.type);
                           return (
                             <DropdownMenuItem
                               key={widget.type}
                               disabled={isAdded}
                               onClick={() => !isAdded && addWidget(widget.type)}
                               className={cn(
                                 "flex items-center justify-between gap-2 cursor-pointer focus:bg-white/10 text-muted-foreground focus:text-white",
                                 isAdded && "opacity-50 cursor-not-allowed"
                               )}
                             >
                               <div className="flex items-center gap-2">
                                  <widget.icon className="size-4" />
                                  <span>{widget.label}</span>
                               </div>
                               {isAdded && <Check className="size-3.5 text-emerald-500" />}
                             </DropdownMenuItem>
                           );
                         })}
                       </DropdownMenuContent>
                     </DropdownMenu>

                     <div className="w-px h-4 bg-white/10 mx-1" />

                     <button
                        onClick={resetLayout}
                        className="p-2 rounded-full text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
                        title="Reset Layout"
                     >
                        <RotateCcw className="size-3.5" />
                     </button>

                     <button
                        onClick={() => setWidgets([])}
                        className="p-2 rounded-full text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Remove All"
                     >
                        <Trash2 className="size-3.5" />
                     </button>

                     <div className="w-px h-4 bg-white/10 mx-1" />
                   </>
                )}

                 <button
                    onClick={toggleEditMode}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300",
                      isEditMode
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-transparent text-muted-foreground hover:text-white"
                    )}
                 >
                    {isEditMode ? <Check className="size-3.5" /> : <Pencil className="size-3.5" />}
                    {isEditMode ? "Done" : "Customize"}
                 </button>
             </div>
         )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
            items={widgets.map(w => w.id)}
            strategy={rectSortingStrategy}
        >
          {/* Performance: Removed motion.div layout prop - it was causing all widgets to animate on any state change */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[150px] pb-20"
          >
            {widgets.map((widget) => (
              <MemoizedBentoItem
                key={widget.id}
                widget={widget}
                isEditMode={isEditMode}
                onResize={handleResize}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay adjustScale={true}>
          {activeId ? (
              <div className="w-full h-full bg-accent/20 border-2 border-accent rounded-4xl backdrop-blur-md opacity-80" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
