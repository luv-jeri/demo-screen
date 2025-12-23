"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchBar } from "@/components/search-bar";
import { BentoGrid } from "@/components/bento-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { DotPattern } from "@/components/ui/dot-pattern";
import { VARIANTS } from "@/lib/motion";
import { useBentoStore } from "@/components/bento-store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const widgets = useBentoStore((state) => state.widgets);
  const [zoom, setZoom] = useState(0.8); // Default to 80%
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHydrated(true);
  }, []);

  // Default to false (not empty) during SSR to match server
  const isEditMode = useBentoStore((state) => state.isEditMode);
  const isEmpty = hasHydrated && widgets.length === 0 && !isEditMode;

  return (
    <div className={cn(
      "relative h-dvh w-full overflow-hidden bg-background text-foreground flex flex-col transition-all duration-700",
      isEmpty ? "items-center justify-center p-8" : "p-6 md:p-8 lg:p-10"
    )}>
      {/* Dot Pattern Background */}
      <DotPattern 
        width={24} 
        height={24} 
        cr={1} 
        className="fixed inset-0 z-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" 
      />
      {/* Zoom Control */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl transition-opacity duration-300 hover:bg-black/60">
        <button 
           onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
           className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          -
        </button>
        <span className="text-xs font-mono font-medium text-white/80 min-w-[3ch] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
           onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
           className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          +
        </button>
      </div>

      <motion.div
        variants={VARIANTS.staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ zoom: zoom }}
        className={cn(
          "w-full max-w-[1400px] mx-auto flex flex-col h-full origin-top transition-all duration-700",
          isEmpty ? "justify-center max-w-5xl" : "justify-start gap-4 md:gap-8" 
        )}
      >
        {/* Dynamic Top Spacer - Collapses first when space is needed */}
        {!isEmpty && (
          <div className="flex-none w-full h-[32vh] min-h-[10vh] shrink-10 transition-all duration-700 ease-in-out" />
        )}

        {/* Header Section - Fixed Size - Polished Hero */}
        <div className="flex-none space-y-8 md:space-y-10 relative pt-8 shrink-0 z-10 text-center">
          <motion.div variants={VARIANTS.fadeInUp} className="space-y-2">
            {/* Creative Workspace Hero Text */}
            <h1 className="text-[clamp(3rem,5.5vw,5.5rem)] font-thin tracking-tighter text-white leading-[0.95] font-heading select-none">
              Every Asset.<br />
              <span className="text-white/60">One Place.</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground/60 font-light tracking-wide pt-2">
              Create • Organize • Deliver
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div variants={VARIANTS.scaleIn} className="w-full mx-auto">
            <SearchBar isHero={isEmpty} />
          </motion.div>
          
          {/* Empty State Action */}
          <AnimatePresence>
            {isEmpty && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
               >
                  <EmptyState />
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bento Grid Widgets - Scrollable Area - Collapses last */}
        <motion.div 
           variants={VARIANTS.fadeInUp} 
           className={cn(
             "w-full overflow-y-auto scrollbar-hide -mr-4 pr-4 transition-all duration-500 min-h-0 shrink",
             isEmpty && "hidden" 
           )}
           style={{
              maskImage: "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)"
           }}
        >
            <BentoGrid />
        </motion.div>
      </motion.div>
    </div>
  );
}
