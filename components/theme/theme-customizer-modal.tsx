"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, themePresets } from "./theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorControls } from "./controls/color-controls";
import { TypographyControls } from "./controls/typography-controls";
import { SpacingControls } from "./controls/spacing-controls";
import { ShapeControls } from "./controls/shape-controls";

// ============================================================================
// Types
// ============================================================================

interface ThemeCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabValue = "colors" | "typography" | "spacing" | "shapes";

const tabs: { value: TabValue; label: string; icon: string }[] = [
  { value: "colors", label: "Colors", icon: "🎨" },
  { value: "typography", label: "Typography", icon: "✏️" },
  { value: "spacing", label: "Spacing", icon: "📐" },
  { value: "shapes", label: "Shapes", icon: "⬜" },
];

// ============================================================================
// Component
// ============================================================================

export function ThemeCustomizerModal({
  open,
  onOpenChange,
}: ThemeCustomizerModalProps) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState<TabValue>("colors");

  const handleSave = () => {
    theme.saveTheme();
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Revert to saved theme
    if (theme.isDirty) {
      theme.resetToDefault();
    }
    onOpenChange(false);
  };

  const handleReset = () => {
    theme.resetToDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-2xl w-full max-h-[85vh] overflow-hidden",
          "flex flex-col",
          "p-0 gap-0",
          "bg-card border-border"
        )}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="size-5 text-accent" />
              </motion.div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  Theme Customizer
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Personalize your experience
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preset Gallery */}
        <div className="px-6 py-4 border-b border-border">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
            Quick Presets
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {themePresets.map((preset) => (
              <motion.button
                key={preset.id}
                onClick={() => theme.applyPreset(preset.id)}
                className={cn(
                  "shrink-0 flex items-center gap-2 px-3 py-2 rounded-md",
                  "border transition-all duration-200",
                  "cursor-pointer",
                  "hover:scale-[1.02]",
                  theme.currentTheme.id === preset.id
                    ? "border-accent bg-accent/10"
                    : "border-border bg-background hover:border-muted-foreground/30"
                )}
                whileTap={{ scale: 0.98 }}
              >
                {/* Color preview dots */}
                <div className="flex gap-1">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: preset.preview.primary }}
                  />
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: preset.preview.accent }}
                  />
                  <div
                    className="size-3 rounded-full border border-border"
                    style={{ backgroundColor: preset.preview.background }}
                  />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {preset.name}
                </span>
                {theme.currentTheme.id === preset.id && (
                  <Check className="size-3 text-accent" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-md">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-sm",
                  "text-sm font-medium transition-all duration-200",
                  "cursor-pointer",
                  activeTab === tab.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "colors" && <ColorControls />}
              {activeTab === "typography" && <TypographyControls />}
              {activeTab === "spacing" && <SpacingControls />}
              {activeTab === "shapes" && <ShapeControls />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              Reset to default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="gap-2"
              >
                <Check className="size-3.5" />
                Save theme
                {theme.isDirty && (
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
