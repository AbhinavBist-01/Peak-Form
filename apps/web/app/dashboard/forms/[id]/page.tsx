"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeftIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { useCreateField, useDeleteField, useGetFields, useUpdateField } from "~/hooks/api/form";

const fieldTypes = [
  "TEXT",
  "TEXTAREA",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "PASSWORD",
  "EMAIL",
  "YES_NO",
  "DATE",
  "NUMBER",
] as const;

type FieldType = (typeof fieldTypes)[number];
type FieldValues = {
  label: string;
  description: string;
  placeholder: string;
  isRequired: boolean;
  type: FieldType;
  index: string;
};
type FormField = NonNullable<ReturnType<typeof useGetFields>["fields"]>[number];

const defaultFieldValues: FieldValues = {
  label: "",
  description: "",
  placeholder: "",
  isRequired: false,
  type: "TEXT",
  index: "1.00",
};

function getFormId(params: ReturnType<typeof useParams>) {
  const id = params.id;

  if (Array.isArray(id)) {
    return id[0] ?? "";
  }

  return id ?? "";
}

function getNextIndex(fields: FormField[] | undefined) {
  if (!fields?.length) {
    return "1.00";
  }

  const lastIndex = Number(fields[fields.length - 1]?.index);

  if (!Number.isFinite(lastIndex)) {
    return `${fields.length + 1}.00`;
  }

  return (lastIndex + 1).toFixed(2);
}

function toOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toNullableText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export default function Page() {
  const params = useParams();
  const formId = getFormId(params);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingField, setEditingField] = React.useState<FormField | null>(null);

  const {
    fields = [],
    error: getFieldsError,
    isLoading: isLoadingFields,
    isFetching: isFetchingFields,
  } = useGetFields(formId);
  const { createFieldAsync, error: createFieldError, status: createFieldStatus } = useCreateField();
  const { updateFieldAsync, error: updateFieldError, status: updateFieldStatus } = useUpdateField();
  const { deleteFieldAsync, error: deleteFieldError, status: deleteFieldStatus } = useDeleteField();

  const isCreating = createFieldStatus === "pending";
  const isUpdating = updateFieldStatus === "pending";
  const isDeleting = deleteFieldStatus === "pending";

  const createForm = useForm<FieldValues>({
    defaultValues: defaultFieldValues,
  });
  const editForm = useForm<FieldValues>({
    defaultValues: defaultFieldValues,
  });

  const nextIndex = React.useMemo(() => getNextIndex(fields), [fields]);

  React.useEffect(() => {
    if (!createOpen) {
      return;
    }

    createForm.reset({
      ...defaultFieldValues,
      index: nextIndex,
    });
  }, [createForm, createOpen, nextIndex]);

  React.useEffect(() => {
    if (!editingField) {
      return;
    }

    editForm.reset({
      label: editingField.label,
      description: editingField.description ?? "",
      placeholder: editingField.placeholder ?? "",
      isRequired: Boolean(editingField.isRequired),
      type: editingField.type,
      index: editingField.index,
    });
  }, [editForm, editingField]);

  const createType = createForm.watch("type");
  const createIsRequired = createForm.watch("isRequired");
  const editType = editForm.watch("type");
  const editIsRequired = editForm.watch("isRequired");

  const onCreateField = async (values: FieldValues) => {
    if (!formId) {
      return;
    }

    await createFieldAsync({
      formId,
      label: values.label,
      description: toOptionalText(values.description),
      placeholder: toOptionalText(values.placeholder),
      isRequired: values.isRequired,
      type: values.type,
      index: values.index,
    });

    createForm.reset({
      ...defaultFieldValues,
      index: getNextIndex(fields),
    });
    setCreateOpen(false);
  };

  const onUpdateField = async (values: FieldValues) => {
    if (!editingField) {
      return;
    }

    await updateFieldAsync({
      id: editingField.id,
      label: values.label,
      description: toNullableText(values.description),
      placeholder: toNullableText(values.placeholder),
      isRequired: values.isRequired,
      type: values.type,
      index: values.index,
    });

    setEditingField(null);
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
        <SiteHeader title="Edit form" />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-normal">Edit form</h2>
                <p className="text-sm text-muted-foreground">Form ID: {formId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/forms">
                    <ArrowLeftIcon />
                    Back
                  </Link>
                </Button>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon />
                      Add field
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add field</DialogTitle>
                      <DialogDescription>
                        Field keys are generated from the first label and stay stable.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-5" onSubmit={createForm.handleSubmit(onCreateField)}>
                      <FieldEditor
                        errorMessage={createFieldError?.message}
                        form={createForm}
                        isRequired={createIsRequired}
                        type={createType}
                      />
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isCreating}
                          onClick={() => setCreateOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                          {isCreating ? "Adding..." : "Add field"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {getFieldsError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not load fields</AlertTitle>
                <AlertDescription>{getFieldsError.message}</AlertDescription>
              </Alert>
            ) : null}

            {deleteFieldError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not delete field</AlertTitle>
                <AlertDescription>{deleteFieldError.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead className="hidden md:table-cell">Key</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden lg:table-cell">Index</TableHead>
                    <TableHead className="w-36 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingFields ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Loading fields...
                      </TableCell>
                    </TableRow>
                  ) : fields.length ? (
                    fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div className="grid gap-1">
                            <div className="font-medium">{field.label}</div>
                            {field.description ? (
                              <p className="max-w-[28rem] truncate text-sm text-muted-foreground">
                                {field.description}
                              </p>
                            ) : null}
                            {field.isRequired ? (
                              <Badge variant="outline" className="w-fit">
                                Required
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                          {field.labelKey}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{field.type}</Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                          {field.index}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setEditingField(field)}
                            >
                              <PencilIcon />
                              <span className="sr-only">Edit field</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                  <Trash2Icon />
                                  <span className="sr-only">Delete field</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete field</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This removes the field from the form.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel disabled={isDeleting}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    disabled={isDeleting}
                                    onClick={() => deleteFieldAsync({ id: field.id })}
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
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="mx-auto flex max-w-md flex-col items-center gap-2">
                          <h3 className="text-base font-medium">No fields yet</h3>
                          <p className="text-sm text-muted-foreground">
                            Add the first field for this form.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {isFetchingFields && !isLoadingFields ? (
              <p className="text-sm text-muted-foreground">Refreshing fields...</p>
            ) : null}
          </div>
        </main>

        <Dialog
          open={Boolean(editingField)}
          onOpenChange={(open) => !open && setEditingField(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit field</DialogTitle>
              <DialogDescription>
                Label key stays unchanged:{" "}
                <span className="font-mono">{editingField?.labelKey ?? ""}</span>
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-5" onSubmit={editForm.handleSubmit(onUpdateField)}>
              <FieldEditor
                errorMessage={updateFieldError?.message}
                form={editForm}
                isRequired={editIsRequired}
                type={editType}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() => setEditingField(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}

function FieldEditor({
  errorMessage,
  form,
  isRequired,
  type,
}: {
  errorMessage?: string;
  form: ReturnType<typeof useForm<FieldValues>>;
  isRequired: boolean;
  type: FieldType;
}) {
  const {
    formState: { errors },
    register,
    setValue,
  } = form;

  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor="label">Label</FieldLabel>
        <Input
          id="label"
          placeholder="Email address"
          aria-invalid={Boolean(errors.label)}
          {...register("label", {
            required: "Label is required",
            maxLength: {
              value: 100,
              message: "Label must be 100 characters or less",
            },
          })}
        />
        <FieldError errors={[errors.label]} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="type">Type</FieldLabel>
          <Select value={type} onValueChange={(value) => setValue("type", value as FieldType)}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((fieldType) => (
                <SelectItem key={fieldType} value={fieldType}>
                  {fieldType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="index">Index</FieldLabel>
          <Input
            id="index"
            placeholder="1.00"
            aria-invalid={Boolean(errors.index)}
            {...register("index", {
              required: "Index is required",
            })}
          />
          <FieldDescription>Fractional sort value.</FieldDescription>
          <FieldError errors={[errors.index]} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="placeholder">Placeholder</FieldLabel>
        <Input id="placeholder" placeholder="name@example.com" {...register("placeholder")} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="Shown near the field."
          className="min-h-20"
          {...register("description")}
        />
      </Field>

      <Field orientation="horizontal" className="justify-between rounded-lg border p-3">
        <div className="space-y-1">
          <FieldLabel htmlFor="isRequired">Required</FieldLabel>
          <FieldDescription>Respondents must answer this field.</FieldDescription>
        </div>
        <Switch
          id="isRequired"
          checked={isRequired}
          onCheckedChange={(checked) => setValue("isRequired", checked)}
        />
      </Field>

      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </FieldGroup>
  );
}
