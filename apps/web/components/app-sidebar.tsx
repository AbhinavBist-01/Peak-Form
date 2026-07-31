"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconDashboard,
  IconClipboardText,
  IconWorldSearch,
  IconCreditCard,
  IconShieldCheck,
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

const baseNavMain = [
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const navMain =
    user?.role === "admin"
      ? [
          ...baseNavMain,
          {
            title: "Admin",
            url: "/dashboard/admin",
            icon: IconShieldCheck,
          },
        ]
      : baseNavMain;
  const displayUser = {
    name: user?.fullName ?? "PeakForms user",
    email: user?.email ?? "Signed in workspace",
    avatar: "",
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-[#E5DFD5] bg-[#FAF7F2] text-[#2D2926]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-[#FAF7F2] text-[#2D2926] hover:bg-[#F2ECE1] data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <Image
                  src="/peakform-logo.svg"
                  alt="PeakForms"
                  width={32}
                  height={32}
                  className="size-7 shrink-0 opacity-90"
                />
                <span className="peak-serif text-lg font-medium tracking-tight text-[#2D2926]">
                  PeakForms
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
