import { Skeleton } from "~/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="@container/main peak-topography flex flex-1 flex-col gap-5 p-4 md:p-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl md:p-6">
          <div className="grid gap-3">
            <Skeleton className="h-6 w-36 rounded-full bg-[#d0e9d4]/70" />
            <Skeleton className="h-10 w-48 bg-[#d0e9d4]/70" />
            <Skeleton className="h-4 w-full max-w-xl bg-[#edf1ec]" />
            <Skeleton className="h-4 w-4/5 max-w-lg bg-[#edf1ec]" />
          </div>
        </div>
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-[#2f5d3b]/85 p-5 shadow-xl shadow-[#2f5d3b]/15">
          <Skeleton className="mb-4 h-4 w-24 bg-white/20" />
          <Skeleton className="mb-3 h-7 w-52 bg-white/25" />
          <Skeleton className="h-10 w-full bg-white/25" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`metric-loading-${index}`} className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-4 shadow-lg shadow-[#4c616c]/8 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28 bg-[#edf1ec]" />
              <Skeleton className="size-9 bg-[#d0e9d4]/70" />
            </div>
            <Skeleton className="h-9 w-16 bg-[#d0e9d4]/70" />
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
          <Skeleton className="mb-5 h-5 w-32 bg-[#d0e9d4]/70" />
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`row-loading-${index}`} className="rounded-lg border border-[#c3c8c1]/45 bg-white/70 p-4">
                <Skeleton className="mb-2 h-4 w-1/3 bg-[#d0e9d4]/70" />
                <Skeleton className="h-3 w-2/3 bg-[#edf1ec]" />
              </div>
            ))}
          </div>
        </div>
        <aside className="grid content-start gap-4">
          <Skeleton className="h-48 rounded-xl bg-white/82" />
          <Skeleton className="h-40 rounded-xl bg-white/82" />
        </aside>
      </section>
    </div>
  );
}
