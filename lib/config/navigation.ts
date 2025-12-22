import {
  Image,
  FolderOpen,
  Upload,
  MessageSquare,
  Archive,
  Settings,
  Tags,
  Search,
  Grid3X3,
  FileVideo,
  FileAudio,
  FileImage,
  File,
  Clock,
  Star,
  Trash2,
  Users,
  Share2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Mock saved chats/searches for Drawers section
export interface DrawerItem {
  id: string;
  title: string;
  type: "chat" | "search";
  timestamp: Date;
}

export const recentDrawers: DrawerItem[] = [
  { id: "1", title: "How to upload assets", type: "chat", timestamp: new Date() },
  { id: "2", title: "Brand guidelines search", type: "search", timestamp: new Date(Date.now() - 3600000) },
  { id: "3", title: "Video compression settings", type: "chat", timestamp: new Date(Date.now() - 7200000) },
  { id: "4", title: "Logo assets for Q4", type: "search", timestamp: new Date(Date.now() - 86400000) },
  { id: "5", title: "Marketing campaign images", type: "search", timestamp: new Date(Date.now() - 172800000) },
];

// Main navigation groups for DAM/MAM software
export const navigationGroups: NavGroup[] = [
  {
    label: "Library",
    items: [
      { title: "Assets", url: "/assets", icon: Image },
      { title: "Collections", url: "/collections", icon: FolderOpen },
      { title: "Upload", url: "/upload", icon: Upload },
    ],
  },
  {
    label: "Browse",
    items: [
      { title: "All Files", url: "/browse/all", icon: Grid3X3 },
      { title: "Images", url: "/browse/images", icon: FileImage },
      { title: "Videos", url: "/browse/videos", icon: FileVideo },
      { title: "Audio", url: "/browse/audio", icon: FileAudio },
      { title: "Documents", url: "/browse/documents", icon: File },
    ],
  },
  {
    label: "Organize",
    items: [
      { title: "Tags", url: "/tags", icon: Tags },
      { title: "Shared", url: "/shared", icon: Share2 },
      { title: "Team", url: "/team", icon: Users },
    ],
  },
  {
    label: "Quick Access",
    items: [
      { title: "Recent", url: "/recent", icon: Clock },
      { title: "Starred", url: "/starred", icon: Star },
      { title: "Archive", url: "/archive", icon: Archive },
      { title: "Trash", url: "/trash", icon: Trash2 },
    ],
  },
];

// Settings navigation items
export const settingsItems: NavItem[] = [
  { title: "Settings", url: "/settings", icon: Settings },
];
