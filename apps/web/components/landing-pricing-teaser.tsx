"use client";

import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Essential form building for personal projects and small teams.",
    features: [
      "Unlimited forms & submissions",
      "Standard question types",
      "Public share links & QR codes",
      "CSV response export",
    ],
    cta: "Start Free",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Advanced branching rules, custom themes, and password protection.",
    features: [
      "Everything in Free",
      "If/Then conditional logic rules",
      "Custom branding & color themes",
      "Password-protected forms",
      "Email notification alerts",
    ],
    cta: "Start Pro Trial",
    href: "/signup",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "Full workspace collaboration, custom domains, and Scalar API access.",
    features: [
      "Everything in Pro",
      "Multi-user team workspaces",
      "Custom CNAME domain routing",
      "Scalar REST API & webhooks",
      "Priority creator support",
    ],
    cta: "Contact Team Sales",
    href: "/signup",
    popular: false,
  },
];

export function LandingPricingTeaser() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h2 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926]">
          Simple, transparent pricing
        </h2>
        <p className="text-base text-[#78726A]">
          Build unlimited forms for free. Upgrade whenever you need smart logic, custom themes, or team collaboration.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`claude-card rounded-2xl bg-[#FFFDF9] p-7 flex flex-col justify-between relative ${
              tier.popular ? "border-[#DA7756] ring-1 ring-[#DA7756]" : "border-[#E5DFD5]"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#DA7756] px-3 py-0.5 text-[11px] font-medium text-white shadow-xs">
                Most Popular
              </span>
            )}

            <div className="space-y-5">
              <div>
                <h3 className="peak-serif text-2xl font-medium text-[#2D2926]">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-serif font-medium text-[#2D2926]">{tier.price}</span>
                  {tier.period && <span className="text-xs text-[#78726A]">{tier.period}</span>}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#78726A]">{tier.description}</p>
              </div>

              <div className="space-y-2.5 border-t border-[#E5DFD5] pt-5">
                {tier.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-[#2D2926]">
                    <CheckIcon className="mt-0.5 size-3.5 text-[#DA7756] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              className={`mt-8 w-full rounded-xl text-xs font-medium ${
                tier.popular
                  ? "bg-[#DA7756] text-white hover:bg-[#C66545]"
                  : "border-[#E5DFD5] bg-white text-[#2D2926] hover:bg-[#F2ECE1]"
              }`}
              variant={tier.popular ? "default" : "outline"}
            >
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
