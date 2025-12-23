/**
 * Theme Token Types
 * Centralized type definitions for the theme customization system
 */

// ============================================================================
// Color Tokens
// ============================================================================

export interface ColorTokens {
  // Core colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;

  // Background & Surface
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;

  // Muted & Border
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;

  // Status colors
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;

  // Sidebar specific
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

// ============================================================================
// Typography Tokens
// ============================================================================

export type FontSizeScale = "small" | "medium" | "large";
export type HeadingScale = "compact" | "normal" | "large";

export interface TypographyTokens {
  fontFamily: string;
  headingFamily: string;
  baseFontSize: FontSizeScale;
  headingScale: HeadingScale;
  lineHeight: number;
  letterSpacing: string;
}

// ============================================================================
// Spacing Tokens
// ============================================================================

export type DensityScale = "compact" | "comfortable" | "spacious";
export type IconSize = "sm" | "md" | "lg";

export interface SpacingTokens {
  density: DensityScale;
  iconSize: IconSize;
}

// ============================================================================
// Radius Tokens
// ============================================================================

export type RadiusScale = "sharp" | "rounded" | "pill";

export interface RadiusTokens {
  scale: RadiusScale;
}

// ============================================================================
// Shadow Tokens
// ============================================================================

export type ShadowIntensity = "subtle" | "medium" | "strong";

export interface ShadowTokens {
  elevation: ShadowIntensity;
}

// ============================================================================
// Border Tokens
// ============================================================================

export type BorderThickness = "thin" | "normal" | "thick";

export interface BorderTokens {
  thickness: BorderThickness;
}

// ============================================================================
// Complete Theme Interface
// ============================================================================

export interface ThemeTokens {
  id: string;
  name: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
}

// ============================================================================
// Theme Presets
// ============================================================================

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
  };
  tokens: Partial<ThemeTokens>;
}

// ============================================================================
// Theme Context State
// ============================================================================

export interface ThemeState {
  currentTheme: ThemeTokens;
  isDirty: boolean;
  isLoading: boolean;
}

export interface ThemeActions {
  updateColors: (colors: Partial<ColorTokens>) => void;
  updateTypography: (typography: Partial<TypographyTokens>) => void;
  updateSpacing: (spacing: Partial<SpacingTokens>) => void;
  updateRadius: (radius: Partial<RadiusTokens>) => void;
  updateShadows: (shadows: Partial<ShadowTokens>) => void;
  updateBorders: (borders: Partial<BorderTokens>) => void;
  applyPreset: (presetId: string) => void;
  resetToDefault: () => void;
  saveTheme: () => void;
}

export type ThemeContextValue = ThemeState & ThemeActions;
