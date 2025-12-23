"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CheckSquare, Plus, Circle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIDGET_SIZES, type WidgetSize } from "../widget-types";
import type { WidgetProps } from "../widget-registry";

// ============================================================================
// Types & Mock Data
// ============================================================================

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority?: "high" | "normal";
}

const INITIAL_TODOS: TodoItem[] = [
  { id: "1", text: "Review Q4 campaign assets", completed: false, priority: "high" },
  { id: "2", text: "Upload new product photos", completed: false },
  { id: "3", text: "Organize logo collection", completed: true },
  { id: "4", text: "Update brand guidelines", completed: false },
];

// ============================================================================
// Todo Widget Component
// ============================================================================
// 
// Size Variants:
// - sm: Icon + count + top task
// - md: Task list with quick toggle
// - lg: Full list with add input and progress
//

export function TodoWidget({ title, size }: WidgetProps) {
  const [todos, setTodos] = React.useState(INITIAL_TODOS);
  const [newTodo, setNewTodo] = React.useState("");

  const isSmall = size === WIDGET_SIZES.SMALL;
  const isMedium = size === WIDGET_SIZES.MEDIUM;
  const isLarge = size === WIDGET_SIZES.LARGE;

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const pendingTodos = todos.filter(t => !t.completed);
  const displayTodos = isSmall ? pendingTodos.slice(0, 1) : isMedium ? pendingTodos.slice(0, 3) : todos;

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    setTodos(prev => [newItem, ...prev]);
    setNewTodo("");
  };

  return (
    <div className="h-full flex flex-col p-3">
      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <CheckSquare className={cn(
          "text-muted-foreground/70",
          isSmall ? "size-4" : "size-5"
        )} />
        <span className={cn(
          "font-semibold tracking-tight truncate flex-1",
          isSmall ? "text-[11px] uppercase text-muted-foreground" : "text-xs text-foreground/80"
        )}>
          {title}
        </span>
        <span className={cn(
          "font-medium text-muted-foreground",
          isSmall ? "text-[10px]" : "text-xs"
        )}>
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Add input (lg only) */}
      {isLarge && (
        <div className="flex gap-2 mt-2 shrink-0">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 h-8 px-2 text-sm bg-muted/50 border border-border/50 focus:outline-none focus:border-accent"
          />
          <button
            onClick={addTodo}
            className="size-8 flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Plus className="size-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 mt-2 overflow-hidden">
        {isSmall ? (
          // SMALL: Show top pending task
          <div className="flex items-center h-full">
            {pendingTodos.length > 0 ? (
              <p className="text-xs text-muted-foreground truncate">
                {pendingTodos[0].text}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">All done! 🎉</p>
            )}
          </div>
        ) : (
          // MEDIUM/LARGE: Task list
          <div className="space-y-1 overflow-auto h-full scrollbar-none">
            {displayTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                className={cn(
                  "flex items-center gap-2 py-1.5 cursor-pointer group",
                  isLarge && "py-2 px-1 hover:bg-muted/50"
                )}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed ? (
                  <CheckCircle2 className={cn(
                    "shrink-0 text-accent",
                    isLarge ? "size-5" : "size-4"
                  )} />
                ) : (
                  <Circle className={cn(
                    "shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground",
                    isLarge ? "size-5" : "size-4"
                  )} />
                )}
                <span className={cn(
                  "truncate transition-colors",
                  todo.completed && "line-through text-muted-foreground/50",
                  isLarge ? "text-sm" : "text-xs",
                  todo.priority === "high" && !todo.completed && "text-foreground font-medium"
                )}>
                  {todo.text}
                </span>
                {todo.priority === "high" && !todo.completed && (
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 px-1 py-0.5">
                    !
                  </span>
                )}
              </motion.div>
            ))}

            {isMedium && pendingTodos.length > 3 && (
              <button className="w-full py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                +{pendingTodos.length - 3} more tasks
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress (lg only) */}
      {isLarge && (
        <div className="shrink-0 pt-2 mt-1 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
