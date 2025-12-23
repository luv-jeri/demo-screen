"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  Moon,
  Sun,
  LogOut,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FolderOpen,
  Upload,
  Image,
  Film,
  Music,
  FileText,
  Clock,
  Star,
  Archive,
  Trash2,
  Users,
  Share2,
  Tags,
  History,
  User2,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ============================================================================
// Types
// ============================================================================

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface DrawerItem {
  id: string;
  title: string;
  type: "chat" | "search";
}

// ============================================================================
// Navigation Data
// ============================================================================

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: "Library",
    items: [
      { title: "All Assets", url: "#", icon: LayoutGrid },
      { title: "Collections", url: "#", icon: FolderOpen },
      { title: "Upload", url: "#", icon: Upload },
    ],
  },
  {
    label: "Media Types",
    items: [
      { title: "Images", url: "#", icon: Image },
      { title: "Videos", url: "#", icon: Film },
      { title: "Audio", url: "#", icon: Music },
      { title: "Documents", url: "#", icon: FileText },
    ],
  },
  {
    label: "Quick Access",
    items: [
      { title: "Recent", url: "#", icon: Clock },
      { title: "Starred", url: "#", icon: Star },
      { title: "Archive", url: "#", icon: Archive },
      { title: "Trash", url: "#", icon: Trash2 },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Tags", url: "#", icon: Tags },
      { title: "Shared", url: "#", icon: Share2, badge: "3" },
      { title: "Team", url: "#", icon: Users },
    ],
  },
];

const RECENT_ITEMS: DrawerItem[] = [
  { id: "1", title: "How to upload assets", type: "chat" },
  { id: "2", title: "Brand guidelines search", type: "search" },
  { id: "3", title: "Video compression settings", type: "chat" },
  { id: "4", title: "Logo assets for Q4", type: "search" },
];

const USER_DATA = {
  name: "John Doe",
  email: "john@company.com",
  initials: "JD",
};

// ============================================================================
// Sidebar Context
// ============================================================================

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
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

  const value = React.useMemo(
    () => ({
      isOpen,
      isCollapsed,
      isMobile,
      toggle: () => (isMobile ? setIsOpen((v) => !v) : setIsCollapsed((v) => !v)),
      close: () => setIsOpen(false),
    }),
    [isOpen, isCollapsed, isMobile]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

// ============================================================================
// Sidebar Trigger (Mobile)
// ============================================================================

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle, isMobile } = useSidebar();
  if (!isMobile) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className={cn(
        "fixed top-4 left-4 z-50 size-10 shadow-md bg-card border-border",
        className
      )}
    >
      <Command className="size-5" />
    </Button>
  );
}

// ============================================================================
// Separator Component
// ============================================================================

function SidebarSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px mx-4 my-3 bg-gradient-to-r from-transparent via-border to-transparent",
        className
      )}
    />
  );
}

// ============================================================================
// NavItem Component
// ============================================================================

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.url;
  const Icon = item.icon;

  return (
    <Link
      href={item.url}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-all duration-150",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      title={collapsed ? item.title : undefined}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1">{item.title}</span>
          {item.badge && (
            <span className="text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

// ============================================================================
// Section Header Component
// ============================================================================

function SectionHeader({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-3" />;

  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-2">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

// ============================================================================
// Recent Items Section
// ============================================================================

function RecentSection({ collapsed }: { collapsed: boolean }) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (collapsed) return null;

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 pt-4 pb-2 group"
      >
        <History className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Recent
        </span>
        <div className="flex-1 h-px bg-border/60" />
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform duration-200",
            !isOpen && "-rotate-90"
          )}
        />
      </button>

      {isOpen && (
        <div className="space-y-0.5 px-2">
          {RECENT_ITEMS.map((item) => (
            <Link
              key={item.id}
              href="#"
              className="group flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {item.type === "chat" ? (
                <MessageSquare className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" />
              ) : (
                <Search className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground" />
              )}
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// User Menu
// ============================================================================

function UserMenu({ collapsed }: { collapsed: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-full flex items-center gap-3 p-2 rounded-sm transition-colors",
            "bg-muted/50 hover:bg-muted border border-border/50",
            collapsed && "justify-center p-2"
          )}
        >
          {/* Avatar with accent ring */}
          <div className="relative flex items-center justify-center size-9 rounded-sm bg-foreground text-background font-bold text-xs shrink-0">
            {USER_DATA.initials}
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-accent rounded-full border-2 border-sidebar" />
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[13px] font-semibold text-foreground truncate">
                  {USER_DATA.name}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {USER_DATA.email}
                </div>
              </div>
              <ChevronUp className="size-4 text-muted-foreground shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-card border-border"
        side="top"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-sm bg-foreground text-background font-bold text-sm">
              {USER_DATA.initials}
            </div>
            <div>
              <div className="font-semibold text-foreground">{USER_DATA.name}</div>
              <div className="text-xs text-muted-foreground">{USER_DATA.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem asChild>
          <Link href="#" className="cursor-pointer">
            <User2 className="mr-2 size-4" /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="#" className="cursor-pointer">
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
// Main Sidebar
// ============================================================================

export function AppSidebar() {
  const { isOpen, isCollapsed, isMobile, toggle, close } = useSidebar();
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode((v) => !v);
    document.documentElement.classList.toggle("dark");
  };

  const collapsed = isCollapsed && !isMobile;
  const sidebarWidth = collapsed ? "w-[72px]" : "w-[264px]";

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col",
          "bg-sidebar border-r border-sidebar-border",
          "transition-all duration-200 ease-out",
          isMobile
            ? cn("w-[280px]", isOpen ? "translate-x-0" : "-translate-x-full")
            : cn(sidebarWidth, "translate-x-0")
        )}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none" />

        {/* ============ HEADER ============ */}
        <div className="relative flex items-center h-16 px-3 border-b border-sidebar-border">
          {/* Logo - Fixed width container to prevent layout shift */}
          <div className={cn("flex items-center gap-3 min-w-0", collapsed ? "justify-center w-full" : "flex-1")}>
            {/* Icon */}
            <div className="flex items-center justify-center size-10 bg-foreground text-background rounded-sm shrink-0">
              <Command className="size-5" />
            </div>

            {/* Text - Only show when not collapsed */}
            {!collapsed && (
              <div className="min-w-0 overflow-hidden">
                <div className="font-heading font-black text-[15px] tracking-tight text-foreground truncate">
                  MediaVault
                </div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] truncate">
                  DAM Platform
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button - Separate from logo */}
          {!isMobile && !collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 ml-2"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}

          {/* Expand button when collapsed */}
          {!isMobile && collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="absolute -right-3 top-1/2 -translate-y-1/2 size-6 bg-sidebar border border-sidebar-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full shadow-sm"
            >
              <ChevronRight className="size-3" />
            </Button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="size-8 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* ============ NAVIGATION ============ */}
        <nav className="relative flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 scrollbar-none">
          {NAVIGATION_GROUPS.map((group, idx) => (
            <div key={group.label}>
              <SectionHeader label={group.label} collapsed={collapsed} />
              <div className="space-y-0.5 px-1">
                {group.items.map((item) => (
                  <NavLink key={item.title} item={item} collapsed={collapsed} />
                ))}
              </div>
              {idx < NAVIGATION_GROUPS.length - 1 && <SidebarSeparator />}
            </div>
          ))}

          <SidebarSeparator />

          {/* Recent Items */}
          <RecentSection collapsed={collapsed} />
        </nav>

        {/* ============ FOOTER ============ */}
        <div className="relative border-t border-sidebar-border p-2 space-y-0.5 bg-muted/20">
          {/* Settings */}
          <Link
            href="#"
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="size-[18px] text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Settings</span>}
          </Link>

          {/* Help */}
          <Link
            href="#"
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Help & Support" : undefined}
          >
            <HelpCircle className="size-[18px] text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span>Help & Support</span>}
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={cn(
              "group w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-[14px] font-medium transition-colors",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? (isDarkMode ? "Light Mode" : "Dark Mode") : undefined}
          >
            {isDarkMode ? (
              <Sun className="size-[18px] text-muted-foreground group-hover:text-foreground" />
            ) : (
              <Moon className="size-[18px] text-muted-foreground group-hover:text-foreground" />
            )}
            {!collapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Separator before user */}
          <div className="h-px mx-2 my-2 bg-border" />

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
        isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[264px]"
      )}
    >
      {children}
    </main>
  );
}

export { useSidebar };
