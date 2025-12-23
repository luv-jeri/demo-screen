"use client";

import * as React from "react";
import {
  Search,
  MessageSquare,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  Clock,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";

// ============================================================================
// Configuration
// ============================================================================

const categories = [
  { value: "all", label: "All" },
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "documents", label: "Documents" },
  { value: "audio", label: "Audio" },
];

const quickFilters = [
  { value: "recent", label: "Recent", icon: Clock },
  { value: "popular", label: "Popular", icon: TrendingUp },
  { value: "saved", label: "Saved", icon: Bookmark },
];

// ============================================================================
// Search Bar Component
// ============================================================================

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, category: string, mode: "search" | "chat") => void;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [mode, setMode] = React.useState<"search" | "chat">("search");
  const [activeQuickFilters, setActiveQuickFilters] = React.useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [dateRange, setDateRange] = React.useState("all-time");
  const [contentType, setContentType] = React.useState("all");
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Global "/" keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as Element)?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query, category, mode);
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setActiveQuickFilters([]);
    setCategory("all");
    setDateRange("all-time");
    setContentType("all");
  };

  const hasActiveFilters =
    activeQuickFilters.length > 0 ||
    category !== "all" ||
    dateRange !== "all-time" ||
    contentType !== "all";

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* ================================================================== */}
      {/* Mode Toggle - Clear Selection with Accent Color                   */}
      {/* ================================================================== */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-muted/40 border border-border/60 rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-sm",
              mode === "search"
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Search className="size-4" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2.5 text-sm font-semibold transition-all duration-200 rounded-sm",
              mode === "chat"
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Sparkles className="size-4" />
            Ask AI
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Hero Search Input                                                 */}
      {/* ================================================================== */}
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative flex items-center",
            "bg-background border-2 transition-all duration-300",
            isFocused
              ? "border-accent shadow-[0_0_0_4px_rgba(161,255,98,0.15)]"
              : "border-border hover:border-primary/30 shadow-sm"
          )}
        >
          {/* Category Dropdown (left side) */}
          <div className="hidden md:flex items-center border-r border-border/50 h-full">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-0 bg-transparent h-14 md:h-16 px-4 text-sm font-medium text-muted-foreground hover:text-foreground focus:ring-0 focus:ring-offset-0 min-w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search/AI Icon */}
          <div className="pl-4 md:pl-3">
            {mode === "search" ? (
              <Search className="size-5 text-muted-foreground" />
            ) : (
              <Sparkles className="size-5 text-accent" />
            )}
          </div>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "w-full h-14 md:h-16 px-4 bg-transparent",
                "text-base md:text-lg font-medium text-foreground",
                "placeholder:text-transparent focus:outline-none"
              )}
              placeholder="Search..."
            />
            {/* Animated Placeholder */}
            {!query && (
              <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
                <span className="text-muted-foreground/70 text-base md:text-lg">
                  <TypingAnimation
                    words={
                      mode === "search"
                        ? [
                            "Search for assets...",
                            "Find documents...",
                            "Browse collections...",
                            "Explore your library...",
                          ]
                        : [
                            "Ask anything about your content...",
                            "Summarize this document...",
                            "Find similar assets to...",
                            "What's the latest update on...",
                          ]
                    }
                    typeSpeed={50}
                    deleteSpeed={30}
                    pauseDelay={2000}
                  />
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <InteractiveHoverButton
            type="submit"
            disabled={!query.trim()}
            className="h-10 md:h-11 mr-2 shrink-0"
          >
            {mode === "search" ? "Search" : "Ask"}
          </InteractiveHoverButton>
        </div>
      </form>

      {/* ================================================================== */}
      {/* Filters - Compact & Non-Intrusive                                 */}
      {/* ================================================================== */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeQuickFilters.includes(filter.value);
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => toggleQuickFilter(filter.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    "border",
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                  )}
                >
                  <Icon className="size-3" />
                  {filter.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>

          {/* Advanced Toggle */}
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all",
                "text-muted-foreground hover:text-foreground",
                showAdvancedFilters && "text-foreground"
              )}
            >
              <SlidersHorizontal className="size-3" />
              Filters
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-200",
                  showAdvancedFilters && "rotate-180"
                )}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        {/* Advanced Filters Panel */}
        <CollapsibleContent>
          <div className="mt-4 p-4 border border-border/50 bg-muted/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-9 text-sm bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                    <SelectItem value="year">Past year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Content Type
                </label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="h-9 text-sm bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Category (Mobile)
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 text-sm bg-background md:hidden">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Placeholder for desktop alignment */}
                <div className="hidden md:block h-9" />
              </div>
            </div>

            {/* Apply/Reset Row */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/30">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Reset All
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setShowAdvancedFilters(false)}
                className="text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
