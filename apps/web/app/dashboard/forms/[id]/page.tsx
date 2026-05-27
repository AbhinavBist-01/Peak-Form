"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  GlobeIcon,
  InboxIcon,
  PencilIcon,
  PlusIcon,
  RocketIcon,
  Trash2Icon,
} from "lucide-react";
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
import { Skeleton } from "~/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import {
  useCreateField,
  useArchiveForm,
  useCloneForm,
  useDeleteField,
  useGetFormForEditor,
  usePublishForm,
  useUnpublishForm,
  useUpdateField,
  useUpdateFormSettings,
} from "~/hooks/api/form";

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
  "RATING",
] as const;

type FieldType = (typeof fieldTypes)[number];
type FieldValues = {
  label: string;
  description: string;
  placeholder: string;
  optionsText: string;
  min: string;
  max: string;
  isRequired: boolean;
  type: FieldType;
  index: string;
  conditionalFieldId: string;
  conditionalOperator: "equals" | "not_equals" | "contains" | "not_empty";
  conditionalValue: string;
};
type FormField = NonNullable<ReturnType<typeof useGetFormForEditor>["fields"]>[number];
type EditorForm = NonNullable<ReturnType<typeof useGetFormForEditor>["form"]>;
type FormSettingsValues = {
  title: string;
  description: string;
  slug: string;
  visibility: "public" | "unlisted";
  expiresAt: string;
  pageSize: "all" | "1" | "2" | "3" | "5";
  password: string;
  clearPassword: boolean;
  themeName: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
};

const defaultFieldValues: FieldValues = {
  label: "",
  description: "",
  placeholder: "",
  optionsText: "",
  min: "",
  max: "",
  isRequired: false,
  type: "TEXT",
  index: "1.00",
  conditionalFieldId: "none",
  conditionalOperator: "equals",
  conditionalValue: "",
};

const defaultSettingsValues: FormSettingsValues = {
  title: "",
  description: "",
  slug: "",
  visibility: "unlisted",
  expiresAt: "",
  pageSize: "all",
  password: "",
  clearPassword: false,
  themeName: "",
  backgroundColor: "",
  accentColor: "",
  textColor: "",
  fontFamily: "",
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

function getSettingsDefaults(form: EditorForm | undefined): FormSettingsValues {
  if (!form) {
    return defaultSettingsValues;
  }

  return {
    title: form.title,
    description: form.description ?? "",
    slug: form.slug ?? "",
    visibility: form.visibility,
    expiresAt: toDateTimeLocalValue(form.expiresAt),
    pageSize: form.pageSize,
    password: "",
    clearPassword: false,
    themeName: form.themeConfig?.name ?? "",
    backgroundColor: form.themeConfig?.backgroundColor ?? "",
    accentColor: form.themeConfig?.accentColor ?? "",
    textColor: form.themeConfig?.textColor ?? "",
    fontFamily: form.themeConfig?.fontFamily ?? "",
  };
}

function getFormStatusLabel(form: EditorForm | undefined) {
  if (!form) {
    return "Loading";
  }

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

function toOptionalNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return Number(trimmed);
}

function toNullableNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return Number(trimmed);
}

function parseOptions(value: string) {
  const options = value
    .split(/\r?\n/)
    .map((option) => option.trim())
    .filter(Boolean);

  return options.length ? options : undefined;
}

function parseNullableOptions(value: string) {
  return parseOptions(value) ?? null;
}

function formatOptions(options: string[] | null | undefined) {
  return options?.join("\n") ?? "";
}

function getConditionalDefaults(field: FormField) {
  const condition = field.validationRules?.conditionalLogic;

  return {
    conditionalFieldId: condition?.fieldId ?? "none",
    conditionalOperator: condition?.operator ?? "equals",
    conditionalValue: condition?.value ?? "",
  };
}

function supportsOptions(type: FieldType) {
  return type === "SELECT" || type === "RADIO" || type === "CHECKBOX";
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const formId = getFormId(params);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingField, setEditingField] = React.useState<FormField | null>(null);

  const {
    form: editorFormData,
    fields = [],
    error: getFormError,
    isLoading: isLoadingForm,
    isFetching: isFetchingForm,
  } = useGetFormForEditor(formId);
  const { createFieldAsync, error: createFieldError, status: createFieldStatus } = useCreateField();
  const { updateFieldAsync, error: updateFieldError, status: updateFieldStatus } = useUpdateField();
  const { deleteFieldAsync, error: deleteFieldError, status: deleteFieldStatus } = useDeleteField();
  const { cloneFormAsync, error: cloneFormError, status: cloneFormStatus } = useCloneForm();
  const { archiveFormAsync, error: archiveFormError, status: archiveFormStatus } = useArchiveForm();
  const {
    updateFormSettingsAsync,
    error: updateFormSettingsError,
    status: updateFormSettingsStatus,
  } = useUpdateFormSettings();
  const { publishFormAsync, error: publishFormError, status: publishFormStatus } = usePublishForm();
  const {
    unpublishFormAsync,
    error: unpublishFormError,
    status: unpublishFormStatus,
  } = useUnpublishForm();

  const isCreating = createFieldStatus === "pending";
  const isUpdating = updateFieldStatus === "pending";
  const isDeleting = deleteFieldStatus === "pending";
  const isCloning = cloneFormStatus === "pending";
  const isArchiving = archiveFormStatus === "pending";
  const isSavingSettings = updateFormSettingsStatus === "pending";
  const isPublishing = publishFormStatus === "pending";
  const isUnpublishing = unpublishFormStatus === "pending";
  const isPublished = editorFormData?.status === "published";

  const createForm = useForm<FieldValues>({
    defaultValues: defaultFieldValues,
  });
  const editForm = useForm<FieldValues>({
    defaultValues: defaultFieldValues,
  });
  const settingsForm = useForm<FormSettingsValues>({
    defaultValues: defaultSettingsValues,
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
      optionsText: formatOptions(editingField.options),
      min: editingField.min === null ? "" : String(editingField.min),
      max: editingField.max === null ? "" : String(editingField.max),
      isRequired: Boolean(editingField.isRequired),
      type: editingField.type,
      index: editingField.index,
      ...getConditionalDefaults(editingField),
    });
  }, [editForm, editingField]);

  React.useEffect(() => {
    settingsForm.reset(getSettingsDefaults(editorFormData));
  }, [editorFormData, settingsForm]);

  const createType = createForm.watch("type");
  const createIsRequired = createForm.watch("isRequired");
  const editType = editForm.watch("type");
  const editIsRequired = editForm.watch("isRequired");

  const onSaveSettings = async (values: FormSettingsValues) => {
    if (!formId) {
      return;
    }

    const themeConfig = {
      name: values.themeName.trim() || undefined,
      backgroundColor: values.backgroundColor.trim() || undefined,
      accentColor: values.accentColor.trim() || undefined,
      textColor: values.textColor.trim() || undefined,
      fontFamily: values.fontFamily.trim() || undefined,
    };
    const hasThemeConfig = Object.values(themeConfig).some(Boolean);

    await updateFormSettingsAsync({
      formId,
      title: values.title,
      description: toNullableText(values.description),
      slug: toNullableText(values.slug),
      visibility: values.visibility,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
      pageSize: values.pageSize,
      password: values.clearPassword ? null : toOptionalText(values.password),
      themeConfig: hasThemeConfig ? themeConfig : null,
    });
  };

  const getValidationRules = (values: FieldValues) => {
    if (values.conditionalFieldId === "none") {
      return undefined;
    }

    return {
      conditionalLogic: {
        fieldId: values.conditionalFieldId,
        operator: values.conditionalOperator,
        value:
          values.conditionalOperator === "not_empty"
            ? undefined
            : values.conditionalValue.trim(),
      },
    };
  };

  const onCreateField = async (values: FieldValues) => {
    if (!formId) {
      return;
    }

    await createFieldAsync({
      formId,
      label: values.label,
      description: toOptionalText(values.description),
      placeholder: toOptionalText(values.placeholder),
      options: supportsOptions(values.type) ? parseOptions(values.optionsText) : undefined,
      validationRules: getValidationRules(values),
      min: toOptionalNumber(values.min),
      max: toOptionalNumber(values.max),
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
      options: supportsOptions(values.type) ? parseNullableOptions(values.optionsText) : null,
      validationRules: getValidationRules(values) ?? null,
      min: toNullableNumber(values.min),
      max: toNullableNumber(values.max),
      isRequired: values.isRequired,
      type: values.type,
      index: values.index,
    });

    setEditingField(null);
  };

  const onCloneForm = async () => {
    if (!formId) {
      return;
    }

    const result = await cloneFormAsync({ formId });
    router.push(`/dashboard/forms/${result.id}`);
  };

  const onArchiveForm = async () => {
    if (!formId) {
      return;
    }

    await archiveFormAsync({ formId });
  };

  return (
    <>
      <div className="@container/main peak-topography peak-topography-motion flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="peak-glass peak-reveal peak-shine grid gap-5 rounded-xl p-5 xl:grid-cols-[1fr_auto] xl:items-center">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isLoadingForm ? (
                    <>
                      <Skeleton className="h-10 w-56 bg-[#d0e9d4]/70" />
                      <Skeleton className="h-6 w-20 rounded-full bg-[#edf1ec]" />
                    </>
                  ) : (
                    <>
                      <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
                        {editorFormData?.title ?? "Edit form"}
                      </h2>
                      <Badge variant={isPublished ? "default" : "outline"}>
                        {getFormStatusLabel(editorFormData)}
                      </Badge>
                    </>
                  )}
                  {editorFormData ? (
                    <Badge variant="outline" className="gap-1 capitalize">
                      {editorFormData.visibility === "public" ? (
                        <GlobeIcon className="size-3" />
                      ) : (
                        <EyeOffIcon className="size-3" />
                      )}
                      {editorFormData.visibility}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-[#59645b]">Form ID: {formId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/forms">
                    <ArrowLeftIcon />
                    Back
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/forms/${formId}/submissions`}>
                    <InboxIcon />
                    Submissions
                  </Link>
                </Button>
                {isPublished ? (
                  <Button variant="outline" asChild>
                    <Link href={`/form/${editorFormData?.slug ?? formId}`}>
                      <ExternalLinkIcon />
                      View
                    </Link>
                  </Button>
                ) : null}
                <Button variant="outline" disabled={isCloning} onClick={() => void onCloneForm()}>
                  <CopyIcon />
                  {isCloning ? "Cloning..." : "Clone"}
                </Button>
                <Button
                  variant="outline"
                  disabled={isArchiving || editorFormData?.status === "archived"}
                  onClick={() => void onArchiveForm()}
                >
                  <ArchiveIcon />
                  {isArchiving ? "Archiving..." : "Archive"}
                </Button>
                {isPublished ? (
                  <Button
                    variant="outline"
                    disabled={isUnpublishing}
                    onClick={() => void unpublishFormAsync({ formId })}
                  >
                    <EyeOffIcon />
                    {isUnpublishing ? "Unpublishing..." : "Unpublish"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled={isPublishing}
                    onClick={() => void publishFormAsync({ formId })}
                  >
                    <RocketIcon />
                    {isPublishing ? "Publishing..." : "Publish"}
                  </Button>
                )}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                      <PlusIcon />
                      Add field
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[88svh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
                    <DialogHeader className="px-6 pb-4 pt-6 pr-12">
                      <DialogTitle>Add field</DialogTitle>
                      <DialogDescription>
                        Field keys are generated from the first label and stay stable.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      className="flex min-h-0 flex-col"
                      onSubmit={createForm.handleSubmit(onCreateField)}
                    >
                      <div className="max-h-[calc(88svh-11rem)] overflow-y-auto px-6 py-4">
                        <FieldEditor
                          errorMessage={createFieldError?.message}
                          form={createForm}
                          fields={fields}
                          isRequired={createIsRequired}
                          type={createType}
                        />
                      </div>
                      <DialogFooter className="border-t bg-background px-6 py-4">
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

            {getFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not load form</AlertTitle>
                <AlertDescription>{getFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            {updateFormSettingsError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not save settings</AlertTitle>
                <AlertDescription>{updateFormSettingsError.message}</AlertDescription>
              </Alert>
            ) : null}

            {publishFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not publish form</AlertTitle>
                <AlertDescription>{publishFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            {unpublishFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not unpublish form</AlertTitle>
                <AlertDescription>{unpublishFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            {deleteFieldError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not delete field</AlertTitle>
                <AlertDescription>{deleteFieldError.message}</AlertDescription>
              </Alert>
            ) : null}

            {cloneFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not clone form</AlertTitle>
                <AlertDescription>{cloneFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            {archiveFormError ? (
              <Alert variant="destructive">
                <AlertTitle>Could not archive form</AlertTitle>
                <AlertDescription>{archiveFormError.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <div className="grid gap-6">
                <div className="peak-reveal overflow-hidden rounded-xl border border-[#c3c8c1]/65 bg-white/78 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
                  <Table>
                    <TableHeader className="bg-[#edf1ec]">
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead className="hidden md:table-cell">Key</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Index</TableHead>
                        <TableHead className="w-36 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingForm ? (
                        Array.from({ length: 4 }).map((_, index) => (
                          <TableRow key={`field-skeleton-${index}`}>
                            <TableCell>
                              <div className="grid gap-2">
                                <Skeleton className="h-4 w-44 bg-[#d0e9d4]/70" />
                                <Skeleton className="h-3 w-72 max-w-full bg-[#edf1ec]" />
                                <Skeleton className="h-5 w-20 rounded-full bg-[#edf1ec]" />
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Skeleton className="h-4 w-32 bg-[#edf1ec]" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20 rounded-full bg-[#edf1ec]" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Skeleton className="h-4 w-12 bg-[#edf1ec]" />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Skeleton className="size-9 bg-[#edf1ec]" />
                                <Skeleton className="size-9 bg-[#edf1ec]" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
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
                                <div className="flex flex-wrap gap-2">
                                  {field.isRequired ? (
                                    <Badge variant="outline" className="w-fit">
                                      Required
                                    </Badge>
                                  ) : null}
                                  {field.options?.length ? (
                                    <Badge variant="secondary">{field.options.length} options</Badge>
                                  ) : null}
                                </div>
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

                {isFetchingForm && !isLoadingForm ? (
                  <p className="text-sm text-muted-foreground">Refreshing form...</p>
                ) : null}
              </div>

              <aside className="grid content-start gap-4">
                <FormSettingsPanel
                  form={editorFormData}
                  formState={settingsForm}
                  isSaving={isSavingSettings}
                  onSave={onSaveSettings}
                />
                <SharePanel form={editorFormData} />
                <FormPreview form={editorFormData} fields={fields} />
              </aside>
            </div>
          </div>

        <Dialog
          open={Boolean(editingField)}
          onOpenChange={(open) => !open && setEditingField(null)}
        >
          <DialogContent className="max-h-[88svh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
            <DialogHeader className="px-6 pb-4 pt-6 pr-12">
              <DialogTitle>Edit field</DialogTitle>
              <DialogDescription>
                Label key stays unchanged:{" "}
                <span className="font-mono">{editingField?.labelKey ?? ""}</span>
              </DialogDescription>
            </DialogHeader>
            <form className="flex min-h-0 flex-col" onSubmit={editForm.handleSubmit(onUpdateField)}>
              <div className="max-h-[calc(88svh-11rem)] overflow-y-auto px-6 py-4">
                <FieldEditor
                  errorMessage={updateFieldError?.message}
                  form={editForm}
                  fields={fields.filter((field) => field.id !== editingField?.id)}
                  isRequired={editIsRequired}
                  type={editType}
                />
              </div>
              <DialogFooter className="border-t bg-background px-6 py-4">
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
    </>
  );
}

function FormSettingsPanel({
  form,
  formState,
  isSaving,
  onSave,
}: {
  form?: EditorForm;
  formState: ReturnType<typeof useForm<FormSettingsValues>>;
  isSaving: boolean;
  onSave: (values: FormSettingsValues) => Promise<void>;
}) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = formState;
  const visibility = watch("visibility");
  const pageSize = watch("pageSize");
  const clearPassword = watch("clearPassword");

  return (
    <section className="peak-glass peak-lift grid gap-4 rounded-xl p-4">
      <div className="space-y-1">
        <h3 className="peak-serif text-lg font-semibold tracking-normal text-[#2f5d3b]">Settings</h3>
        <p className="text-sm text-[#59645b]">
          {form?.status === "published"
            ? "Published forms can be shared or listed publicly."
            : "Draft forms stay private until published."}
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit(onSave)}>
        <Field>
          <FieldLabel htmlFor="settings-title">Title</FieldLabel>
          <Input
            id="settings-title"
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
          <FieldLabel htmlFor="settings-description">Description</FieldLabel>
          <Textarea
            id="settings-description"
            className="min-h-20"
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must be 500 characters or less",
              },
            })}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="settings-slug">Custom slug</FieldLabel>
          <Input
            id="settings-slug"
            placeholder="startup-feedback"
            {...register("slug", {
              minLength: {
                value: 3,
                message: "Slug must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Slug must be 100 characters or less",
              },
            })}
          />
          <FieldDescription className="text-xs">
            Public link: /form/{watch("slug") || form?.id || "..."}
          </FieldDescription>
          <FieldError errors={[errors.slug]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field>
            <FieldLabel htmlFor="settings-visibility">Visibility</FieldLabel>
            <Select
              value={visibility}
              onValueChange={(value) => setValue("visibility", value as FormSettingsValues["visibility"])}
            >
              <SelectTrigger id="settings-visibility" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="settings-expires">Expires at</FieldLabel>
            <Input id="settings-expires" type="datetime-local" {...register("expiresAt")} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field>
            <FieldLabel htmlFor="settings-pages">Public pages</FieldLabel>
            <Select
              value={pageSize}
              onValueChange={(value) => setValue("pageSize", value as FormSettingsValues["pageSize"])}
            >
              <SelectTrigger id="settings-pages" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Single page</SelectItem>
                <SelectItem value="1">1 question per page</SelectItem>
                <SelectItem value="2">2 questions per page</SelectItem>
                <SelectItem value="3">3 questions per page</SelectItem>
                <SelectItem value="5">5 questions per page</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="settings-password">Form password</FieldLabel>
            <Input
              id="settings-password"
              type="password"
              placeholder={form?.isPasswordProtected ? "Protected" : "Optional"}
              disabled={clearPassword}
              {...register("password", {
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters",
                },
              })}
            />
            <FieldDescription className="text-xs">
              Leave blank to keep the current password.
            </FieldDescription>
            <FieldError errors={[errors.password]} />
          </Field>
        </div>

        {form?.isPasswordProtected ? (
          <Field orientation="horizontal" className="justify-between rounded-lg border p-3">
            <div className="space-y-1">
              <FieldLabel htmlFor="settings-clear-password">Remove password</FieldLabel>
              <FieldDescription className="text-xs">
                Make the published link accessible without a password.
              </FieldDescription>
            </div>
            <Switch
              id="settings-clear-password"
              checked={clearPassword}
              onCheckedChange={(checked) => setValue("clearPassword", checked)}
            />
          </Field>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Field>
            <FieldLabel htmlFor="settings-theme">Theme name</FieldLabel>
            <Input id="settings-theme" placeholder="Studio night" {...register("themeName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-font">Font family</FieldLabel>
            <Input id="settings-font" placeholder="Inter" {...register("fontFamily")} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <Field>
            <FieldLabel htmlFor="settings-bg">Background</FieldLabel>
            <Input id="settings-bg" placeholder="#ffffff" {...register("backgroundColor")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-accent">Accent</FieldLabel>
            <Input id="settings-accent" placeholder="#2563eb" {...register("accentColor")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-text">Text</FieldLabel>
            <Input id="settings-text" placeholder="#111827" {...register("textColor")} />
          </Field>
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save settings"}
        </Button>
      </form>
    </section>
  );
}

function SharePanel({ form }: { form?: EditorForm }) {
  const [origin, setOrigin] = React.useState("");
  const publicPath = form ? `/form/${form.slug ?? form.id}` : "";
  const shareUrl = origin && publicPath ? `${origin}${publicPath}` : publicPath;
  const qrUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=12&data=${encodeURIComponent(shareUrl)}`
    : "";

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <section className="peak-glass peak-lift grid gap-4 rounded-xl p-4">
      <div className="space-y-1">
        <h3 className="peak-serif text-lg font-semibold tracking-normal text-[#2f5d3b]">Share</h3>
        <p className="text-sm text-[#59645b]">
          Custom slug links and QR sharing stay tied to this form.
        </p>
      </div>

      <div className="grid gap-3">
        <Input readOnly value={shareUrl} className="bg-white/75" />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={!shareUrl} onClick={() => void copyLink()}>
            <CopyIcon />
            Copy link
          </Button>
          {form?.status === "published" ? (
            <Button type="button" variant="outline" asChild>
              <Link href={publicPath}>
                <ExternalLinkIcon />
                Open
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {qrUrl ? (
        <div className="grid place-items-center rounded-xl border border-[#c3c8c1]/60 bg-white/80 p-4">
          <div
            aria-label="Form QR code"
            className="size-40 rounded-md bg-contain bg-center bg-no-repeat"
            role="img"
            style={{ backgroundImage: `url(${qrUrl})` }}
          />
        </div>
      ) : null}
    </section>
  );
}

function FormPreview({ form, fields }: { form?: EditorForm; fields: FormField[] }) {
  const theme = form?.themeConfig;

  return (
    <section className="peak-glass peak-lift grid gap-4 rounded-xl p-4">
      <div className="space-y-1">
        <h3 className="peak-serif text-lg font-semibold tracking-normal text-[#2f5d3b]">Preview</h3>
        <p className="text-sm text-[#59645b]">Approximate public form layout.</p>
      </div>

      <div
        className="grid gap-4 rounded-xl border border-[#c3c8c1]/60 bg-white/84 p-4"
        style={{
          backgroundColor: theme?.backgroundColor,
          color: theme?.textColor,
          fontFamily: theme?.fontFamily,
        }}
      >
        <div className="grid gap-1">
          <h4 className="text-lg font-semibold tracking-normal">{form?.title ?? "Untitled form"}</h4>
          {form?.description ? (
            <p className="text-sm text-muted-foreground">{form.description}</p>
          ) : null}
        </div>

        <div className="grid gap-3">
          {fields.length ? (
            fields.slice(0, 5).map((field) => (
              <div key={field.id} className="grid gap-2 rounded-lg border border-[#c3c8c1]/60 bg-white/78 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {field.label}
                    {field.isRequired ? <span className="text-destructive">*</span> : null}
                  </span>
                  <Badge variant="secondary">{field.type}</Badge>
                </div>
                {field.options?.length ? (
                  <div className="flex flex-wrap gap-1">
                    {field.options.slice(0, 4).map((option) => (
                      <Badge key={option} variant="outline">
                        {option}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="h-8 rounded-md border bg-muted/40" />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Add fields to preview the form.</p>
          )}
        </div>

        <Button
          type="button"
          className="w-full"
          style={{
            backgroundColor: theme?.accentColor,
          }}
        >
          Submit
        </Button>
      </div>
    </section>
  );
}

function FieldEditor({
  errorMessage,
  form,
  fields,
  isRequired,
  type,
}: {
  errorMessage?: string;
  form: ReturnType<typeof useForm<FieldValues>>;
  fields: FormField[];
  isRequired: boolean;
  type: FieldType;
}) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;
  const conditionalFieldId = watch("conditionalFieldId");
  const conditionalOperator = watch("conditionalOperator");

  return (
    <FieldGroup className="gap-3">
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

      <div className="grid gap-3 md:grid-cols-2">
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
          <FieldDescription className="text-xs">Fractional sort value.</FieldDescription>
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
          className="min-h-16"
          {...register("description")}
        />
      </Field>

      {["SELECT", "RADIO", "CHECKBOX"].includes(type) ? (
        <Field>
          <FieldLabel htmlFor="optionsText">Options</FieldLabel>
          <Textarea
            id="optionsText"
            placeholder={"One option per line\nStarter\nPro\nEnterprise"}
            className="min-h-20"
            {...register("optionsText")}
          />
          <FieldDescription className="text-xs">
            Used by select, radio, and multi-checkbox fields.
          </FieldDescription>
        </Field>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="min">Minimum</FieldLabel>
          <Input
            id="min"
            type="number"
            placeholder={type === "RATING" ? "1" : "Optional"}
            {...register("min", {
              validate: (value) =>
                !value.trim() || Number.isFinite(Number(value)) || "Minimum must be a number",
            })}
          />
          <FieldDescription className="text-xs">
            Text length, number lower bound, or rating minimum.
          </FieldDescription>
          <FieldError errors={[errors.min]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="max">Maximum</FieldLabel>
          <Input
            id="max"
            type="number"
            placeholder={type === "RATING" ? "5" : "Optional"}
            {...register("max", {
              validate: (value) =>
                !value.trim() || Number.isFinite(Number(value)) || "Maximum must be a number",
            })}
          />
          <FieldDescription className="text-xs">
            Text length, number upper bound, or rating maximum.
          </FieldDescription>
          <FieldError errors={[errors.max]} />
        </Field>
      </div>

      <Field orientation="horizontal" className="justify-between rounded-lg border p-3">
        <div className="space-y-1">
          <FieldLabel htmlFor="isRequired">Required</FieldLabel>
          <FieldDescription className="text-xs">Respondents must answer this field.</FieldDescription>
        </div>
        <Switch
          id="isRequired"
          checked={isRequired}
          onCheckedChange={(checked) => setValue("isRequired", checked)}
        />
      </Field>

      <div className="grid gap-3 rounded-lg border p-3">
        <div className="space-y-1">
          <FieldLabel>Conditional logic</FieldLabel>
          <FieldDescription className="text-xs">
            Show this field only when another answer matches.
          </FieldDescription>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="conditionalFieldId">Show when field</FieldLabel>
            <Select
              value={conditionalFieldId}
              onValueChange={(value) => setValue("conditionalFieldId", value)}
            >
              <SelectTrigger id="conditionalFieldId" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Always show</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="conditionalOperator">Condition</FieldLabel>
            <Select
              value={conditionalOperator}
              onValueChange={(value) =>
                setValue("conditionalOperator", value as FieldValues["conditionalOperator"])
              }
              disabled={conditionalFieldId === "none"}
            >
              <SelectTrigger id="conditionalOperator" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="not_equals">Does not equal</SelectItem>
                <SelectItem value="contains">Contains option</SelectItem>
                <SelectItem value="not_empty">Is answered</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {conditionalFieldId !== "none" && conditionalOperator !== "not_empty" ? (
          <Field>
            <FieldLabel htmlFor="conditionalValue">Value</FieldLabel>
            <Input
              id="conditionalValue"
              placeholder="Exact value or option"
              {...register("conditionalValue")}
            />
          </Field>
        ) : null}
      </div>

      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
    </FieldGroup>
  );
}
