"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  FileText,
  Mountain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MarketingFooter, MarketingNavbar } from "~/components/marketing-chrome";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

const plans = [
  {
    name: "Base Camp",
    description: "For solo creators validating forms and collecting first responses.",
    monthly: 12,
    annual: 8,
    badge: "Starter",
    cta: "Start building",
    href: "/signup",
    features: [
      "5 published forms",
      "500 responses per month",
      "Theme presets and share links",
      "CSV response export",
      "Basic email notifications",
    ],
  },
  {
    name: "Summit",
    description: "For growing teams that need better collaboration and review flows.",
    monthly: 29,
    annual: 21,
    badge: "Most popular",
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
    features: [
      "Unlimited forms",
      "10,000 responses per month",
      "Team workspace controls",
      "Submission review dashboard",
      "Custom success messages",
      "Priority support",
    ],
  },
  {
    name: "Expedition",
    description: "For organizations with heavier traffic, governance, and support needs.",
    monthly: null,
    annual: null,
    badge: "Scale",
    cta: "Contact us",
    href: "/dashboard/forms",
    features: [
      "Unlimited responses",
      "Advanced access controls",
      "Dedicated onboarding",
      "Custom integrations",
      "Audit-ready exports",
      "SLA-backed support",
    ],
  },
];

const discounts = [
  {
    title: "PeakForm for Students",
    description: "Build research surveys, project intake forms, and event signups with a lighter first-year price.",
  },
  {
    title: "PeakForm for Communities",
    description: "For clubs, classrooms, and local groups collecting responses without a large software budget.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = React.useState(true);

  return (
    <main className="min-h-screen bg-[#f9faf8] text-[#191c1b]">
      <MarketingNavbar />
      <section className="peak-topography peak-topography-motion relative overflow-hidden border-b border-[#c3c8c1]/60">
        <Image
          src="/pricing-mountains.svg"
          alt=""
          aria-hidden="true"
          width={1600}
          height={430}
          className="absolute inset-x-0 bottom-0 h-[430px] w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,250,248,0.97),rgba(237,241,236,0.78)_50%,rgba(249,250,248,0.96))]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-14 md:px-6 md:py-16">
          <div className="peak-stagger mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <Badge className="gap-1 bg-slate-950 text-white">
              <Mountain className="size-3" />
              Mountain-ready form growth
            </Badge>
            <div className="grid gap-4">
              <h1 className="text-4xl font-bold tracking-normal md:text-6xl">
                Clear pricing for every climb.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Start with simple public forms, then scale into team workflows,
                response review, and polished branded collection.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-md border border-slate-200 bg-white/85 px-4 py-2 shadow-sm backdrop-blur sm:rounded-full">
              <span className={cn("text-sm", !annual ? "font-semibold text-slate-950" : "text-slate-500")}>
                Monthly
              </span>
              <Switch
                checked={annual}
                onCheckedChange={setAnnual}
                aria-label="Use annual billing"
                className="data-[state=checked]:bg-[#4d6453]"
              />
              <span className={cn("text-sm", annual ? "font-semibold text-slate-950" : "text-slate-500")}>
                Annually
              </span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Save up to 30%
              </Badge>
            </div>
          </div>

          <div className="peak-stagger grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "peak-lift peak-shine relative min-h-[520px] overflow-hidden rounded-lg border-[#c3c8c1]/65 bg-white/92 py-0 shadow-xl shadow-[#4c616c]/12 backdrop-blur",
                  plan.highlighted && "border-[#061b0e] ring-2 ring-[#b4cdb8]"
                )}
              >
                {plan.highlighted ? (
                  <div className="bg-[#d0e9d4] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#061b0e]">
                    Best for teams
                  </div>
                ) : null}

                <CardHeader className={cn("gap-5 p-6 text-center", plan.highlighted && "pt-5")}>
                  <Badge
                    variant={plan.highlighted ? "default" : "secondary"}
                    className={cn(
                      "mx-auto",
                      plan.highlighted && "bg-slate-950 text-white"
                    )}
                  >
                    {plan.badge}
                  </Badge>
                  <div className="grid gap-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="min-h-12 leading-6">
                      {plan.description}
                    </CardDescription>
                  </div>

                  <div className="grid gap-1">
                    {plan.monthly === null ? (
                      <p className="text-4xl font-semibold tracking-normal">Contact us</p>
                    ) : (
                      <p className="text-5xl font-semibold tracking-normal">
                        <span className="align-top text-xl">$</span>
                        {annual ? plan.annual : plan.monthly}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {plan.monthly === null ? "Designed for high-volume teams" : "per user per month"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-6 p-6 pt-0">
                  <ul className="grid gap-3 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-[#4d6453]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={plan.highlighted ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      plan.highlighted && "bg-[#061b0e] text-white hover:bg-[#1b3022]"
                    )}
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 md:px-6">
        <div className="grid gap-3 text-center">
          <h2 className="text-2xl font-semibold tracking-normal">Looking for a discount?</h2>
          <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
            PeakForm keeps a few lower-friction paths open for learning groups,
            early projects, and community teams.
          </p>
        </div>

        <div className="peak-glass grid overflow-hidden rounded-xl md:grid-cols-2">
          {discounts.map((discount, index) => (
            <article
              key={discount.title}
              className={cn(
                "grid gap-5 p-8 text-center",
                index === 0 && "border-b border-[#c3c8c1]/60 md:border-b-0 md:border-r"
              )}
            >
              <div className="mx-auto grid size-12 place-items-center rounded-lg bg-[#061b0e] text-white">
                {index === 0 ? <FileText className="size-5" /> : <ShieldCheck className="size-5" />}
              </div>
              <div className="grid gap-2">
                <h3 className="text-xl font-semibold tracking-normal">{discount.title}</h3>
                <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600">
                  {discount.description}
                </p>
              </div>
              <Button variant="link" asChild className="text-[#4d6453]">
                <Link href="/dashboard/forms">
                  Learn more
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="peak-shine grid gap-4 rounded-xl border border-[#c3c8c1]/55 bg-[#061b0e] p-6 text-white shadow-xl md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-2">
            <Badge className="w-fit bg-white text-slate-950">
              <Sparkles className="size-3" />
              Launch faster
            </Badge>
            <h2 className="text-2xl font-semibold tracking-normal">Create your first PeakForm today.</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              Build a form, publish the share link, and start collecting responses without waiting for a full workspace setup.
            </p>
          </div>
          <Button asChild className="peak-button-motion bg-[#d0e9d4] text-[#061b0e] hover:bg-white">
            <Link href="/dashboard/forms">
              Open forms
              <CircleDollarSign className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
