import { db, eq } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { forms } from "@repo/database/models/form";
import {
  createFormSubmissionInput,
  createFormSubmissionOutput,
  type CreateFormSubmissionInputType,
  type CreateFormSubmissionOutputType,
} from "./model";

class FormSubmissionService {
  public async createFormSubmission(
    payload: CreateFormSubmissionInputType,
  ): Promise<CreateFormSubmissionOutputType> {
    const { formId, values } = await createFormSubmissionInput.parseAsync(payload);

    const [form] = await db
      .select({
        id: forms.id,
        expiresAt: forms.expiresAt,
      })
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (!form) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    if (form.expiresAt && form.expiresAt.getTime() < Date.now()) {
      throw new Error("This form is no longer accepting submissions");
    }

    const fields = await db
      .select({
        id: formFields.id,
        label: formFields.label,
        isRequired: formFields.isRequired,
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
      if (!field.isRequired) {
        continue;
      }

      const submittedValue = values.find((value) => value.formFieldId === field.id);

      if (!submittedValue?.value.trim()) {
        throw new Error(`${field.label} is required`);
      }
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
}

export default FormSubmissionService;
