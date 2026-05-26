import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BellIcon,
  FileSpreadsheetIcon,
  Globe2Icon,
  Layers3Icon,
  LockKeyholeIcon,
  MountainIcon,
  PaletteIcon,
  PlayIcon,
  SendIcon,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const productPillars = [
  {
    title: "Build",
    description: "Compose dynamic forms with ratings, choices, dates, validations, and branded alpine themes.",
    icon: Layers3Icon,
  },
  {
    title: "Publish",
    description: "Share public forms in galleries or keep unlisted links hidden for invited respondents.",
    icon: Globe2Icon,
  },
  {
    title: "Learn",
    description: "Review responses, export CSVs, watch field distributions, and understand completion trends.",
    icon: BarChart3Icon,
  },
];

const workflow = [
  "Create a form",
  "Tune the theme",
  "Publish a link",
  "Collect responses",
  "Export and analyze",
];

const capabilities = [
  { label: "Public and unlisted links", icon: LockKeyholeIcon },
  { label: "CSV response export", icon: FileSpreadsheetIcon },
  { label: "Creator notifications", icon: BellIcon },
  { label: "Respondent confirmation", icon: SendIcon },
  { label: "Theme controls", icon: PaletteIcon },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f9faf8] text-[#191c1b]">
      <section className="relative min-h-[92svh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/peakform-mountain-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/peakform-builder-preview.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,27,14,0.66),rgba(6,27,14,0.38)_42%,rgba(249,250,248,0.96)_96%)]" />
        <div className="absolute inset-0 peak-topography opacity-35" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img src="/peakform-logo.svg" alt="PeakForm" className="size-9 rounded-md bg-white/90 p-1.5" />
            <span className="peak-serif text-2xl font-semibold tracking-normal">PeakForm</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/78 md:flex">
            <Link href="/explore" className="transition hover:text-white">
              Explore
            </Link>
            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="http://localhost:8000/docs" className="transition hover:text-white">
              API docs
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden text-white hover:bg-white/12 hover:text-white sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-white text-[#061b0e] hover:bg-[#d0e9d4]">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-84px)] w-full max-w-7xl flex-col justify-center px-5 pb-24 pt-14 md:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-5 gap-2 bg-white/16 text-white ring-1 ring-white/20 backdrop-blur-md">
              <MountainIcon className="size-3.5" />
              Altitude and clarity for modern forms
            </Badge>
            <h1 className="peak-serif max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-white drop-shadow-2xl md:text-7xl">
              PeakForm
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
              Build Typeform-style experiences, publish shareable links, collect responses without login, and turn every answer into calm, readable insight.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-12 bg-white px-6 text-[#061b0e] hover:bg-[#d0e9d4]">
                <Link href="/signup">
                  Start building
                  <ArrowRightIcon />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 border-white/28 bg-white/10 px-6 text-white backdrop-blur-md hover:bg-white/18 hover:text-white"
              >
                <Link href="/explore">
                  <PlayIcon />
                  View demo forms
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-6 left-5 right-5 z-10 mx-auto grid max-w-7xl gap-3 md:grid-cols-3 md:px-3">
            {productPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <article key={pillar.title} className="peak-glass rounded-lg p-4 text-[#191c1b]">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="size-4 text-[#4d6453]" />
                    <h2 className="text-sm font-semibold">{pillar.title}</h2>
                  </div>
                  <p className="text-sm leading-6 text-[#434843]">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="grid gap-6">
          <Badge variant="secondary" className="w-fit bg-[#d0e9d4] text-[#0b2013]">
            Form builder
          </Badge>
          <div className="grid gap-4">
            <h2 className="peak-serif text-4xl font-semibold tracking-normal md:text-5xl">
              A focused workspace for forms that need to feel intentional.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[#59645b]">
              The builder keeps creation, preview, settings, publishing, and response review close together so creators can move from idea to live link without losing context.
            </p>
          </div>
          <div className="grid gap-3">
            {workflow.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border border-[#c3c8c1]/70 bg-white/70 p-3">
                <span className="grid size-8 place-items-center rounded-md bg-[#061b0e] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="peak-glass peak-shadow overflow-hidden rounded-2xl p-3">
          <img
            src="/peakform-builder-preview.png"
            alt="PeakForm builder interface"
            className="aspect-[16/10] w-full rounded-xl object-cover object-top"
          />
        </div>
      </section>

      <section className="border-y border-[#c3c8c1]/60 bg-[#edf1ec]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 md:grid-cols-5 md:px-8">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <div key={capability.label} className="peak-glass rounded-lg p-5">
                <Icon className="mb-4 size-5 text-[#4d6453]" />
                <p className="text-sm font-medium leading-6">{capability.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 md:px-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="grid gap-4">
          <Badge className="w-fit bg-[#061b0e] text-white">Demo-ready SaaS</Badge>
          <h2 className="peak-serif max-w-3xl text-4xl font-semibold tracking-normal md:text-5xl">
            Launch a polished form flow, then prove what happened.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-[#59645b]">
            PeakForm brings public listings, unlisted share links, analytics, email notifications, CSV exports, and Scalar API documentation into one calm product surface.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button size="lg" asChild className="bg-[#061b0e] text-white hover:bg-[#1b3022]">
            <Link href="/signup">
              Create account
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-[#4d6453]/40 bg-white/70">
            <Link href="/explore">Open demo gallery</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
