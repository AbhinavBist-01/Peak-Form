"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Pricing", href: "/pricing" },
  { label: "API docs", href: "http://localhost:8000/docs" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1f12]/96 text-white shadow-lg shadow-[#061b0e]/16 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForm"
            width={34}
            height={34}
            className="size-8 shrink-0 invert"
            priority
          />
          <span className="peak-serif truncate text-xl font-semibold tracking-normal">PeakForm</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/72 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            className="peak-button-motion hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="peak-button-motion bg-[#d0e9d4] text-[#061b0e] hover:bg-white">
            <Link href="/signup">
              Sign up
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#c3c8c1]/45 bg-[#0b1f12] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.3fr_1fr] md:px-8">
        <div className="grid gap-3">
          <Link href="/" className="flex w-fit items-center gap-3">
            <Image
              src="/peakform-logo.svg"
              alt="PeakForm"
              width={32}
              height={32}
              className="size-8 invert"
            />
            <span className="peak-serif text-xl font-semibold tracking-normal">PeakForm</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-white/62">
            Dynamic forms, public links, response analytics, and exports in one focused workspace.
          </p>
        </div>

        <div className="grid content-start gap-4 text-sm md:justify-end md:text-right">
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <Link href="/explore" className="text-white/70 transition hover:text-white">
              Explore
            </Link>
            <Link href="/pricing" className="text-white/70 transition hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="text-white/70 transition hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="text-white/70 transition hover:text-white">
              Signup
            </Link>
          </div>
          <p className="text-xs text-white/45">© 2026 PeakForm. Built for cleaner collection.</p>
        </div>
      </div>
    </footer>
  );
}
