import { Skeleton } from "~/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
      <section className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs">
        <div className="space-y-3">
          <Skeleton className="h-6 w-36 rounded-md bg-[#E5DFD5]/60" />
          <Skeleton className="h-10 w-48 bg-[#E5DFD5]/60" />
          <Skeleton className="h-4 w-full max-w-xl bg-[#E5DFD5]/40" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`metric-loading-${index}`} className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-[#E5DFD5]/60" />
              <Skeleton className="h-8 w-16 bg-[#E5DFD5]/60" />
            </div>
            <Skeleton className="size-10 rounded-xl bg-[#E5DFD5]/40" />
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-4">
          <Skeleton className="h-6 w-32 bg-[#E5DFD5]/60" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`row-loading-${index}`} className="h-16 w-full rounded-xl bg-[#E5DFD5]/40" />
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4 claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-3">
          <Skeleton className="h-6 w-32 bg-[#E5DFD5]/60" />
          <Skeleton className="h-32 w-full rounded-xl bg-[#E5DFD5]/40" />
        </aside>
      </section>
    </div>
  );
}
