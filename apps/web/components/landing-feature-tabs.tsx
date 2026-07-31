"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BarChart3Icon,
  GitForkIcon,
  Layers3Icon,
  QrCodeIcon,
  CheckIcon,
  FileSpreadsheetIcon,
  Share2Icon,
} from "lucide-react";

const tabs = [
  {
    id: "builder",
    label: "Drag & Drop Builder",
    icon: Layers3Icon,
    heading: "Craft forms field by field with zero code",
    description:
      "Reorder questions, configure validations, pick custom color schemes, and preview live changes instantaneously.",
    features: [
      "12+ question types (Choice, Text, Rating, Date)",
      "Required field toggles & character limits",
      "Custom themes & brand customization",
    ],
    image: "/peakforms-builder-preview.png",
  },
  {
    id: "logic",
    label: "Conditional Logic",
    icon: GitForkIcon,
    heading: "Ask only what's relevant to each respondent",
    description:
      "Set rules based on earlier answers to branch respondents to relevant questions or skip entire pages automatically.",
    features: [
      "If / Then / Else condition rules",
      "Dynamic field show/hide triggers",
      "Multi-page section branching",
    ],
    mockup: {
      type: "logic",
    },
  },
  {
    id: "sharing",
    label: "Public Links & QR",
    icon: Share2Icon,
    heading: "Share public links or embed QR codes anywhere",
    description:
      "Generate custom slugs, optional password protection, and direct QR code image downloads for print or digital sharing.",
    features: [
      "Custom URL slugs (peakforms.live/f/your-slug)",
      "Optional password protection for respondent privacy",
      "High-res downloadable QR codes",
    ],
    mockup: {
      type: "sharing",
    },
  },
  {
    id: "analytics",
    label: "Analytics & CSV Export",
    icon: BarChart3Icon,
    heading: "Turn responses into clear visual trends",
    description:
      "Track submission volumes, watch field answer distributions with interactive charts, and export complete CSV data files.",
    features: [
      "Field distribution pie & bar charts",
      "Submission filtering & pagination",
      "One-click full dataset CSV export",
    ],
    mockup: {
      type: "analytics",
    },
  },
];

export function LandingFeatureTabs() {
  const [activeTabId, setActiveTabId] = useState<string>("builder");
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]!;

  return (
    <div className="space-y-12">
      {/* Minimal Claude-style Text Tabs */}
      <div className="flex flex-wrap items-center justify-center border-b border-[#E5DFD5] pb-px">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={`relative px-5 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "text-[#DA7756]"
                  : "text-[#78726A] hover:text-[#2D2926]"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#DA7756]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-5">
          <h3 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926] md:text-4xl">
            {activeTab.heading}
          </h3>

          <p className="text-base leading-relaxed text-[#78726A]">
            {activeTab.description}
          </p>

          <ul className="space-y-3 pt-3">
            {activeTab.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2.5 text-sm text-[#2D2926]">
                <CheckIcon className="mt-0.5 size-4 text-[#DA7756] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-4 shadow-xs">
            {activeTab.image ? (
              <Image
                src={activeTab.image}
                alt={activeTab.label}
                width={1280}
                height={800}
                className="aspect-[16/10] w-full rounded-xl object-cover object-top border border-[#E5DFD5]"
              />
            ) : activeTab.mockup?.type === "logic" ? (
              <div className="space-y-4 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-6">
                <div className="border-b border-[#E5DFD5] pb-3">
                  <span className="text-xs font-mono text-[#78726A]">
                    LOGIC_BRANCHING_RULES
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#E5DFD5] bg-white p-4">
                    <div className="flex items-center gap-2 text-xs text-[#78726A]">
                      <span className="font-mono text-[#DA7756] font-medium">IF</span>
                      <span>"Satisfaction Rating" &lt; 3</span>
                    </div>
                    <div className="mt-2 text-xs font-medium text-[#2D2926]">
                      &rarr; SHOW Question: "What can we improve for you?"
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#E5DFD5] bg-white p-4">
                    <div className="flex items-center gap-2 text-xs text-[#78726A]">
                      <span className="font-mono text-[#DA7756] font-medium">IF</span>
                      <span>"Role" = "Developer"</span>
                    </div>
                    <div className="mt-2 text-xs font-medium text-[#2D2926]">
                      &rarr; JUMP TO Page: "Technical Specifications"
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab.mockup?.type === "sharing" ? (
              <div className="space-y-5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-8 text-center">
                <div className="mx-auto max-w-sm rounded-xl border border-[#E5DFD5] bg-white p-6">
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-xl bg-[#F7EBE1] text-[#DA7756]">
                    <QrCodeIcon className="size-8" />
                  </div>
                  <div className="font-mono text-xs text-[#78726A]">
                    peakforms.live/f/alpine-feedback
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-6">
                <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3Icon className="size-4 text-[#DA7756]" />
                    <span className="text-xs font-mono text-[#2D2926]">
                      RESPONSE_SUMMARY
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#78726A]">
                    <FileSpreadsheetIcon className="size-3.5" />
                    <span>CSV Export</span>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-[#E5DFD5] bg-white p-3.5">
                    <div className="text-xs text-[#78726A]">Total Responses</div>
                    <div className="mt-1 text-2xl font-serif font-medium text-[#2D2926]">482</div>
                  </div>
                  <div className="rounded-lg border border-[#E5DFD5] bg-white p-3.5">
                    <div className="text-xs text-[#78726A]">Completion Rate</div>
                    <div className="mt-1 text-2xl font-serif font-medium text-[#DA7756]">94.2%</div>
                  </div>
                  <div className="rounded-lg border border-[#E5DFD5] bg-white p-3.5">
                    <div className="text-xs text-[#78726A]">Avg Time</div>
                    <div className="mt-1 text-2xl font-serif font-medium text-[#2D2926]">1m 42s</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
