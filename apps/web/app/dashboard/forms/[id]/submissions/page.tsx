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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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

function downloadCsv(fileName: string, mimeType: string, csv: string) {
  const blob = new Blob([csv], { type: mimeType });
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
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6 peak-topography">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-normal">Submissions</h2>
                <p className="text-sm text-muted-foreground">Form ID: {formId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  disabled={!submissions.length || isExporting}
                  onClick={() => void onExportCsv()}
                >
                  <DownloadIcon />
                  {isExporting ? "Exporting..." : "CSV export"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/forms/${formId}`}>
                    <ArrowLeftIcon />
                    Back to editor
                  </Link>
                </Button>
              </div>
            </div>

            {[fieldsError, submissionsError, analyticsError, deleteSubmissionError].map((error) =>
              error ? (
                <Alert key={error.message} variant="destructive">
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ) : null,
            )}

            <section className="grid gap-3 md:grid-cols-4">
              <Metric
                icon={<BarChart3Icon className="size-4" />}
                label="Responses"
                value={analytics?.responseCount ?? submissions.length}
              />
              <Metric label="Fields" value={fields.length} />
              <Metric label="Trend days" value={analytics?.completionTrend.length ?? 0} />
              <Metric label="Rating fields" value={ratingSummaries.length} />
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="grid gap-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold tracking-normal">Completion trend</h3>
                      <p className="text-sm text-muted-foreground">Responses by submission date.</p>
                    </div>
                    <Badge variant="outline">{analytics?.completionTrend.length ?? 0} days</Badge>
                  </div>
                  <div className="grid gap-2">
                    {analytics?.completionTrend.length ? (
                      analytics.completionTrend.map((entry) => (
                        <div key={entry.date} className="grid gap-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{entry.date}</span>
                            <span className="font-medium">{entry.count}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
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
                      <p className="text-sm text-muted-foreground">No responses yet.</p>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead className="min-w-48">Submitted</TableHead>
                        {fields.slice(0, 4).map((field) => (
                          <TableHead key={field.id} className="min-w-48">
                            <div className="grid gap-1">
                              <span>{field.label}</span>
                              <span className="font-mono text-xs font-normal text-muted-foreground">
                                {field.labelKey}
                              </span>
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="w-32 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell
                            colSpan={Math.max(Math.min(fields.length, 4) + 2, 1)}
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
                            {fields.slice(0, 4).map((field) => (
                              <TableCell key={field.id} className="max-w-80 align-top">
                                <span className="line-clamp-3 break-words">
                                  {getSubmissionValue(submission, field)}
                                </span>
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => setSelectedSubmissionId(submission.id)}
                                >
                                  <EyeIcon />
                                  <span className="sr-only">View response</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="icon" variant="outline">
                                      <Trash2Icon />
                                      <span className="sr-only">Delete response</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete response</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This permanently removes the selected response.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel disabled={isDeleting}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        disabled={isDeleting}
                                        onClick={() =>
                                          void deleteFormSubmissionAsync({
                                            submissionId: submission.id,
                                          })
                                        }
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
                            className="h-32 text-center text-muted-foreground"
                          >
                            No submissions yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <aside className="grid content-start gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-base font-semibold tracking-normal">Rating averages</h3>
                  <div className="grid gap-3">
                    {ratingSummaries.length ? (
                      ratingSummaries.map((summary) => (
                        <div key={summary.fieldId} className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{summary.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {summary.totalAnswers} answers
                            </p>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <StarIcon className="size-3" />
                            {summary.ratingAverage}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No rating answers yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-base font-semibold tracking-normal">Field summaries</h3>
                  <div className="grid gap-4">
                    {analytics?.fieldSummaries.length ? (
                      analytics.fieldSummaries.map((summary) => (
                        <div key={summary.fieldId} className="grid gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{summary.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {summary.totalAnswers} answers, {summary.completionRate}%
                                completion
                              </p>
                            </div>
                            <Badge variant="outline">{summary.type}</Badge>
                          </div>
                          {summary.distribution.length ? (
                            <div className="grid gap-2">
                              {summary.distribution.slice(0, 5).map((entry) => (
                                <div key={entry.value} className="grid gap-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="truncate">{entry.value}</span>
                                    <span>{entry.count}</span>
                                  </div>
                                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className="h-full rounded-full bg-primary"
                                      style={{ width: `${Math.max(4, entry.percentage)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No field data yet.</p>
                    )}
                  </div>
                </div>
              </aside>
            </section>

            {distributionSummaries.length ? (
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {distributionSummaries.map((summary) => (
                  <div key={summary.fieldId} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold tracking-normal">{summary.label}</h3>
                      <Badge variant="outline">{summary.type}</Badge>
                    </div>
                    <div className="grid gap-2">
                      {summary.distribution.map((entry) => (
                        <div key={entry.value} className="grid gap-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{entry.value}</span>
                            <span className="text-muted-foreground">
                              {entry.count} / {entry.percentage}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${Math.max(4, entry.percentage)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            {isRefreshing && !isLoading ? (
              <p className="text-sm text-muted-foreground">Refreshing submissions...</p>
            ) : null}
          </div>

        <Dialog
          open={Boolean(selectedSubmissionId)}
          onOpenChange={(open) => !open && setSelectedSubmissionId(null)}
        >
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Response detail</DialogTitle>
              <DialogDescription>
                {selectedSubmission
                  ? `Submitted ${formatDate(selectedSubmission.createdAt)}`
                  : "Loading response..."}
              </DialogDescription>
            </DialogHeader>
            {isLoadingSelectedSubmission ? (
              <p className="text-sm text-muted-foreground">Loading response...</p>
            ) : selectedSubmission ? (
              <div className="grid gap-3">
                {fields.map((field) => (
                  <div key={field.id} className="rounded-lg border p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{field.label}</p>
                      <Badge variant="outline">{field.type}</Badge>
                    </div>
                    <p className="break-words text-sm text-muted-foreground">
                      {getSubmissionValue(selectedSubmission, field)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Response not found.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between gap-3 text-muted-foreground">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-semibold tracking-normal">{value}</p>
    </div>
  );
}
