"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { WidgetDashboard } from "@/components/dashboard/widget-dashboard";
import { DashboardProvider, useDashboard } from "@/components/dashboard/widget-context";
import { Button } from "@/components/ui/button";

// ============================================================================
// Animation Config - Simple, Calm, Quick
// ============================================================================

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const quickSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// ============================================================================
// Add First Widget Button
// ============================================================================

function AddFirstWidgetButton() {
  const { resetToDefault } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex justify-center pb-8"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={resetToDefault}
        className="text-xs text-muted-foreground/60 hover:text-muted-foreground gap-1.5 border-b-2 border-accent rounded-none"
      >
        <Plus className="size-3.5" />
        Add first widget
      </Button>
    </motion.div>
  );
}

// ============================================================================
// Home Content
// ============================================================================
// 
// Layout Strategy:
// - Search bar is STICKY (always visible at top)
// - Widgets have their OWN scroll container (separate from page)
// - Page scroll does NOT hide search bar
// - Widgets are compact and don't dominate
//

function HomeContent() {
  const { getVisibleWidgets } = useDashboard();
  const hasWidgets = getVisibleWidgets().length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* ================================================================== */}
      {/* STICKY SEARCH SECTION - Always visible, never scrolls away        */}
      {/* ================================================================== */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.08 } },
        }}
        className={`
          flex-shrink-0 
          px-4 md:px-8 lg:px-12
          pt-6 md:pt-10 pb-4 md:pb-6
          max-w-6xl mx-auto w-full
          ${!hasWidgets ? 'flex-1 flex flex-col justify-center' : ''}
        `}
      >
        {/* Welcome Copy - Compelling & Action-Oriented */}
        <motion.div
          variants={fadeUp}
          transition={quickSpring}
          className="text-center mb-theme"
        >
          <h1 className="text-heading text-h1 font-bold text-foreground">
            What are you looking for?
          </h1>
          <p className="text-body text-muted-foreground mt-2 max-w-md mx-auto">
            Search across all your assets, docs, and collections
          </p>
        </motion.div>

        {/* Search Bar - Hero Element */}
        <motion.div
          variants={fadeUp}
          transition={quickSpring}
        >
          <SearchBar />
        </motion.div>

        {/* Keyboard Shortcut Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60"
        >
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-muted/60 border border-border/40 text-[10px] font-mono font-semibold text-foreground/70">
            /
          </kbd>
          <span>to focus</span>
        </motion.div>
      </motion.section>

      {/* ================================================================== */}
      {/* WIDGETS SECTION - Only shown when widgets exist                   */}
      {/* ================================================================== */}
      {hasWidgets ? (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex-1 min-h-0 overflow-hidden"
        >
          {/* Subtle separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mx-8" />
          
          {/* Scrollable widget area */}
          <div className="h-full overflow-y-auto px-4 md:px-8 lg:px-12 py-4 scroll-smooth scrollbar-thin">
            <div className="max-w-6xl mx-auto">
              <WidgetDashboard />
            </div>
          </div>
        </motion.section>
      ) : (
        /* Add First Widget - Subtle CTA when no widgets */
        <AddFirstWidgetButton />
      )}
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function Home() {
  return (
    <DashboardProvider>
      <HomeContent />
    </DashboardProvider>
  );
}
