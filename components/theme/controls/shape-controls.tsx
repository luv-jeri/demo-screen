"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import type {
  RadiusScale,
  ShadowIntensity,
  BorderThickness,
} from "@/lib/theme/types";

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
// Radius Preview
// ============================================================================

function RadiusPreview({ scale }: { scale: RadiusScale }) {
  const radiusMap: Record<RadiusScale, string> = {
    sharp: "0px",
    rounded: "8px",
    pill: "9999px",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className="size-10 bg-primary"
        style={{ borderRadius: radiusMap[scale] }}
      />
      <div
        className="w-16 h-8 bg-primary"
        style={{ borderRadius: radiusMap[scale] }}
      />
    </div>
  );
}

// ============================================================================
// Shadow Preview
// ============================================================================

function ShadowPreview({ intensity }: { intensity: ShadowIntensity }) {
  const shadowMap: Record<ShadowIntensity, string> = {
    subtle: "0 1px 2px rgba(0,0,0,0.05)",
    medium: "0 4px 12px rgba(0,0,0,0.1)",
    strong: "0 8px 24px rgba(0,0,0,0.2)",
  };

  return (
    <div className="flex items-center justify-center py-3">
      <div
        className="w-16 h-10 bg-card border border-border rounded-md"
        style={{ boxShadow: shadowMap[intensity] }}
      />
    </div>
  );
}

// ============================================================================
// Border Preview
// ============================================================================

function BorderPreview({ thickness }: { thickness: BorderThickness }) {
  const widthMap: Record<BorderThickness, string> = {
    thin: "0.5px",
    normal: "1px",
    thick: "2px",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className="size-10 bg-transparent rounded-md"
        style={{
          border: `${widthMap[thickness]} solid currentColor`,
          color: "var(--border)",
        }}
      />
      <div
        className="w-16 h-8 bg-transparent rounded-md"
        style={{
          border: `${widthMap[thickness]} solid currentColor`,
          color: "var(--border)",
        }}
      />
    </div>
  );
}

// ============================================================================
// Shape Controls
// ============================================================================

export function ShapeControls() {
  const theme = useTheme();
  const { radius, shadows, borders } = theme.currentTheme;

  return (
    <div className="space-y-8">
      {/* Border Radius */}
      <Section
        title="Border Radius"
        description="Control the roundness of corners throughout the interface"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="sharp"
            currentValue={radius.scale}
            onChange={(v) => theme.updateRadius({ scale: v })}
            label="Sharp"
            description="No rounding"
            preview={<RadiusPreview scale="sharp" />}
          />
          <OptionCard
            value="rounded"
            currentValue={radius.scale}
            onChange={(v) => theme.updateRadius({ scale: v })}
            label="Rounded"
            description="Subtle curves"
            preview={<RadiusPreview scale="rounded" />}
          />
          <OptionCard
            value="pill"
            currentValue={radius.scale}
            onChange={(v) => theme.updateRadius({ scale: v })}
            label="Pill"
            description="Fully rounded"
            preview={<RadiusPreview scale="pill" />}
          />
        </div>
      </Section>

      {/* Shadow Intensity */}
      <Section
        title="Shadow Intensity"
        description="Adjust the depth and prominence of shadows"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="subtle"
            currentValue={shadows.elevation}
            onChange={(v) => theme.updateShadows({ elevation: v })}
            label="Subtle"
            description="Minimal depth"
            preview={<ShadowPreview intensity="subtle" />}
          />
          <OptionCard
            value="medium"
            currentValue={shadows.elevation}
            onChange={(v) => theme.updateShadows({ elevation: v })}
            label="Medium"
            description="Balanced depth"
            preview={<ShadowPreview intensity="medium" />}
          />
          <OptionCard
            value="strong"
            currentValue={shadows.elevation}
            onChange={(v) => theme.updateShadows({ elevation: v })}
            label="Strong"
            description="Prominent depth"
            preview={<ShadowPreview intensity="strong" />}
          />
        </div>
      </Section>

      {/* Border Thickness */}
      <Section
        title="Border Thickness"
        description="Control the weight of border lines"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="thin"
            currentValue={borders.thickness}
            onChange={(v) => theme.updateBorders({ thickness: v })}
            label="Thin"
            description="0.5px borders"
            preview={<BorderPreview thickness="thin" />}
          />
          <OptionCard
            value="normal"
            currentValue={borders.thickness}
            onChange={(v) => theme.updateBorders({ thickness: v })}
            label="Normal"
            description="1px borders"
            preview={<BorderPreview thickness="normal" />}
          />
          <OptionCard
            value="thick"
            currentValue={borders.thickness}
            onChange={(v) => theme.updateBorders({ thickness: v })}
            label="Thick"
            description="2px borders"
            preview={<BorderPreview thickness="thick" />}
          />
        </div>
      </Section>

      {/* Combined Preview */}
      <Section title="Combined Preview">
        <div className="p-4 bg-muted/30 rounded-md">
          <div
            className="bg-card p-4 space-y-3"
            style={{
              borderRadius:
                radius.scale === "sharp"
                  ? "0px"
                  : radius.scale === "rounded"
                  ? "8px"
                  : "16px",
              boxShadow:
                shadows.elevation === "subtle"
                  ? "0 1px 2px rgba(0,0,0,0.05)"
                  : shadows.elevation === "strong"
                  ? "0 8px 24px rgba(0,0,0,0.15)"
                  : "0 4px 12px rgba(0,0,0,0.1)",
              border: `${
                borders.thickness === "thin"
                  ? "0.5px"
                  : borders.thickness === "thick"
                  ? "2px"
                  : "1px"
              } solid var(--border)`,
            }}
          >
            <div className="text-sm font-semibold">Sample Card</div>
            <p className="text-xs text-muted-foreground">
              This preview combines your selected border radius, shadow intensity,
              and border thickness settings.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium"
                style={{
                  borderRadius:
                    radius.scale === "sharp"
                      ? "0px"
                      : radius.scale === "rounded"
                      ? "4px"
                      : "9999px",
                }}
              >
                Button
              </button>
              <button
                className="px-4 py-2 bg-transparent text-foreground text-xs font-medium"
                style={{
                  borderRadius:
                    radius.scale === "sharp"
                      ? "0px"
                      : radius.scale === "rounded"
                      ? "4px"
                      : "9999px",
                  border: `${
                    borders.thickness === "thin"
                      ? "0.5px"
                      : borders.thickness === "thick"
                      ? "2px"
                      : "1px"
                  } solid var(--border)`,
                }}
              >
                Outline
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
