import Link from "next/link";
import Image from "next/image";

import { SignupForm } from "~/components/signup-form";

export default function Page() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#FAF7F2] px-5 py-8 text-[#2D2926]">
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-md flex-col justify-center">
        <Link
          href="/"
          className="mb-8 flex w-fit items-center gap-3 text-[#2D2926]"
        >
          <Image
            src="/peakform-logo.svg"
            alt="PeakForms"
            width={36}
            height={36}
            className="size-9 opacity-90"
          />
          <span className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
            PeakForms
          </span>
        </Link>

        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
