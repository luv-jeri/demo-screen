"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, ChevronUp, User2, Sparkles } from "lucide-react";

import { navigationGroups, type NavItem } from "@/lib/config/navigation";
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
} from "@/components/animate-ui/components/radix/sidebar";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header with brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/brand data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm transition-all duration-300 group-hover/brand:shadow-md group-hover/brand:scale-105">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">
                  Acme Inc
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Enterprise
                </span>
              </div>
              <Sparkles className="ml-auto size-4 text-muted-foreground/50 transition-colors group-hover/brand:text-primary" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Main content */}
      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <NavItems items={group.items} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer with user */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="group/user transition-all duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/80 text-muted-foreground shadow-sm transition-all duration-300 group-hover/user:shadow-md">
                <User2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">
                  john@acme.com
                </span>
              </div>
              <ChevronUp className="ml-auto size-4 transition-transform duration-200 group-hover/user:translate-y-[-2px]" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for quick toggle */}
      <SidebarRail />
    </Sidebar>
  );
}
