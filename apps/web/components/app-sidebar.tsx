"use client";

import * as React from "react";
import {
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconSettings,
  IconClipboardText,
  IconWorldSearch,
  IconCreditCard,
} from "@tabler/icons-react";

import { NavDocuments } from "~/components/nav-documents";
import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Meeting notes",
      url: "#",
      icon: IconFileDescription,
    },
    {
      name: "Design system",
      url: "#",
      icon: IconFileAi,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
