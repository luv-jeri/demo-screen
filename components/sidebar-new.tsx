"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Search,
  Moon,
  Sun,
  LogOut,
  CreditCard,
  Settings,
  HelpCircle,
  History,
  User2,
  X,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";
import {
  navigationGroups,
  footerNavItems,
  recentDrawers,
  currentUser,
  type NavItem,
  type NavGroup,
  type DrawerItem,
} from "@/lib/config/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_WIDTH_EXPANDED = 280;
const SIDEBAR_WIDTH_COLLAPSED = 72;

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
  expandedSections: Set<string>;
  toggleSection: (label: string) => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    () => new Set(navigationGroups.filter(g => g.defaultOpen !== false).map(g => g.label))
  );

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobile, isOpen]);

  // Keyboard shortcut: Cmd/Ctrl + B to toggle
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (isMobile) {
          setIsOpen((v) => !v);
        } else {
          setIsCollapsed((v) => !v);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  const toggleSection = React.useCallback((label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      isCollapsed,
      isMobile,
      toggle: () => (isMobile ? setIsOpen((v) => !v) : setIsCollapsed((v) => !v)),
      close: () => setIsOpen(false),
      expandedSections,
      toggleSection,
    }),
    [isOpen, isCollapsed, isMobile, expandedSections, toggleSection]
  );

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={100}>
        {children}
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

// ============================================================================
// Sidebar Trigger (Mobile)
// ============================================================================

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, isOpen, isMobile } = useSidebar();
  if (!isMobile) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={toggle}
      className={cn(
        "fixed top-4 left-4 z-50 size-11 flex items-center justify-center",
        "bg-foreground text-background rounded-sm shadow-lg",
        "hover:bg-foreground/90 active:scale-95",
        "transition-colors",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <X className="size-5" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Menu className="size-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ============================================================================
// NavItem Component with Tooltip
// ============================================================================

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
  index?: number;
}

function NavItemComponent({ item, collapsed, index = 0 }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.url;
  const Icon = item.icon;

  const content = (
    <Link
      href={item.url}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium rounded-sm",
        "transition-all duration-200 ease-out",
        collapsed && "justify-center px-2 py-2",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/80"
      )}
    >
      {/* Active indicator bar */}
      {isActive && !collapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-foreground rounded-r-full"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}

      {/* Icon */}
      <Icon
        className={cn(
          "shrink-0 transition-colors duration-200",
          collapsed ? "size-5" : "size-[18px]",
          isActive 
            ? "text-accent-foreground" 
            : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      {/* Label */}
      {!collapsed && (
        <span className="flex-1 truncate">
          {item.title}
        </span>
      )}

      {/* Badge */}
      {item.badge && !collapsed && (
        <span className="text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm">
          {item.badge}
        </span>
      )}
    </Link>
  );

  // Wrap in tooltip when collapsed
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="bg-foreground text-background">
          <span className="font-medium">{item.title}</span>
          {item.description && (
            <span className="block text-[11px] text-background/70 mt-0.5">
              {item.description}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ============================================================================
// NavGroup Component - Collapsible Section
// ============================================================================

interface NavGroupProps {
  group: NavGroup;
  collapsed: boolean;
  groupIndex: number;
}

function NavGroupComponent({ group, collapsed, groupIndex }: NavGroupProps) {
  const { expandedSections, toggleSection } = useSidebar();
  const isExpanded = expandedSections.has(group.label);
  const isCollapsible = group.collapsible !== false;

  // When sidebar is collapsed, just show nav items without section headers
  if (collapsed) {
    return (
      <div className="px-3 space-y-1">
        {group.items.map((item, i) => (
          <NavItemComponent key={item.title} item={item} collapsed={true} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="px-2">
      {/* Section Header */}
      {isCollapsible ? (
        <button
          onClick={() => toggleSection(group.label)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-sm",
            "text-[12px] font-bold text-foreground/50 uppercase tracking-[0.12em]",
            "hover:text-foreground/70 hover:bg-muted/50 transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-expanded={isExpanded}
        >
          <span className="flex-1 text-left">{group.label}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-3.5 opacity-50" />
          </motion.div>
        </button>
      ) : (
        <div className="px-3 py-2.5 text-[12px] font-bold text-foreground/50 uppercase tracking-[0.12em]">
          {group.label}
        </div>
      )}

      {/* Items */}
      <AnimatePresence initial={false}>
        {(isExpanded || !isCollapsible) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {group.items.map((item, i) => (
                <NavItemComponent
                  key={item.title}
                  item={item}
                  collapsed={false}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Recent Items Section
// ============================================================================

function RecentSection({ collapsed }: { collapsed: boolean }) {
  const { expandedSections, toggleSection } = useSidebar();
  const isExpanded = expandedSections.has("Recent");

  if (collapsed) return null;

  return (
    <div className="px-2">
      <button
        onClick={() => toggleSection("Recent")}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-sm",
          "text-[12px] font-bold text-foreground/50 uppercase tracking-[0.12em]",
          "hover:text-foreground/70 hover:bg-muted/50 transition-all duration-200"
        )}
        aria-expanded={isExpanded}
      >
        <History className="size-3.5" />
        <span className="flex-1 text-left">Recent</span>
        <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="size-3.5 opacity-50" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {recentDrawers.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/drawer/${item.id}`}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-sm",
                    "text-[14px] text-foreground/60 hover:text-foreground hover:bg-muted/80",
                    "transition-all duration-200"
                  )}
                >
                  {item.type === "chat" ? (
                    <MessageSquare className="size-4 shrink-0 opacity-50 group-hover:opacity-100" />
                  ) : (
                    <Search className="size-4 shrink-0 opacity-50 group-hover:opacity-100" />
                  )}
                  <span className="truncate">{item.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Footer Nav Item
// ============================================================================

function FooterNavItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon;
  const pathname = usePathname();
  const isActive = pathname === item.url;

  const content = (
    <Link
      href={item.url}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-sm",
        "text-[15px] font-medium transition-all duration-200",
        collapsed && "justify-center px-2 py-2",
        isActive
          ? "bg-foreground/10 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      )}
    >
      <Icon className={cn("shrink-0 transition-colors group-hover:text-foreground", collapsed ? "size-5" : "size-[18px]")} />
      {/* Only show label when expanded */}
      {!collapsed && (
        <span className="whitespace-nowrap">
          {item.title}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="bg-foreground text-background">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ============================================================================
// User Menu
// ============================================================================

function UserMenu({ collapsed }: { collapsed: boolean }) {
  const menuButton = (
    <DropdownMenuTrigger asChild>
      <button
        className={cn(
          "w-full flex items-center gap-3 p-2 rounded-sm",
          "bg-muted/60 hover:bg-muted border border-border/50",
          "transition-all duration-200 group",
          collapsed && "justify-center p-1.5"
        )}
      >
        {/* Avatar */}
        <div className={cn(
          "relative flex items-center justify-center rounded-sm bg-foreground text-background font-bold shrink-0 transition-transform group-hover:scale-105",
          collapsed ? "size-8 text-[10px]" : "size-9 text-xs"
        )}>
          {currentUser.initials}
          {/* Online dot */}
          <div className="absolute -bottom-0.5 -right-0.5 size-2 bg-accent rounded-full border-2 border-sidebar" />
        </div>

        {/* User info - only show when expanded */}
        {!collapsed && (
          <div className="flex-1 text-left min-w-0">
            <div className="text-[14px] font-semibold text-foreground truncate">
              {currentUser.name}
            </div>
            <div className="text-[12px] text-muted-foreground truncate">
              {currentUser.email}
            </div>
          </div>
        )}
      </button>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {menuButton}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="bg-foreground text-background">
            <div className="font-medium">{currentUser.name}</div>
            <div className="text-[11px] text-background/70">{currentUser.email}</div>
          </TooltipContent>
        </Tooltip>
      ) : (
        menuButton
      )}

      <DropdownMenuContent
        className="w-56 bg-card border-border"
        side="top"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-foreground text-background font-bold text-sm">
              {currentUser.initials}
            </div>
            <div>
              <div className="font-semibold text-foreground">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <User2 className="mr-2 size-4" /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="cursor-pointer">
            <CreditCard className="mr-2 size-4" /> Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive">
          <LogOut className="mr-2 size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Dark Mode Toggle
// ============================================================================

function DarkModeToggle({ collapsed }: { collapsed: boolean }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((v) => !v);
    document.documentElement.classList.toggle("dark");
  };

  const content = (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "group w-full flex items-center gap-3 px-3 py-2.5 rounded-sm",
        "text-[15px] font-medium text-foreground/60 hover:text-foreground hover:bg-muted/60",
        "transition-all duration-200",
        collapsed && "justify-center px-2 py-2"
      )}
    >
      <motion.div
        whileHover={{ rotate: 15 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {isDarkMode ? (
          <Sun className={cn("opacity-70 group-hover:opacity-100", collapsed ? "size-5" : "size-[18px]")} />
        ) : (
          <Moon className={cn("opacity-70 group-hover:opacity-100", collapsed ? "size-5" : "size-[18px]")} />
        )}
      </motion.div>

      {/* Only show label when expanded */}
      {!collapsed && (
        <span className="whitespace-nowrap">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={12} className="bg-foreground text-background">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ============================================================================
// Main Sidebar
// ============================================================================

export function AppSidebar() {
  const { isOpen, isCollapsed, isMobile, toggle, close } = useSidebar();

  const collapsed = isCollapsed && !isMobile;
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col",
          "bg-sidebar border-r border-sidebar-border",
          "transition-all duration-200 ease-out",
          isMobile
            ? cn("w-[280px]", isOpen ? "translate-x-0" : "-translate-x-full")
            : sidebarWidth
        )}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-foreground/[0.02] to-transparent pointer-events-none" />

        {/* ============ HEADER ============ */}
        <div className="relative flex items-center h-16 px-3 border-b border-sidebar-border shrink-0">
          {/* Logo Container - Fixed layout, no AnimatePresence for smoother transition */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Logo Mark with Lime accent background */}
            <div className="relative shrink-0 group">
              <div className="flex items-center justify-center size-10 bg-accent text-accent-foreground rounded-sm shadow-lg shadow-accent/40 transition-all duration-200 group-hover:shadow-xl group-hover:shadow-accent/50 group-hover:scale-105">
                <Command className="size-5" />
              </div>
            </div>

            {/* Brand Text - CSS transition instead of AnimatePresence */}
            <div 
              className={cn(
                "min-w-0 overflow-hidden transition-all duration-300 ease-out",
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              <div className="font-heading font-black text-[16px] tracking-tight text-foreground whitespace-nowrap">
                MediaVault
              </div>
              <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-[0.15em] whitespace-nowrap">
                DAM Platform
              </div>
            </div>
          </div>

          {/* Toggle Button - Simplified, no AnimatePresence */}
          {!isMobile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  className={cn(
                    "flex items-center justify-center size-7 rounded-sm transition-all duration-200",
                    "text-muted-foreground hover:text-foreground hover:bg-muted",
                    collapsed && "absolute -right-3.5 top-1/2 -translate-y-1/2 bg-sidebar border border-sidebar-border shadow-md hover:shadow-lg hover:border-accent/50"
                  )}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <ChevronLeft 
                    className={cn(
                      "size-4 transition-transform duration-300",
                      collapsed && "rotate-180"
                    )} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={collapsed ? 16 : 8}>
                {collapsed ? "Expand (⌘B)" : "Collapse (⌘B)"}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Mobile Close */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="size-8 text-muted-foreground hover:text-foreground hover:bg-accent/20 shrink-0"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* ============ NAVIGATION ============ */}
        <nav className="relative flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-none">
          <div className="space-y-2">
            {navigationGroups.map((group, idx) => (
              <NavGroupComponent
                key={group.label}
                group={group}
                collapsed={collapsed}
                groupIndex={idx}
              />
            ))}

            {/* Spacer */}
            <div className="h-2" />

            {/* Recent Section */}
            <RecentSection collapsed={collapsed} />
          </div>
        </nav>

        {/* ============ FOOTER ============ */}
        <div className="relative border-t border-sidebar-border p-2 space-y-0.5 shrink-0">
          {/* Subtle top gradient */}
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-foreground/[0.02] to-transparent pointer-events-none" />
          
          {/* Footer Nav Items */}
          {footerNavItems.map((item) => (
            <FooterNavItem key={item.title} item={item} collapsed={collapsed} />
          ))}

          {/* Dark Mode Toggle */}
          <DarkModeToggle collapsed={collapsed} />

          {/* Divider with lime accent */}
          <div className="relative h-3 my-1">
            <div className="absolute inset-x-3 top-1/2 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>

          {/* User Menu */}
          <UserMenu collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// Sidebar Inset (Main content area)
// ============================================================================

export function SidebarInset({ children }: { children: React.ReactNode }) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-200 ease-out",
        isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[280px]"
      )}
    >
      {children}
    </main>
  );
}

export { useSidebar };

