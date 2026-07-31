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
    <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
      <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
            All Forms
          </h2>
          <p className="max-w-xl text-xs text-[#78726A]">
            Manage form questions, publishing, themes, and response analytics.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="claude-button rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]">
              <PlusIcon className="mr-1 size-3.5" />
              New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-[#E5DFD5] bg-[#FFFDF9] p-6">
            <DialogHeader>
              <DialogTitle className="peak-serif text-2xl font-medium text-[#2D2926]">
                Create Form
              </DialogTitle>
              <DialogDescription className="text-xs text-[#78726A]">
                Add basic details. Publishing and themes live inside the editor.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-5 pt-2" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="title" className="text-xs font-medium text-[#2D2926]">
                    Title
                  </FieldLabel>
                  <Input
                    id="title"
                    placeholder="e.g. Customer feedback 2026"
                    className="h-11 rounded-xl border-[#E5DFD5] bg-white text-xs text-[#2D2926] focus:border-[#DA7756]"
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
                  <FieldLabel htmlFor="description" className="text-xs font-medium text-[#2D2926]">
                    Description (Optional)
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Context for respondents..."
                    className="min-h-24 rounded-xl border-[#E5DFD5] bg-white text-xs text-[#2D2926] focus:border-[#DA7756]"
                    {...register("description")}
                  />
                </Field>

                {error ? <FieldError>{error.message}</FieldError> : null}
              </FieldGroup>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isCreating}
                  onClick={() => setOpen(false)}
                  className="border-[#E5DFD5] bg-white text-xs text-[#78726A] hover:bg-[#F2ECE1]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating}
                  className="rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
                >
                  {isCreating ? "Creating..." : "Create Form"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {createdFormId ? (
        <Alert className="rounded-xl border-[#E5DFD5] bg-[#F7EBE1] text-[#2D2926]">
          <AlertTitle className="text-xs font-medium">Form created successfully</AlertTitle>
          <AlertDescription className="flex items-center gap-2 text-xs text-[#78726A] pt-1">
            <span>Publish the form when ready.</span>
            <Button variant="link" className="h-auto p-0 text-[#DA7756] font-medium" asChild>
              <Link href={`/dashboard/forms/${createdFormId}`}>Open in editor &rarr;</Link>
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {listFormsError ? (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
          <AlertTitle className="font-medium">Could not load forms</AlertTitle>
          <AlertDescription className="text-xs">{listFormsError.message}</AlertDescription>
        </Alert>
      ) : null}

      {deleteFormError ? (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
          <AlertTitle className="font-medium">Could not delete form</AlertTitle>
          <AlertDescription className="text-xs">{deleteFormError.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="claude-card overflow-hidden rounded-2xl border border-[#E5DFD5] bg-[#FFFDF9] shadow-xs">
        <Table>
          <TableHeader className="bg-[#FAF7F2] border-b border-[#E5DFD5]">
            <TableRow>
              <TableHead className="text-xs font-mono text-[#78726A]">Form Details</TableHead>
              <TableHead className="w-36 text-center text-xs font-mono text-[#78726A]">Status</TableHead>
              <TableHead className="w-48 text-right text-xs font-mono text-[#78726A]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingForms ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`form-skeleton-${index}`}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48 bg-[#E5DFD5]/60" />
                      <Skeleton className="h-3 w-72 bg-[#E5DFD5]/40" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-6 w-20 rounded-md bg-[#E5DFD5]/60" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-16 bg-[#E5DFD5]/60" />
                      <Skeleton className="h-8 w-20 bg-[#E5DFD5]/60" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : forms.length ? (
              forms.map((form) => {
                const formStatus = getFormStatus(form);

                return (
                  <TableRow key={form.id} className="transition-colors hover:bg-[#FAF7F2]">
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          href={`/dashboard/forms/${form.id}`}
                          className="peak-serif text-base font-medium text-[#2D2926] transition hover:text-[#DA7756]"
                        >
                          {form.title}
                        </Link>
                        {form.description ? (
                          <p className="max-w-[28rem] truncate text-xs text-[#78726A]">
                            {form.description}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block min-w-20 rounded-md px-2 py-0.5 text-center text-[11px] font-mono capitalize ${
                          formStatus === "Published"
                            ? "bg-[#F7EBE1] text-[#DA7756]"
                            : formStatus === "Archived"
                            ? "bg-[#E5DFD5] text-[#78726A]"
                            : "bg-[#FAF7F2] text-[#78726A] border border-[#E5DFD5]"
                        }`}
                      >
                        {formStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" asChild className="border-[#E5DFD5] bg-white text-xs text-[#2D2926] hover:bg-[#F2ECE1] rounded-xl">
                          <Link href={`/dashboard/forms/${form.id}`}>
                            <PencilIcon className="mr-1 size-3.5" />
                            Edit
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" disabled={isDeleting} className="border-red-200 text-xs text-red-600 hover:bg-red-50 rounded-xl">
                              <Trash2Icon className="mr-1 size-3.5" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-[#E5DFD5] bg-[#FFFDF9]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="peak-serif text-2xl font-medium text-[#2D2926]">
                                Delete form?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-xs text-[#78726A]">
                                This will permanently delete{" "}
                                <span className="font-medium text-[#2D2926]">{form.title}</span> and all
                                of its fields and submissions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={deletingFormId === form.id} className="border-[#E5DFD5] text-xs">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className={buttonVariants({ variant: "destructive" })}
                                disabled={deletingFormId === form.id}
                                onClick={() => void onDeleteForm(form.id)}
                              >
                                {deletingFormId === form.id ? "Removing..." : "Remove Form"}
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
                <TableCell colSpan={3} className="h-36 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <h3 className="peak-serif text-lg font-medium text-[#2D2926]">No forms yet</h3>
                    <p className="text-xs text-[#78726A]">
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
        <p className="text-xs font-mono text-[#9E978F]">Refreshing forms...</p>
      ) : null}
    </div>
  );
}
