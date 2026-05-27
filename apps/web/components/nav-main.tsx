"use client"

import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { cn } from "~/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="peak-stagger">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url))

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  asChild
                  className={cn(
                    "peak-lift h-10 rounded-lg text-[#59645b] transition-colors hover:bg-[#d0e9d4]/70 hover:text-[#2f5d3b]",
                    isActive && "bg-[#d0e9d4] font-semibold text-[#2f5d3b] shadow-sm"
                  )}
                >
                  <a href={item.url} className="group/nav">
                    {item.icon && (
                      <item.icon className="transition-transform group-hover/nav:scale-110" />
                    )}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
