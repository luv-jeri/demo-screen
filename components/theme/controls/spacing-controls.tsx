"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import type { DensityScale, IconSize } from "@/lib/theme/types";
import { Square, Circle, LayoutGrid } from "lucide-react";

// ============================================================================
// Option Card Component
// ============================================================================

interface OptionCardProps<T extends string> {
  value: T;
  currentValue: T;
  onChange: (value: T) => void;
  label: string;
  description?: string;
  preview?: React.ReactNode;
}

function OptionCard<T extends string>({
  value,
  currentValue,
  onChange,
  label,
  description,
  preview,
}: OptionCardProps<T>) {
  const isActive = value === currentValue;

  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        "flex flex-col items-start p-4 rounded-md",
        "border transition-all duration-200",
        "cursor-pointer text-left",
        "hover:scale-[1.02]",
        isActive
          ? "border-accent bg-accent/10"
          : "border-border bg-background hover:border-muted-foreground/30"
      )}
    >
      {preview && <div className="mb-3 w-full">{preview}</div>}
      <span className="text-sm font-medium">{label}</span>
      {description && (
        <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
      )}
    </button>
  );
}

// ============================================================================
// Section Component
// ============================================================================

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// Density Preview
// ============================================================================

function DensityPreview({ density }: { density: DensityScale }) {
  const gapMap: Record<DensityScale, string> = {
    compact: "4px",
    comfortable: "8px",
    spacious: "12px",
  };

  const paddingMap: Record<DensityScale, string> = {
    compact: "4px 8px",
    comfortable: "8px 12px",
    spacious: "12px 16px",
  };

  return (
    <div
      className="flex flex-col bg-muted/50 rounded-sm p-2"
      style={{ gap: gapMap[density] }}
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-muted rounded-sm"
          style={{ padding: paddingMap[density] }}
        >
          <div className="h-2 w-12 bg-foreground/20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Icon Size Preview
// ============================================================================

function IconSizePreview({ size }: { size: IconSize }) {
  const sizeMap: Record<IconSize, number> = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const iconSize = sizeMap[size];

  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <Square size={iconSize} className="text-muted-foreground" />
      <Circle size={iconSize} className="text-muted-foreground" />
      <LayoutGrid size={iconSize} className="text-muted-foreground" />
    </div>
  );
}

// ============================================================================
// Spacing Controls
// ============================================================================

export function SpacingControls() {
  const theme = useTheme();
  const spacing = theme.currentTheme.spacing;

  return (
    <div className="space-y-8">
      {/* UI Density */}
      <Section
        title="UI Density"
        description="Control the overall spacing and padding of interface elements"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="compact"
            currentValue={spacing.density}
            onChange={(v) => theme.updateSpacing({ density: v })}
            label="Compact"
            description="Fits more content"
            preview={<DensityPreview density="compact" />}
          />
          <OptionCard
            value="comfortable"
            currentValue={spacing.density}
            onChange={(v) => theme.updateSpacing({ density: v })}
            label="Comfortable"
            description="Balanced spacing"
            preview={<DensityPreview density="comfortable" />}
          />
          <OptionCard
            value="spacious"
            currentValue={spacing.density}
            onChange={(v) => theme.updateSpacing({ density: v })}
            label="Spacious"
            description="More breathing room"
            preview={<DensityPreview density="spacious" />}
          />
        </div>
      </Section>

      {/* Icon Size */}
      <Section
        title="Icon Size"
        description="Adjust the size of icons throughout the interface"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="sm"
            currentValue={spacing.iconSize}
            onChange={(v) => theme.updateSpacing({ iconSize: v })}
            label="Small"
            description="16px icons"
            preview={<IconSizePreview size="sm" />}
          />
          <OptionCard
            value="md"
            currentValue={spacing.iconSize}
            onChange={(v) => theme.updateSpacing({ iconSize: v })}
            label="Medium"
            description="20px icons"
            preview={<IconSizePreview size="md" />}
          />
          <OptionCard
            value="lg"
            currentValue={spacing.iconSize}
            onChange={(v) => theme.updateSpacing({ iconSize: v })}
            label="Large"
            description="24px icons"
            preview={<IconSizePreview size="lg" />}
          />
        </div>
      </Section>

      {/* Preview */}
      <Section title="Preview">
        <div
          className={cn(
            "p-4 bg-muted/50 rounded-md space-y-3",
            spacing.density === "compact" && "p-2 space-y-2",
            spacing.density === "spacious" && "p-6 space-y-4"
          )}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid
              className="text-foreground"
              size={
                spacing.iconSize === "sm" ? 16 : spacing.iconSize === "lg" ? 24 : 20
              }
            />
            <span className="text-sm font-medium">Sample Interface Element</span>
          </div>
          <div
            className={cn(
              "bg-card border border-border rounded-md p-3",
              spacing.density === "compact" && "p-2",
              spacing.density === "spacious" && "p-4"
            )}
          >
            <p className="text-sm text-muted-foreground">
              This preview demonstrates how the density and icon size settings
              affect the layout of interface elements.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
