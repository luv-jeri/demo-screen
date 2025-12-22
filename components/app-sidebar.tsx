"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Command,
  ChevronUp,
  ChevronDown,
  User2,
  MessageSquare,
  Search,
  Moon,
  Sun,
  LogOut,
  CreditCard,
  History,
  PanelLeftClose,
} from "lucide-react";

import {
  navigationGroups,
  recentDrawers,
  type NavItem,
  type DrawerItem,
} from "@/lib/config/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function NavItems({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = pathname === item.url;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              className="group/nav-item transition-all duration-200"
            >
              <Link href={item.url}>
                <item.icon className="transition-transform duration-200 group-hover/nav-item:scale-110" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function DrawerItems({ items }: { items: DrawerItem[] }) {
  return (
    <SidebarMenu>
      {items.slice(0, 5).map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            tooltip={item.title}
            className="group/drawer-item transition-all duration-200"
          >
            <Link href={`/drawer/${item.id}`}>
              {item.type === "chat" ? (
                <MessageSquare className="size-4 text-muted-foreground" />
              ) : (
                <Search className="size-4 text-muted-foreground" />
              )}
              <span className="truncate text-sm">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

// Collapsible navigation group
function CollapsibleNavGroup({
  label,
  items,
  defaultOpen = true,
}: {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarGroup className="py-1">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors flex items-center justify-between pr-2">
            <span>{label}</span>
            <ChevronDown
              className={`size-3 transition-transform duration-200 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <NavItems items={items} />
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { toggleSidebar, state } = useSidebar();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with brand and close button */}
      <SidebarHeader className="flex-row items-center justify-between">
        <SidebarMenu className="flex-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/brand data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm transition-all duration-300 group-hover/brand:shadow-md group-hover/brand:scale-105">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">
                  MediaVault
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  DAM Platform
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Close/Toggle Button - only visible when expanded */}
        {state === "expanded" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="size-8 shrink-0"
          >
            <PanelLeftClose className="size-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      {/* Main navigation with collapsible groups - no scrollbar */}
      <SidebarContent className="scrollbar-none overflow-y-auto">
        {navigationGroups.map((group, index) => (
          <CollapsibleNavGroup
            key={group.label}
            label={group.label}
            items={group.items}
            defaultOpen={index < 2} // Only first 2 groups open by default
          />
        ))}

        <SidebarSeparator className="mx-2" />

        {/* Drawers - Saved Chats & Searches (collapsible) */}
        <Collapsible defaultOpen>
          <SidebarGroup className="py-1">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors flex items-center gap-2 justify-between pr-2">
                <span className="flex items-center gap-2">
                  <History className="size-3" />
                  Drawers
                </span>
                <ChevronDown className="size-3 transition-transform duration-200 [[data-state=closed]_&]:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <DrawerItems items={recentDrawers} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      {/* Footer with user dropdown and dark mode toggle */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Dark Mode Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleDarkMode}
              tooltip={isDarkMode ? "Light mode" : "Dark mode"}
              className="group/theme transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Account Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group/user transition-all duration-200"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-muted to-muted/80 text-muted-foreground shadow-sm transition-all duration-300 group-hover/user:shadow-md">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">John Doe</span>
                    <span className="truncate text-xs text-muted-foreground">
                      john@company.com
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 transition-transform duration-200 group-hover/user:translate-y-[-2px]" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side="top"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      john@company.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User2 className="mr-2 size-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing">
                    <CreditCard className="mr-2 size-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for quick toggle */}
      <SidebarRail />
    </Sidebar>
  );
}
