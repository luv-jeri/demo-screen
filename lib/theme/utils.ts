/**
 * Theme Utility Functions
 * Helpers for color conversion, contrast checking, and CSS variable mapping
 */

import type { ThemeTokens, ColorTokens } from "./types";
import {
  fontSizeValues,
  headingScaleValues,
  densityValues,
  iconSizeValues,
  radiusValues,
  shadowValues,
  borderWidthValues,
} from "./themes";

// ============================================================================
// Color Conversion Utilities
// ============================================================================

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/**
 * Convert hex color to HSL values
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

// ============================================================================
// Contrast Checking (WCAG)
// ============================================================================

/**
 * Calculate relative luminance of a color
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 */
export function checkContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  level: "AAA" | "AA" | "AA-large" | "fail";
  isAccessible: boolean;
} {
  const ratio = getContrastRatio(foreground, background);

  let level: "AAA" | "AA" | "AA-large" | "fail";
  if (ratio >= 7) {
    level = "AAA";
  } else if (ratio >= 4.5) {
    level = "AA";
  } else if (ratio >= 3) {
    level = "AA-large";
  } else {
    level = "fail";
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    isAccessible: ratio >= 4.5,
  };
}

// ============================================================================
// CSS Variable Mapping
// ============================================================================

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Convert color tokens to CSS custom properties
 */
function colorsToCSSVars(colors: ColorTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    vars[`--${camelToKebab(key)}`] = value;
  }

  return vars;
}

/**
 * Convert complete theme to CSS custom properties
 */
export function themeToCSSVars(theme: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.assign(vars, colorsToCSSVars(theme.colors));

  // Typography - Font Families
  vars["--font-family"] = theme.typography.fontFamily;
  vars["--heading-family"] = theme.typography.headingFamily;

  // Typography - Sizes and spacing
  vars["--font-size-base"] = fontSizeValues[theme.typography.baseFontSize];
  vars["--line-height-base"] = theme.typography.lineHeight.toString();
  vars["--heading-scale"] = headingScaleValues[theme.typography.headingScale].toString();
  vars["--letter-spacing"] = theme.typography.letterSpacing;

  // Spacing
  const densityConfig = densityValues[theme.spacing.density];
  vars["--spacing-unit"] = densityConfig.unit;
  vars["--spacing-gap"] = densityConfig.gap;
  vars["--icon-size"] = iconSizeValues[theme.spacing.iconSize];

  // Radius
  vars["--radius"] = radiusValues[theme.radius.scale];

  // Shadows
  const shadowConfig = shadowValues[theme.shadows.elevation];
  vars["--shadow-card"] = shadowConfig.card;
  vars["--shadow-elevated"] = shadowConfig.elevated;

  // Borders
  vars["--border-width"] = borderWidthValues[theme.borders.thickness];

  return vars;
}

/**
 * Apply theme CSS variables to document root
 */
export function applyThemeToDOM(theme: ThemeTokens): void {
  const vars = themeToCSSVars(theme);
  const root = document.documentElement;

  for (const [property, value] of Object.entries(vars)) {
    root.style.setProperty(property, value);
  }
}

/**
 * Remove theme CSS variables from document root
 */
export function removeThemeFromDOM(): void {
  const root = document.documentElement;
  root.removeAttribute("style");
}

// ============================================================================
// Local Storage Persistence
// ============================================================================

const THEME_STORAGE_KEY = "theme-customizer-v1";

/**
 * Save theme to localStorage
 */
export function saveThemeToStorage(theme: ThemeTokens): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.warn("Failed to save theme to localStorage:", error);
  }
}

/**
 * Load theme from localStorage
 */
export function loadThemeFromStorage(): ThemeTokens | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to load theme from localStorage:", error);
    return null;
  }
}

/**
 * Clear theme from localStorage
 */
export function clearThemeFromStorage(): void {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear theme from localStorage:", error);
  }
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate hex color format
 */
export function isValidHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Ensure a color is valid, return fallback if not
 */
export function sanitizeColor(color: string, fallback: string): string {
  return isValidHex(color) ? color : fallback;
}
