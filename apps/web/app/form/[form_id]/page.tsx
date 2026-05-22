"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
import { useCreateFormSubmission } from "~/hooks/api/form-submission";
import { useGetFormById } from "~/hooks/api/form";

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

function PublicFormField({ field }: { field: PublicField }) {
  const fieldId = `field-${field.id}`;

  if (field.type === "TEXTAREA") {
    return (
      <Field>
        <FieldLabel htmlFor={fieldId}>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
        <Textarea
          id={fieldId}
          name={field.id}
          placeholder={field.placeholder ?? undefined}
          required={Boolean(field.isRequired)}
          className="min-h-28 resize-y"
        />
      </Field>
    );
  }

  if (field.type === "YES_NO") {
    return (
      <Field>
        <FieldLabel>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
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
    return (
      <Field orientation="horizontal" className="items-start rounded-md border p-4">
        <Checkbox id={fieldId} name={field.id} required={Boolean(field.isRequired)} />
        <div className="grid gap-1.5">
          <FieldLabel htmlFor={fieldId}>
            {field.label}
            {field.isRequired ? <span className="text-destructive">*</span> : null}
          </FieldLabel>
          {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
        </div>
      </Field>
    );
  }

  if (field.type === "SELECT") {
    return (
      <Field>
        <FieldLabel htmlFor={fieldId}>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
        <Select name={field.id} required={Boolean(field.isRequired)}>
          <SelectTrigger id={fieldId} className="w-full">
            <SelectValue placeholder={field.placeholder ?? "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option">Option</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (field.type === "RADIO") {
    return (
      <Field>
        <FieldLabel>
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </FieldLabel>
        {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
        <RadioGroup name={field.id} required={Boolean(field.isRequired)}>
          <div className="flex items-center gap-2">
            <RadioGroupItem id={`${fieldId}-option`} value="option" />
            <Label htmlFor={`${fieldId}-option`}>Option</Label>
          </div>
        </RadioGroup>
      </Field>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>
        {field.label}
        {field.isRequired ? <span className="text-destructive">*</span> : null}
      </FieldLabel>
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
      <Input
        id={fieldId}
        name={field.id}
        type={getInputType(field.type)}
        placeholder={field.placeholder ?? undefined}
        required={Boolean(field.isRequired)}
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
          value: String(formData.get(field.id) ?? ""),
        })),
      });

      setSubmissionId(result.id);
      formElement.reset();
    } catch {
      // The mutation exposes its error through submissionError.
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 md:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {isLoading ? (
          <div className="rounded-lg border bg-background p-6 shadow-sm">
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
            className="rounded-lg border bg-background p-5 shadow-sm md:p-7"
            onSubmit={onSubmit}
          >
            <div className="grid gap-2">
              <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">{form.title}</h1>
              {form.description ? (
                <p className="text-sm leading-6 text-muted-foreground">{form.description}</p>
              ) : null}
            </div>

            <Separator className="my-6" />

            {submissionId ? (
              <Alert className="mb-6">
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
              <FieldGroup className="gap-6">
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
              <Button type="submit" disabled={!fields.length || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}
