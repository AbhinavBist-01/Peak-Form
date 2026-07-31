"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  ShieldCheck,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { MarketingFooter, MarketingNavbar } from "~/components/marketing-chrome";
import { Switch } from "~/components/ui/switch";

const plans = [
  {
    name: "Free",
    description: "For solo creators validating forms and collecting initial responses.",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    href: "/signup",
    highlighted: false,
    features: [
      "Unlimited published forms",
      "500 responses per month",
      "Theme presets & share links",
      "CSV response export",
      "Basic email notifications",
    ],
  },
  {
    name: "Pro",
    description: "For growing teams that need smart branching rules and custom themes.",
    monthly: 24,
    annual: 19,
    cta: "Start Pro trial",
    href: "/signup",
    highlighted: true,
    features: [
      "Everything in Free",
      "If/Then conditional logic rules",
      "Custom branding & color themes",
      "Password-protected forms",
      "Email notification alerts",
      "Priority creator support",
    ],
  },
  {
    name: "Team",
    description: "For organizations with team collaboration, custom domains, and API access.",
    monthly: 59,
    annual: 49,
    cta: "Contact Team sales",
    href: "/signup",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Multi-user team workspaces",
      "Custom CNAME domain routing",
      "Scalar REST API & webhooks",
      "Audit-ready exports",
      "SLA-backed support",
    ],
  },
];

const discounts = [
  {
    title: "PeakForms for Students",
    description: "Build research surveys, project intake forms, and event signups with free or discounted creator tier.",
  },
  {
    title: "PeakForms for Communities",
    description: "For clubs, classrooms, and non-profits collecting responses without software budget constraints.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = React.useState(true);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      <MarketingNavbar />

      {/* Spacious Claude Header Section */}
      <section className="border-b border-[#E5DFD5] bg-[#F4EFE6]/40 py-16 md:py-24 text-center">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-5 md:px-8">
          <div className="space-y-4">
            <h1 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926] md:text-6xl">
              Simple, transparent pricing.
            </h1>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-[#78726A] md:text-lg">
              Start free, upgrade whenever you need smart branching logic, custom themes, or team collaboration.
            </p>
          </div>

          {/* Minimal Billing Switcher */}
          <div className="flex items-center gap-3 rounded-full border border-[#E5DFD5] bg-[#FFFDF9] px-4 py-2 text-xs font-medium shadow-xs">
            <span className={!annual ? "text-[#2D2926] font-semibold" : "text-[#78726A]"}>
              Monthly billing
            </span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              aria-label="Use annual billing"
              className="data-[state=checked]:bg-[#DA7756]"
            />
            <span className={annual ? "text-[#2D2926] font-semibold" : "text-[#78726A]"}>
              Annual billing
            </span>
            <span className="rounded-full bg-[#F7EBE1] px-2.5 py-0.5 font-semibold text-[#DA7756]">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid Section */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`claude-card rounded-2xl bg-[#FFFDF9] p-8 flex flex-col justify-between relative ${
                plan.highlighted ? "border-[#DA7756] ring-1 ring-[#DA7756]" : "border-[#E5DFD5]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#DA7756] px-3.5 py-0.5 text-[11px] font-medium text-white shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="peak-serif text-2xl font-medium text-[#2D2926]">{plan.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#78726A] min-h-10">{plan.description}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-serif font-medium text-[#2D2926]">
                      ${annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="text-xs text-[#78726A]">/ month</span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-[#E5DFD5] pt-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-[#2D2926]">
                      <Check className="mt-0.5 size-4 text-[#DA7756] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                asChild
                className={`mt-8 w-full rounded-xl text-xs font-medium ${
                  plan.highlighted
                    ? "bg-[#DA7756] text-white hover:bg-[#C66545]"
                    : "border-[#E5DFD5] bg-white text-[#2D2926] hover:bg-[#F2ECE1]"
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href={plan.href}>
                  {plan.cta}
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Discounts Section */}
      <section className="border-t border-[#E5DFD5] bg-[#F4EFE6]/40 py-20">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
              Looking for student or community pricing?
            </h2>
            <p className="text-sm text-[#78726A]">
              PeakForms keeps paths open for learning groups, early projects, and community teams.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {discounts.map((discount, index) => (
              <div
                key={discount.title}
                className="claude-card rounded-2xl bg-[#FFFDF9] p-8 text-center flex flex-col items-center justify-between space-y-4"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-[#F7EBE1] text-[#DA7756]">
                  {index === 0 ? <FileText className="size-6" /> : <ShieldCheck className="size-6" />}
                </div>
                <div className="space-y-2">
                  <h3 className="peak-serif text-xl font-medium text-[#2D2926]">{discount.title}</h3>
                  <p className="max-w-sm text-xs leading-relaxed text-[#78726A]">
                    {discount.description}
                  </p>
                </div>
                <Button variant="outline" asChild className="border-[#E5DFD5] bg-white text-xs text-[#DA7756] hover:bg-[#F7EBE1]">
                  <Link href="/signup">
                    Apply for access
                    <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Claude Banner CTA */}
      <section className="border-t border-[#E5DFD5] bg-[#FFFDF9] py-20 text-center">
        <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-6">
          <h2 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926]">
            Create your first PeakForms form today.
          </h2>
          <p className="mx-auto max-w-lg text-base text-[#78726A] leading-relaxed">
            Build a form, publish the share link, and start collecting responses immediately without waiting for a complex setup.
          </p>

          <div className="pt-2 flex justify-center">
            <Button size="lg" asChild className="claude-button h-12 rounded-xl bg-[#DA7756] px-8 text-white hover:bg-[#C66545] font-medium text-sm">
              <Link href="/signup">
                Get started free
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
