"use client";

import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  AppSidebar,
} from "@/components/sidebar-new";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { FloatingThemeButton } from "@/components/theme/floating-theme-button";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <SidebarInset>
            <div className="relative flex flex-1 flex-col min-h-screen bg-background">
              {/* Aceternity Grid Background - uses theme colors */}
              <div
                className="absolute inset-0 [background-size:40px_40px]"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
                  opacity: 0.5,
                }}
              />
              {/* Radial gradient mask for faded look */}
              <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col gap-4 p-4 md:p-6">
                {children}
              </div>
            </div>
          </SidebarInset>

          {/* Floating Theme Button */}
          <FloatingThemeButton />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

