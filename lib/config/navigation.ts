import {
  Home,
  BarChart3,
  FolderOpen,
  Settings,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Main navigation items
export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    isActive: true,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FileText,
  },
  {
    title: "Team",
    url: "/team",
    icon: Users,
  },
];

// Settings navigation items
export const settingsNavItems: NavItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

// Grouped navigation for the sidebar
export const navigationGroups: NavGroup[] = [
  {
    label: "Platform",
    items: mainNavItems,
  },
  {
    label: "Settings",
    items: settingsNavItems,
  },
];
