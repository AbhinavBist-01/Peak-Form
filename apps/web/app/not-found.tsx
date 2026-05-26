import { ArrowLeft, Home, LogIn, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Forms", href: "/dashboard/forms" },
  { label: "Explore", href: "/explore" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center opacity-45 blur-sm"
        style={{ backgroundImage: 'url("/not-found-mountains.png")' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,18,0.24),rgba(6,10,18,0.86))]" />

      <section className="relative w-full max-w-5xl rounded-md bg-white p-3 shadow-2xl shadow-black/45 sm:p-5">
        <div className="relative min-h-[560px] overflow-hidden rounded-md bg-zinc-950 sm:min-h-[620px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-70 blur-md"
            style={{ backgroundImage: 'url("/not-found-mountains.png")' }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,16,28,0.76),rgba(11,16,28,0.36)_42%,rgba(11,16,28,0.9))]" />

          <header className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-white"
            >
              <Image
                src="/peakform-logo.svg"
                alt="PeakForm"
                width={32}
                height={32}
                className="size-8 rounded-md bg-white/10 p-1 ring-1 ring-white/20"
              />
              <span>PeakForm</span>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex" aria-label="404 navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/45 bg-white/10 px-4 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur transition hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-4 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-orange-300"
            >
              <LogIn className="size-4" />
              Login
            </Link>
          </header>

          <div className="relative z-10 flex min-h-[460px] flex-col items-center justify-center px-5 pb-10 pt-12 text-center sm:min-h-[500px] sm:px-8">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
              <Search className="size-3.5" />
              Page not found
            </p>

            <h1 className="text-8xl font-black leading-none text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)] sm:text-9xl">
              404
            </h1>

            <p className="mt-6 max-w-3xl text-3xl font-black uppercase leading-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)] sm:text-5xl">
              Oops! Looks like this page got lost in the mountains.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-orange-400 px-6 text-sm font-bold text-zinc-950 shadow-lg shadow-black/25 transition hover:bg-orange-300"
              >
                <Home className="size-4" />
                Dashboard
              </Link>
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ArrowLeft className="size-4" />
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
