import Link from "next/link";
import Image from "next/image";
import { MountainIcon } from "lucide-react";

import { LoginForm } from "~/components/login-form";

export default function Page() {
  return (
    <main className="relative grid min-h-svh overflow-hidden bg-[#061b0e] text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute inset-0 lg:relative">
        <video
          className="h-full w-full object-cover"
          src="/peakform-mountain-loop%20-%20Trim.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/peakform-builder-preview.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,27,14,0.78),rgba(6,27,14,0.48),rgba(6,27,14,0.9))]" />
        <div className="absolute inset-0 peak-topography peak-topography-motion opacity-30" />
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
          <div className="peak-lift mb-6 hidden rounded-lg border border-[#c3c8c1]/60 bg-white/64 p-4 text-sm text-[#434843] shadow-sm lg:flex lg:items-center lg:gap-3">
            <MountainIcon className="peak-icon-breathe size-5 text-[#4d6453]" />
            <span>Return to your form workspace and keep collecting clean responses.</span>
          </div>
        <LoginForm />
      </div>
      </section>
    </main>
  );
}
