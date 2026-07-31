"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  Clock3Icon,
  EyeOffIcon,
  FileTextIcon,
  Globe2Icon,
  PlusIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useListForms } from "~/hooks/api/form";
import { DashboardActivityFeed } from "~/components/dashboard-activity-feed";
import { DashboardCreateModal } from "~/components/dashboard-create-modal";

type FormRow = NonNullable<ReturnType<typeof useListForms>["forms"]>[number];

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return dateFormatter.format(date);
}

function getStatusLabel(form: FormRow) {
  if (form.status === "published") {
    return "Published";
  }

  if (form.status === "archived") {
    return "Archived";
  }

  return "Draft";
}

export default function Page() {
  const { forms = [], error, isLoading, isFetching } = useListForms();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");

  const publishedForms = forms.filter((form) => form.status === "published");
  const draftForms = forms.filter((form) => form.status === "draft");
  const archivedForms = forms.filter((form) => form.status === "archived");

  const filteredForms = forms.filter((form) => {
    if (statusFilter === "published") return form.status === "published";
    if (statusFilter === "draft") return form.status === "draft";
    if (statusFilter === "archived") return form.status === "archived";
    return true;
  });

  const metrics = [
    {
      label: "Total Forms",
      value: forms.length,
      icon: FileTextIcon,
    },
    {
      label: "Published",
      value: publishedForms.length,
      icon: Globe2Icon,
    },
    {
      label: "Drafts",
      value: draftForms.length,
      icon: Clock3Icon,
    },
    {
      label: "Archived",
      value: archivedForms.length,
      icon: BarChart3Icon,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
      {/* Overview Banner */}
      <section className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-xl">
            <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926] md:text-4xl">
              Workspace Overview
            </h2>
            <p className="text-xs leading-relaxed text-[#78726A]">
              Create interactive forms, publish shareable public links, and track respondent answers in real time.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="claude-button rounded-xl bg-[#DA7756] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#C66545] shrink-0"
          >
            <PlusIcon className="mr-1.5 size-4" />
            <span>Create New Form</span>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-[#E5DFD5]">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs text-[#78726A]">{m.label}</span>
                  <div className="mt-1 text-3xl font-serif font-medium text-[#2D2926]">
                    {m.value}
                  </div>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-[#F7EBE1] text-[#DA7756]">
                  <Icon className="size-5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Layout: Forms List + Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Forms Table Container */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5DFD5] pb-3">
            <h3 className="peak-serif text-2xl font-medium text-[#2D2926]">
              Your Forms
            </h3>

            {/* Segmented Status Filter Tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-[#E5DFD5] bg-[#FFFDF9] p-1 text-xs font-medium">
              {(["all", "published", "draft", "archived"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 capitalize transition-all ${
                    statusFilter === filter
                      ? "bg-[#DA7756] text-white shadow-xs"
                      : "text-[#78726A] hover:text-[#2D2926]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
              <AlertTitle className="font-medium">Could not load forms</AlertTitle>
              <AlertDescription className="text-xs">{error.message}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="claude-card rounded-xl bg-[#FFFDF9] p-4 flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/3 bg-[#E5DFD5]/60" />
                    <Skeleton className="h-3 w-1/2 bg-[#E5DFD5]/40" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-lg bg-[#E5DFD5]/60" />
                </div>
              ))}
            </div>
          ) : filteredForms.length ? (
            <div className="space-y-3">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="claude-card rounded-xl bg-[#FFFDF9] border border-[#E5DFD5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#D6CEC1]"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="peak-serif text-lg font-medium text-[#2D2926] truncate">
                        {form.title}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-mono capitalize ${
                          form.status === "published"
                            ? "bg-[#F7EBE1] text-[#DA7756]"
                            : form.status === "archived"
                            ? "bg-[#E5DFD5] text-[#78726A]"
                            : "bg-[#FAF7F2] text-[#78726A] border border-[#E5DFD5]"
                        }`}
                      >
                        {getStatusLabel(form)}
                      </span>
                    </div>
                    <p className="text-xs text-[#78726A] truncate">
                      {form.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-[#9E978F] font-mono pt-1">
                      <span>Updated {formatDate(form.updatedAt)}</span>
                      <span>&bull;</span>
                      <span>Visibility: {form.visibility}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F2ECE1] rounded-xl"
                    >
                      <Link href={`/dashboard/forms/${form.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
                    >
                      <Link href={`/dashboard/forms/${form.id}/submissions`}>
                        Submissions
                        <ArrowRightIcon className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-12 text-center">
              <div className="mx-auto max-w-sm space-y-3">
                <div className="mx-auto grid size-10 place-items-center rounded-full bg-[#F7EBE1] text-[#DA7756]">
                  <EyeOffIcon className="size-5" />
                </div>
                <h3 className="peak-serif text-xl font-medium text-[#2D2926]">No forms found</h3>
                <p className="text-xs text-[#78726A]">
                  {statusFilter !== "all"
                    ? `No forms with status '${statusFilter}'.`
                    : "Create your first PeakForms form to start collecting responses."}
                </p>
                <Button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="rounded-xl bg-[#DA7756] text-xs text-white hover:bg-[#C66545] mt-2"
                >
                  <PlusIcon className="mr-1 size-3.5" />
                  Create Form
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Activity Feed Sidebar */}
        <section className="lg:col-span-4 space-y-4">
          <DashboardActivityFeed />
        </section>
      </div>

      {/* Quick Create Modal */}
      <DashboardCreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
