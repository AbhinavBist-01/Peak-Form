"use client";

import * as React from "react";
import Link from "next/link";
import {
  ExternalLinkIcon,
  EyeOffIcon,
  GlobeIcon,
  PencilIcon,
  PlusIcon,
  RocketIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
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
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import {
  useCreateForm,
  useDeleteForm,
  useListForms,
  usePublishForm,
  useUnpublishForm,
  useUpdateFormSettings,
} from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
  expiresAt: string;
};
type FormRow = NonNullable<ReturnType<typeof useListForms>["forms"]>[number];
type SettingsFormValues = {
  title: string;
  description: string;
  visibility: "public" | "unlisted";
  expiresAt: string;
  themeName: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "No expiry";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return dateFormatter.format(date);
}

function toDateTimeLocalValue(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

function getFormStatus(form: FormRow) {
  if (form.status === "published" && form.expiresAt) {
    const expiryDate = new Date(form.expiresAt);

    if (!Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
      return "Expired";
    }
  }

  if (form.status === "published") {
    return "Published";
  }

  if (form.status === "archived") {
    return "Archived";
  }

  return "Draft";
}

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [createdFormId, setCreatedFormId] = React.useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = React.useState<string | null>(null);
  const { createFormAsync, error, status } = useCreateForm();
  const { deleteFormAsync, error: deleteFormError, status: deleteFormStatus } = useDeleteForm();
  const {
    forms = [],
    error: listFormsError,
    isLoading: isLoadingForms,
    isFetching: isFetchingForms,
  } = useListForms();
  const isCreating = status === "pending";
  const isDeleting = deleteFormStatus === "pending";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      expiresAt: "",
    },
  });

  const onSubmit = async (values: CreateFormValues) => {
    const result = await createFormAsync({
      title: values.title,
      description: values.description || undefined,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
    });

    setCreatedFormId(result.id);
    reset();
    setOpen(false);
  };

  const onDeleteForm = async (formId: string) => {
    setDeletingFormId(formId);

    try {
      await deleteFormAsync({ formId });

      if (createdFormId === formId) {
        setCreatedFormId(null);
      }
    } finally {
      setDeletingFormId(null);
    }
  };

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
        <SiteHeader title="Forms" />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-normal">Forms</h2>
                <p className="text-sm text-muted-foreground">
                  Create and manage forms for collecting responses.
                </p>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon />
                    New form
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create form</DialogTitle>
                    <DialogDescription>
                      Add the basic details. Fields can be configured after the form exists.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-4">
                      <Field>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                          id="title"
                          placeholder="Customer feedback"
                          aria-invalid={Boolean(errors.title)}
                          {...register("title", {
                            required: "Title is required",
                            maxLength: {
                              value: 55,
                              message: "Title must be 55 characters or less",
                            },
                          })}
                        />
                        <FieldError errors={[errors.title]} />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea
                          id="description"
                          placeholder="What should respondents know before they start?"
                          className="min-h-24"
                          {...register("description")}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="expiresAt">Expires at</FieldLabel>
                        <Input id="expiresAt" type="datetime-local" {...register("expiresAt")} />
                        <FieldDescription>
                          Leave empty if the form should stay open.
                        </FieldDescription>
                      </Field>

                      {error ? <FieldError>{error.message}</FieldError> : null}
                    </FieldGroup>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isCreating}
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create form"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {createdFormId ? (
              <Alert>
                <AlertTitle>Form created</AlertTitle>
                <AlertDescription className="flex flex-wrap gap-3">
                  Publish the form when you are ready to share it.
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href={`/dashboard/forms/${createdFormId}`}>Open editor</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {listFormsError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not load forms</AlertTitle>
                <AlertDescription>{listFormsError.message}</AlertDescription>
              </Alert>
            ) : null}

            {deleteFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not delete form</AlertTitle>
                <AlertDescription>{deleteFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="hidden lg:table-cell">Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Visibility</TableHead>
                      <TableHead className="w-[30rem] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {isLoadingForms ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        Loading forms...
                      </TableCell>
                    </TableRow>
                  ) : forms.length ? (
                    forms.map((form) => {
                      const formStatus = getFormStatus(form);
                      const isPublished = form.status === "published";

                      return (
                        <TableRow key={form.id}>
                          <TableCell>
                            <div className="grid gap-1">
                              {isPublished ? (
                                <Button
                                  variant="link"
                                  className="h-auto justify-start p-0 text-left text-foreground"
                                  asChild
                                >
                                  <Link href={`/form/${form.id}`}>{form.title}</Link>
                                </Button>
                              ) : (
                                <span className="font-medium">{form.title}</span>
                              )}
                              {form.description ? (
                                <p className="max-w-[28rem] truncate text-sm text-muted-foreground">
                                  {form.description}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-muted-foreground md:table-cell">
                            {formatDate(form.createdAt)}
                          </TableCell>
                          <TableCell className="hidden text-muted-foreground lg:table-cell">
                            {formatDate(form.expiresAt)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                formStatus === "Published"
                                  ? "default"
                                  : formStatus === "Expired"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {formStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="gap-1 capitalize">
                              {form.visibility === "public" ? (
                                <GlobeIcon className="size-3" />
                              ) : (
                                <EyeOffIcon className="size-3" />
                              )}
                              {form.visibility}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {isPublished ? (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/form/${form.id}`}>
                                    <ExternalLinkIcon />
                                    View
                                  </Link>
                                </Button>
                              ) : (
                                <Button size="sm" variant="outline" disabled>
                                  <ExternalLinkIcon />
                                  View
                                </Button>
                              )}
                              <FormLifecycleActions form={form} />
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/forms/${form.id}`}>
                                  <PencilIcon />
                                  Edit
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" disabled={isDeleting}>
                                    <Trash2Icon />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete form?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete "{form.title}" and all of its
                                      fields and submissions.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel disabled={deletingFormId === form.id}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className={buttonVariants({ variant: "destructive" })}
                                      disabled={deletingFormId === form.id}
                                      onClick={() => void onDeleteForm(form.id)}
                                    >
                                      {deletingFormId === form.id ? "Deleting..." : "Delete form"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <div className="mx-auto flex max-w-md flex-col items-center gap-2">
                          <h3 className="text-base font-medium">No forms yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Start by creating a form, then add questions and publish it when ready.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {isFetchingForms && !isLoadingForms ? (
              <p className="text-sm text-muted-foreground">Refreshing forms...</p>
            ) : null}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function FormLifecycleActions({ form }: { form: FormRow }) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const {
    publishFormAsync,
    error: publishError,
    status: publishStatus,
  } = usePublishForm();
  const {
    unpublishFormAsync,
    error: unpublishError,
    status: unpublishStatus,
  } = useUnpublishForm();
  const {
    updateFormSettingsAsync,
    error: settingsError,
    status: settingsStatus,
  } = useUpdateFormSettings();
  const settingsForm = useForm<SettingsFormValues>({
    defaultValues: getSettingsDefaults(form),
  });

  const isPublishing = publishStatus === "pending";
  const isUnpublishing = unpublishStatus === "pending";
  const isSavingSettings = settingsStatus === "pending";
  const isPublished = form.status === "published";

  React.useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    settingsForm.reset(getSettingsDefaults(form));
  }, [form, settingsForm, settingsOpen]);

  const onSaveSettings = async (values: SettingsFormValues) => {
    const themeConfig = {
      name: values.themeName.trim() || undefined,
      backgroundColor: values.backgroundColor.trim() || undefined,
      accentColor: values.accentColor.trim() || undefined,
      textColor: values.textColor.trim() || undefined,
      fontFamily: values.fontFamily.trim() || undefined,
    };
    const hasThemeConfig = Object.values(themeConfig).some(Boolean);

    await updateFormSettingsAsync({
      formId: form.id,
      title: values.title,
      description: values.description.trim() || null,
      visibility: values.visibility,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
      themeConfig: hasThemeConfig ? themeConfig : null,
    });

    setSettingsOpen(false);
  };

  return (
    <>
      {isPublished ? (
        <Button
          size="sm"
          variant="outline"
          disabled={isUnpublishing}
          onClick={() => void unpublishFormAsync({ formId: form.id })}
        >
          <EyeOffIcon />
          {isUnpublishing ? "Unpublishing..." : "Unpublish"}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={isPublishing}
          onClick={() => void publishFormAsync({ formId: form.id })}
        >
          <RocketIcon />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <SettingsIcon />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form settings</DialogTitle>
            <DialogDescription>
              Control visibility, expiry, and the public form theme.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-5" onSubmit={settingsForm.handleSubmit(onSaveSettings)}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor={`settings-title-${form.id}`}>Title</FieldLabel>
                <Input
                  id={`settings-title-${form.id}`}
                  aria-invalid={Boolean(settingsForm.formState.errors.title)}
                  {...settingsForm.register("title", {
                    required: "Title is required",
                    maxLength: {
                      value: 55,
                      message: "Title must be 55 characters or less",
                    },
                  })}
                />
                <FieldError errors={[settingsForm.formState.errors.title]} />
              </Field>

              <Field>
                <FieldLabel htmlFor={`settings-description-${form.id}`}>Description</FieldLabel>
                <Textarea
                  id={`settings-description-${form.id}`}
                  className="min-h-20"
                  {...settingsForm.register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description must be 500 characters or less",
                    },
                  })}
                />
                <FieldError errors={[settingsForm.formState.errors.description]} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`settings-visibility-${form.id}`}>Visibility</FieldLabel>
                  <Select
                    value={settingsForm.watch("visibility")}
                    onValueChange={(value) =>
                      settingsForm.setValue("visibility", value as SettingsFormValues["visibility"])
                    }
                  >
                    <SelectTrigger id={`settings-visibility-${form.id}`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor={`settings-expires-${form.id}`}>Expires at</FieldLabel>
                  <Input
                    id={`settings-expires-${form.id}`}
                    type="datetime-local"
                    {...settingsForm.register("expiresAt")}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`settings-theme-${form.id}`}>Theme name</FieldLabel>
                  <Input
                    id={`settings-theme-${form.id}`}
                    placeholder="Studio night"
                    {...settingsForm.register("themeName")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`settings-font-${form.id}`}>Font family</FieldLabel>
                  <Input
                    id={`settings-font-${form.id}`}
                    placeholder="Inter"
                    {...settingsForm.register("fontFamily")}
                  />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor={`settings-bg-${form.id}`}>Background</FieldLabel>
                  <Input
                    id={`settings-bg-${form.id}`}
                    placeholder="#ffffff"
                    {...settingsForm.register("backgroundColor")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`settings-accent-${form.id}`}>Accent</FieldLabel>
                  <Input
                    id={`settings-accent-${form.id}`}
                    placeholder="#2563eb"
                    {...settingsForm.register("accentColor")}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`settings-text-${form.id}`}>Text</FieldLabel>
                  <Input
                    id={`settings-text-${form.id}`}
                    placeholder="#111827"
                    {...settingsForm.register("textColor")}
                  />
                </Field>
              </div>

              {settingsError ? <FieldError>{settingsError.message}</FieldError> : null}
              {publishError ? <FieldError>{publishError.message}</FieldError> : null}
              {unpublishError ? <FieldError>{unpublishError.message}</FieldError> : null}
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSavingSettings}
                onClick={() => setSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingSettings}>
                {isSavingSettings ? "Saving..." : "Save settings"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getSettingsDefaults(form: FormRow): SettingsFormValues {
  return {
    title: form.title,
    description: form.description ?? "",
    visibility: form.visibility,
    expiresAt: toDateTimeLocalValue(form.expiresAt),
    themeName: form.themeConfig?.name ?? "",
    backgroundColor: form.themeConfig?.backgroundColor ?? "",
    accentColor: form.themeConfig?.accentColor ?? "",
    textColor: form.themeConfig?.textColor ?? "",
    fontFamily: form.themeConfig?.fontFamily ?? "",
  };
}
