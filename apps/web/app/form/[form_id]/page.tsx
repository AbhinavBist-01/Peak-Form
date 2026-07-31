"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";

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
      {field.description ? <FieldDescription className="text-xs text-[#78726A]">{field.description}</FieldDescription> : null}
      {field.helpText ? <FieldDescription className="text-xs text-[#78726A]">{field.helpText}</FieldDescription> : null}
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
    return value.toLowerCase() !== expected.toLowerCase();
  }

  return value.toLowerCase() === expected.toLowerCase();
}

function isFieldRequired(field: PublicField) {
  return Boolean(field.isRequired);
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
  const required = isFieldRequired(field);

  if (field.type === "TEXTAREA") {
    return (
      <Field>
        <FieldLabel htmlFor={field.id} className="text-xs font-medium text-[#2D2926]">
          {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
        </FieldLabel>
        <Textarea
          id={field.id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={field.placeholder ?? undefined}
          className="min-h-28 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] focus:border-[#DA7756]"
        />
        <FieldHelp field={field} />
      </Field>
    );
  }

  if (field.type === "SELECT") {
    const options = getFieldOptions(field);

    return (
      <Field>
        <FieldLabel htmlFor={field.id} className="text-xs font-medium text-[#2D2926]">
          {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
        </FieldLabel>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id={field.id} className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926]">
            <SelectValue placeholder={field.placeholder ?? "Select an option"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldHelp field={field} />
      </Field>
    );
  }

  if (field.type === "RADIO") {
    const options = getFieldOptions(field);

    return (
      <Field>
        <FieldLabel className="text-xs font-medium text-[#2D2926]">
          {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
        </FieldLabel>
        <RadioGroup value={value} onValueChange={onValueChange} className="gap-2.5">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-2 rounded-xl border border-[#E5DFD5] bg-[#FFFDF9] px-3.5 py-2.5 text-xs text-[#2D2926]">
              <RadioGroupItem value={option} id={`${field.id}-${option}`} />
              <Label htmlFor={`${field.id}-${option}`} className="font-normal text-[#2D2926]">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <FieldHelp field={field} />
      </Field>
    );
  }

  if (field.type === "CHECKBOX") {
    const options = getFieldOptions(field);
    const selectedValues = value ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : [];

    const toggleOption = (option: string) => {
      const next = selectedValues.includes(option)
        ? selectedValues.filter((entry) => entry !== option)
        : [...selectedValues, option];

      onValueChange(next.join(", "));
    };

    return (
      <Field>
        <FieldLabel className="text-xs font-medium text-[#2D2926]">
          {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
        </FieldLabel>
        <div className="grid gap-2.5">
          {options.map((option) => {
            const checked = selectedValues.includes(option);

            return (
              <div key={option} className="flex items-center gap-2.5 rounded-xl border border-[#E5DFD5] bg-[#FFFDF9] px-3.5 py-2.5 text-xs text-[#2D2926]">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={checked}
                  onCheckedChange={() => toggleOption(option)}
                />
                <Label htmlFor={`${field.id}-${option}`} className="font-normal text-[#2D2926]">
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
        <FieldHelp field={field} />
      </Field>
    );
  }

  if (field.type === "RATING") {
    const options = getRatingOptions(field);

    return (
      <Field>
        <FieldLabel className="text-xs font-medium text-[#2D2926]">
          {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
        </FieldLabel>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = value === option;

            return (
              <Button
                key={option}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onValueChange(option)}
                className={`size-10 rounded-xl text-xs font-medium ${
                  isSelected
                    ? "border-[#DA7756] bg-[#F7EBE1] text-[#DA7756]"
                    : "border-[#E5DFD5] bg-[#FFFDF9] text-[#2D2926] hover:bg-[#F2ECE1]"
                }`}
              >
                {option}
              </Button>
            );
          })}
        </div>
        <FieldHelp field={field} />
      </Field>
    );
  }

  return (
    <Field>
      <FieldLabel htmlFor={field.id} className="text-xs font-medium text-[#2D2926]">
        {field.label} {required ? <span className="text-[#DA7756]">*</span> : null}
      </FieldLabel>
      <Input
        id={field.id}
        type={getInputType(field.type)}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={field.placeholder ?? undefined}
        className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] focus:border-[#DA7756]"
      />
      <FieldHelp field={field} />
    </Field>
  );
}

export default function PublicFormPage() {
  const params = useParams();
  const formId = getFormId(params);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [submittedPassword, setSubmittedPassword] = React.useState<string | undefined>(undefined);
  const { form, fields = [], error, isLoading } = useGetFormById(formId, submittedPassword);
  const { createFormSubmissionAsync, error: submissionError, status: submissionStatus } =
    useCreateFormSubmission();

  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [pageError, setPageError] = React.useState<string | null>(null);
  const isSubmitting = submissionStatus === "pending";

  const visibleFields = React.useMemo(() => {
    return fields.filter((field) => isFieldVisible(field, answers));
  }, [fields, answers]);

  const pagedFields = React.useMemo(() => {
    const pages: PublicField[][] = [[]];

    for (const field of visibleFields) {
      const currentPageIndex = pages.length - 1;
      const currentPage = pages[currentPageIndex];

      if (!currentPage) {
        pages.push([field]);
        continue;
      }

      currentPage.push(field);
    }

    return pages.filter((page) => page.length > 0);
  }, [visibleFields]);

  const totalPages = Math.max(pagedFields.length, 1);
  const currentFields = pagedFields[page] ?? [];

  const setAnswer = (fieldId: string, value: string) => {
    setPageError(null);
    setAnswers((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const validatePage = (fieldsToValidate: PublicField[]) => {
    for (const field of fieldsToValidate) {
      if (isFieldRequired(field) && !answers[field.id]?.trim()) {
        setPageError(`"${field.label}" is required.`);
        return false;
      }
    }

    setPageError(null);
    return true;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validatePage(currentFields)) {
      return;
    }

    const payloadAnswers = visibleFields.map((field) => ({
      formFieldId: field.id,
      value: answers[field.id]?.trim() ?? "",
    }));

    const result = await createFormSubmissionAsync({
      formId: form?.id ?? formId,
      values: payloadAnswers,
      password: submittedPassword,
    });

    setSubmissionId(result.id);
  };

  const theme = form?.themeConfig;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2D2926] px-5 py-8 md:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <Image
            src="/peakform-logo.svg"
            alt="PeakForms"
            width={32}
            height={32}
            className="size-7 opacity-90"
          />
          <span className="peak-serif text-xl font-medium tracking-tight text-[#2D2926]">
            PeakForms
          </span>
        </Link>

        {isLoading ? (
          <div className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-8 space-y-6">
            <Skeleton className="h-8 w-2/3 bg-[#E5DFD5]/60" />
            <Skeleton className="h-4 w-full bg-[#E5DFD5]/40" />
            <div className="space-y-4 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3 bg-[#E5DFD5]/60" />
                  <Skeleton className="h-10 w-full rounded-xl bg-[#E5DFD5]/40" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
            <AlertTitle className="font-medium">Could not load form</AlertTitle>
            <AlertDescription className="text-xs">{error.message}</AlertDescription>
          </Alert>
        ) : form ? (
          <form
            className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 md:p-8 shadow-xs space-y-6"
            onSubmit={onSubmit}
          >
            <div className="space-y-2">
              <h1 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926] md:text-4xl">
                {form.title}
              </h1>
              {form.description ? (
                <p className="text-sm text-[#78726A] leading-relaxed">{form.description}</p>
              ) : null}
            </div>

            <Separator className="bg-[#E5DFD5]" />

            {submissionId ? (
              <Alert className="rounded-xl border-[#E5DFD5] bg-[#F7EBE1] text-[#2D2926]">
                <CheckCircle2Icon className="size-4 text-[#DA7756]" />
                <AlertTitle className="font-medium text-[#2D2926]">Response submitted</AlertTitle>
                <AlertDescription className="text-xs text-[#78726A]">Your response has been recorded.</AlertDescription>
              </Alert>
            ) : null}

            {submissionError ? (
              <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
                <AlertTitle className="font-medium">Could not submit response</AlertTitle>
                <AlertDescription className="text-xs">{submissionError.message}</AlertDescription>
              </Alert>
            ) : null}

            {pageError ? (
              <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
                <AlertTitle className="font-medium">Before you continue</AlertTitle>
                <AlertDescription className="text-xs">{pageError}</AlertDescription>
              </Alert>
            ) : null}

            {form.requiresPassword && !submittedPassword ? (
              <div className="space-y-4 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] p-5">
                <Field>
                  <FieldLabel htmlFor="form-password" className="text-xs font-medium text-[#2D2926]">
                    Form Password Required
                  </FieldLabel>
                  <Input
                    id="form-password"
                    type="password"
                    value={passwordInput}
                    placeholder="Enter form password"
                    className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926]"
                    onChange={(event) => setPasswordInput(event.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  className="rounded-xl bg-[#DA7756] text-xs text-white hover:bg-[#C66545]"
                  onClick={() => setSubmittedPassword(passwordInput)}
                >
                  Unlock Form
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
              <p className="text-xs text-[#78726A]">This form has no fields.</p>
            )}

            <div className="flex items-center justify-between border-t border-[#E5DFD5] pt-5">
              {totalPages > 1 ? (
                <span className="font-mono text-xs text-[#78726A]">
                  Page {page + 1} of {totalPages}
                </span>
              ) : <span />}

              {!form.requiresPassword || submittedPassword ? (
                <div className="flex items-center gap-2">
                  {page > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      className="border-[#E5DFD5] text-xs text-[#78726A] hover:bg-[#F2ECE1]"
                    >
                      Back
                    </Button>
                  ) : null}
                  {page < totalPages - 1 ? (
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
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
                      size="sm"
                      disabled={!fields.length || isSubmitting}
                      className="rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Response"}
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}
