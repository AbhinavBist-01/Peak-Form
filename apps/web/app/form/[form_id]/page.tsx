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

function getSubmittedValue(formData: FormData, field: PublicField) {
  if (field.type === "CHECKBOX" && field.options?.length) {
    return formData.getAll(field.id).map(String).join(",");
  }

  return String(formData.get(field.id) ?? "");
}

function PublicFormField({ field }: { field: PublicField }) {
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
          placeholder={field.placeholder ?? undefined}
          required={Boolean(field.isRequired)}
          minLength={field.min ?? undefined}
          maxLength={field.max ?? undefined}
          className="min-h-28 resize-y"
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
        <RadioGroup name={field.id} required={Boolean(field.isRequired)}>
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
                <Checkbox id={`${fieldId}-${option}`} name={field.id} value={option} />
                <FieldLabel htmlFor={`${fieldId}-${option}`}>{option}</FieldLabel>
              </Field>
            ))}
          </div>
        </Field>
      );
    }

    return (
      <Field orientation="horizontal" className="peak-lift items-start rounded-xl border border-[#c3c8c1]/60 bg-white/70 p-4 backdrop-blur">
        <Checkbox id={fieldId} name={field.id} required={Boolean(field.isRequired)} />
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
        <Select name={field.id} required={Boolean(field.isRequired)}>
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
        <RadioGroup name={field.id} required={Boolean(field.isRequired)}>
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
        <RadioGroup name={field.id} required={Boolean(field.isRequired)} className="flex flex-wrap gap-2">
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
        placeholder={field.placeholder ?? undefined}
        required={Boolean(field.isRequired)}
        min={field.type === "NUMBER" ? field.min ?? undefined : undefined}
        max={field.type === "NUMBER" ? field.max ?? undefined : undefined}
        minLength={field.type !== "NUMBER" ? field.min ?? undefined : undefined}
        maxLength={field.type !== "NUMBER" ? field.max ?? undefined : undefined}
        pattern={field.pattern ?? undefined}
      />
    </Field>
  );
}

export default function Page() {
  const params = useParams();
  const formId = getFormId(params);
  const { form, fields = [], error, isLoading, isFetching } = useGetFormById(formId);
  const {
    createFormSubmissionAsync,
    error: submissionError,
    status: createSubmissionStatus,
  } = useCreateFormSubmission();
  const [submissionId, setSubmissionId] = React.useState<string | null>(null);

  const isSubmitting = createSubmissionStatus === "pending";
  const theme = form?.themeConfig;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formId || !fields.length) {
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    setSubmissionId(null);

    try {
      const result = await createFormSubmissionAsync({
        formId,
        values: fields.map((field) => ({
          formFieldId: field.id,
          value: getSubmittedValue(formData, field),
        })),
      });

      setSubmissionId(result.id);
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
          <Link href="/" className="flex items-center gap-3 font-semibold text-[#061b0e]">
            <Image
              src="/peakform-logo.svg"
              alt="PeakForm"
              width={34}
              height={34}
              className="size-8 invert"
            />
            <span className="peak-serif text-xl tracking-normal">PeakForm</span>
          </Link>
          <Badge className="gap-2 bg-[#061b0e] text-white">
            <MountainIcon className="size-3.5" />
            Public form
          </Badge>
        </header>

        {isLoading ? (
          <div className="peak-glass rounded-xl p-6">
            <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-8 grid gap-5">
              <div className="h-16 animate-pulse rounded bg-muted" />
              <div className="h-16 animate-pulse rounded bg-muted" />
              <div className="h-28 animate-pulse rounded bg-muted" />
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
              <Badge variant="secondary" className="w-fit bg-[#d0e9d4] text-[#061b0e]">
                {theme?.name ?? "PeakForm"}
              </Badge>
              <h1 className="peak-serif text-3xl font-semibold tracking-normal text-[#061b0e] md:text-5xl">
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

            {fields.length ? (
              <FieldGroup className="gap-5">
                {fields.map((field) => (
                  <PublicFormField key={field.id} field={field} />
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
              <Button
                type="submit"
                disabled={!fields.length || isSubmitting}
                className="peak-button-motion"
                style={{
                  backgroundColor: theme?.accentColor ?? "#061b0e",
                  color: "#ffffff",
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}
