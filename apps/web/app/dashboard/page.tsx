"use client";

import Link from "next/link";
import {
  ArrowUpRightIcon,
  BarChart3Icon,
  CirclePlusIcon,
  Clock3Icon,
  EyeOffIcon,
  FileTextIcon,
  Globe2Icon,
  Layers3Icon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useListForms } from "~/hooks/api/form";

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

function getStatusVariant(status: string) {
  if (status === "Published") {
    return "default";
  }

  if (status === "Archived") {
    return "secondary";
  }

  return "outline";
}

export default function Page() {
  const {
    forms = [],
    error,
    isLoading,
    isFetching,
  } = useListForms();

  const publishedForms = forms.filter((form) => form.status === "published");
  const draftForms = forms.filter((form) => form.status === "draft");
  const publicForms = forms.filter(
    (form) => form.status === "published" && form.visibility === "public",
  );
  const recentForms = forms.slice(0, 5);

  const metrics = [
    {
      label: "Total forms",
      value: forms.length,
      icon: FileTextIcon,
      tone: "bg-[#2f5d3b] text-white",
    },
    {
      label: "Published",
      value: publishedForms.length,
      icon: Globe2Icon,
      tone: "bg-[#d0e9d4] text-[#2f5d3b]",
    },
    {
      label: "Drafts",
      value: draftForms.length,
      icon: Clock3Icon,
      tone: "bg-[#edf1ec] text-[#4d6453]",
    },
    {
      label: "Public listings",
      value: publicForms.length,
      icon: BarChart3Icon,
      tone: "bg-white text-[#4d6453]",
    },
  ];

  return (
    <div className="@container/main peak-topography flex flex-1 flex-col gap-5 p-4 md:p-6">
      <section className="peak-reveal grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl md:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="grid gap-2">
              <Badge className="w-fit bg-[#d0e9d4] text-[#2f5d3b]">
                Workspace overview
              </Badge>
              <div className="grid gap-2">
                <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b] md:text-4xl">
                  Dashboard
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[#59645b]">
                  Monitor your forms, jump back into active work, and keep publishing decisions inside each form editor.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild className="bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                <Link href="/dashboard/forms">
                  <CirclePlusIcon />
                  New form
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/explore">
                  Public gallery
                  <ArrowUpRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid content-between gap-4 rounded-xl border border-[#c3c8c1]/65 bg-[#2f5d3b] p-5 text-white shadow-xl shadow-[#2f5d3b]/15">
          <div className="grid gap-2">
            <p className="text-sm text-white/68">Current focus</p>
            <h3 className="peak-serif text-2xl font-semibold tracking-normal">
              Build clean forms. Review clean answers.
            </h3>
          </div>
          <Button asChild className="bg-white text-[#2f5d3b] hover:bg-[#d0e9d4]">
            <Link href="/dashboard/forms">
              Open builder
              <Layers3Icon />
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load dashboard</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="peak-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-4 shadow-lg shadow-[#4c616c]/8 backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[#59645b]">{metric.label}</span>
                <span className={`grid size-9 place-items-center rounded-lg ${metric.tone}`}>
                  <Icon className="size-4" />
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="h-9 w-16 bg-[#d0e9d4]/70" />
              ) : (
                <p className="text-3xl font-semibold tracking-normal text-[#2f5d3b]">
                  {metric.value}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-[#c3c8c1]/55 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#2f5d3b]">Recent forms</h3>
              <p className="text-sm text-[#59645b]">The latest forms in your workspace.</p>
            </div>
            {isFetching && !isLoading ? (
              <Badge variant="outline">Refreshing</Badge>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-3 p-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="grid gap-3 rounded-lg border border-[#c3c8c1]/45 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid flex-1 gap-2">
                      <Skeleton className="h-4 w-1/3 bg-[#d0e9d4]/70" />
                      <Skeleton className="h-3 w-2/3 bg-[#edf1ec]" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full bg-[#edf1ec]" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentForms.length ? (
            <div className="divide-y divide-[#c3c8c1]/45">
              {recentForms.map((form) => {
                const status = getStatusLabel(form);
                return (
                  <Link
                    key={form.id}
                    href={`/dashboard/forms/${form.id}`}
                    className="grid gap-3 p-5 transition hover:bg-[#edf1ec]/65 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h4 className="truncate font-medium text-[#2f5d3b]">{form.title}</h4>
                        <Badge variant={getStatusVariant(status)}>{status}</Badge>
                      </div>
                      <p className="truncate text-sm text-[#59645b]">
                        {form.description || "No description added yet."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#59645b]">
                      <span>{formatDate(form.updatedAt ?? form.createdAt)}</span>
                      {form.visibility === "public" ? (
                        <Globe2Icon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-56 place-items-center p-8 text-center">
              <div className="grid max-w-sm gap-3">
                <div className="mx-auto grid size-12 place-items-center rounded-lg bg-[#d0e9d4] text-[#2f5d3b]">
                  <FileTextIcon className="size-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#2f5d3b]">No forms yet</h4>
                  <p className="mt-1 text-sm leading-6 text-[#59645b]">
                    Create your first form, then configure publishing, visibility, fields, and analytics inside the editor.
                  </p>
                </div>
                <Button asChild className="bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                  <Link href="/dashboard/forms">Create form</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="grid gap-4">
          <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
            <h3 className="text-base font-semibold text-[#2f5d3b]">Main workflow</h3>
            <div className="mt-4 grid gap-3">
              {["Create the form", "Add fields", "Set visibility", "Review responses"].map(
                (step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="grid size-7 place-items-center rounded-md bg-[#edf1ec] text-xs font-semibold text-[#4d6453]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-[#59645b]">{step}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
            <h3 className="text-base font-semibold text-[#2f5d3b]">Quick links</h3>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-between">
                <Link href="/dashboard/forms">
                  Manage forms
                  <ArrowUpRightIcon />
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-between">
                <Link href="/explore">
                  Explore public forms
                  <ArrowUpRightIcon />
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
