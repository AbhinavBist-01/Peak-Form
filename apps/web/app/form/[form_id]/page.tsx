"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2Icon, MountainIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Textarea } from "~/components/ui/textarea";
import { useCreateFormSubmission, useGetFormById } from "~/hooks/api/form";

type PublicField = NonNullable<ReturnType<typeof useGetFormById>["fields"]>[number];

function getFormId(params: ReturnType<typeof useParams>) {
  const formId = params.form_id;

  if (Array.isArray(formId)) {
    return formId[0] ?? "";
  }

  return formId ?? "";
}

function getInputType(type: PublicField["type"]) {
  if (type === "EMAIL") {
    return "email";
  }

  if (type === "PASSWORD") {
    return "password";
  }

  if (type === "DATE") {
    return "date";
  }

  if (type === "NUMBER") {
    return "number";
  }

  return "text";
}

function FieldHelp({ field }: { field: PublicField }) {
  return (
    <>
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
      {field.helpText ? <FieldDescription>{field.helpText}</FieldDescription> : null}
    </>
  );
}

function getFieldOptions(field: PublicField) {
  return field.options?.length ? field.options : ["Option"];
}

function getRatingOptions(field: PublicField) {
  const min = field.min ?? 1;
  const max = field.max ?? 5;
  const safeMin = Math.max(1, Math.min(min, max));
  const safeMax = Math.max(safeMin, max);

  return Array.from({ length: safeMax - safeMin + 1 }, (_, index) => String(safeMin + index));
}

function isFieldVisible(field: PublicField, answers: Record<string, string>) {
  const condition = field.validationRules?.conditionalLogic;

  if (!condition) {
    return true;
  }

  const value = answers[condition.fieldId]?.trim() ?? "";
  const expected = condition.value?.trim() ?? "";

  if (condition.operator === "not_empty") {
    return Boolean(value);
  }

  if (condition.operator === "contains") {
    return Boolean(expected) && value.split(",").map((entry) => entry.trim()).includes(expected);
  }

  if (condition.operator === "not_equals") {
    return value !== expected;
  }

  return value === expected;
}

function PublicFormField({
  field,
  value,
  onValueChange,
}: {
  field: PublicField;
  value: string;
  onValueChange: (value: string) => void;
}) {
  const fieldId = `field-${field.id}`;

  if (field.type === "TEXTAREA") {
    return (
      <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <FieldLabel htmlFor={fieldId}>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        <FieldHelp field={field} />
        <Textarea
          id={fieldId}
          name={field.id}
          value={value}
          placeholder={field.placeholder ?? undefined}
          required={Boolean(field.isRequired)}
          minLength={field.min ?? undefined}
          maxLength={field.max ?? undefined}
          className="min-h-28 resize-y"
          onChange={(event) => onValueChange(event.target.value)}
        />
      </Field>
    );
  }

  if (field.type === "YES_NO") {
    return (
      <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <FieldLabel>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        <FieldHelp field={field} />
        <RadioGroup name={field.id} value={value} required={Boolean(field.isRequired)} onValueChange={onValueChange}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-yes`} value="yes" />
            <Label htmlFor={`${fieldId}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-no`} value="no" />
            <Label htmlFor={`${fieldId}-no`}>No</Label>
          </div>
        </RadioGroup>
      </Field>
    );
  }

  if (field.type === "CHECKBOX") {
    if (field.options?.length) {
      return (
        <Field>
          <FieldLabel>
            {field.label}
            {field.isRequired ? <span className="text-destructive">*</span> : null}
          </FieldLabel>
          <FieldHelp field={field} />
          <div className="grid gap-3">
            {field.options.map((option) => (
              <Field key={option} orientation="horizontal" className="items-start rounded-lg border border-[#c3c8c1]/60 bg-white/60 p-4">
                <Checkbox
                  id={`${fieldId}-${option}`}
                  name={field.id}
                  value={option}
                  checked={value.split(",").filter(Boolean).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = value.split(",").filter(Boolean);
                    const next = checked
                      ? Array.from(new Set([...current, option]))
                      : current.filter((entry) => entry !== option);
                    onValueChange(next.join(","));
                  }}
                />
                <FieldLabel htmlFor={`${fieldId}-${option}`}>{option}</FieldLabel>
              </Field>
            ))}
          </div>
        </Field>
      );
    }

    return (
      <Field orientation="horizontal" className="peak-lift items-start rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <Checkbox
          id={fieldId}
          name={field.id}
          required={Boolean(field.isRequired)}
          checked={value === "on"}
          onCheckedChange={(checked) => onValueChange(checked ? "on" : "")}
        />
        <div className="grid gap-1.5">
          <FieldLabel htmlFor={fieldId}>
            {field.label}
            {field.isRequired ? <span className="text-destructive">*</span> : null}
          </FieldLabel>
          <FieldHelp field={field} />
        </div>
      </Field>
    );
  }

  if (field.type === "SELECT") {
    return (
      <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <FieldLabel htmlFor={fieldId}>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        <FieldHelp field={field} />
        <Select name={field.id} value={value} required={Boolean(field.isRequired)} onValueChange={onValueChange}>
          <SelectTrigger id={fieldId} className="w-full">
            <SelectValue placeholder={field.placeholder ?? "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {getFieldOptions(field).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (field.type === "RADIO") {
    return (
      <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <FieldLabel>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        <FieldHelp field={field} />
        <RadioGroup name={field.id} value={value} required={Boolean(field.isRequired)} onValueChange={onValueChange}>
          {getFieldOptions(field).map((option) => (
            <div key={option} className="flex items-center gap-2 rounded-lg border border-[#c3c8c1]/55 bg-white/60 px-3 py-2">
              <RadioGroupItem id={`${fieldId}-${option}`} value={option} />
              <Label htmlFor={`${fieldId}-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </Field>
    );
  }

  if (field.type === "RATING") {
    return (
      <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <FieldLabel>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        <FieldHelp field={field} />
        <RadioGroup
          name={field.id}
          value={value}
          required={Boolean(field.isRequired)}
          className="flex flex-wrap gap-2"
          onValueChange={onValueChange}
        >
          {getRatingOptions(field).map((rating) => (
            <div key={rating} className="flex items-center gap-2 rounded-lg border border-[#c3c8c1]/60 bg-white/65 px-3 py-2">
              <RadioGroupItem id={`${fieldId}-${rating}`} value={rating} />
              <Label htmlFor={`${fieldId}-${rating}`}>{rating}</Label>
            </div>
          ))}
        </RadioGroup>
      </Field>
    );
  }

  return (
    <Field className="peak-lift rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
      <FieldLabel htmlFor={fieldId}>
        {field.label}
        {field.isRequired ? <span className="text-destructive">*</span> : null}
      </FieldLabel>
      <FieldHelp field={field} />
      <Input
        id={fieldId}
        name={field.id}
        type={getInputType(field.type)}
        value={value}
        placeholder={field.placeholder ?? undefined}
        required={Boolean(field.isRequired)}
        min={field.type === "NUMBER" ? field.min ?? undefined : undefined}
        max={field.type === "NUMBER" ? field.max ?? undefined : undefined}
        minLength={field.type !== "NUMBER" ? field.min ?? undefined : undefined}
        maxLength={field.type !== "NUMBER" ? field.max ?? undefined : undefined}
        pattern={field.pattern ?? undefined}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </Field>
  );
}

export default function Page() {
  const params = useParams();
  const formId = getFormId(params);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [submittedPassword, setSubmittedPassword] = React.useState<string | undefined>();
  const { form, fields = [], error, isLoading, isFetching } = useGetFormById(formId, submittedPassword);
  const {
    createFormSubmissionAsync,
    error: submissionError,
    status: createSubmissionStatus,
  } = useCreateFormSubmission();
  const [submissionId, setSubmissionId] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [page, setPage] = React.useState(0);
  const [pageError, setPageError] = React.useState<string | null>(null);

  const isSubmitting = createSubmissionStatus === "pending";
  const theme = form?.themeConfig;
  const visibleFields = React.useMemo(
    () => fields.filter((field) => isFieldVisible(field, answers)),
    [answers, fields],
  );
  const pageSize = form?.pageSize && form.pageSize !== "all" ? Number(form.pageSize) : visibleFields.length || 1;
  const totalPages = Math.max(1, Math.ceil(visibleFields.length / pageSize));
  const currentFields = visibleFields.slice(page * pageSize, page * pageSize + pageSize);

  React.useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const setAnswer = (fieldId: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [fieldId]: value,
    }));
  };

  const validatePage = (pageFields: PublicField[]) => {
    const missingField = pageFields.find((field) => field.isRequired && !answers[field.id]?.trim());

    if (missingField) {
      setPageError(`${missingField.label} is required`);
      return false;
    }

    setPageError(null);
    return true;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formId || !visibleFields.length || !validatePage(currentFields)) {
      return;
    }

    const formElement = event.currentTarget;
    setSubmissionId(null);

    try {
      const result = await createFormSubmissionAsync({
        formId,
        password: submittedPassword,
        values: visibleFields.map((field) => ({
          formFieldId: field.id,
          value: answers[field.id] ?? "",
        })),
      });

      setSubmissionId(result.id);
      setAnswers({});
      setPage(0);
      formElement.reset();
    } catch {
      // The mutation exposes its error through submissionError.
    }
  };

  return (
    <main
      className="peak-topography peak-topography-motion min-h-screen overflow-hidden bg-[#f9faf8] px-4 py-6 md:py-10"
      style={{
        backgroundColor: theme?.backgroundColor,
        color: theme?.textColor,
        fontFamily: theme?.fontFamily,
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="peak-reveal flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-[#2f5d3b]">
            <Image
              src="/peakform-logo.svg"
              alt="PeakForm"
              width={34}
              height={34}
              className="size-8 opacity-90 drop-shadow-[0_1px_4px_rgba(47,93,59,0.35)]"
            />
            <span className="peak-serif text-xl tracking-normal">PeakForm</span>
          </Link>
          <Badge className="gap-2 bg-[#2f5d3b] text-white">
            <MountainIcon className="size-3.5" />
            Public form
          </Badge>
        </header>

        {isLoading ? (
          <div className="peak-glass rounded-xl p-6">
            <div className="grid gap-3">
              <Skeleton className="h-6 w-28 rounded-full bg-[#d0e9d4]/70" />
              <Skeleton className="h-10 w-2/3 bg-[#d0e9d4]/70" />
              <Skeleton className="h-4 w-full bg-[#edf1ec]" />
              <Skeleton className="h-4 w-3/4 bg-[#edf1ec]" />
            </div>
            <div className="mt-8 grid gap-5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4">
                  <Skeleton className="mb-3 h-4 w-40 bg-[#d0e9d4]/70" />
                  <Skeleton className="h-10 w-full bg-[#edf1ec]" />
                </div>
              ))}
              <Skeleton className="ml-auto h-10 w-28 bg-[#d0e9d4]/70" />
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load form</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : form ? (
          <form
            className="peak-glass peak-reveal rounded-xl p-5 md:p-7"
            style={{
              color: theme?.textColor,
              fontFamily: theme?.fontFamily,
            }}
            onSubmit={onSubmit}
          >
            <div className="peak-stagger grid gap-3">
              <Badge variant="secondary" className="w-fit bg-[#d0e9d4] text-[#2f5d3b]">
                {theme?.name ?? "PeakForm"}
              </Badge>
              <h1 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b] md:text-5xl">
                {form.title}
              </h1>
              {form.description ? (
                <p className="max-w-2xl text-sm leading-6 text-[#59645b] md:text-base md:leading-7">{form.description}</p>
              ) : null}
            </div>

            <Separator className="my-6" />

            {submissionId ? (
              <Alert className="mb-6 border-[#b4cdb8] bg-[#d0e9d4]/55">
                <CheckCircle2Icon className="size-4" />
                <AlertTitle>Response submitted</AlertTitle>
                <AlertDescription>Your response has been recorded.</AlertDescription>
              </Alert>
            ) : null}

            {submissionError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Could not submit response</AlertTitle>
                <AlertDescription>{submissionError.message}</AlertDescription>
              </Alert>
            ) : null}

            {pageError ? (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Before you continue</AlertTitle>
                <AlertDescription>{pageError}</AlertDescription>
              </Alert>
            ) : null}

            {form.requiresPassword ? (
              <div className="grid gap-4 rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4">
                <Field>
                  <FieldLabel htmlFor="form-password">Password</FieldLabel>
                  <Input
                    id="form-password"
                    type="password"
                    value={passwordInput}
                    placeholder="Enter form password"
                    onChange={(event) => setPasswordInput(event.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => setSubmittedPassword(passwordInput)}
                >
                  Unlock form
                </Button>
              </div>
            ) : fields.length ? (
              <FieldGroup className="gap-5">
                {currentFields.map((field) => (
                  <PublicFormField
                    key={field.id}
                    field={field}
                    value={answers[field.id] ?? ""}
                    onValueChange={(value) => setAnswer(field.id, value)}
                  />
                ))}
              </FieldGroup>
            ) : (
              <p className="text-sm text-muted-foreground">This form has no fields.</p>
            )}

            <div className="mt-7 flex items-center justify-between gap-3">
              {isFetching ? (
                <p className="text-sm text-muted-foreground">Refreshing...</p>
              ) : (
                <span />
              )}
              {form.requiresPassword ? null : (
                <div className="ml-auto flex items-center gap-2">
                  {totalPages > 1 ? (
                    <Badge variant="outline">
                      Page {page + 1} of {totalPages}
                    </Badge>
                  ) : null}
                  {page > 0 ? (
                    <Button type="button" variant="outline" onClick={() => setPage(page - 1)}>
                      Back
                    </Button>
                  ) : null}
                  {page < totalPages - 1 ? (
                    <Button
                      type="button"
                      className="peak-button-motion"
                      style={{
                        backgroundColor: theme?.accentColor ?? "#2f5d3b",
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        if (validatePage(currentFields)) {
                          setPage(page + 1);
                        }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!fields.length || isSubmitting}
                      className="peak-button-motion"
                      style={{
                        backgroundColor: theme?.accentColor ?? "#2f5d3b",
                        color: "#ffffff",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}
