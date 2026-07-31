"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  BarChart3Icon,
  DownloadIcon,
  EyeIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  useDeleteFormSubmission,
  useExportFormSubmissionsCsv,
  useGetFields,
  useGetFormSubmissionAnalytics,
  useGetFormSubmissionById,
  useGetFormSubmissionsByFormId,
} from "~/hooks/api/form";

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

function getSubmissionValue(submission: FormSubmission | undefined, field: FormField) {
  const value = submission?.values.find((entry) => entry.formFieldId === field.id)?.value;

  if (!value?.trim()) {
    return "No answer";
  }

  if (field.type === "CHECKBOX" && value === "on") {
    return "Checked";
  }

  return value;
}

function downloadCsv(fileName: string, mimeType: string, content: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function Page() {
  const params = useParams();
  const formId = getFormId(params);
  const [selectedSubmissionId, setSelectedSubmissionId] = React.useState<string | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = React.useDeferredValue(search);

  const {
    fields = [],
    error: fieldsError,
    isLoading: isLoadingFields,
    isFetching: isFetchingFields,
  } = useGetFields(formId);
  const {
    submissions = [],
    submissionPage,
    error: submissionsError,
    isLoading: isLoadingSubmissions,
    isFetching: isFetchingSubmissions,
  } = useGetFormSubmissionsByFormId(formId, {
    page,
    pageSize: 10,
    search: debouncedSearch || undefined,
  });
  const {
    analytics,
    error: analyticsError,
    isLoading: isLoadingAnalytics,
    isFetching: isFetchingAnalytics,
  } = useGetFormSubmissionAnalytics(formId);
  const { submission: selectedSubmission, isLoading: isLoadingSelectedSubmission } =
    useGetFormSubmissionById(selectedSubmissionId);
  const {
    deleteFormSubmissionAsync,
    error: deleteSubmissionError,
    status: deleteSubmissionStatus,
  } = useDeleteFormSubmission();
  const { exportFormSubmissionsCsvAsync } = useExportFormSubmissionsCsv();

  const isLoading = isLoadingFields || isLoadingSubmissions || isLoadingAnalytics;
  const isRefreshing = isFetchingFields || isFetchingSubmissions || isFetchingAnalytics;
  const isDeleting = deleteSubmissionStatus === "pending";
  const ratingSummaries =
    analytics?.fieldSummaries.filter((summary) => summary.ratingAverage !== null) ?? [];
  const distributionSummaries =
    analytics?.fieldSummaries.filter((summary) => summary.distribution.length > 0) ?? [];

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const onExportCsv = async () => {
    if (!formId) {
      return;
    }

    setIsExporting(true);

    try {
      const result = await exportFormSubmissionsCsvAsync(formId);
      downloadCsv(result.fileName, result.mimeType, result.csv);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
              Submissions & Analytics
            </h2>
            <p className="text-xs text-[#78726A] font-mono">
              Form ID: {formId}
              {submissionPage ? ` · ${submissionPage.total} total responses` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="claude-button rounded-xl bg-[#DA7756] px-4 text-xs font-medium text-white hover:bg-[#C66545]"
              disabled={!submissions.length || isExporting}
              onClick={() => void onExportCsv()}
            >
              <DownloadIcon className="mr-1.5 size-3.5" />
              {isExporting ? "Exporting..." : "CSV Export"}
            </Button>
            <Button variant="outline" asChild className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F2ECE1] rounded-xl">
              <Link href={`/dashboard/forms/${formId}`}>
                <ArrowLeftIcon className="mr-1 size-3.5" />
                Back to Editor
              </Link>
            </Button>
          </div>
        </div>

        {[fieldsError, submissionsError, analyticsError, deleteSubmissionError].map((error) =>
          error ? (
            <Alert key={error.message} variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
              <AlertTitle className="font-medium">Something went wrong</AlertTitle>
              <AlertDescription className="text-xs">{error.message}</AlertDescription>
            </Alert>
          ) : null,
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric
            icon={<BarChart3Icon className="size-4 text-[#DA7756]" />}
            label="Responses"
            value={analytics?.responseCount ?? submissions.length}
            isLoading={isLoading}
          />
          <Metric label="Fields" value={fields.length} isLoading={isLoading} />
          <Metric
            label="Trend Days"
            value={analytics?.completionTrend.length ?? 0}
            isLoading={isLoading}
          />
          <Metric label="Rating Fields" value={ratingSummaries.length} isLoading={isLoading} />
        </section>

        <section className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <Input
            value={search}
            placeholder="Search responses by answer or date..."
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 rounded-xl border-[#E5DFD5] bg-white text-xs text-[#2D2926] placeholder:text-[#9E978F] focus:border-[#DA7756]"
          />
          <div className="flex items-center justify-end gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!submissionPage || submissionPage.page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="border-[#E5DFD5] bg-white text-xs text-[#78726A] hover:bg-[#F2ECE1]"
            >
              Previous
            </Button>
            <span className="font-mono text-xs text-[#78726A] px-2">
              Page {submissionPage?.page ?? page} of {submissionPage?.totalPages ?? 1}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!submissionPage || submissionPage.page >= submissionPage.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="border-[#E5DFD5] bg-white text-xs text-[#78726A] hover:bg-[#F2ECE1]"
            >
              Next
            </Button>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-12 items-start">
          <div className="xl:col-span-8 space-y-6">
            <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                <div>
                  <h3 className="peak-serif text-xl font-medium text-[#2D2926]">Completion Trend</h3>
                  <p className="text-xs text-[#78726A]">Responses grouped by date.</p>
                </div>
                <span className="font-mono text-xs text-[#DA7756] bg-[#F7EBE1] px-2.5 py-0.5 rounded-md font-medium">
                  {analytics?.completionTrend.length ?? 0} days
                </span>
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={`trend-skeleton-${index}`} className="space-y-1.5">
                      <Skeleton className="h-4 w-28 bg-[#E5DFD5]/60" />
                      <Skeleton className="h-2 w-full rounded-full bg-[#E5DFD5]/40" />
                    </div>
                  ))
                ) : analytics?.completionTrend.length ? (
                  analytics.completionTrend.map((entry) => (
                    <div key={entry.date} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[#2D2926]">
                        <span>{entry.date}</span>
                        <span className="font-mono font-medium">{entry.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#FAF7F2]">
                        <div
                          className="h-full rounded-full bg-[#DA7756]"
                          style={{
                            width: `${Math.max(
                              6,
                              (entry.count /
                                Math.max(
                                  ...analytics.completionTrend.map((trend) => trend.count),
                                  1,
                                )) *
                                100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#78726A]">No response data yet.</p>
                )}
              </div>
            </div>

            <div className="claude-card overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] shadow-xs">
              <Table>
                <TableHeader className="bg-[#FAF7F2] border-b border-[#E5DFD5]">
                  <TableRow>
                    <TableHead className="min-w-48 text-xs font-mono text-[#78726A]">Submitted</TableHead>
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, index) => (
                          <TableHead key={`field-head-skeleton-${index}`} className="min-w-48">
                            <Skeleton className="h-4 w-24 bg-[#E5DFD5]/60" />
                          </TableHead>
                        ))
                      : fields.slice(0, 4).map((field) => (
                          <TableHead key={field.id} className="min-w-48 text-xs font-mono text-[#78726A]">
                            <span>{field.label}</span>
                          </TableHead>
                        ))}
                    <TableHead className="w-28 text-right text-xs font-mono text-[#78726A]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`submission-skeleton-${index}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-36 bg-[#E5DFD5]/60" />
                        </TableCell>
                        {Array.from({ length: 4 }).map((__, cellIndex) => (
                          <TableCell key={`submission-cell-skeleton-${cellIndex}`}>
                            <Skeleton className="h-4 w-full bg-[#E5DFD5]/40" />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Skeleton className="h-8 w-16 bg-[#E5DFD5]/60 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : !fields.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-xs text-[#78726A]">
                        Add fields to review submission table.
                      </TableCell>
                    </TableRow>
                  ) : submissions.length ? (
                    submissions.map((submission) => (
                      <TableRow key={submission.id} className="transition-colors hover:bg-[#FAF7F2]">
                        <TableCell className="whitespace-nowrap text-xs font-mono text-[#78726A]">
                          {formatDate(submission.createdAt)}
                        </TableCell>
                        {fields.slice(0, 4).map((field) => (
                          <TableCell key={field.id} className="max-w-80 text-xs text-[#2D2926]">
                            <span className="line-clamp-2">
                              {getSubmissionValue(submission, field)}
                            </span>
                          </TableCell>
                        ))}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSubmissionId(submission.id)}
                              className="border-[#E5DFD5] text-xs text-[#2D2926] hover:bg-[#F2ECE1] rounded-lg"
                            >
                              <EyeIcon className="size-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-200 text-xs text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2Icon className="size-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl border-[#E5DFD5] bg-[#FFFDF9]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="peak-serif text-xl font-medium text-[#2D2926]">
                                    Delete response?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-xs text-[#78726A]">
                                    This permanently removes the selected response.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={isDeleting} className="border-[#E5DFD5] text-xs">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={isDeleting}
                                    onClick={() =>
                                      void deleteFormSubmissionAsync({
                                        submissionId: submission.id,
                                      })
                                    }
                                    className="bg-red-600 text-xs font-medium text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={fields.length + 2}
                        className="h-32 text-center text-xs text-[#78726A]"
                      >
                        No submissions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <aside className="xl:col-span-4 space-y-6">
            <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-4">
              <h3 className="peak-serif text-lg font-medium text-[#2D2926] border-b border-[#E5DFD5] pb-3">
                Rating Averages
              </h3>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-full bg-[#E5DFD5]/60" />
                  ))
                ) : ratingSummaries.length ? (
                  ratingSummaries.map((summary) => (
                    <div key={summary.fieldId} className="rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-medium text-[#2D2926]">{summary.label}</span>
                        <div className="flex items-center gap-1 text-[#DA7756] mt-0.5">
                          <StarIcon className="size-3.5 fill-[#DA7756]" />
                          <span className="font-mono text-xs font-medium">{summary.ratingAverage}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#78726A]">{summary.totalAnswers} answers</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#78726A]">No rating fields configured.</p>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Dialog
        open={Boolean(selectedSubmissionId)}
        onOpenChange={(open) => !open && setSelectedSubmissionId(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto rounded-2xl border-[#E5DFD5] bg-[#FFFDF9] p-6">
          <DialogHeader>
            <DialogTitle className="peak-serif text-2xl font-medium text-[#2D2926]">Response Detail</DialogTitle>
            <DialogDescription className="text-xs text-[#78726A]">
              {selectedSubmission
                ? `Submitted ${formatDate(selectedSubmission.createdAt)}`
                : "Loading response..."}
            </DialogDescription>
          </DialogHeader>
          {isLoadingSelectedSubmission ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full bg-[#E5DFD5]/60" />
              ))}
            </div>
          ) : selectedSubmission ? (
            <div className="space-y-3 pt-2">
              {fields.map((field) => (
                <div key={field.id} className="rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-[#2D2926]">
                    <span>{field.label}</span>
                    <span className="font-mono text-[10px] text-[#DA7756] bg-[#F7EBE1] px-2 py-0.5 rounded-md">{field.type}</span>
                  </div>
                  <p className="text-xs text-[#78726A] break-words">
                    {getSubmissionValue(selectedSubmission, field)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#78726A]">Response not found.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Metric({
  icon,
  isLoading,
  label,
  value,
}: {
  icon?: React.ReactNode;
  isLoading?: boolean;
  label: string;
  value: number;
}) {
  return (
    <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-5 shadow-xs flex items-center justify-between">
      <div>
        <span className="text-xs text-[#78726A]">{label}</span>
        {isLoading ? (
          <Skeleton className="h-8 w-14 bg-[#E5DFD5]/60 mt-1" />
        ) : (
          <div className="mt-1 text-3xl font-serif font-medium text-[#2D2926]">{value}</div>
        )}
      </div>
      {icon && (
        <div className="grid size-10 place-items-center rounded-xl bg-[#F7EBE1]">
          {icon}
        </div>
      )}
    </div>
  );
}
