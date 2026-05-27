import type { CSSProperties, ReactNode } from "react";

import { AppSidebar } from "~/components/app-sidebar";
import { AuthGuard } from "~/components/auth-guard";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
