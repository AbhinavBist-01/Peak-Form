"use client";

import { ActivityIcon, GlobeIcon, ClockIcon, CheckCircle2Icon } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "published" | "submission" | "created";
  title: string;
  time: string;
}

const mockActivity: ActivityItem[] = [
  {
    id: "1",
    type: "submission",
    title: "New response recorded on 'Product Feedback & CSAT'",
    time: "12m ago",
  },
  {
    id: "2",
    type: "published",
    title: "'Event RSVP & Attendance' published to public link",
    time: "2h ago",
  },
  {
    id: "3",
    type: "created",
    title: "'User Onboarding Survey' form created",
    time: "1d ago",
  },
];

export function DashboardActivityFeed() {
  return (
    <div className="rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
        <div className="flex items-center gap-2">
          <ActivityIcon className="size-4 text-[#DA7756]" />
          <h3 className="peak-serif text-lg font-medium text-[#2D2926]">
            Workspace Activity
          </h3>
        </div>
        <span className="font-mono text-[11px] text-[#9E978F]">LIVE_FEED</span>
      </div>

      <div className="space-y-3">
        {mockActivity.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 rounded-xl border border-[#E5DFD5]/60 bg-[#FAF7F2] p-3 text-xs"
          >
            <div className="mt-0.5 grid size-6 place-items-center rounded-md bg-[#F7EBE1] text-[#DA7756] shrink-0">
              {act.type === "submission" ? (
                <CheckCircle2Icon className="size-3.5" />
              ) : act.type === "published" ? (
                <GlobeIcon className="size-3.5" />
              ) : (
                <ClockIcon className="size-3.5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#2D2926] font-medium leading-snug truncate">
                {act.title}
              </p>
              <span className="text-[11px] text-[#78726A]">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
