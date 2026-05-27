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
    name: user?.fullName ?? "PeakForm user",
    email: user?.email ?? "Signed in workspace",
    avatar: "",
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="peak-reveal border-[#b4cdb8]/70 bg-[#edf7ea]/95 shadow-xl shadow-[#4c616c]/8 backdrop-blur-xl"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-sidebar-accent text-sidebar-accent-foreground shadow-sm data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <Image
                  src="/peakform-logo.svg"
                  alt="PeakForm"
                  width={32}
                  height={32}
                  className="peak-icon-breathe size-8 shrink-0 opacity-90 drop-shadow-[0_1px_4px_rgba(47,93,59,0.35)]"
                />
                <span className="peak-serif text-lg font-semibold tracking-normal text-[#2f5d3b]">PeakForm</span>
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
