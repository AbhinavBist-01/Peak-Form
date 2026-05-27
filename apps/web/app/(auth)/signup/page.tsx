import Link from "next/link";
import Image from "next/image";

import { SignupForm } from "~/components/signup-form";

export default function Page() {
  return (
    <main className="peak-topography peak-topography-motion min-h-svh overflow-hidden bg-[#f5f8f2] px-5 py-8 text-[#191c1b]">
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-md flex-col justify-center">
        <Link
          href="/"
          className="peak-reveal mb-8 flex w-fit items-center gap-3 text-[#2f5d3b]"
        >
          <Image
            src="/peakform-logo.svg"
            alt="PeakForm"
            width={32}
            height={32}
            className="size-8 opacity-90 drop-shadow-[0_1px_4px_rgba(47,93,59,0.35)]"
          />
          <span className="peak-serif text-xl font-semibold">PeakForm</span>
        </Link>

        <div className="peak-reveal w-full max-w-md">
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
