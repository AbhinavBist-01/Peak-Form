import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart3Icon,
  FileSpreadsheetIcon,
  Globe2Icon,
  Layers3Icon,
  MountainIcon,
  PaletteIcon,
  SendIcon,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

const quickActions = [
  {
    title: "Create forms",
    description: "Build dynamic schemas with field types, requirements, options, and ratings.",
    href: "/dashboard/forms",
    icon: Layers3Icon,
  },
  {
    title: "Publish links",
    description: "Ship public gallery forms or unlisted direct links for private campaigns.",
    href: "/dashboard/forms",
    icon: Globe2Icon,
  },
  {
    title: "Review responses",
    description: "Open analytics, inspect individual responses, and export CSV files.",
    href: "/dashboard/forms",
    icon: BarChart3Icon,
  },
];

const systemCards = [
  { label: "Theme controls", value: "Alpine", icon: PaletteIcon },
  { label: "Exports", value: "CSV ready", icon: FileSpreadsheetIcon },
  { label: "Email flows", value: "Nodemailer", icon: SendIcon },
];

export default function Page() {
  return (
    <div className="@container/main peak-topography peak-topography-motion flex flex-1 flex-col gap-6 p-4 md:p-6">
      <section className="peak-glass peak-reveal peak-shine grid overflow-hidden rounded-xl lg:grid-cols-[1fr_25rem]">
        <div className="peak-stagger grid content-center gap-6 p-6 md:p-8">
          <Badge className="w-fit gap-2 bg-[#061b0e] text-white">
            <MountainIcon className="peak-icon-breathe size-3.5" />
            PeakForm workspace
          </Badge>
          <div className="grid gap-3">
            <h2 className="peak-serif max-w-3xl text-4xl font-semibold tracking-normal text-[#061b0e] md:text-5xl">
              Build, publish, and understand every form from one calm dashboard.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[#59645b] md:text-base md:leading-7">
              This workspace is focused on the real product flow: create forms, tune visibility, publish links, collect responses, and export analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="peak-button-motion bg-[#061b0e] text-white hover:bg-[#1b3022]">
              <Link href="/dashboard/forms">
                Open forms
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild variant="outline" className="peak-button-motion border-[#4d6453]/35 bg-white/70">
              <Link href="/explore">View public gallery</Link>
            </Button>
          </div>
        </div>
        <Image
          src="/peakform-builder-preview.png"
          alt=""
          width={640}
          height={520}
          className="peak-float hidden h-full min-h-80 w-full object-cover object-left-top lg:block"
        />
      </section>

      <section className="peak-stagger grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="peak-glass peak-lift peak-shine group rounded-xl p-5"
            >
              <div className="mb-5 grid size-11 place-items-center rounded-lg bg-[#d0e9d4] text-[#061b0e] transition-transform group-hover:scale-105">
                <Icon className="size-5" />
              </div>
              <div className="grid gap-2">
                <h3 className="text-base font-semibold text-[#061b0e]">{action.title}</h3>
                <p className="text-sm leading-6 text-[#59645b]">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="peak-stagger grid gap-4 md:grid-cols-3">
        {systemCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="peak-lift rounded-xl border border-[#c3c8c1]/65 bg-white/76 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-sm text-[#59645b]">{card.label}</span>
                <Icon className="size-4 text-[#4d6453]" />
              </div>
              <p className="peak-serif text-2xl font-semibold tracking-normal text-[#061b0e]">
                {card.value}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
