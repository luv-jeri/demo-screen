"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import type { FontSizeScale, HeadingScale } from "@/lib/theme/types";

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
// Font Size Preview
// ============================================================================

function FontSizePreview({ size }: { size: FontSizeScale }) {
  const sizeMap: Record<FontSizeScale, string> = {
    small: "13px",
    medium: "15px",
    large: "17px",
  };

  return (
    <div
      className="text-foreground truncate"
      style={{ fontSize: sizeMap[size] }}
    >
      The quick brown fox
    </div>
  );
}

// ============================================================================
// Heading Scale Preview
// ============================================================================

function HeadingScalePreview({ scale }: { scale: HeadingScale }) {
  const scaleMap: Record<HeadingScale, string> = {
    compact: "1.15em",
    normal: "1.25em",
    large: "1.35em",
  };

  return (
    <div className="space-y-1">
      <div
        className="font-bold text-foreground"
        style={{ fontSize: scaleMap[scale] }}
      >
        Heading
      </div>
      <div className="text-xs text-muted-foreground">Body text</div>
    </div>
  );
}

// ============================================================================
// Typography Controls
// ============================================================================

export function TypographyControls() {
  const theme = useTheme();
  const typography = theme.currentTheme.typography;

  // Curated font pairings with web-safe fallbacks
  const fontPairings = [
    { id: "haffer", name: "Haffer", body: "var(--font-sans)", heading: "var(--font-heading)", preview: "Aa" },
    { id: "inter", name: "Inter", body: "'Inter', system-ui, sans-serif", heading: "'Inter', system-ui, sans-serif", preview: "Aa" },
    { id: "poppins", name: "Poppins", body: "'Poppins', system-ui, sans-serif", heading: "'Poppins', system-ui, sans-serif", preview: "Aa" },
    { id: "space-grotesk", name: "Space Grotesk", body: "'Space Grotesk', system-ui, sans-serif", heading: "'Space Grotesk', system-ui, sans-serif", preview: "Aa" },
    { id: "dm-sans", name: "DM Sans", body: "'DM Sans', system-ui, sans-serif", heading: "'DM Sans', system-ui, sans-serif", preview: "Aa" },
    { id: "system", name: "System UI", body: "system-ui, -apple-system, sans-serif", heading: "system-ui, -apple-system, sans-serif", preview: "Aa" },
  ];

  const currentFontId = fontPairings.find(f => f.body === typography.fontFamily)?.id || "haffer";

  return (
    <div className="space-y-8">
      {/* Font Pairing */}
      <Section
        title="Font Family"
        description="Choose a font pairing for your interface"
      >
        <div className="grid grid-cols-5 gap-2">
          {fontPairings.map((font) => (
            <button
              key={font.id}
              onClick={() => theme.updateTypography({ 
                fontFamily: font.body,
                headingFamily: font.heading 
              })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-md",
                "border transition-all duration-200",
                "cursor-pointer",
                "hover:scale-[1.02]",
                currentFontId === font.id
                  ? "border-accent bg-accent/10"
                  : "border-border bg-background hover:border-muted-foreground/30"
              )}
            >
              <span 
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: font.body }}
              >
                {font.preview}
              </span>
              <span className="text-xs text-muted-foreground">{font.name}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Font Size Scale */}
      <Section
        title="Base Font Size"
        description="Adjust the overall text size throughout the app"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="small"
            currentValue={typography.baseFontSize}
            onChange={(v) => theme.updateTypography({ baseFontSize: v })}
            label="Small"
            description="13px base"
            preview={<FontSizePreview size="small" />}
          />
          <OptionCard
            value="medium"
            currentValue={typography.baseFontSize}
            onChange={(v) => theme.updateTypography({ baseFontSize: v })}
            label="Medium"
            description="15px base"
            preview={<FontSizePreview size="medium" />}
          />
          <OptionCard
            value="large"
            currentValue={typography.baseFontSize}
            onChange={(v) => theme.updateTypography({ baseFontSize: v })}
            label="Large"
            description="17px base"
            preview={<FontSizePreview size="large" />}
          />
        </div>
      </Section>

      {/* Heading Scale */}
      <Section
        title="Heading Scale"
        description="Control the size difference between headings and body text"
      >
        <div className="grid grid-cols-3 gap-3">
          <OptionCard
            value="compact"
            currentValue={typography.headingScale}
            onChange={(v) => theme.updateTypography({ headingScale: v })}
            label="Compact"
            description="Subtle hierarchy"
            preview={<HeadingScalePreview scale="compact" />}
          />
          <OptionCard
            value="normal"
            currentValue={typography.headingScale}
            onChange={(v) => theme.updateTypography({ headingScale: v })}
            label="Normal"
            description="Balanced"
            preview={<HeadingScalePreview scale="normal" />}
          />
          <OptionCard
            value="large"
            currentValue={typography.headingScale}
            onChange={(v) => theme.updateTypography({ headingScale: v })}
            label="Large"
            description="Bold hierarchy"
            preview={<HeadingScalePreview scale="large" />}
          />
        </div>
      </Section>

      {/* Line Height */}
      <Section
        title="Line Height"
        description="Adjust the spacing between lines of text"
      >
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1.2"
            max="2"
            step="0.1"
            value={typography.lineHeight}
            onChange={(e) =>
              theme.updateTypography({ lineHeight: parseFloat(e.target.value) })
            }
            className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-accent"
          />
          <span className="text-sm font-mono text-muted-foreground w-12">
            {typography.lineHeight}
          </span>
        </div>
        <div
          className="p-4 bg-muted/50 rounded-md text-sm"
          style={{ lineHeight: typography.lineHeight }}
        >
          This is a sample paragraph that demonstrates the current line height
          setting. Notice how the spacing between these lines changes as you
          adjust the slider above.
        </div>
      </Section>

      {/* Letter Spacing */}
      <Section
        title="Letter Spacing"
        description="Adjust the spacing between characters"
      >
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "-0.02em", label: "Tight" },
            { value: "0em", label: "Normal" },
            { value: "0.02em", label: "Wide" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                theme.updateTypography({ letterSpacing: option.value })
              }
              className={cn(
                "py-3 px-4 rounded-md border transition-all duration-200",
                "cursor-pointer",
                "hover:scale-[1.02]",
                typography.letterSpacing === option.value
                  ? "border-accent bg-accent/10"
                  : "border-border bg-background hover:border-muted-foreground/30"
              )}
            >
              <span
                className="text-sm font-medium"
                style={{ letterSpacing: option.value }}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
