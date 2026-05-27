import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f9faf8] text-[#191c1b]">
      <div className="border-b border-white/14 bg-[#3f744b]/94">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-md bg-white/25" />
            <Skeleton className="h-6 w-28 bg-white/25" />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
          <Skeleton className="h-10 w-24 bg-[#d0e9d4]/70" />
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid content-start gap-5">
          <Skeleton className="h-7 w-32 rounded-full bg-[#d0e9d4]/70" />
          <Skeleton className="h-12 w-4/5 bg-[#d0e9d4]/70" />
          <Skeleton className="h-12 w-2/3 bg-[#d0e9d4]/70" />
          <Skeleton className="h-5 w-full bg-[#edf1ec]" />
          <Skeleton className="h-5 w-4/5 bg-[#edf1ec]" />
          <div className="flex gap-3 pt-3">
            <Skeleton className="h-11 w-32 bg-[#d0e9d4]/70" />
            <Skeleton className="h-11 w-32 bg-[#edf1ec]" />
          </div>
        </div>
        <div className="peak-glass rounded-xl p-4">
          <Skeleton className="aspect-[16/10] w-full rounded-lg bg-[#edf1ec]" />
        </div>
      </section>
    </main>
  );
}
