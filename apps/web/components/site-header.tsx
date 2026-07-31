"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import { DashboardCreateModal } from "~/components/dashboard-create-modal";

interface SiteHeaderProps {
  title?: string;
}

function getDashboardTitle(pathname: string) {
  if (pathname.includes("/submissions")) {
    return "Submissions";
  }

  if (/^\/dashboard\/forms\/[^/]+$/.test(pathname)) {
    return "Edit Form";
  }

  if (pathname.startsWith("/dashboard/forms")) {
    return "Forms";
  }

  if (pathname.startsWith("/dashboard/admin")) {
    return "Admin Workspace";
  }

  return "Dashboard";
}

export function SiteHeader({ title }: SiteHeaderProps) {
  const pathname = usePathname();
  const resolvedTitle = title ?? getDashboardTitle(pathname);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#E5DFD5] bg-[#FAF7F2]/90 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1 text-[#2D2926]" />
          <Separator
            orientation="vertical"
            className="mx-2 bg-[#E5DFD5] data-[orientation=vertical]:h-4"
          />
          <h1 className="peak-serif text-lg font-medium tracking-tight text-[#2D2926]">
            {resolvedTitle}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-lg border border-[#E5DFD5] bg-[#FFFDF9] px-3 py-1 text-xs font-medium text-[#78726A] sm:inline-flex">
              PeakForms Workspace
            </span>
            <Button
              type="button"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="claude-button rounded-xl bg-[#DA7756] px-3.5 text-xs font-medium text-white hover:bg-[#C66545]"
            >
              <PlusIcon className="mr-1 size-3.5" />
              <span>Create Form</span>
            </Button>
          </div>
        </div>
      </header>

      <DashboardCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </>
  );
}
