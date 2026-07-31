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
      <SidebarGroupContent className="flex flex-col gap-1.5">
        <SidebarMenu>
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
                    "h-10 rounded-xl text-[#78726A] transition-colors hover:bg-[#F2ECE1] hover:text-[#2D2926]",
                    isActive && "bg-[#F7EBE1] font-semibold text-[#DA7756] hover:bg-[#F7EBE1] hover:text-[#DA7756]"
                  )}
                >
                  <a href={item.url} className="group/nav flex items-center gap-2 px-3">
                    {item.icon && (
                      <item.icon className={cn("size-4 transition-transform group-hover/nav:scale-105", isActive ? "text-[#DA7756]" : "text-[#78726A]")} />
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
