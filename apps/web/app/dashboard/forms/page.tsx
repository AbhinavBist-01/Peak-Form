"use client";

import * as React from "react";
import Link from "next/link";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
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
} from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
};
type FormRow = NonNullable<ReturnType<typeof useListForms>["forms"]>[number];

function getFormStatus(form: FormRow) {
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
    },
  });

  const onSubmit = async (values: CreateFormValues) => {
    const result = await createFormAsync({
      title: values.title,
      description: values.description || undefined,
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
    <div className="@container/main peak-topography peak-topography-motion flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="peak-glass peak-reveal peak-shine grid gap-5 rounded-xl p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
              <div className="space-y-1">
                <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
                  Forms
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[#59645b]">
                  Keep this list simple. Open a form to manage fields, publishing, visibility, themes, and responses.
                </p>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="peak-button-motion bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                    <PlusIcon />
                    New form
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create form</DialogTitle>
                    <DialogDescription>
                      Add the basic details. Publishing, visibility, and theme settings live inside the form editor.
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

            <div className="peak-reveal overflow-hidden rounded-xl border border-[#c3c8c1]/65 bg-white/78 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
              <Table>
                <TableHeader className="bg-[#edf1ec]">
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead className="w-40 text-center">Status</TableHead>
                      <TableHead className="w-48 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {isLoadingForms ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`form-skeleton-${index}`}>
                        <TableCell>
                          <div className="grid gap-2">
                            <Skeleton className="h-4 w-48 bg-[#d0e9d4]/70" />
                            <Skeleton className="h-3 w-72 max-w-full bg-[#edf1ec]" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="mx-auto h-7 w-24 rounded-full bg-[#edf1ec]" />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-9 w-20 bg-[#edf1ec]" />
                            <Skeleton className="h-9 w-24 bg-[#edf1ec]" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : forms.length ? (
                    forms.map((form) => {
                      const formStatus = getFormStatus(form);

                      return (
                        <TableRow key={form.id} className="transition-colors hover:bg-[#edf1ec]/65">
                          <TableCell>
                            <div className="grid gap-1">
                              <Link
                                href={`/dashboard/forms/${form.id}`}
                                className="font-medium text-[#2f5d3b] transition hover:text-[#4d6453]"
                              >
                                {form.title}
                              </Link>
                              {form.description ? (
                                <p className="max-w-[28rem] truncate text-sm text-muted-foreground">
                                  {form.description}
                                </p>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className="min-w-24 justify-center"
                              variant={
                                formStatus === "Published"
                                  ? "default"
                                  : formStatus === "Archived"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {formStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
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
                                    Remove
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete form?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete{" "}
                                      <span className="font-medium">{form.title}</span> and all
                                      of its fields and submissions.
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
                                      {deletingFormId === form.id ? "Removing..." : "Remove form"}
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
                      <TableCell colSpan={3} className="h-32 text-center">
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
  );
}
