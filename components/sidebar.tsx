"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  ChevronRight,
  ChevronLeft,
  User2,
  MessageSquare,
  Search,
  Moon,
  Sun,
  LogOut,
  CreditCard,
  History,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  navigationGroups,
  recentDrawers,
  settingsItems,
  type NavItem,
  type DrawerItem,
} from "@/lib/config/navigation";

// ============================================================================
// Sidebar Context - Simple, fast state management
// ============================================================================
interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  close: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

// ============================================================================
// Sidebar Provider - Handles all state
// ============================================================================
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check for mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ESC key to close on mobile
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobile, isOpen]);

  const value = React.useMemo(
    () => ({
      isOpen,
      isCollapsed,
      isMobile,
      toggle: () => isMobile ? setIsOpen((v) => !v) : setIsCollapsed((v) => !v),
      collapse: () => setIsCollapsed(true),
      expand: () => setIsCollapsed(false),
      close: () => setIsOpen(false),
    }),
    [isOpen, isCollapsed, isMobile]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// ============================================================================
// Sidebar Trigger Button - For mobile hamburger
// ============================================================================
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, isOpen, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <button
      onClick={toggle}
      className={cn(
        "fixed top-4 left-4 z-50 p-2 rounded-sm bg-background border border-border shadow-sm",
        "hover:bg-muted transition-colors duration-150",
        className
      )}
      aria-label="Toggle sidebar"
    >
      {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

// ============================================================================
// NavItem Component
// ============================================================================
function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.url;
  const Icon = item.icon;

  return (
    <Link
      href={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-sm text-[15px] font-medium transition-all duration-150",
        "hover:bg-accent/80 hover:text-accent-foreground",
        isActive
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-foreground/80 hover:text-foreground"
      )}
      title={collapsed ? item.title : undefined}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {item.badge && !collapsed && (
        <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ============================================================================
// DrawerItem Component
// ============================================================================
function DrawerItemComponent({ item, collapsed }: { item: DrawerItem; collapsed: boolean }) {
  const Icon = item.type === "chat" ? MessageSquare : Search;

  return (
    <Link
      href="#"
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all duration-150",
        "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      title={collapsed ? item.title : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );
}

// ============================================================================
// Main Sidebar Component
// ============================================================================
export function Sidebar() {
  const { isOpen, isCollapsed, isMobile, toggle, close } = useSidebar();
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode((v) => !v);
    document.documentElement.classList.toggle("dark");
  };

  const sidebarWidth = isCollapsed ? "w-16" : "w-64";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-background border-r border-border flex flex-col",
          "transition-all duration-200 ease-out",
          isMobile
            ? cn("w-72", isOpen ? "translate-x-0" : "-translate-x-full")
            : cn(sidebarWidth, "translate-x-0")
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
              <Command className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-tight">MediaVault</span>
                <span className="text-xs text-muted-foreground">DAM Platform</span>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={toggle}
              className="p-1.5 rounded-sm hover:bg-muted transition-colors duration-150"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          )}
          {isMobile && (
            <button onClick={close} className="p-1.5 rounded-sm hover:bg-muted transition-colors duration-150">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-none">
          {navigationGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <h3 className="px-3 mb-3 text-[11px] font-bold text-foreground/50 uppercase tracking-widest">
                  {group.label}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItemComponent key={item.title} item={item} collapsed={isCollapsed && !isMobile} />
                ))}
              </div>
            </div>
          ))}

          {/* Drawers Section */}
          {!isCollapsed && (
            <div className="mt-2">
              <h3 className="px-3 mb-3 text-[11px] font-bold text-foreground/50 uppercase tracking-widest flex items-center gap-2">
                <History className="size-3" />
                Recent
              </h3>
              <div className="space-y-1">
                {recentDrawers.slice(0, 5).map((item) => (
                  <DrawerItemComponent key={item.id} item={item} collapsed={false} />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3 space-y-1 shrink-0">
          {/* Settings */}
          {settingsItems.map((item) => (
            <NavItemComponent key={item.title} item={item} collapsed={isCollapsed && !isMobile} />
          ))}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all duration-150",
              "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {isDarkMode ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
            {!isCollapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* User */}
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-150",
              "hover:bg-muted cursor-pointer"
            )}
          >
            <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User2 className="size-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">John Doe</div>
                <div className="text-xs text-muted-foreground truncate">john@company.com</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// Sidebar Inset - Main content wrapper that adjusts for sidebar
// ============================================================================
export function SidebarInset({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-200 ease-out",
        isMobile ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
      )}
    >
      {children}
    </main>
  );
}

export { useSidebar };
