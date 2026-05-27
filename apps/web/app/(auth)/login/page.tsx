import Link from "next/link";
import Image from "next/image";

import { LoginForm } from "~/components/login-form";

export default function Page() {
  return (
    <main className="peak-topography peak-topography-motion min-h-svh overflow-hidden bg-[#f5f8f2] px-5 py-8 text-[#191c1b]">
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-md flex-col justify-center">
        <Link
          href="/"
          className="peak-reveal mb-8 flex w-fit items-center gap-4 text-black"
        >
          <Image
            src="/peakform-logo.svg"
            alt="PeakForm"
            width={44}
            height={44}
            className="size-11 brightness-0"
          />
          <span className="peak-serif text-3xl font-semibold tracking-normal">PeakForm</span>
        </Link>

        <div className="peak-reveal w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
