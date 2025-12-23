"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Box, 
  Layers, 
  Settings, 
  User,
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  FolderOpen,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TRANSITIONS } from "@/lib/motion";
import { SidebarContext } from "@/components/sidebar-layout";

// ============================================================================
// Types
// ============================================================================

type NavItem = {
  label: string;
  icon: React.ElementType;
  href?: string;
  isActive?: boolean;
  children?: NavItem[];
};

type NavGroup = {
  label?: string;
  items: NavItem[];
};

// ============================================================================
// Data
// ============================================================================

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: "Search", icon: LayoutGrid, href: "/", isActive: true },
      { label: "Chat", icon: Layers, href: "/chat" },
    ]
  },
  {
    label: "Library",
    items: [
      { 
        label: "Assets", 
        icon: Box, 
        children: [
            { label: "Images", icon: ImageIcon, href: "/assets/images" },
            { label: "Videos", icon: Video, href: "/assets/videos" },
            { label: "Audio", icon: Music, href: "/assets/audio" },
            { label: "Documents", icon: FileText, href: "/assets/documents" },
        ]
      },
      { label: "Collections", icon: FolderOpen, href: "/collections" },
    ]
  }
];

// ============================================================================
// Component
// ============================================================================

export function OsmoSidebar() {
  const { isCollapsed, setIsCollapsed } = React.useContext(SidebarContext);

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }} // Slightly wider for sub-menus
        transition={TRANSITIONS.spring}
        className="fixed inset-y-0 left-0 z-50 bg-sidebar flex flex-col shadow-2xl shadow-black/30"
      >
        {/* Header / Brand - REMOVED border-b for cleaner look */}
        <div className={cn(
            "h-20 flex items-center shrink-0 relative px-6 transition-all",
            isCollapsed ? "justify-center px-0" : "justify-between"
        )}>
           
           {/* Brand Name (Left) */}
           <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col justify-center"
                >
                    <span className="font-heading font-bold text-lg tracking-tight text-foreground leading-none">
                        Media Wale
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mt-1">
                        Workspace
                    </span>
                </motion.div>
              )}
           </AnimatePresence>

           {/* Brand Icon (Right) */}
           <div className={cn(
               "size-8 bg-foreground flex items-center justify-center rounded-lg shadow-lg shadow-white/10 transition-all duration-500",
               isCollapsed ? "scale-100" : "scale-90"
           )}>
              <span className="text-background font-black text-sm relative top-px">M</span>
           </div>
        </div>

        {/* Toggle Button - Floating on Border */}
         <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-24 bg-sidebar border border-sidebar-border rounded-full p-1.5 text-muted-foreground hover:text-foreground transition-colors z-50 shadow-md transform hover:scale-110 active:scale-95"
          >
            <ChevronLeft className={cn("size-3 transition-transform duration-500", isCollapsed && "rotate-180")} />
         </button>

        {/* Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-8 scrollbar-hide mask-gradient-y">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.label && !isCollapsed && (
                <motion.h4 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-2 truncate"
                >
                  {group.label}
                </motion.h4>
              )}
              {group.items.map((item) => (
                <SidebarItem key={item.label} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          ))}
        </div>

        {/* Footer - Settings & Profile */}
        <div className="p-4 bg-transparent space-y-2">
          {/* Settings Button */}
          <button className={cn(
            "flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 group text-left border border-transparent hover:border-white/5",
            isCollapsed && "justify-center p-2"
          )}>
            <Settings className="size-4 text-muted-foreground group-hover:text-white transition-colors" />
            {!isCollapsed && (
              <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">Settings</span>
            )}
          </button>

          {/* User Profile */}
          <button className={cn(
            "flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 group text-left border border-transparent hover:border-white/5",
            isCollapsed && "justify-center p-0 size-11 rounded-full"
          )}>
            <div className="size-9 rounded-full bg-linear-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors shrink-0 shadow-inner">
               <User className="size-4" />
            </div>
            
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground group-hover:text-white transition-colors truncate">
                  Admin User
                </p>
                <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] text-muted-foreground truncate">Online</p>
                </div>
              </motion.div>
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

// ============================================================================
// Sidebar Item (Recursive with Tree Guides)
// ============================================================================

function SidebarItem({ item, isCollapsed, level = 0 }: { item: NavItem, isCollapsed: boolean, level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasCb = !!item.children?.length;
  
  // Auto-close sub-menus when sidebar collapses
  React.useEffect(() => {
    if (isCollapsed) setIsOpen(false);
  }, [isCollapsed]);

  const ItemIcon = item.icon;

  const content = (
    <div className="relative group/item">
     <Button
      variant="ghost"
      onClick={() => hasCb ? setIsOpen(!isOpen) : undefined}
      className={cn(
        "w-full h-9 relative flex items-center transition-all duration-200 mb-0.5",
        isCollapsed ? "justify-center px-0 w-10 mx-auto" : "justify-between px-2",
        item.isActive && !hasCb
          ? "bg-accent/10 text-accent font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
         // Different styling for nested items to look like "leaves"
         level > 0 && "text-sm h-8 font-normal" 
      )}
     >
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
          {/* Tree Connector (Horizontal) for Levels > 0 */}
          {level > 0 && !isCollapsed && (
              <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-3 h-px bg-sidebar-border" />
          )}

          <ItemIcon className={cn(
            "transition-colors shrink-0",
             level === 0 ? "size-[18px]" : "size-4 opacity-70", // Smaller icon for children
            !isCollapsed && level === 0 && "mr-1",
            item.isActive ? "text-accent" : "group-hover/item:text-foreground"
          )} />
          
          {!isCollapsed && (
            <span className="truncate transition-colors">
              {item.label}
            </span>
          )}
      </div>

      {/* Sub-menu Toggle Icon - ChevronRight/Down */}
      {!isCollapsed && hasCb && (
          <div className="text-muted-foreground/30">
            {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </div>
      )}

      {/* Active Indicator Strip (Top Level) */}
      {item.isActive && !isCollapsed && level === 0 && (
          <motion.div 
            layoutId="active-strip"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] bg-accent rounded-r-full"
          />
      )}
     </Button>

     {/* Sub Menu Animation with Tree Guide Line */}
      <AnimatePresence>
        {!isCollapsed && isOpen && hasCb && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="overflow-hidden relative ml-[11px] pl-3" // Indent container
            >
                {/* Vertical Tree Guide Line */}
                <div className="absolute left-0 top-0 bottom-2 w-px bg-sidebar-border/60" />

                <div className="py-1">
                    {item.children!.map((subItem) => (
                        <SidebarItem 
                            key={subItem.label} 
                            item={subItem} 
                            isCollapsed={isCollapsed} 
                            level={level + 1} 
                        />
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-zinc-900 border-white/10 text-white font-medium ml-4 shadow-xl z-60">
          {item.label}
          {hasCb && <span className="text-[10px] text-muted-foreground ml-2">(Group)</span>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
