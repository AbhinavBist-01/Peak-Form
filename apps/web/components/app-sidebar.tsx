"use client";

import * as React from "react";
import {
  IconDashboard,
  IconClipboardText,
  IconWorldSearch,
  IconCreditCard,
} from "@tabler/icons-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import { useUser } from "~/hooks/api/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Forms",
      url: "/dashboard/forms",
      icon: IconClipboardText,
    },
    {
      title: "Explore",
      url: "/explore",
      icon: IconWorldSearch,
    },
    {
      title: "Pricing",
      url: "/pricing",
      icon: IconCreditCard,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const displayUser = {
    name: user?.fullName ?? "PeakForm user",
    email: user?.email ?? "Signed in workspace",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-[#c3c8c1]/50 bg-[#f9faf8]/85 backdrop-blur-xl" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="/dashboard">
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#061b0e]">
                  <img src="/peakform-logo.svg" alt="PeakForm" className="size-5 invert" />
                </span>
                <span className="peak-serif text-lg font-semibold tracking-normal text-[#061b0e]">PeakForm</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
