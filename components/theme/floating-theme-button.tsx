"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeCustomizerModal } from "./theme-customizer-modal";

// ============================================================================
// Types
// ============================================================================

interface FloatingThemeButtonProps {
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function FloatingThemeButton({ className }: FloatingThemeButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <>
      {/* Floating Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={() => setIsOpen(true)}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "flex items-center justify-center",
              "size-12 rounded-full",
              "bg-card/80 backdrop-blur-md",
              "border border-border",
              "text-foreground",
              "shadow-lg",
              "cursor-pointer",
              "outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "transition-colors duration-200",
              className
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            aria-label="Customize theme"
          >
            {/* Animated icon */}
            <motion.div
              animate={{
                rotate: isHovered ? 15 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Palette className="size-5" />
            </motion.div>

            {/* Glow effect on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-accent/20"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            {/* Subtle pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={12}>
          <p>Customize theme</p>
        </TooltipContent>
      </Tooltip>

      {/* Theme Customizer Modal */}
      <ThemeCustomizerModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
