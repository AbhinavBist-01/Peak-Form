import { and, db, desc, eq } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { forms } from "@repo/database/models/form";
import { usersTable } from "@repo/database/models/user";
import { sendEmail } from "../email";
import {
  createFormSubmissionInput,
  createFormSubmissionOutput,
  deleteFormSubmissionForUserInput,
  deleteFormSubmissionOutput,
  exportFormSubmissionsCsvForUserInput,
  exportFormSubmissionsCsvOutput,
  formSubmissionAnalyticsOutput,
  getFormSubmissionAnalyticsForUserInput,
  getFormSubmissionByIdForUserInput,
  getFormSubmissionByIdOutput,
  getFormSubmissionsByFormIdInput,
  getFormSubmissionsByFormIdForUserInput,
  getFormSubmissionsByFormIdOutput,
  type CreateFormSubmissionInputType,
  type CreateFormSubmissionOutputType,
  type DeleteFormSubmissionForUserInputType,
  type DeleteFormSubmissionOutputType,
  type ExportFormSubmissionsCsvForUserInputType,
  type ExportFormSubmissionsCsvOutputType,
  type FormSubmissionAnalyticsOutputType,
  type GetFormSubmissionAnalyticsForUserInputType,
  type GetFormSubmissionByIdForUserInputType,
  type GetFormSubmissionByIdOutputType,
  type GetFormSubmissionsByFormIdInputType,
  type GetFormSubmissionsByFormIdForUserInputType,
  type GetFormSubmissionsByFormIdOutputType,
} from "./model";

type ValidationField = {
  id: string;
  label: string;
  labelKey: string;
  isRequired: boolean | null;
  type:
    | "TEXT"
    | "TEXTAREA"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX"
    | "PASSWORD"
    | "EMAIL"
    | "YES_NO"
    | "DATE"
    | "NUMBER"
    | "RATING";
  options: string[] | null;
  validationRules: {
    customErrorMessage?: string;
  } | null;
  min: number | null;
  max: number | null;
  pattern: string | null;
};

type SubmissionRow = GetFormSubmissionsByFormIdOutputType[number];

type FormMetadata = {
  id: string;
  title: string;
  creatorEmail: string;
  creatorName: string;
};

function getValidationMessage(field: ValidationField, fallback: string) {
  return field.validationRules?.customErrorMessage || fallback;
}

function getMultiValue(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getAnswer(submission: SubmissionRow, fieldId: string) {
  return submission.values.find((value) => value.formFieldId === fieldId)?.value.trim() ?? "";
}

function getDistributionEntries(field: ValidationField, value: string) {
  if (!value) {
    return [];
  }

  if (field.type === "CHECKBOX") {
    return getMultiValue(value);
  }

  return [value];
}

function getDateKey(value: Date | string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toISOString().slice(0, 10);
}

function roundPercent(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 10_000) / 100;
}

function roundAverage(value: number) {
  return Math.round(value * 100) / 100;
}

function escapeCsv(value: string | Date | null | undefined) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function slugFileName(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "form"
  );
}

function findRespondentEmail(fields: ValidationField[], values: CreateFormSubmissionInputType["values"]) {
  const emailField = fields.find((field) => field.type === "EMAIL");

  if (!emailField) {
    return undefined;
  }

  const value = values.find((entry) => entry.formFieldId === emailField.id)?.value.trim();

  return value || undefined;
}

function validateSubmittedValue(field: ValidationField, rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    if (field.isRequired) {
      throw new Error(getValidationMessage(field, `${field.label} is required`));
    }

    return;
  }

  const options = field.options ?? [];

  if ((field.type === "SELECT" || field.type === "RADIO") && options.length > 0) {
    if (!options.includes(value)) {
      throw new Error(getValidationMessage(field, `${field.label} must be one of the configured options`));
    }
  }

  if (field.type === "CHECKBOX" && options.length > 0) {
    const submittedOptions = getMultiValue(value);

    if (field.isRequired && submittedOptions.length === 0) {
      throw new Error(getValidationMessage(field, `${field.label} is required`));
    }

    if (submittedOptions.some((option) => !options.includes(option))) {
      throw new Error(getValidationMessage(field, `${field.label} contains an invalid option`));
    }
  }

  if (field.type === "YES_NO" && !["yes", "no"].includes(value)) {
    throw new Error(getValidationMessage(field, `${field.label} must be yes or no`));
  }

  if (field.type === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(getValidationMessage(field, `${field.label} must be a valid email`));
  }

  if (field.type === "DATE" && Number.isNaN(new Date(value).getTime())) {
    throw new Error(getValidationMessage(field, `${field.label} must be a valid date`));
  }

  if (field.type === "NUMBER" || field.type === "RATING") {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      throw new Error(getValidationMessage(field, `${field.label} must be a number`));
    }

    const min = field.type === "RATING" ? field.min ?? 1 : field.min;
    const max = field.type === "RATING" ? field.max ?? 5 : field.max;

    if (min !== null && numericValue < min) {
      throw new Error(getValidationMessage(field, `${field.label} must be at least ${min}`));
    }

    if (max !== null && numericValue > max) {
      throw new Error(getValidationMessage(field, `${field.label} must be at most ${max}`));
    }
  }

  if (["TEXT", "TEXTAREA", "PASSWORD", "EMAIL"].includes(field.type)) {
    if (field.min !== null && value.length < field.min) {
      throw new Error(getValidationMessage(field, `${field.label} must be at least ${field.min} characters`));
    }

    if (field.max !== null && value.length > field.max) {
      throw new Error(getValidationMessage(field, `${field.label} must be at most ${field.max} characters`));
    }

    if (field.pattern) {
      const pattern = new RegExp(field.pattern);

      if (!pattern.test(value)) {
        throw new Error(getValidationMessage(field, `${field.label} has an invalid format`));
      }
    }
  }
}

class FormSubmissionService {
  public async createFormSubmission(
    payload: CreateFormSubmissionInputType,
  ): Promise<CreateFormSubmissionOutputType> {
    const { formId, values } = await createFormSubmissionInput.parseAsync(payload);

    const [form] = await db
      .select({
        id: forms.id,
        title: forms.title,
        status: forms.status,
        expiresAt: forms.expiresAt,
        creatorEmail: usersTable.email,
        creatorName: usersTable.fullName,
      })
      .from(forms)
      .innerJoin(usersTable, eq(usersTable.id, forms.creatorId))
      .where(eq(forms.id, formId))
      .limit(1);

    if (!form) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    if (form.status !== "published") {
      throw new Error("This form is not accepting submissions");
    }

    if (form.expiresAt && form.expiresAt.getTime() < Date.now()) {
      throw new Error("This form is no longer accepting submissions");
    }

    const fields = await db
      .select({
        id: formFields.id,
        label: formFields.label,
        labelKey: formFields.labelKey,
        isRequired: formFields.isRequired,
        type: formFields.type,
        options: formFields.options,
        validationRules: formFields.validationRules,
        min: formFields.min,
        max: formFields.max,
        pattern: formFields.pattern,
      })
      .from(formFields)
      .where(eq(formFields.formId, formId));

    const fieldsById = new Map(fields.map((field) => [field.id, field]));
    const submittedFieldIds = new Set<string>();

    for (const value of values) {
      if (submittedFieldIds.has(value.formFieldId)) {
        throw new Error(`Field ${value.formFieldId} was submitted more than once`);
      }

      submittedFieldIds.add(value.formFieldId);

      if (!fieldsById.has(value.formFieldId)) {
        throw new Error(`Field ${value.formFieldId} does not belong to this form`);
      }
    }

    for (const field of fields) {
      const submittedValue = values.find((value) => value.formFieldId === field.id);
      validateSubmittedValue(field, submittedValue?.value ?? "");
    }

    const result = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formSubmissionsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to create form submission");
    }

    await this.sendSubmissionEmails({
      form,
      fields,
      values,
      submissionId: result[0].id,
    });

    return createFormSubmissionOutput.parse({
      id: result[0].id,
    });
  }

  public async getFormSubmissionsByFormId(
    payload: GetFormSubmissionsByFormIdInputType,
  ): Promise<GetFormSubmissionsByFormIdOutputType> {
    const { formId } = await getFormSubmissionsByFormIdInput.parseAsync(payload);

    const result = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
      })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(desc(formSubmissionsTable.createdAt));

    return getFormSubmissionsByFormIdOutput.parse(result);
  }

  public async getFormSubmissionsByFormIdForUser(
    payload: GetFormSubmissionsByFormIdForUserInputType,
  ): Promise<GetFormSubmissionsByFormIdOutputType> {
    const { formId, userId } = await getFormSubmissionsByFormIdForUserInput.parseAsync(payload);

    const result = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
      })
      .from(formSubmissionsTable)
      .innerJoin(forms, eq(forms.id, formSubmissionsTable.formId))
      .where(and(eq(formSubmissionsTable.formId, formId), eq(forms.creatorId, userId)))
      .orderBy(desc(formSubmissionsTable.createdAt));

    return getFormSubmissionsByFormIdOutput.parse(result);
  }

  public async getFormSubmissionAnalyticsForUser(
    payload: GetFormSubmissionAnalyticsForUserInputType,
  ): Promise<FormSubmissionAnalyticsOutputType> {
    const { formId, userId } = await getFormSubmissionAnalyticsForUserInput.parseAsync(payload);
    const [fields, submissions] = await Promise.all([
      this.getFieldsForUser({ formId, userId }),
      this.getFormSubmissionsByFormIdForUser({ formId, userId }),
    ]);

    const trend = new Map<string, number>();

    for (const submission of submissions) {
      const dateKey = getDateKey(submission.createdAt);
      trend.set(dateKey, (trend.get(dateKey) ?? 0) + 1);
    }

    const fieldSummaries = fields.map((field) => {
      const answers = submissions.map((submission) => getAnswer(submission, field.id)).filter(Boolean);
      const distribution = new Map<string, number>();
      let ratingTotal = 0;
      let ratingCount = 0;

      for (const answer of answers) {
        if (field.type === "RATING") {
          const rating = Number(answer);

          if (Number.isFinite(rating)) {
            ratingTotal += rating;
            ratingCount += 1;
          }
        }

        if (["SELECT", "RADIO", "CHECKBOX", "RATING"].includes(field.type)) {
          for (const entry of getDistributionEntries(field, answer)) {
            distribution.set(entry, (distribution.get(entry) ?? 0) + 1);
          }
        }
      }

      const distributionTotal = Array.from(distribution.values()).reduce(
        (sum, count) => sum + count,
        0,
      );

      return {
        fieldId: field.id,
        label: field.label,
        labelKey: field.labelKey,
        type: field.type,
        totalAnswers: answers.length,
        completionRate: roundPercent(answers.length, submissions.length),
        ratingAverage: ratingCount ? roundAverage(ratingTotal / ratingCount) : null,
        distribution: Array.from(distribution.entries())
          .map(([value, count]) => ({
            value,
            count,
            percentage: roundPercent(count, distributionTotal),
          }))
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
      };
    });

    return formSubmissionAnalyticsOutput.parse({
      responseCount: submissions.length,
      completionTrend: Array.from(trend.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      fieldSummaries,
    });
  }

  public async getFormSubmissionByIdForUser(
    payload: GetFormSubmissionByIdForUserInputType,
  ): Promise<GetFormSubmissionByIdOutputType> {
    const { submissionId, userId } = await getFormSubmissionByIdForUserInput.parseAsync(payload);

    const [submission] = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
      })
      .from(formSubmissionsTable)
      .innerJoin(forms, eq(forms.id, formSubmissionsTable.formId))
      .where(and(eq(formSubmissionsTable.id, submissionId), eq(forms.creatorId, userId)))
      .limit(1);

    if (!submission) {
      throw new Error(`Form submission with id ${submissionId} does not exist`);
    }

    return getFormSubmissionByIdOutput.parse(submission);
  }

  public async deleteFormSubmissionForUser(
    payload: DeleteFormSubmissionForUserInputType,
  ): Promise<DeleteFormSubmissionOutputType> {
    const { submissionId, userId } = await deleteFormSubmissionForUserInput.parseAsync(payload);
    await this.getFormSubmissionByIdForUser({ submissionId, userId });

    const [deleted] = await db
      .delete(formSubmissionsTable)
      .where(eq(formSubmissionsTable.id, submissionId))
      .returning({
        id: formSubmissionsTable.id,
      });

    if (!deleted) {
      throw new Error(`Form submission with id ${submissionId} does not exist`);
    }

    return deleteFormSubmissionOutput.parse(deleted);
  }

  public async exportFormSubmissionsCsvForUser(
    payload: ExportFormSubmissionsCsvForUserInputType,
  ): Promise<ExportFormSubmissionsCsvOutputType> {
    const { formId, userId } = await exportFormSubmissionsCsvForUserInput.parseAsync(payload);
    const form = await this.getFormMetadataForUser({ formId, userId });
    const [fields, submissions] = await Promise.all([
      this.getFieldsForUser({ formId, userId }),
      this.getFormSubmissionsByFormIdForUser({ formId, userId }),
    ]);
    const headers = ["Submission ID", "Submitted at", ...fields.map((field) => field.labelKey)];
    const rows = submissions.map((submission) => [
      submission.id,
      submission.createdAt instanceof Date ? submission.createdAt.toISOString() : submission.createdAt,
      ...fields.map((field) => getAnswer(submission, field.id)),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeCsv(value)).join(","))
      .join("\r\n");

    return exportFormSubmissionsCsvOutput.parse({
      fileName: `${slugFileName(form.title)}-responses.csv`,
      mimeType: "text/csv;charset=utf-8",
      csv,
    });
  }

  private async getFormMetadataForUser({
    formId,
    userId,
  }: {
    formId: string;
    userId: string;
  }): Promise<FormMetadata> {
    const [form] = await db
      .select({
        id: forms.id,
        title: forms.title,
        creatorEmail: usersTable.email,
        creatorName: usersTable.fullName,
      })
      .from(forms)
      .innerJoin(usersTable, eq(usersTable.id, forms.creatorId))
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .limit(1);

    if (!form) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return form;
  }

  private async getFieldsForUser({
    formId,
    userId,
  }: {
    formId: string;
    userId: string;
  }): Promise<ValidationField[]> {
    await this.getFormMetadataForUser({ formId, userId });

    return db
      .select({
        id: formFields.id,
        label: formFields.label,
        labelKey: formFields.labelKey,
        isRequired: formFields.isRequired,
        type: formFields.type,
        options: formFields.options,
        validationRules: formFields.validationRules,
        min: formFields.min,
        max: formFields.max,
        pattern: formFields.pattern,
      })
      .from(formFields)
      .where(eq(formFields.formId, formId));
  }

  private async sendSubmissionEmails({
    form,
    fields,
    values,
    submissionId,
  }: {
    form: FormMetadata;
    fields: ValidationField[];
    values: CreateFormSubmissionInputType["values"];
    submissionId: string;
  }) {
    const summary = fields
      .map((field) => {
        const answer = values.find((value) => value.formFieldId === field.id)?.value.trim();
        return `${field.label}: ${answer || "No answer"}`;
      })
      .join("\n");

    await sendEmail({
      to: form.creatorEmail,
      subject: `New response for ${form.title}`,
      text: `Hi ${form.creatorName},\n\n${form.title} received a new response.\n\n${summary}\n\nSubmission ID: ${submissionId}`,
      html: `<p>Hi ${form.creatorName},</p><p><strong>${form.title}</strong> received a new response.</p><pre>${summary}</pre><p>Submission ID: ${submissionId}</p>`,
    });

    const respondentEmail = findRespondentEmail(fields, values);

    if (respondentEmail) {
      await sendEmail({
        to: respondentEmail,
        subject: `We received your ${form.title} response`,
        text: `Thanks for submitting ${form.title}. We received your response successfully.\n\nSubmission ID: ${submissionId}`,
        html: `<p>Thanks for submitting <strong>${form.title}</strong>.</p><p>We received your response successfully.</p><p>Submission ID: ${submissionId}</p>`,
      });
    }
  }
}

export default FormSubmissionService;
