"use client";

import * as React from "react";
import type {
  ThemeTokens,
  ThemeContextValue,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  BorderTokens,
} from "@/lib/theme/types";
import { defaultTheme, themePresets } from "@/lib/theme/themes";
import {
  applyThemeToDOM,
  saveThemeToStorage,
  loadThemeFromStorage,
  clearThemeFromStorage,
} from "@/lib/theme/utils";

// ============================================================================
// Context
// ============================================================================

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeTokens;
}

// ============================================================================
// Provider Component
// ============================================================================

export function ThemeProvider({
  children,
  defaultTheme: initialTheme = defaultTheme,
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeTokens>(initialTheme);
  const [savedTheme, setSavedTheme] = React.useState<ThemeTokens>(initialTheme);
  const [isLoading, setIsLoading] = React.useState(true);

  // Calculate if theme has unsaved changes
  const isDirty = React.useMemo(() => {
    return JSON.stringify(currentTheme) !== JSON.stringify(savedTheme);
  }, [currentTheme, savedTheme]);

  // Load theme from storage on mount
  React.useEffect(() => {
    const storedTheme = loadThemeFromStorage();
    console.log("[ThemeProvider] Loading from storage:", storedTheme?.id);
    if (storedTheme) {
      setCurrentTheme(storedTheme);
      setSavedTheme(storedTheme);
    }
    setIsLoading(false);
  }, []);

  // Apply theme to DOM whenever it changes
  React.useEffect(() => {
    if (!isLoading) {
      console.log("[ThemeProvider] Applying theme:", currentTheme.id);
      applyThemeToDOM(currentTheme);
      
      // Toggle dark mode class based on theme
      const isDarkTheme = currentTheme.id.includes("dark") || 
                          currentTheme.id === "midnight-purple" ||
                          currentTheme.colors.background.toLowerCase().startsWith("#0") ||
                          currentTheme.colors.background.toLowerCase().startsWith("#1");
      
      if (isDarkTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [currentTheme, isLoading]);

  // ============================================================================
  // Actions
  // ============================================================================

  const updateColors = React.useCallback((colors: Partial<ColorTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  }, []);

  const updateTypography = React.useCallback((typography: Partial<TypographyTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }));
  }, []);

  const updateSpacing = React.useCallback((spacing: Partial<SpacingTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      spacing: { ...prev.spacing, ...spacing },
    }));
  }, []);

  const updateRadius = React.useCallback((radius: Partial<RadiusTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      radius: { ...prev.radius, ...radius },
    }));
  }, []);

  const updateShadows = React.useCallback((shadows: Partial<ShadowTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      shadows: { ...prev.shadows, ...shadows },
    }));
  }, []);

  const updateBorders = React.useCallback((borders: Partial<BorderTokens>) => {
    setCurrentTheme((prev) => ({
      ...prev,
      borders: { ...prev.borders, ...borders },
    }));
  }, []);

  const applyPreset = React.useCallback((presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentTheme((prev) => ({
        ...prev,
        ...preset.tokens,
        id: preset.id,
        name: preset.name,
        colors: {
          ...prev.colors,
          ...(preset.tokens.colors || {}),
        },
      }));
    }
  }, []);

  const resetToDefault = React.useCallback(() => {
    setCurrentTheme(initialTheme);
    clearThemeFromStorage();
    setSavedTheme(initialTheme);
  }, [initialTheme]);

  const saveTheme = React.useCallback(() => {
    console.log("[ThemeProvider] Saving theme:", currentTheme.id);
    saveThemeToStorage(currentTheme);
    setSavedTheme(currentTheme);
  }, [currentTheme]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: ThemeContextValue = React.useMemo(
    () => ({
      currentTheme,
      isDirty,
      isLoading,
      updateColors,
      updateTypography,
      updateSpacing,
      updateRadius,
      updateShadows,
      updateBorders,
      applyPreset,
      resetToDefault,
      saveTheme,
    }),
    [
      currentTheme,
      isDirty,
      isLoading,
      updateColors,
      updateTypography,
      updateSpacing,
      updateRadius,
      updateShadows,
      updateBorders,
      applyPreset,
      resetToDefault,
      saveTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ============================================================================
// Export Presets for convenience
// ============================================================================

export { themePresets } from "@/lib/theme/themes";
