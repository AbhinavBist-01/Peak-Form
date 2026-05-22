"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLinkIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import { useCreateForm, useListForms } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
  expiresAt: string;
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

function getFormStatus(expiresAt: Date | string | null | undefined) {
  if (!expiresAt) {
    return "Open";
  }

  const expiryDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);

  if (Number.isNaN(expiryDate.getTime())) {
    return "Open";
  }

  return expiryDate.getTime() < Date.now() ? "Expired" : "Open";
}

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [createdFormId, setCreatedFormId] = React.useState<string | null>(null);
  const { createFormAsync, error, status } = useCreateForm();
  const {
    forms = [],
    error: listFormsError,
    isLoading: isLoadingForms,
    isFetching: isFetchingForms,
  } = useListForms();
  const isCreating = status === "pending";

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
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link href={`/form/${createdFormId}`}>Open public form</Link>
                  </Button>
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

            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="hidden lg:table-cell">Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingForms ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Loading forms...
                      </TableCell>
                    </TableRow>
                  ) : forms.length ? (
                    forms.map((form) => {
                      const formStatus = getFormStatus(form.expiresAt);

                      return (
                        <TableRow key={form.id}>
                          <TableCell>
                            <div className="grid gap-1">
                              <Button
                                variant="link"
                                className="h-auto justify-start p-0 text-left text-foreground"
                                asChild
                              >
                                <Link href={`/form/${form.id}`}>{form.title}</Link>
                              </Button>
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
                            <Badge variant={formStatus === "Expired" ? "secondary" : "outline"}>
                              {formStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/form/${form.id}`}>
                                  <ExternalLinkIcon />
                                  View
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/dashboard/forms/${form.id}`}>
                                  <PencilIcon />
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
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
