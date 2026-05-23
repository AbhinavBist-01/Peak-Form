import { and, db, desc, eq } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { forms } from "@repo/database/models/form";
import {
  createFormSubmissionInput,
  createFormSubmissionOutput,
  getFormSubmissionsByFormIdInput,
  getFormSubmissionsByFormIdForUserInput,
  getFormSubmissionsByFormIdOutput,
  type CreateFormSubmissionInputType,
  type CreateFormSubmissionOutputType,
  type GetFormSubmissionsByFormIdInputType,
  type GetFormSubmissionsByFormIdForUserInputType,
  type GetFormSubmissionsByFormIdOutputType,
} from "./model";

type ValidationField = {
  id: string;
  label: string;
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

function getValidationMessage(field: ValidationField, fallback: string) {
  return field.validationRules?.customErrorMessage || fallback;
}

function getMultiValue(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
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
        status: forms.status,
        expiresAt: forms.expiresAt,
      })
      .from(forms)
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
}

export default FormSubmissionService;
