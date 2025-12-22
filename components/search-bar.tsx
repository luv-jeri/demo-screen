"use client";

import * as React from "react";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock categories for the dropdown
const categories = [
  { value: "all", label: "All Categories" },
  { value: "wiki-1", label: "Wiki 1" },
  { value: "wiki-2", label: "Wiki 2" },
  { value: "docs", label: "Documentation" },
  { value: "guides", label: "Guides" },
];

interface SearchBarProps {
  className?: string;
  onSearch?: (query: string, category: string) => void;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Search submitted:", { query, category });
      onSearch?.(query, category);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
          Ask your Knowledge Base
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Search across all your wikis, documents, and guides
        </p>
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
            <Search className="ml-3 size-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 h-12 md:h-14 px-3 bg-transparent text-sm md:text-base placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 md:h-11 md:w-11 rounded-lg mr-1.5 shrink-0"
            disabled={!query.trim()}
          >
            <ArrowRight className="size-4 md:size-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>

      {/* Quick suggestions (optional) */}
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
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors"
            >
              {suggestion}
            </button>
          )
        )}
      </div>
    </div>
  );
}
