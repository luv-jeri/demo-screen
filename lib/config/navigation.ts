import {
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
  Settings,
  HelpCircle,
  MessageSquare,
  Search,
  type LucideIcon,
} from "lucide-react";

// ============================================================================
// Type Definitions
// ============================================================================

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  icon?: LucideIcon;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export interface DrawerItem {
  id: string;
  title: string;
  type: "chat" | "search";
  timestamp: Date;
}

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

// ============================================================================
// User Data
// ============================================================================

export const currentUser: UserData = {
  name: "John Doe",
  email: "john@company.com",
  initials: "JD",
};

// ============================================================================
// Navigation Groups - Organized by user workflow
// ============================================================================

export const navigationGroups: NavGroup[] = [
  {
    label: "Library",
    collapsible: false,
    defaultOpen: true,
    items: [
      {
        title: "All Assets",
        url: "/assets",
        icon: LayoutGrid,
        description: "Browse your entire media library",
      },
      {
        title: "Collections",
        url: "/collections",
        icon: FolderOpen,
        description: "Organized asset collections",
      },
      {
        title: "Upload",
        url: "/upload",
        icon: Upload,
        description: "Add new media to your library",
      },
    ],
  },
  {
    label: "Media Types",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Images",
        url: "/browse/images",
        icon: Image,
      },
      {
        title: "Videos",
        url: "/browse/videos",
        icon: Film,
      },
      {
        title: "Audio",
        url: "/browse/audio",
        icon: Music,
      },
      {
        title: "Documents",
        url: "/browse/documents",
        icon: FileText,
      },
    ],
  },
  {
    label: "Quick Access",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Recent",
        url: "/recent",
        icon: Clock,
      },
      {
        title: "Starred",
        url: "/starred",
        icon: Star,
      },
      {
        title: "Archive",
        url: "/archive",
        icon: Archive,
      },
      {
        title: "Trash",
        url: "/trash",
        icon: Trash2,
      },
    ],
  },
  {
    label: "Workspace",
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        title: "Tags",
        url: "/tags",
        icon: Tags,
      },
      {
        title: "Shared",
        url: "/shared",
        icon: Share2,
        badge: "3",
      },
      {
        title: "Team",
        url: "/team",
        icon: Users,
      },
    ],
  },
];

// ============================================================================
// Footer Navigation Items
// ============================================================================

export const footerNavItems: NavItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/help",
    icon: HelpCircle,
  },
];

// ============================================================================
// Recent Drawers - Saved Chats & Searches
// ============================================================================

export const recentDrawers: DrawerItem[] = [
  {
    id: "1",
    title: "How to upload assets",
    type: "chat",
    timestamp: new Date(),
  },
  {
    id: "2",
    title: "Brand guidelines search",
    type: "search",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    title: "Video compression settings",
    type: "chat",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "4",
    title: "Logo assets for Q4",
    type: "search",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "5",
    title: "Marketing campaign images",
    type: "search",
    timestamp: new Date(Date.now() - 172800000),
  },
];

// For backwards compatibility
export const settingsItems = footerNavItems.filter(
  (item) => item.title === "Settings"
);
