"use client";

import * as React from "react";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
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
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
  expiresAt: string;
};

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [createdFormId, setCreatedFormId] = React.useState<string | null>(null);
  const { createFormAsync, error, status } = useCreateForm();
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
                        <FieldDescription>Leave empty if the form should stay open.</FieldDescription>
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

            <div className="rounded-lg border border-dashed p-8">
              <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
                <h3 className="text-base font-medium">No forms yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start by creating a form, then add questions and publish it when ready.
                </p>
                {createdFormId ? (
                  <p className="text-sm text-muted-foreground">Created form ID: {createdFormId}</p>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
