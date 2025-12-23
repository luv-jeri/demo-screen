/**
 * Theme Presets and Default Themes
 * Contains the default theme configuration and preset palettes
 */

import type { ThemeTokens, ThemePreset, ColorTokens } from "./types";

// ============================================================================
// Default Theme (Osmo Light)
// ============================================================================

export const defaultColors: ColorTokens = {
  // Core colors
  primary: "#201D1D",
  primaryForeground: "#F4F4F4",
  secondary: "#E1E1E1",
  secondaryForeground: "#201D1D",
  accent: "#A1FF62",
  accentForeground: "#101808",

  // Background & Surface
  background: "#F4F4F4",
  foreground: "#201D1D",
  card: "#FFFFFF",
  cardForeground: "#201D1D",
  popover: "#FFFFFF",
  popoverForeground: "#201D1D",

  // Muted & Border
  muted: "#EAEAEA",
  mutedForeground: "#525252",
  border: "#E1E1E1",
  input: "#E1E1E1",
  ring: "#201D1D",

  // Status colors
  destructive: "#FF4545",
  destructiveForeground: "#FFFFFF",
  success: "#22C55E",
  successForeground: "#FFFFFF",
  warning: "#F59E0B",
  warningForeground: "#FFFFFF",
  info: "#3B82F6",
  infoForeground: "#FFFFFF",

  // Sidebar
  sidebar: "#F4F4F4",
  sidebarForeground: "#201D1D",
  sidebarPrimary: "#201D1D",
  sidebarPrimaryForeground: "#F4F4F4",
  sidebarAccent: "#A1FF62",
  sidebarAccentForeground: "#101808",
  sidebarBorder: "#E1E1E1",
  sidebarRing: "#201D1D",
};

export const darkColors: ColorTokens = {
  primary: "#F4F4F4",
  primaryForeground: "#0A0A0A",
  secondary: "#262626",
  secondaryForeground: "#F4F4F4",
  accent: "#A1FF62",
  accentForeground: "#0A0A0A",

  background: "#0A0A0A",
  foreground: "#F4F4F4",
  card: "#121212",
  cardForeground: "#F4F4F4",
  popover: "#121212",
  popoverForeground: "#F4F4F4",

  muted: "#262626",
  mutedForeground: "#A1A1A1",
  border: "#262626",
  input: "#262626",
  ring: "#A1FF62",

  destructive: "#7f1d1d",
  destructiveForeground: "#F4F4F4",
  success: "#166534",
  successForeground: "#F4F4F4",
  warning: "#92400E",
  warningForeground: "#F4F4F4",
  info: "#1E40AF",
  infoForeground: "#F4F4F4",

  sidebar: "#0A0A0A",
  sidebarForeground: "#F4F4F4",
  sidebarPrimary: "#A1FF62",
  sidebarPrimaryForeground: "#0A0A0A",
  sidebarAccent: "#262626",
  sidebarAccentForeground: "#F4F4F4",
  sidebarBorder: "#262626",
  sidebarRing: "#A1FF62",
};

export const defaultTheme: ThemeTokens = {
  id: "osmo-light",
  name: "Osmo Light",
  colors: defaultColors,
  typography: {
    fontFamily: "var(--font-sans)",
    headingFamily: "var(--font-heading)",
    baseFontSize: "medium",
    headingScale: "normal",
    lineHeight: 1.6,
    letterSpacing: "0em",
  },
  spacing: {
    density: "comfortable",
    iconSize: "md",
  },
  radius: {
    scale: "sharp",
  },
  shadows: {
    elevation: "medium",
  },
  borders: {
    thickness: "normal",
  },
};

export const darkTheme: ThemeTokens = {
  ...defaultTheme,
  id: "osmo-dark",
  name: "Osmo Dark",
  colors: darkColors,
};

// ============================================================================
// Theme Presets
// ============================================================================

export const themePresets: ThemePreset[] = [
  {
    id: "osmo-light",
    name: "Osmo Light",
    description: "Clean, industrial light theme with lime accent",
    preview: {
      primary: "#201D1D",
      accent: "#A1FF62",
      background: "#F4F4F4",
    },
    tokens: { colors: defaultColors },
  },
  {
    id: "osmo-dark",
    name: "Osmo Dark",
    description: "Dark mode with vibrant lime highlights",
    preview: {
      primary: "#F4F4F4",
      accent: "#A1FF62",
      background: "#0A0A0A",
    },
    tokens: { colors: darkColors },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Calm ocean-inspired palette",
    preview: {
      primary: "#1E3A5F",
      accent: "#00D4FF",
      background: "#F0F7FF",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#1E3A5F",
        primaryForeground: "#F0F7FF",
        accent: "#00D4FF",
        accentForeground: "#0A1929",
        background: "#F0F7FF",
        foreground: "#1E3A5F",
        card: "#FFFFFF",
        muted: "#E1EBF5",
        border: "#C4D9F0",
        ring: "#00D4FF",
        sidebar: "#F0F7FF",
        sidebarForeground: "#1E3A5F",
        sidebarAccent: "#00D4FF",
        sidebarAccentForeground: "#0A1929",
        sidebarPrimary: "#1E3A5F",
        sidebarPrimaryForeground: "#F0F7FF",
        sidebarBorder: "#C4D9F0",
        sidebarRing: "#00D4FF",
      },
    },
  },
  {
    id: "forest-green",
    name: "Forest Green",
    description: "Natural, earthy green tones",
    preview: {
      primary: "#1A3C34",
      accent: "#4ADE80",
      background: "#F0F5F3",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#1A3C34",
        primaryForeground: "#F0F5F3",
        accent: "#4ADE80",
        accentForeground: "#052E16",
        background: "#F0F5F3",
        foreground: "#1A3C34",
        card: "#FFFFFF",
        muted: "#DCE8E3",
        border: "#B8D4C9",
        ring: "#4ADE80",
        sidebar: "#F0F5F3",
        sidebarForeground: "#1A3C34",
        sidebarAccent: "#4ADE80",
        sidebarAccentForeground: "#052E16",
        sidebarPrimary: "#1A3C34",
        sidebarPrimaryForeground: "#F0F5F3",
        sidebarBorder: "#B8D4C9",
        sidebarRing: "#4ADE80",
      },
    },
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    description: "Warm, inviting sunset palette",
    preview: {
      primary: "#4A2C2A",
      accent: "#FF8C42",
      background: "#FFF8F5",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#4A2C2A",
        primaryForeground: "#FFF8F5",
        accent: "#FF8C42",
        accentForeground: "#2D1810",
        background: "#FFF8F5",
        foreground: "#4A2C2A",
        card: "#FFFFFF",
        muted: "#F5E6E0",
        border: "#E8D0C5",
        ring: "#FF8C42",
        sidebar: "#FFF8F5",
        sidebarForeground: "#4A2C2A",
        sidebarAccent: "#FF8C42",
        sidebarAccentForeground: "#2D1810",
        sidebarPrimary: "#4A2C2A",
        sidebarPrimaryForeground: "#FFF8F5",
        sidebarBorder: "#E8D0C5",
        sidebarRing: "#FF8C42",
      },
    },
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    description: "Deep, luxurious purple theme",
    preview: {
      primary: "#E8E0F0",
      accent: "#A855F7",
      background: "#0F0A1A",
    },
    tokens: {
      colors: {
        ...darkColors,
        primary: "#E8E0F0",
        primaryForeground: "#0F0A1A",
        accent: "#A855F7",
        accentForeground: "#F5F0FF",
        background: "#0F0A1A",
        foreground: "#E8E0F0",
        card: "#1A1225",
        cardForeground: "#E8E0F0",
        muted: "#2A1F3D",
        mutedForeground: "#A89BC2",
        border: "#3D2D5C",
        ring: "#A855F7",
        sidebar: "#0F0A1A",
        sidebarForeground: "#E8E0F0",
        sidebarAccent: "#A855F7",
        sidebarAccentForeground: "#F5F0FF",
        sidebarPrimary: "#E8E0F0",
        sidebarPrimaryForeground: "#0F0A1A",
        sidebarBorder: "#3D2D5C",
        sidebarRing: "#A855F7",
      },
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    description: "Elegant rose gold palette",
    preview: {
      primary: "#4A3B3B",
      accent: "#E8A0A0",
      background: "#FDF8F8",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#4A3B3B",
        primaryForeground: "#FDF8F8",
        accent: "#E8A0A0",
        accentForeground: "#3D2020",
        background: "#FDF8F8",
        foreground: "#4A3B3B",
        card: "#FFFFFF",
        muted: "#F5E8E8",
        border: "#E8D0D0",
        ring: "#E8A0A0",
        sidebar: "#FDF8F8",
        sidebarForeground: "#4A3B3B",
        sidebarAccent: "#E8A0A0",
        sidebarAccentForeground: "#3D2020",
        sidebarPrimary: "#4A3B3B",
        sidebarPrimaryForeground: "#FDF8F8",
        sidebarBorder: "#E8D0D0",
        sidebarRing: "#E8A0A0",
      },
    },
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    description: "Vibrant cyberpunk theme",
    preview: {
      primary: "#00FF88",
      accent: "#FF00FF",
      background: "#0D0D0D",
    },
    tokens: {
      colors: {
        ...darkColors,
        primary: "#00FF88",
        primaryForeground: "#0D0D0D",
        accent: "#FF00FF",
        accentForeground: "#0D0D0D",
        background: "#0D0D0D",
        foreground: "#00FF88",
        card: "#1A1A1A",
        cardForeground: "#00FF88",
        muted: "#262626",
        mutedForeground: "#00CC6A",
        border: "#333333",
        ring: "#FF00FF",
        sidebar: "#0D0D0D",
        sidebarForeground: "#00FF88",
        sidebarAccent: "#FF00FF",
        sidebarAccentForeground: "#0D0D0D",
        sidebarPrimary: "#00FF88",
        sidebarPrimaryForeground: "#0D0D0D",
        sidebarBorder: "#333333",
        sidebarRing: "#FF00FF",
      },
    },
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    description: "Soft, calming lavender",
    preview: {
      primary: "#4A4A6A",
      accent: "#B8A9C9",
      background: "#F8F6FC",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#4A4A6A",
        primaryForeground: "#F8F6FC",
        accent: "#B8A9C9",
        accentForeground: "#2D2D40",
        background: "#F8F6FC",
        foreground: "#4A4A6A",
        card: "#FFFFFF",
        muted: "#EDE8F5",
        border: "#D9D0E8",
        ring: "#B8A9C9",
        sidebar: "#F8F6FC",
        sidebarForeground: "#4A4A6A",
        sidebarAccent: "#B8A9C9",
        sidebarAccentForeground: "#2D2D40",
        sidebarPrimary: "#4A4A6A",
        sidebarPrimaryForeground: "#F8F6FC",
        sidebarBorder: "#D9D0E8",
        sidebarRing: "#B8A9C9",
      },
    },
  },
  {
    id: "coffee-brown",
    name: "Coffee Brown",
    description: "Warm coffee-inspired tones",
    preview: {
      primary: "#3E2723",
      accent: "#D4A574",
      background: "#FAF6F3",
    },
    tokens: {
      colors: {
        ...defaultColors,
        primary: "#3E2723",
        primaryForeground: "#FAF6F3",
        accent: "#D4A574",
        accentForeground: "#2D1B1A",
        background: "#FAF6F3",
        foreground: "#3E2723",
        card: "#FFFFFF",
        muted: "#F0E6DE",
        border: "#E0D0C0",
        ring: "#D4A574",
        sidebar: "#FAF6F3",
        sidebarForeground: "#3E2723",
        sidebarAccent: "#D4A574",
        sidebarAccentForeground: "#2D1B1A",
        sidebarPrimary: "#3E2723",
        sidebarPrimaryForeground: "#FAF6F3",
        sidebarBorder: "#E0D0C0",
        sidebarRing: "#D4A574",
      },
    },
  },
];

// ============================================================================
// Computed Values for Scales
// ============================================================================

export const fontSizeValues: Record<string, string> = {
  small: "13px",
  medium: "15px",
  large: "17px",
};

export const lineHeightValues: Record<string, number> = {
  small: 1.5,
  medium: 1.6,
  large: 1.7,
};

export const headingScaleValues: Record<string, number> = {
  compact: 1.15,
  normal: 1.25,
  large: 1.35,
};

export const densityValues: Record<string, { unit: string; gap: string }> = {
  compact: { unit: "3px", gap: "0.5rem" },
  comfortable: { unit: "4px", gap: "1rem" },
  spacious: { unit: "6px", gap: "1.5rem" },
};

export const iconSizeValues: Record<string, string> = {
  sm: "16px",
  md: "20px",
  lg: "24px",
};

export const radiusValues: Record<string, string> = {
  sharp: "0rem",
  rounded: "0.75rem",
  pill: "1.5rem",  // Capped to prevent circle-ification; buttons use rounded-full explicitly
};

export const shadowValues: Record<string, { card: string; elevated: string }> = {
  subtle: {
    card: "0 1px 2px rgba(0,0,0,0.03)",
    elevated: "0 2px 4px rgba(0,0,0,0.05)",
  },
  medium: {
    card: "0 2px 8px rgba(0,0,0,0.06)",
    elevated: "0 4px 16px rgba(0,0,0,0.1)",
  },
  strong: {
    card: "0 4px 16px rgba(0,0,0,0.1)",
    elevated: "0 8px 32px rgba(0,0,0,0.15)",
  },
};

export const borderWidthValues: Record<string, string> = {
  thin: "0.5px",
  normal: "1px",
  thick: "2px",
};
