"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Image as ImageIcon, 
  FileVideo, 
  Music, 
  Box, 
  X, 
  Calendar, 
  Tag,
  User,
  Smartphone,
  Monitor,
  Square,
  ArrowRight,

  Clock,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

type SearchMode = "search" | "ask";

// ============================================================================
// Data
// ============================================================================

const PLACEHOLDERS = {
  search: [
    "Search for 'Quarterly Report'...",
    "Find 'Contract.pdf' from last week...",
    "Where is the 'Design Assets' folder?",
    "Show me 'Unpaid Invoices'...",
    "Search for 'Meeting Notes'...",
    "Find 'Budget 2025.xlsx'...",
    "Looking for 'Logo_Final.png'...",
    "Trace 'Project Alpha' timeline...",
    "Locate 'Client Contracts'...",
    "Search 'Employee Handbook'...",
    "Find 'Q4 Marketing Strategy'...",
    "Who edited 'Policy_v2.docx'?"
  ],
  ask: [
    "Summarize the Q3 financial report...",
    "Draft an email to the client about delays...",
    "Create a table of recent sales data...",
    "What are the key takeaways from the meeting?",
    "How do I reset my password?",
    "Explain the new vacation policy...",
    "Generate a checklist for the launch...",
    "Compare revenue Q1 vs Q2...",
    "Write a bio for the new team member...",
    "Suggest a tagline for the campaign...",
    "Translate this document to Spanish...",
    "Debugging steps for Error 503..."
  ]
};

const CATEGORIES = [
  { id: "all", label: "All", icon: Box },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "video", label: "Video", icon: FileVideo },
  { id: "audio", label: "Audio", icon: Music },
];

const STATUS_FILTERS = [
  { id: "any", label: "Any Status" },
  { id: "approved", label: "Approved" },
  { id: "review", label: "In Review" },
  { id: "draft", label: "Draft" },
];

const ORIENTATIONS = [
  { id: "landscape", label: "Landscape", icon: Monitor },
  { id: "portrait", label: "Portrait", icon: Smartphone },
  { id: "square", label: "Square", icon: Square },
];

// ... (previous imports)

// Standardized Quick Filters (Monochrome/Premium)
const QUICK_FILTERS = [
  { id: "unread", label: "Unread", icon: Box },
  { id: "archived", label: "Archived", icon: Box },
  { id: "drafts", label: "Drafts", icon: Box },
  { id: "shared", label: "Shared", icon: User },
  { id: "private", label: "Private", icon: User },
  { id: "important", label: "Important", icon: Sparkles },
  { id: "recent", label: "Recent", icon: Clock },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: FileVideo },
  { id: "docs", label: "Text Docs", icon: Box },
  { id: "audio", label: "Audio", icon: Music },
  { id: "tasks", label: "Tasks", icon: CheckCircle2 },
];

// ...



  // ...


// ============================================================================
// Component
// ============================================================================

interface SearchBarProps {
  isHero?: boolean;
}

export function SearchBar({ isHero = false }: SearchBarProps) {
  const [mode, setMode] = React.useState<SearchMode>("search");
  const [query, setQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // ... (keep existing state)
  
  // Filter States
  const [status, setStatus] = React.useState("any");
  const [orientation, setOrientation] = React.useState<string | null>(null);
  const [selectedQuickFilters, setSelectedQuickFilters] = React.useState<string[]>([]);
  
  // Toggle Quick Filter

  const toggleQuickFilter = (id: string) => {
    setSelectedQuickFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // ... (keep existing effects)

  // --------------------------------------------------------------------------
  // Typewriter Logic (State Machine)
  // --------------------------------------------------------------------------
  const [placeholder, setPlaceholder] = React.useState("");
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<"typing" | "pausing" | "deleting">("typing");

  React.useEffect(() => {
    // Performance: Don't run typewriter when user is interacting
    if (isFocused || query.length > 0) return;

    const currentPhrases = PLACEHOLDERS[mode];
    const currentPhrase = currentPhrases[phraseIndex % currentPhrases.length];

    let timeout: NodeJS.Timeout;

    if (phase === "typing") {
      // Type next character
      if (placeholder.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholder(currentPhrase.slice(0, placeholder.length + 1));
        }, 50 + Math.random() * 30); // Slight random variance for realism
      } else {
        // Finished typing, pause
        timeout = setTimeout(() => setPhase("pausing"), 2000);
      }
    } else if (phase === "pausing") {
      // Finished pausing, start deleting
      timeout = setTimeout(() => setPhase("deleting"), 100);
    } else if (phase === "deleting") {
      // Delete last character
      if (placeholder.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(prev => prev.slice(0, -1));
        }, 30);
      } else {
        // Finished deleting, next phrase
        setPhase("typing");
        setPhraseIndex(prev => prev + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholder, phase, phraseIndex, mode, isFocused, query]);

  // Reset on mode change
  React.useEffect(() => {
    setPlaceholder("");
    setPhase("typing");
    setPhraseIndex(0);
  }, [mode]);

  // --------------------------------------------------------------------------
  // Scroll Logic (CSS Marquee - Performance Optimized)
  // --------------------------------------------------------------------------
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Performance: Use CSS animation instead of requestAnimationFrame
  // The marquee now uses CSS translate animation which runs on GPU
  // Manual wheel scroll still supported via event handler
  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Manual Wheel Scroll (only JS-based interaction needed)
    const handleWheel = (evt: WheelEvent) => {
      evt.preventDefault();
      container.scrollLeft += evt.deltaY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className={cn(
        "w-full mx-auto space-y-6 transition-all duration-700",
        isHero ? "max-w-4xl" : "max-w-3xl"
    )}>
      
      {/* Search Input Container - LIME BORDER ALWAYS */}
      <div className={cn(
        "relative group rounded-[2.5rem] bg-zinc-900/50 backdrop-blur-xl border-2 transition-all duration-300 z-50",
        isFocused || isFilterOpen 
            ? "border-accent shadow-[0_0_50px_-10px_var(--color-accent)_/0.2] scale-[1.01]" 
            : "border-accent/30 hover:border-accent/60 hover:shadow-[0_0_30px_-10px_rgba(180,245,88,0.15)] hover:scale-[1.005]"
      )}>
        
        {/* Main Flex Row - Conditional Height - Slimmed Down */}
        <div className={cn(
            "relative flex items-center px-4 md:px-5 py-2 transition-all duration-500",
            isHero ? "h-14 md:h-16" : "h-14 md:h-18" 
        )}>
          
          {/* Leading Icon / Toggle */}
          <div className="shrink-0 flex items-center gap-3 mr-4">
             <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                <button
                    onClick={() => setMode("search")}
                    className={cn(
                        "relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10",
                        mode === "search" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {mode === "search" && (
                        <motion.div
                            layoutId="active-mode"
                            className="absolute inset-0 bg-zinc-700/80 rounded-full shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative flex items-center gap-2">
                        <Search className="size-4" />
                        <span className="hidden md:inline">Search</span>
                    </span>
                </button>
                <button
                    onClick={() => setMode("ask")}
                    className={cn(
                        "relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10",
                        mode === "ask" ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                     {mode === "ask" && (
                        <motion.div
                            layoutId="active-mode"
                            className="absolute inset-0 bg-accent rounded-full shadow-[0_0_20px_-5px_var(--color-accent)_/0.3]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative flex items-center gap-2">
                        <Sparkles className="size-4" />
                        <span className="hidden md:inline">Ask AI</span>
                    </span>
                </button>
             </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 relative h-full flex items-center min-w-0">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full h-full bg-transparent border-none text-xl md:text-2xl placeholder-transparent focus:outline-none focus:ring-0 text-foreground font-light caret-accent z-10 relative tracking-tight"
            />
            
            {/* Animated Placeholder */}
            {query === "" && (
                <div className="absolute inset-0 flex items-center pointer-events-none text-muted-foreground/40 text-xl md:text-2xl font-light select-none whitespace-nowrap overflow-hidden tracking-tight">
                    <span className="opacity-0">|</span> 
                    <motion.span>
                        {placeholder}
                        <span className="animate-pulse text-accent">|</span>
                    </motion.span>
                </div>
            )}
          </div>

          {/* Trailing Actions */}
          <div className="shrink-0 flex items-center gap-3 ml-4">
            
            <div className="h-8 w-px bg-linear-to-b from-transparent via-white/10 to-transparent mx-1" />
            
            {/* Advanced Filters Trigger - Premium Revamp */}
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                    "group relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 border",
                    isFilterOpen 
                        ? "bg-white text-black border-white shadow-lg shadow-white/5" 
                        : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-foreground"
                )}
            >
                {isFilterOpen ? <X className="size-5" /> : <SlidersHorizontal className="size-5" />}
                <span className="hidden md:inline text-sm font-medium">Filters</span>
            </button>
            
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.98, y: -10 }}
            animate={{ height: "auto", opacity: 1, scale: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden px-1"
          >
            <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-4xl p-8 shadow-2xl relative z-40 space-y-8">
                
                {/* Header: Categories */}
                <div className="flex flex-wrap items-center justify-center gap-3 border-b border-white/5 pb-8">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all duration-300",
                                activeCategory === cat.id 
                                    ? "bg-accent/20 border-accent text-accent shadow-[0_0_20px_-5px_var(--color-accent)_/0.3]" 
                                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/10"
                            )}
                        >
                            <cat.icon className="size-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid Layout for Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Col 1: Status & Specs (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                         {/* Status */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Status</label>
                            <div className="grid grid-cols-2 gap-3">
                                {STATUS_FILTERS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setStatus(s.id)}
                                        className={cn(
                                            "flex items-center justify-center px-4 py-3 rounded-2xl text-xs font-semibold border transition-all duration-200",
                                            status === s.id 
                                                ? "bg-accent/15 border-accent text-accent shadow-sm" 
                                                : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                        )}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                         {/* Orientation */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Orientation</label>
                            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                {ORIENTATIONS.map(o => (
                                    <button
                                        key={o.id}
                                        onClick={() => setOrientation(orientation === o.id ? null : o.id)}
                                        className={cn(
                                            "flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200",
                                            orientation === o.id 
                                                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                        title={o.label}
                                    >
                                        <o.icon className="size-5 mb-0.5" />
                                        <span className="text-[10px] font-medium opacity-80">{o.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Time & Meta (7 cols) */}
                    <div className="lg:col-span-7 space-y-8 ">
                         {/* Date Range */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Date Created</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Start Date" 
                                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="End Date" 
                                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                         {/* Tags & Owner */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Details</label>
                            <div className="flex flex-col gap-4">
                                <div className="relative group">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter by tags (e.g. 'Campaign', '2025')" 
                                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors"
                                    />
                                </div>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
                                    <input 
                                        type="text" 
                                        placeholder="Filter by author..." 
                                        className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <button 
                         onClick={() => {
                            setStatus("any");
                            setOrientation(null);
                            setActiveCategory("all");
                         }}
                         className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                    >
                        <X className="size-3.5" />
                        Clear All
                    </button>
                    <Button 
                        size="lg" 
                        className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-2xl px-10 h-14 shadow-[0_0_30px_-5px_var(--color-accent)_/0.4] transition-all hover:scale-105 active:scale-95 text-base"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        Show 128 Results
                        <ArrowRight className="ml-2 size-5" />
                    </Button>
                </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filters (Infinite Marquee with Scroll) */}
      <div className="relative group/filters w-full pt-2">
          
          {/* Fading Edges + Scroll Hints */}
          <div className="absolute left-0 top-2 bottom-0 w-12 md:w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none flex items-center justify-start pl-1">
             <div className="size-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/filters:opacity-100 transition-opacity duration-500 text-white/50">
                <span className="text-xl">‹</span>
             </div>
          </div>
          <div className="absolute right-0 top-2 bottom-0 w-12 md:w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none flex items-center justify-end pr-1">
             <div className="size-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/filters:opacity-100 transition-opacity duration-500 text-white/50">
                <span className="text-xl">›</span>
             </div>
          </div>

          <div 
             ref={scrollContainerRef}
             className="relative w-full overflow-x-hidden no-scrollbar mask-gradient-x fade-mask-x py-2"
          >
              {/* CSS-based marquee animation - GPU accelerated, no JS needed */}
              <div 
                 className="flex items-center gap-3 w-max px-4 animate-marquee hover:pause-on-hover"
              >
                  {[...QUICK_FILTERS, ...QUICK_FILTERS].map((filter, i) => {
                      // Unique key for duplicated items
                      const uniqueKey = `${filter.id}-${i}`;
                      const isSelected = selectedQuickFilters.includes(filter.id);
                      return (
                        <button
                            key={uniqueKey}
                            onClick={() => toggleQuickFilter(filter.id)}
                            className={cn(
                                "group flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium tracking-wide border transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer",
                                isSelected
                                    ? "bg-white text-black border-white shadow-lg shadow-white/10"
                                    : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/10"
                            )}
                        >
                            {isSelected ? <X className="size-3.5" /> : <filter.icon className="size-3.5" />}
                            {filter.label}
                        </button>
                      );
                  })}
              </div>
          </div>
      </div>

    </div>
  );
}
