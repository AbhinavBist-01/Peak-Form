"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetFields, useGetFormSubmissionsByFormId } from "~/hooks/api/form";

type FormField = NonNullable<ReturnType<typeof useGetFields>["fields"]>[number];
type FormSubmission = NonNullable<
  ReturnType<typeof useGetFormSubmissionsByFormId>["submissions"]
>[number];

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function getFormId(params: ReturnType<typeof useParams>) {
  const id = params.id;

  if (Array.isArray(id)) {
    return id[0] ?? "";
  }

  return id ?? "";
}

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

function getSubmissionValue(submission: FormSubmission, field: FormField) {
  const value = submission.values.find((entry) => entry.formFieldId === field.id)?.value;

  if (!value?.trim()) {
    return "No answer";
  }

  if (field.type === "CHECKBOX" && value === "on") {
    return "Checked";
  }

  return value;
}

export default function Page() {
  const params = useParams();
  const formId = getFormId(params);

  const {
    fields = [],
    error: fieldsError,
    isLoading: isLoadingFields,
    isFetching: isFetchingFields,
  } = useGetFields(formId);
  const {
    submissions = [],
    error: submissionsError,
    isLoading: isLoadingSubmissions,
    isFetching: isFetchingSubmissions,
  } = useGetFormSubmissionsByFormId(formId);

  const isLoading = isLoadingFields || isLoadingSubmissions;
  const isRefreshing = isFetchingFields || isFetchingSubmissions;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Submissions" />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-normal">Submissions</h2>
                <p className="text-sm text-muted-foreground">Form ID: {formId}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/forms/${formId}`}>
                  <ArrowLeftIcon />
                  Back to editor
                </Link>
              </Button>
            </div>

            {fieldsError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not load fields</AlertTitle>
                <AlertDescription>{fieldsError.message}</AlertDescription>
              </Alert>
            ) : null}

            {submissionsError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not load submissions</AlertTitle>
                <AlertDescription>{submissionsError.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{submissions.length} submissions</Badge>
              <Badge variant="outline">{fields.length} fields</Badge>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="min-w-48">Submitted</TableHead>
                    {fields.map((field) => (
                      <TableHead key={field.id} className="min-w-48">
                        <div className="grid gap-1">
                          <span>{field.label}</span>
                          <span className="font-mono text-xs font-normal text-muted-foreground">
                            {field.labelKey}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={Math.max(fields.length + 1, 1)}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Loading submissions...
                      </TableCell>
                    </TableRow>
                  ) : !fields.length ? (
                    <TableRow>
                      <TableCell className="h-32 text-center text-muted-foreground">
                        Add fields before reviewing submissions.
                      </TableCell>
                    </TableRow>
                  ) : submissions.length ? (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatDate(submission.createdAt)}
                        </TableCell>
                        {fields.map((field) => (
                          <TableCell key={field.id} className="max-w-80 align-top">
                            <span className="line-clamp-3 break-words">
                              {getSubmissionValue(submission, field)}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={fields.length + 1}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No submissions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {isRefreshing && !isLoading ? (
              <p className="text-sm text-muted-foreground">Refreshing submissions...</p>
            ) : null}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
