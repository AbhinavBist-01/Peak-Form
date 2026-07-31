"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  EyeOffIcon,
  SearchIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { MarketingFooter, MarketingNavbar } from "~/components/marketing-chrome";
import { useListPublicForms } from "~/hooks/api/form";

type PublicForm = NonNullable<ReturnType<typeof useListPublicForms>["forms"]>[number];

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Recently published";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return dateFormatter.format(date);
}

function formMatchesQuery(form: PublicForm, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [form.title, form.description ?? "", form.themeConfig?.name ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}

export default function ExplorePage() {
  const { forms = [], error, isLoading, isFetching } = useListPublicForms();
  const [query, setQuery] = React.useState("");
  const filteredForms = forms.filter((form) => formMatchesQuery(form, query));

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2926]">
      <MarketingNavbar />

      {/* Spacious Claude Header Section */}
      <section className="border-b border-[#E5DFD5] bg-[#F4EFE6]/40 py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3 max-w-xl">
              <h1 className="peak-serif text-4xl font-medium tracking-tight text-[#2D2926] md:text-5xl">
                Explore published PeakForms
              </h1>
              <p className="text-base text-[#78726A] leading-relaxed">
                Browse forms creators intentionally made public. Unlisted forms stay hidden and only open from their direct links.
              </p>
            </div>

            {/* Sleek Minimal Search Input */}
            <div className="relative w-full max-w-md">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9E978F]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, description, or theme..."
                className="h-12 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] pl-10 text-xs text-[#2D2926] placeholder:text-[#9E978F] focus:border-[#DA7756] focus:ring-0 shadow-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Grid Section */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        {error ? (
          <Alert variant="destructive" className="mb-8 rounded-xl border-red-200 bg-red-50 text-red-900">
            <AlertTitle className="font-medium">Could not load public forms</AlertTitle>
            <AlertDescription className="text-xs">{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <article key={`public-form-skeleton-${index}`} className="claude-card grid min-h-60 content-between gap-5 rounded-2xl bg-[#FFFDF9] p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20 rounded-md bg-[#E5DFD5]/60" />
                    <Skeleton className="h-4 w-24 rounded-md bg-[#E5DFD5]/40" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-3/4 bg-[#E5DFD5]/60" />
                    <Skeleton className="h-4 w-full bg-[#E5DFD5]/40" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl bg-[#E5DFD5]/60" />
              </article>
            ))}
          </div>
        ) : filteredForms.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <PublicFormCard key={form.id} form={form} />
            ))}
          </div>
        ) : (
          <div className="claude-card grid min-h-64 place-items-center rounded-2xl bg-[#FFFDF9] p-12 text-center">
            <div className="grid max-w-sm gap-3">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#F7EBE1] text-[#DA7756]">
                <EyeOffIcon className="size-6" />
              </div>
              <h2 className="peak-serif text-2xl font-medium tracking-tight text-[#2D2926]">No public forms found</h2>
              <p className="text-xs leading-relaxed text-[#78726A]">
                Public forms appear here after creators publish them with public visibility.
              </p>
            </div>
          </div>
        )}

        {isFetching && !isLoading ? (
          <p className="mt-6 text-xs text-[#78726A] font-mono">Refreshing published forms...</p>
        ) : null}
      </section>

      <MarketingFooter />
    </main>
  );
}

function PublicFormCard({ form }: { form: PublicForm }) {
  const theme = form.themeConfig;

  return (
    <article
      className="claude-card grid min-h-60 content-between gap-5 rounded-2xl bg-[#FFFDF9] p-6 shadow-xs"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[#9E978F]">
          <span className="font-medium text-[#DA7756]">Published Form</span>
          <span>{formatDate(form.publishedAt)}</span>
        </div>
        <div className="space-y-2">
          <h2 className="peak-serif text-2xl font-medium text-[#2D2926] leading-snug">{form.title}</h2>
          {form.description ? (
            <p className="line-clamp-3 text-xs leading-relaxed text-[#78726A]">
              {form.description}
            </p>
          ) : (
            <p className="text-xs text-[#9E978F]">Ready for responses.</p>
          )}
        </div>
      </div>

      <Button
        asChild
        className="claude-button w-full rounded-xl bg-[#DA7756] px-4 text-xs font-medium text-white hover:bg-[#C66545]"
      >
        <Link href={`/form/${form.slug ?? form.id}`}>
          Open form
          <ArrowRightIcon className="ml-1 size-3.5" />
        </Link>
      </Button>
    </article>
  );
}
