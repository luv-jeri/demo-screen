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

// Get greeting based on time
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

interface SearchBarProps {
  className?: string;
  userName?: string;
  onSearch?: (query: string, category: string, mode: "search" | "chat") => void;
}

export function SearchBar({
  className,
  userName = "there",
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

  const greeting = getGreeting();

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* Header with personalized greeting */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
          {greeting}, {userName}{" "}
          <span className="inline-block animate-pulse">👋</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          How can I help you today?
        </p>
      </div>

      {/* Mode Toggle - Search vs Chat with animated highlight */}
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
          <button
            type="button"
            onClick={() => setMode("search")}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
              mode === "search"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Search className="size-4" />
            Search
          </button>
          <button
            type="button"
            onClick={() => setMode("chat")}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
              mode === "chat"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="size-4" />
            Conversation
          </button>
        </div>
      </div>

      {/* Search Bar Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-0 rounded-xl border border-border bg-card shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
          {/* Category Selector */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px] md:w-[160px] border-0 bg-transparent rounded-l-xl rounded-r-none focus:ring-0 focus:ring-offset-0 h-12 md:h-14 pl-4 text-sm font-medium">
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

          {/* Search Input */}
          <div className="flex-1 flex items-center">
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
              placeholder={
                mode === "search"
                  ? "Search your knowledge base..."
                  : "Start a conversation..."
              }
              className="flex-1 h-12 md:h-14 px-3 bg-transparent text-sm md:text-base placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 md:h-11 md:w-11 rounded-lg mr-1.5 shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
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
                  "text-xs px-2.5 py-1 rounded-full border transition-all duration-200",
                  activeQuickFilters.includes(filter.value)
                    ? "bg-primary text-primary-foreground border-primary scale-105"
                    : "border-border bg-muted/50 hover:bg-muted hover:scale-105"
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

      {/* Quick suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Try:</span>
        {["How to get started?", "API documentation", "Best practices"].map(
          (suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion);
                inputRef.current?.focus();
              }}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-105"
            >
              {suggestion}
            </button>
          )
        )}
      </div>
    </div>
  );
}
