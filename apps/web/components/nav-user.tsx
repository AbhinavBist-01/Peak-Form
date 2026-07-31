"use client"

import {
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { getApiOrigin } from "~/lib/api-url"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  function onLogout() {
    setIsLoggingOut(true)
    window.location.href = new URL("/auth/logout", getApiOrigin()).toString()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group/user rounded-xl border border-[#E5DFD5] bg-[#FFFDF9] shadow-xs transition hover:bg-[#F2ECE1] hover:text-[#2D2926] data-[state=open]:bg-[#F7EBE1] data-[state=open]:text-[#DA7756]"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-[#E5DFD5] bg-[#F7EBE1]">
                <AvatarFallback className="rounded-lg bg-[#F7EBE1] text-[#DA7756]">
                  <IconUserCircle className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-medium text-[#2D2926]">{user.name}</span>
                <span className="truncate text-[11px] text-[#78726A]">{user.email}</span>
              </div>
              <IconChevronUp className="ml-auto size-4 text-[#78726A] transition-transform group-data-[state=open]/user:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            sideOffset={10}
            className="w-64 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] p-2 shadow-md text-xs"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="grid gap-0.5">
                <span className="truncate text-xs font-medium text-[#2D2926]">{user.name}</span>
                <span className="truncate text-[11px] font-normal text-[#78726A]">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5DFD5]" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2 text-[#2D2926] focus:bg-[#F7EBE1] focus:text-[#DA7756]"
            >
              <Link href="/dashboard/settings">
                <IconSettings className="mr-2 size-4 text-[#78726A]" />
                User Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-[#2D2926] focus:bg-[#F7EBE1] focus:text-[#DA7756]"
              onSelect={(event) => {
                event.preventDefault()
                onLogout()
              }}
            >
              <IconLogout className="mr-2 size-4 text-[#78726A]" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
