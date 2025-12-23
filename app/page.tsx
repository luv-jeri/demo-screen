"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SearchBar } from "@/components/search-bar";
import { BentoGrid } from "@/components/bento-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { VARIANTS } from "@/lib/motion";
import { useBentoStore } from "@/components/bento-store";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const widgets = useBentoStore((state) => state.widgets);
  const [zoom, setZoom] = useState(1); // Default to 100%
  const [hasHydrated, setHasHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based animations
  const { scrollY } = useScroll();
  
  // Hero text shrinks from scale 1 to 0.6 over first 200px of scroll
  const heroScale = useTransform(scrollY, [0, 200], [1, 0.6]);
  const heroOpacity = useTransform(scrollY, [0, 150], [1, 0.8]);
  // Subtitle fades out faster
  const subtitleOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  // Hydration detection - schedule after initial render to avoid cascade
  useEffect(() => {
    queueMicrotask(() => setHasHydrated(true));
  }, []);

  const isEditMode = useBentoStore((state) => state.isEditMode);
  const isEmpty = hasHydrated && widgets.length === 0 && !isEditMode;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative min-h-dvh w-full bg-background text-foreground flex flex-col transition-all duration-700",
        isEmpty ? "items-center justify-center p-8" : ""
      )}
    >
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

      {isEmpty ? (
        /* Empty State - Centered Layout */
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ zoom }}
          className="w-full max-w-5xl mx-auto flex flex-col justify-center min-h-[80vh] gap-8"
        >
          <div className="flex-none space-y-8 relative z-10 text-center">
            <motion.div variants={VARIANTS.fadeInUp} className="space-y-2">
              <h1 className="text-[clamp(3rem,5.5vw,5.5rem)] font-thin tracking-tighter text-white leading-[0.95] font-heading select-none">
                Every Asset.<br />
                <span className="text-white/60">One Place.</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground/60 font-light tracking-wide pt-2">
                Create • Organize • Deliver
              </p>
            </motion.div>

            <motion.div variants={VARIANTS.scaleIn} className="w-full mx-auto">
              <SearchBar isHero={true} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <EmptyState />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* Dashboard Layout - Widgets start at middle, sticky header */
        <div style={{ zoom }} className="w-full">
          {/* Spacer to position content */}
          <div className="h-[20vh]" />

          {/* Sticky Header Section - sticks to top on scroll */}
          <div className="sticky top-0 z-20 bg-background backdrop-blur-xl pb-4 pt-6 px-6 md:px-8 lg:px-10">
            <motion.div
              className="w-full max-w-[1400px] mx-auto text-center"
            >
              {/* Hero Text - Shrinks on scroll */}
              <motion.div 
                style={{ scale: heroScale, opacity: heroOpacity }}
                className="origin-top mb-4"
              >
                <h1 className="text-[clamp(2rem,4vw,4rem)] font-thin tracking-tighter text-white leading-[0.95] font-heading select-none">
                  Every Asset.<span className="text-white/60 ml-3">One Place.</span>
                </h1>
              </motion.div>

              {/* Subtitle - Fades out on scroll */}
              <motion.p 
                style={{ opacity: subtitleOpacity }}
                className="text-sm text-muted-foreground/60 font-light tracking-wide mb-6"
              >
                Create • Organize • Deliver
              </motion.p>

              {/* Search Bar - Always visible */}
              <motion.div 
                variants={VARIANTS.scaleIn}
                initial="hidden"
                animate="visible"
                className="w-full max-w-3xl mx-auto"
              >
                <SearchBar isHero={false} />
              </motion.div>
            </motion.div>
          </div>

          {/* Bento Grid Widgets */}
          <motion.div 
            variants={VARIANTS.staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-10 pt-8"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 40px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 40px)"
            }}
          >
            <motion.div variants={VARIANTS.fadeInUp}>
              <BentoGrid />
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
