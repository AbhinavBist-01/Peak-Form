import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BellIcon,
  FileSpreadsheetIcon,
  Globe2Icon,
  Layers3Icon,
  LockKeyholeIcon,
  PaletteIcon,
  SendIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { MarketingFooter, MarketingNavbar } from "~/components/marketing-chrome";
import { LandingInteractivePreview } from "~/components/landing-interactive-preview";
import { LandingFeatureTabs } from "~/components/landing-feature-tabs";
import { LandingBuilderDemo } from "~/components/landing-builder-demo";
import { LandingPricingTeaser } from "~/components/landing-pricing-teaser";
import { LandingTestimonials } from "~/components/landing-testimonials";
import { LandingFaq } from "~/components/landing-faq";

const productPillars = [
  {
    title: "Build",
    description: "Compose interactive forms with ratings, choices, dates, validations, and custom themes.",
    icon: Layers3Icon,
  },
  {
    title: "Publish",
    description: "Share public forms or keep unlisted links protected for invited respondents.",
    icon: Globe2Icon,
  },
  {
    title: "Analyze",
    description: "Review responses, export CSVs, track completion rates, and watch field trends.",
    icon: BarChart3Icon,
  },
];

const templates = [
  {
    title: "Product Feedback & CSAT",
    questions: "5 questions",
    tag: "Research",
    description: "Measure Net Promoter Score, star ratings, and open-ended feedback with smart branching.",
  },
  {
    title: "Event RSVP & Attendance",
    questions: "4 questions",
    tag: "Event",
    description: "Collect dietary preferences, headcount, and dates with password-protected public links.",
  },
  {
    title: "User Onboarding Survey",
    questions: "6 questions",
    tag: "Onboarding",
    description: "Multi-page wizard for qualifying user roles, team sizes, and workspace configuration.",
  },
];

const capabilities = [
  { label: "Public and unlisted links", icon: LockKeyholeIcon },
  { label: "CSV response export", icon: FileSpreadsheetIcon },
  { label: "Creator email alerts", icon: BellIcon },
  { label: "Respondent confirmation", icon: SendIcon },
  { label: "Theme & brand controls", icon: PaletteIcon },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      <MarketingNavbar />

      {/* Spacious Hero Section */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-20 pb-24 md:px-8 md:pt-28 md:pb-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="peak-serif text-5xl font-medium tracking-tight text-[#2D2926] leading-[1.1] md:text-6xl lg:text-7xl">
              Forms designed for clarity and focus.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[#78726A] md:text-xl font-normal">
              PeakForms helps you build interactive forms, publish shareable public links, collect responses without friction, and turn data into clear insights.
            </p>

            <div className="pt-2 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="claude-button h-12 rounded-xl bg-[#DA7756] px-7 text-white hover:bg-[#C66545] font-medium text-sm">
                <Link href="/signup">
                  Start building free
                  <ArrowRightIcon className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="claude-button h-12 rounded-xl border-[#E5DFD5] bg-white px-6 text-[#2D2926] hover:bg-[#F2ECE1] text-sm"
              >
                <Link href="/explore">
                  Explore demo forms
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Right: Minimal Interactive Preview Card */}
          <div className="flex justify-center lg:col-span-5">
            <LandingInteractivePreview />
          </div>
        </div>

        {/* Product Pillars Grid */}
        <div className="mt-24 grid gap-6 md:grid-cols-3 pt-12 border-t border-[#E5DFD5]">
          {productPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="claude-card rounded-2xl p-6 bg-[#FFFDF9]">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#F7EBE1] text-[#DA7756]">
                    <Icon className="size-4" />
                  </div>
                  <h2 className="text-base font-medium text-[#2D2926]">{pillar.title}</h2>
                </div>
                <p className="text-xs leading-relaxed text-[#78726A]">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="border-t border-[#E5DFD5] py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
            <h2 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926] md:text-5xl">
              Everything required for clean data collection
            </h2>
            <p className="text-base text-[#78726A]">
              Explore PeakForms core feature set in real time below.
            </p>
          </div>

          <LandingFeatureTabs />
        </div>
      </section>

      {/* Interactive Form Builder Playground Component */}
      <section className="border-t border-[#E5DFD5] bg-[#F4EFE6]/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <LandingBuilderDemo />
        </div>
      </section>

      {/* Pre-built Templates Gallery */}
      <section className="border-t border-[#E5DFD5] py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8 space-y-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926] md:text-4xl">
                Pre-configured templates
              </h2>
              <p className="mt-2 text-sm text-[#78726A]">
                Deploy structured presets tailored for feedback, events, or user onboarding.
              </p>
            </div>
            <Button variant="outline" asChild className="border-[#E5DFD5] bg-white text-[#2D2926] hover:bg-[#F2ECE1] text-xs font-medium">
              <Link href="/explore">
                View all templates
                <ArrowRightIcon className="ml-1 size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((tpl) => (
              <div
                key={tpl.title}
                className="claude-card rounded-2xl bg-[#FFFDF9] p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#9E978F] mb-3 font-mono">
                    <span>{tpl.tag}</span>
                    <span>{tpl.questions}</span>
                  </div>
                  <h3 className="peak-serif text-xl font-medium text-[#2D2926]">{tpl.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#78726A]">
                    {tpl.description}
                  </p>
                </div>
                <Button size="sm" variant="ghost" asChild className="w-full justify-between border-t border-[#E5DFD5] pt-3 text-xs font-medium text-[#DA7756] hover:bg-[#F7EBE1]">
                  <Link href="/explore">
                    <span>Use template</span>
                    <ArrowRightIcon className="size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Component */}
      <section className="border-t border-[#E5DFD5] bg-[#F4EFE6]/50 py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <LandingTestimonials />
        </div>
      </section>

      {/* Pricing Component */}
      <section className="border-t border-[#E5DFD5] py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <LandingPricingTeaser />
        </div>
      </section>

      {/* FAQ Component */}
      <section className="border-t border-[#E5DFD5] bg-[#F4EFE6]/40 py-24">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <LandingFaq />
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="border-t border-[#E5DFD5] mx-auto w-full max-w-6xl px-5 py-24 md:px-8">
        <div className="mb-12 text-center">
          <h2 className="peak-serif text-3xl font-medium text-[#2D2926] md:text-4xl">
            Built for security and privacy
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <div
                key={capability.label}
                className="claude-card rounded-xl bg-[#FFFDF9] p-5 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="grid size-9 place-items-center rounded-lg bg-[#F7EBE1] text-[#DA7756]">
                  <Icon className="size-4" />
                </div>
                <p className="text-xs font-medium text-[#2D2926] leading-snug">{capability.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Minimal Claude CTA Section */}
      <section className="border-t border-[#E5DFD5] bg-[#FFFDF9] py-24 text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-6">
          <h2 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926] md:text-5xl">
            Ready to build cleaner forms with PeakForms?
          </h2>
          <p className="mx-auto max-w-lg text-base text-[#78726A] leading-relaxed">
            Create your free account today. Build multi-page interactive forms, set up smart rules, and analyze responses immediately.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild className="claude-button h-12 rounded-xl bg-[#DA7756] px-8 text-white hover:bg-[#C66545] font-medium text-sm">
              <Link href="/signup">
                Create free account
                <ArrowRightIcon className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="claude-button h-12 rounded-xl border-[#E5DFD5] bg-white px-7 text-[#2D2926] hover:bg-[#F2ECE1] text-sm"
            >
              <Link href="/explore">
                Explore demo gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
