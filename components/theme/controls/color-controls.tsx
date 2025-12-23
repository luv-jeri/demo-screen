"use client";

import * as React from "react";
import { AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../theme-provider";
import { checkContrast, isValidHex } from "@/lib/theme/utils";
import type { ColorTokens } from "@/lib/theme/types";

// ============================================================================
// Color Input Component
// ============================================================================

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  contrastWith?: string;
  helpText?: string;
}

function ColorInput({
  label,
  value,
  onChange,
  contrastWith,
  helpText,
}: ColorInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [isFocused, setIsFocused] = React.useState(false);

  // Sync input value with prop
  React.useEffect(() => {
    if (!isFocused) {
      setInputValue(value);
    }
  }, [value, isFocused]);

  // Calculate contrast if needed
  const contrast = React.useMemo(() => {
    if (!contrastWith || !isValidHex(value) || !isValidHex(contrastWith)) {
      return null;
    }
    return checkContrast(value, contrastWith);
  }, [value, contrastWith]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Ensure # prefix
    if (newValue && !newValue.startsWith("#")) {
      newValue = "#" + newValue;
    }
    
    setInputValue(newValue);
    
    // Only update if valid hex
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reset to valid value if invalid
    if (!isValidHex(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {contrast && (
          <div className="flex items-center gap-1.5">
            {contrast.isAccessible ? (
              <div className="flex items-center gap-1 text-xs text-success">
                <Check className="size-3" />
                <span>{contrast.level}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-warning">
                <AlertTriangle className="size-3" />
                <span>Low contrast ({contrast.ratio}:1)</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Color picker */}
        <label
          className={cn(
            "relative size-10 rounded-md cursor-pointer",
            "border border-border overflow-hidden",
            "transition-all duration-200",
            "hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background"
          )}
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        
        {/* Hex input */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="#000000"
          maxLength={7}
          className={cn(
            "flex-1 px-3 py-2 h-10",
            "bg-background border border-border rounded-md",
            "text-sm font-mono text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            "transition-all duration-200",
            !isValidHex(inputValue) && inputValue.length > 1 && "border-destructive"
          )}
        />
      </div>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
}

// ============================================================================
// Color Section
// ============================================================================

interface ColorSectionProps {
  title: string;
  children: React.ReactNode;
}

function ColorSection({ title, children }: ColorSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
        {title}
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

// ============================================================================
// Color Controls
// ============================================================================

export function ColorControls() {
  const theme = useTheme();
  const colors = theme.currentTheme.colors;

  const updateColor = (key: keyof ColorTokens, value: string) => {
    theme.updateColors({ [key]: value });
  };

  return (
    <div className="space-y-8">
      {/* Core Colors */}
      <ColorSection title="Core Colors">
        <ColorInput
          label="Primary"
          value={colors.primary}
          onChange={(v) => updateColor("primary", v)}
          contrastWith={colors.primaryForeground}
        />
        <ColorInput
          label="Primary Foreground"
          value={colors.primaryForeground}
          onChange={(v) => updateColor("primaryForeground", v)}
          contrastWith={colors.primary}
        />
        <ColorInput
          label="Accent"
          value={colors.accent}
          onChange={(v) => updateColor("accent", v)}
          contrastWith={colors.accentForeground}
        />
        <ColorInput
          label="Accent Foreground"
          value={colors.accentForeground}
          onChange={(v) => updateColor("accentForeground", v)}
          contrastWith={colors.accent}
        />
      </ColorSection>

      {/* Background & Surface */}
      <ColorSection title="Background & Surface">
        <ColorInput
          label="Background"
          value={colors.background}
          onChange={(v) => updateColor("background", v)}
          contrastWith={colors.foreground}
          helpText="Main app background"
        />
        <ColorInput
          label="Foreground"
          value={colors.foreground}
          onChange={(v) => updateColor("foreground", v)}
          contrastWith={colors.background}
          helpText="Default text color"
        />
        <ColorInput
          label="Card"
          value={colors.card}
          onChange={(v) => updateColor("card", v)}
          contrastWith={colors.cardForeground}
        />
        <ColorInput
          label="Border"
          value={colors.border}
          onChange={(v) => updateColor("border", v)}
        />
      </ColorSection>

      {/* Muted */}
      <ColorSection title="Muted & Secondary">
        <ColorInput
          label="Muted"
          value={colors.muted}
          onChange={(v) => updateColor("muted", v)}
          contrastWith={colors.mutedForeground}
        />
        <ColorInput
          label="Muted Foreground"
          value={colors.mutedForeground}
          onChange={(v) => updateColor("mutedForeground", v)}
          contrastWith={colors.muted}
        />
        <ColorInput
          label="Secondary"
          value={colors.secondary}
          onChange={(v) => updateColor("secondary", v)}
          contrastWith={colors.secondaryForeground}
        />
        <ColorInput
          label="Secondary Foreground"
          value={colors.secondaryForeground}
          onChange={(v) => updateColor("secondaryForeground", v)}
          contrastWith={colors.secondary}
        />
      </ColorSection>

      {/* Status Colors */}
      <ColorSection title="Status Colors">
        <ColorInput
          label="Success"
          value={colors.success}
          onChange={(v) => updateColor("success", v)}
          contrastWith={colors.successForeground}
        />
        <ColorInput
          label="Warning"
          value={colors.warning}
          onChange={(v) => updateColor("warning", v)}
          contrastWith={colors.warningForeground}
        />
        <ColorInput
          label="Destructive"
          value={colors.destructive}
          onChange={(v) => updateColor("destructive", v)}
          contrastWith={colors.destructiveForeground}
        />
        <ColorInput
          label="Info"
          value={colors.info}
          onChange={(v) => updateColor("info", v)}
          contrastWith={colors.infoForeground}
        />
      </ColorSection>
    </div>
  );
}
