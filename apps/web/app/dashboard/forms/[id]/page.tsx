import * as React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Button } from "~/components/ui/button";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Edit form" />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-normal">Edit form</h2>
                <p className="text-sm text-muted-foreground">Form ID: {id}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard/forms">
                  <ArrowLeftIcon />
                  Back to forms
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-dashed p-8">
              <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                <h3 className="text-base font-medium">Form editor</h3>
                <p className="text-sm text-muted-foreground">
                  Add fields and editor controls here after the form update API is ready.
                </p>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
