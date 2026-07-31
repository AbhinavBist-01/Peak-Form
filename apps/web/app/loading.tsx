import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      <div className="border-b border-[#E5DFD5] bg-[#FAF7F2]">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-lg bg-[#E5DFD5]/60" />
            <Skeleton className="h-6 w-28 rounded-md bg-[#E5DFD5]/60" />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Skeleton className="h-4 w-16 bg-[#E5DFD5]/40" />
            <Skeleton className="h-4 w-16 bg-[#E5DFD5]/40" />
            <Skeleton className="h-4 w-20 bg-[#E5DFD5]/40" />
          </div>
          <Skeleton className="h-10 w-24 rounded-xl bg-[#E5DFD5]/60" />
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32 rounded-md bg-[#E5DFD5]/60" />
          <Skeleton className="h-12 w-4/5 rounded-xl bg-[#E5DFD5]/60" />
          <Skeleton className="h-5 w-full bg-[#E5DFD5]/40" />
          <Skeleton className="h-5 w-3/4 bg-[#E5DFD5]/40" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 w-32 rounded-xl bg-[#E5DFD5]/60" />
            <Skeleton className="h-11 w-32 rounded-xl bg-[#E5DFD5]/40" />
          </div>
        </div>
        <div className="claude-card rounded-2xl bg-[#FFFDF9] p-6 shadow-xs border border-[#E5DFD5]">
          <Skeleton className="aspect-[16/10] w-full rounded-xl bg-[#E5DFD5]/40" />
        </div>
      </section>
    </main>
  );
}
