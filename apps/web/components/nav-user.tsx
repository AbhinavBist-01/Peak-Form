"use client"

import { IconUserCircle } from "@tabler/icons-react"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default hover:bg-transparent">
          <Avatar className="h-8 w-8 rounded-lg border border-[#c3c8c1] bg-[#d0e9d4]">
            <AvatarFallback className="rounded-lg bg-[#d0e9d4] text-[#061b0e]">
              <IconUserCircle className="size-4" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-[#061b0e]">{user.name}</span>
            <span className="truncate text-xs text-[#59645b]">{user.email}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
