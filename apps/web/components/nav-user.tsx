"use client"

import {
  IconChevronUp,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import { useLogout } from "~/hooks/api/auth"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const router = useRouter()
  const { logoutAsync, status } = useLogout()
  const isLoggingOut = status === "pending"

  async function onLogout() {
    await logoutAsync()
    router.replace("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group/user rounded-xl border border-[#c3c8c1]/70 bg-white/72 shadow-sm transition hover:bg-[#d0e9d4]/80 hover:text-[#2f5d3b] data-[state=open]:bg-[#d0e9d4] data-[state=open]:text-[#2f5d3b]"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-[#b4cdb8] bg-[#d0e9d4]">
                <AvatarFallback className="rounded-lg bg-[#d0e9d4] text-[#2f5d3b]">
                  <IconUserCircle className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-[#2f5d3b]">{user.name}</span>
                <span className="truncate text-xs text-[#59645b]">{user.email}</span>
              </div>
              <IconChevronUp className="ml-auto size-4 text-[#59645b] transition-transform group-data-[state=open]/user:rotate-180" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            sideOffset={10}
            className="w-64 rounded-xl border-[#c3c8c1]/70 bg-white/96 p-2 shadow-xl shadow-[#4c616c]/15 backdrop-blur-xl"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <div className="grid gap-1">
                <span className="truncate text-sm font-semibold text-[#2f5d3b]">{user.name}</span>
                <span className="truncate text-xs font-normal text-[#59645b]">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#c3c8c1]/60" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg px-3 py-2 text-[#3b463d] focus:bg-[#d0e9d4]/75 focus:text-[#2f5d3b]"
            >
              <Link href="/dashboard/settings">
                <IconSettings className="size-4" />
                User settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-[#3b463d] focus:bg-[#d0e9d4]/75 focus:text-[#2f5d3b]"
              onSelect={(event) => {
                event.preventDefault()
                void onLogout()
              }}
            >
              <IconLogout className="size-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
