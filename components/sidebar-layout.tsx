"use client";

import * as React from "react";
import { motion } from "motion/react";
import { OsmoSidebar } from "@/components/osmo-sidebar";
import { TRANSITIONS } from "@/lib/motion";

// Context to share state if needed deeply, but for now passing props is fine or using this context
// We can re-export the context from here if needed.
export const SidebarContext = React.createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}>({ isCollapsed: false, setIsCollapsed: () => {} });

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Sidebar Component with State passed via Context (implicitly used inside) */}
        <OsmoSidebar />
        
        {/* Main Content Area - Animated Margin */}
        <motion.main 
          initial={false}
          animate={{ marginLeft: isCollapsed ? 80 : 260 }}
          transition={TRANSITIONS.spring}
          className="flex-1 min-h-screen relative flex flex-col will-change-[margin-left]"
        >
          <div className="flex-1 h-full w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </SidebarContext.Provider>
  );
}
