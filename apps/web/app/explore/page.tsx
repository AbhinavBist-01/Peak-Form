"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  EyeOffIcon,
  Loader2Icon,
  MountainIcon,
  SearchIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
    <main className="min-h-screen overflow-hidden bg-[#f9faf8] text-[#191c1b]">
      <MarketingNavbar />
      <section className="peak-topography peak-topography-motion border-b border-[#c3c8c1]/55 bg-[#edf1ec]/55">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 md:px-8 md:py-12">
          <div className="peak-glass peak-reveal grid gap-6 rounded-xl p-6 md:grid-cols-[1fr_22rem] md:items-end md:p-8">
            <div className="peak-stagger grid gap-4">
              <Badge className="w-fit gap-2 bg-[#061b0e] text-white">
                <MountainIcon className="peak-icon-breathe size-3.5" />
                Public forms
              </Badge>
              <div className="grid gap-3">
                <h1 className="peak-serif text-4xl font-semibold tracking-normal text-[#061b0e] md:text-5xl">
                  Explore published PeakForms
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-[#59645b] md:text-base md:leading-7">
                  Browse forms creators intentionally made public. Unlisted forms stay hidden and only open from their direct links.
                </p>
              </div>
            </div>

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#59645b]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, description, or theme"
                className="h-12 pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load public forms</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="peak-glass flex min-h-64 items-center justify-center rounded-xl text-sm text-[#59645b]">
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            Loading public forms...
          </div>
        ) : filteredForms.length ? (
          <div className="peak-stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <PublicFormCard key={form.id} form={form} />
            ))}
          </div>
        ) : (
          <div className="peak-glass grid min-h-64 place-items-center rounded-xl border border-dashed border-[#c3c8c1] p-8 text-center">
            <div className="grid max-w-sm gap-2">
              <EyeOffIcon className="mx-auto size-8 text-[#59645b]" />
              <h2 className="peak-serif text-xl font-semibold tracking-normal text-[#061b0e]">No public forms found</h2>
              <p className="text-sm text-[#59645b]">
                Public forms appear here after creators publish them with public visibility.
              </p>
            </div>
          </div>
        )}

        {isFetching && !isLoading ? (
          <p className="mt-4 text-sm text-[#59645b]">Refreshing forms...</p>
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
      className="peak-glass peak-lift peak-shine grid min-h-64 content-between gap-5 rounded-xl p-5"
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
        fontFamily: theme?.fontFamily,
      }}
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <Badge className="bg-[#d0e9d4] text-[#061b0e]">{theme?.name ?? "PeakForm"}</Badge>
          <Badge variant="outline">{formatDate(form.publishedAt)}</Badge>
        </div>
        <div className="grid gap-2">
          <h2 className="peak-serif text-2xl font-semibold tracking-normal">{form.title}</h2>
          {form.description ? (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {form.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Ready for responses.</p>
          )}
        </div>
      </div>

      <Button
        asChild
        className="peak-button-motion"
        style={{
          backgroundColor: theme?.accentColor ?? "#061b0e",
          color: "#ffffff",
        }}
      >
        <Link href={`/form/${form.id}`}>
          Open form
          <ArrowRightIcon />
        </Link>
      </Button>
    </article>
  );
}
