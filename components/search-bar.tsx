"use client";

import * as React from "react";
import {
  ArrowRight,
  Search,
  MessageSquare,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/ui/typing-animation";
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

// Mock categories for the dropdown
const categories = [
  { value: "all", label: "All Categories" },
  { value: "wiki-1", label: "Wiki 1" },
  { value: "wiki-2", label: "Wiki 2" },
  { value: "docs", label: "Documentation" },
  { value: "guides", label: "Guides" },
];

// Quick filters
const quickFilters = [
  { value: "recent", label: "Recent" },
  { value: "popular", label: "Popular" },
  { value: "verified", label: "Verified" },
];



interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, category: string, mode: "search" | "chat") => void;
}

export function SearchBar({
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [mode, setMode] = React.useState<"search" | "chat">("search");
  const [activeQuickFilters, setActiveQuickFilters] = React.useState<string[]>(
    []
  );
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [dateRange, setDateRange] = React.useState("all-time");
  const [contentType, setContentType] = React.useState("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Search submitted:", {
        query,
        category,
        mode,
        quickFilters: activeQuickFilters,
        dateRange,
        contentType,
      });
      onSearch?.(query, category, mode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
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

      {/* Mode Toggle - Search vs Chat with solid background and sharp corners */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center gap-1 p-1 bg-muted border border-border shadow-sm rounded-sm">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2.5 rounded-sm text-[15px] font-medium transition-all duration-300",
              mode === "search"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            <Search className="size-4" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={cn(
              "relative flex items-center gap-2 px-6 py-2.5 rounded-sm text-[15px] font-medium transition-all duration-300",
              mode === "chat"
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            <MessageSquare className="size-4" />
            Conversation
          </button>
        </div>
      </div>

      {/* Search Bar Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-0 border border-border bg-card shadow-lg shadow-black/5 rounded-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-accent focus-within:border-accent hover:border-primary/50">
          {/* Category Selector */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px] md:w-[160px] border-0 bg-transparent rounded-none focus:ring-0 focus:ring-offset-0 h-14 md:h-16 pl-5 text-[15px] font-medium">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Search Input with Typing Animation Placeholder */}
          <div className="flex-1 flex items-center relative">
            {mode === "search" ? (
              <Search className="ml-3 size-4 text-muted-foreground shrink-0" />
            ) : (
              <Sparkles className="ml-3 size-4 text-primary shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-14 md:h-16 px-3 bg-transparent text-[15px] md:text-base focus:outline-none"
            />
            {/* Animated placeholder when input is empty */}
            {!query && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground text-sm md:text-base pointer-events-none flex items-center">
                <span>Try:&nbsp;</span>
                <span className="inline-block min-w-[280px]">
                  <TypingAnimation
                    words={[
                      "How to get started?",
                      "API documentation",
                      "Best practices",
                      "Search your knowledge base...",
                    ]}
                    typeSpeed={40}
                    deleteSpeed={25}
                    pauseDelay={1200}
                  />
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            variant="accent"
            className="h-10 w-10 md:h-11 md:w-11 mr-1.5 shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
            disabled={!query.trim()}
          >
            <ArrowRight className="size-4 md:size-5" />
            <span className="sr-only">
              {mode === "search" ? "Search" : "Start Chat"}
            </span>
          </Button>
        </div>
      </form>

      {/* Collapsible Filters Section */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Quick filters:</span>
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => toggleQuickFilter(filter.value)}
                className={cn(
                  "text-xs px-3 py-1.5 uppercase tracking-wider border transition-all duration-300",
                  activeQuickFilters.includes(filter.value)
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent"
                )}
              >
                {filter.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="size-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Advanced Filters Toggle */}
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs transition-all duration-200 hover:scale-105"
            >
              <SlidersHorizontal className="size-3.5" />
              Advanced
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-200",
                  showAdvancedFilters ? "rotate-180" : ""
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Advanced Filters Content */}
        <CollapsibleContent>
          <div className="mt-4 p-4 rounded-lg border border-border bg-muted/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="h-9 text-sm">
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
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Content Type
                </label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="h-9 text-sm">
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
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );
}
