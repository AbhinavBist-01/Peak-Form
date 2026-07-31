"use client";

import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetAdminOverview } from "~/hooks/api/form";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return dateFormatter.format(date);
}

export default function Page() {
  const { overview, error, isLoading, isFetching } = useGetAdminOverview();
  const metrics = [
    { label: "Users", value: overview?.userCount ?? 0 },
    { label: "Forms", value: overview?.formCount ?? 0 },
    { label: "Published", value: overview?.publishedCount ?? 0 },
    { label: "Responses", value: overview?.responseCount ?? 0 },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
      <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5 text-[#DA7756]" />
            <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
              Admin Workspace
            </h2>
          </div>
          <p className="max-w-2xl text-xs text-[#78726A]">
            Platform-level snapshot for form operations, creator accounts, and system analytics.
          </p>
        </div>
        <Button variant="outline" asChild className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F2ECE1] rounded-xl">
          <Link href="/dashboard/forms">Manage Forms</Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
          <AlertTitle className="font-medium">Admin access unavailable</AlertTitle>
          <AlertDescription className="text-xs">{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-5 shadow-xs">
            <p className="text-xs text-[#78726A]">{metric.label}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-20 bg-[#E5DFD5]/60" />
            ) : (
              <p className="mt-1 text-3xl font-serif font-medium text-[#2D2926]">{metric.value}</p>
            )}
          </div>
        ))}
      </section>

      <section className="claude-card overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] shadow-xs">
        <Table>
          <TableHeader className="bg-[#FAF7F2] border-b border-[#E5DFD5]">
            <TableRow>
              <TableHead className="text-xs font-mono text-[#78726A]">Recent Form</TableHead>
              <TableHead className="text-xs font-mono text-[#78726A]">Status & Visibility</TableHead>
              <TableHead className="text-xs font-mono text-[#78726A]">Creator Email</TableHead>
              <TableHead className="text-right text-xs font-mono text-[#78726A]">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`admin-skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-[#E5DFD5]/60" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24 rounded-md bg-[#E5DFD5]/60" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 bg-[#E5DFD5]/40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-28 bg-[#E5DFD5]/40" />
                  </TableCell>
                </TableRow>
              ))
            ) : overview?.recentForms.length ? (
              overview.recentForms.map((form) => (
                <TableRow key={form.id} className="transition-colors hover:bg-[#FAF7F2]">
                  <TableCell>
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="peak-serif text-base font-medium text-[#2D2926] transition hover:text-[#DA7756]"
                    >
                      {form.title}
                    </Link>
                    <p className="text-[11px] font-mono text-[#9E978F]">{form.slug ?? form.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-mono capitalize ${
                          form.status === "published"
                            ? "bg-[#F7EBE1] text-[#DA7756]"
                            : "bg-[#FAF7F2] text-[#78726A] border border-[#E5DFD5]"
                        }`}
                      >
                        {form.status}
                      </span>
                      <span className="rounded-md border border-[#E5DFD5] bg-[#FAF7F2] px-2 py-0.5 text-[11px] font-mono text-[#78726A]">
                        {form.visibility}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-[#78726A] font-mono">
                    {form.creatorEmail}
                  </TableCell>
                  <TableCell className="text-right text-xs text-[#78726A] font-mono">
                    {formatDate(form.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-28 text-center text-xs text-[#78726A]">
                  No forms created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {isFetching && !isLoading ? (
        <p className="text-xs font-mono text-[#9E978F]">Refreshing admin overview...</p>
      ) : null}
    </div>
  );
}
