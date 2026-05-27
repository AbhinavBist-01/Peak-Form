"use client";

import Link from "next/link";
import { ShieldCheckIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
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
    <div className="@container/main peak-topography peak-topography-motion flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="peak-glass peak-reveal grid gap-4 rounded-xl p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="size-5 text-[#2f5d3b]" />
            <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
              Admin
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#59645b]">
            Platform-level snapshot for demo review, moderation, and form operations.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/forms">Manage forms</Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Admin access unavailable</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="peak-stagger grid gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="peak-glass peak-lift rounded-xl p-4">
            <p className="text-sm text-[#59645b]">{metric.label}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-20 bg-[#d0e9d4]/70" />
            ) : (
              <p className="mt-1 text-3xl font-semibold text-[#2f5d3b]">{metric.value}</p>
            )}
          </div>
        ))}
      </section>

      <section className="peak-reveal overflow-hidden rounded-xl border border-[#c3c8c1]/65 bg-white/78 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-[#edf1ec]">
            <TableRow>
              <TableHead>Recent form</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`admin-skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-[#d0e9d4]/70" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24 rounded-full bg-[#edf1ec]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40 bg-[#edf1ec]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-28 bg-[#edf1ec]" />
                  </TableCell>
                </TableRow>
              ))
            ) : overview?.recentForms.length ? (
              overview.recentForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="font-medium text-[#2f5d3b] hover:underline"
                    >
                      {form.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{form.slug ?? form.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={form.status === "published" ? "default" : "outline"}>
                        {form.status}
                      </Badge>
                      <Badge variant="secondary">{form.visibility}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {form.creatorEmail}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(form.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-sm text-muted-foreground">
                  No forms yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {isFetching && !isLoading ? (
        <p className="text-sm text-muted-foreground">Refreshing admin overview...</p>
      ) : null}
    </div>
  );
}
