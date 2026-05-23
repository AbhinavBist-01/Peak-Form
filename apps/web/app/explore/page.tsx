"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon, EyeOffIcon, FileTextIcon, Loader2Icon, SearchIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid gap-2">
              <Badge variant="outline" className="w-fit gap-1">
                <FileTextIcon className="size-3" />
                Public forms
              </Badge>
              <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">Explore forms</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Browse forms creators have intentionally published to public listings.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/forms">Creator dashboard</Link>
            </Button>
          </div>

          <div className="relative max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, description, or theme"
              className="pl-9"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load public forms</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
            <Loader2Icon className="mr-2 size-4 animate-spin" />
            Loading public forms...
          </div>
        ) : filteredForms.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <PublicFormCard key={form.id} form={form} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-64 place-items-center rounded-lg border border-dashed p-8 text-center">
            <div className="grid max-w-sm gap-2">
              <EyeOffIcon className="mx-auto size-8 text-muted-foreground" />
              <h2 className="text-lg font-medium tracking-normal">No public forms found</h2>
              <p className="text-sm text-muted-foreground">
                Public forms appear here after creators publish them with public visibility.
              </p>
            </div>
          </div>
        )}

        {isFetching && !isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Refreshing forms...</p>
        ) : null}
      </section>
    </main>
  );
}

function PublicFormCard({ form }: { form: PublicForm }) {
  const theme = form.themeConfig;

  return (
    <article
      className="grid min-h-64 content-between gap-5 rounded-lg border p-5 shadow-sm"
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
        fontFamily: theme?.fontFamily,
      }}
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="secondary">{theme?.name ?? "PeakForm"}</Badge>
          <Badge variant="outline">{formatDate(form.publishedAt)}</Badge>
        </div>
        <div className="grid gap-2">
          <h2 className="text-xl font-semibold tracking-normal">{form.title}</h2>
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
        style={{
          backgroundColor: theme?.accentColor,
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
