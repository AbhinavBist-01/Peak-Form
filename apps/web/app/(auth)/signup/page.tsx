import Link from "next/link";
import Image from "next/image";
import { CheckIcon } from "lucide-react";

import { SignupForm } from "~/components/signup-form";

export default function Page() {
  return (
    <main className="relative grid min-h-svh overflow-hidden bg-[#061b0e] text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute inset-0 lg:relative">
        <video
          className="h-full w-full object-cover"
          src="/peakform-mountain-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/peakform-builder-preview.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,27,14,0.8),rgba(6,27,14,0.5),rgba(6,27,14,0.9))]" />
        <div className="absolute bottom-8 left-8 z-10 hidden max-w-lg gap-4 lg:grid">
          {["Create dynamic forms", "Publish public or unlisted links", "Analyze and export responses"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-lg bg-white/12 p-3 backdrop-blur-md">
              <CheckIcon className="size-4" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="relative z-10 flex min-h-svh items-center justify-center px-5 py-10 lg:bg-[#f9faf8]/92 lg:text-[#191c1b] lg:backdrop-blur-xl">
        <Link href="/" className="peak-reveal absolute left-5 top-5 flex items-center gap-2 text-white lg:text-[#061b0e]">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForm"
            width={32}
            height={32}
            className="size-8 lg:invert"
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
