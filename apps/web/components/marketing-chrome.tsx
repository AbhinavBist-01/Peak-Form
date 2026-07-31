"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { env } from "~/env";

function getApiDocsUrl() {
  if (env.NEXT_PUBLIC_API_DOCS_URL) {
    return env.NEXT_PUBLIC_API_DOCS_URL;
  }

  if (env.NEXT_PUBLIC_API_URL) {
    return env.NEXT_PUBLIC_API_URL.replace(/\/trpc\/?$/, "/docs");
  }

  return "http://localhost:8000/docs";
}

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Pricing", href: "/pricing" },
  { label: "API docs", href: getApiDocsUrl() },
];

export function MarketingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5DFD5] bg-[#FAF7F2]/90 text-[#2D2926] backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForms"
            width={32}
            height={32}
            className="size-7 shrink-0 opacity-90 transition-transform hover:scale-105"
            priority
          />
          <span className="peak-serif truncate text-xl font-medium tracking-tight text-[#2D2926]">
            PeakForms
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-[#78726A] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#2D2926]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            asChild
            className="claude-button text-sm font-medium text-[#78726A] hover:bg-[#F2ECE1] hover:text-[#2D2926]"
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="claude-button rounded-xl bg-[#DA7756] px-4 text-sm font-medium text-white hover:bg-[#C66545] shadow-xs"
          >
            <Link href="/signup">
              Try PeakForms
              <ArrowRightIcon className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-9 place-items-center rounded-lg border border-[#E5DFD5] bg-[#F2ECE1] text-[#2D2926] md:hidden hover:bg-[#E5DFD5]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#E5DFD5] bg-[#FAF7F2] px-6 py-6 space-y-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-[#2D2926]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 transition hover:text-[#DA7756]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <Button
              variant="outline"
              asChild
              className="w-full border-[#E5DFD5] text-[#2D2926] hover:bg-[#F2ECE1]"
            >
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#DA7756] text-white hover:bg-[#C66545]"
            >
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Try PeakForms
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#E5DFD5] bg-[#FAF7F2] text-[#2D2926] py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-between gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForms"
            width={28}
            height={28}
            className="size-7 opacity-90"
          />
          <span className="peak-serif text-lg font-medium text-[#2D2926]">
            PeakForms
          </span>
          <span className="text-xs text-[#78726A] ml-2 border-l border-[#E5DFD5] pl-3">
            Designed for clean form experiences
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#78726A]">
          <Link href="/explore" className="transition hover:text-[#2D2926]">
            Explore
          </Link>
          <Link href="/pricing" className="transition hover:text-[#2D2926]">
            Pricing
          </Link>
          <Link href="/login" className="transition hover:text-[#2D2926]">
            Sign in
          </Link>
          <Link href="/signup" className="transition hover:text-[#DA7756]">
            Sign up
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 pt-6 md:px-8 text-xs text-[#9E978F]">
        &copy; 2026 PeakForms. All rights reserved.
      </div>
    </footer>
  );
}
