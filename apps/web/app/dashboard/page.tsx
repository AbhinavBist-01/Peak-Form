import { AppSidebar } from "~/components/app-sidebar"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { DataTable } from "~/components/data-table"
import { SectionCards } from "~/components/section-cards"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
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
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <section className="mx-4 grid overflow-hidden rounded-xl border border-[#c3c8c1]/60 bg-white/72 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl lg:mx-6 lg:grid-cols-[1fr_24rem]">
                <div className="grid content-center gap-4 p-6 md:p-8">
                  <span className="w-fit rounded-md bg-[#d0e9d4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b2013]">
                    PeakForm command center
                  </span>
                  <div className="grid gap-2">
                    <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#061b0e] md:text-4xl">
                      Watch every form climb from draft to insight.
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-[#59645b]">
                      Manage published links, response trends, exports, and creator workflows from one calm alpine workspace.
                    </p>
                  </div>
                </div>
                <img
                  src="/peakform-builder-preview.png"
                  alt=""
                  className="hidden h-full min-h-64 w-full object-cover object-left-top lg:block"
                />
              </section>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
