"use client";

import { usePathname } from "next/navigation";

import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";

interface SiteHeaderProps {
  title?: string;
}

function getDashboardTitle(pathname: string) {
  if (pathname.includes("/submissions")) {
    return "Submissions";
  }

  if (/^\/dashboard\/forms\/[^/]+$/.test(pathname)) {
    return "Edit form";
  }

  if (pathname.startsWith("/dashboard/forms")) {
    return "Forms";
  }

  return "Dashboard";
}

export function SiteHeader({ title }: SiteHeaderProps) {
  const pathname = usePathname();
  const resolvedTitle = title ?? getDashboardTitle(pathname);

  return (
    <header className="peak-reveal sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#c3c8c1]/55 bg-[#f9faf8]/82 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 bg-[#c3c8c1] data-[orientation=vertical]:h-4"
        />
        <h1 className="peak-serif text-lg font-semibold tracking-normal text-[#061b0e]">
          {resolvedTitle}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-md border border-[#c3c8c1]/70 bg-white/60 px-3 py-1 text-xs font-medium text-[#59645b] sm:inline-flex">
            Alpine workspace
          </span>
        </div>
      </div>
    </header>
  );
}
