import { asc, db, eq } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import {
  createFieldInput,
  deleteFieldInput,
  getFieldsInput,
  updateFieldInput,
  type CreateFieldInputType,
  type DeleteFieldInputType,
  type GetFieldsInputType,
  type UpdateFieldInputType,
} from "./model";

function createLabelKey(label: string) {
  const slug = label
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "field";
}

class FormFieldService {
  public async createField(payload: CreateFieldInputType) {
    const {
      formId,
      label,
      description,
      helpText,
      placeholder,
      options,
      validationRules,
      min,
      max,
      pattern,
      isRequired,
      type,
      index,
    } =
      await createFieldInput.parseAsync(payload);

    const result = await db
      .insert(formFields)
      .values({
        formId,
        label,
        labelKey: createLabelKey(label),
        description,
        helpText,
        placeholder,
        options,
        validationRules,
        min,
        max,
        pattern,
        isRequired,
        type,
        index,
      })
      .returning({
        id: formFields.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Failed to create form field");
    }

    return {
      id: result[0].id,
    };
  }

  public async getFields(payload: GetFieldsInputType) {
    const { formId } = await getFieldsInput.parseAsync(payload);

    return db
      .select({
        id: formFields.id,
        formId: formFields.formId,
        label: formFields.label,
        labelKey: formFields.labelKey,
        description: formFields.description,
        helpText: formFields.helpText,
        placeholder: formFields.placeholder,
        options: formFields.options,
        validationRules: formFields.validationRules,
        min: formFields.min,
        max: formFields.max,
        pattern: formFields.pattern,
        isRequired: formFields.isRequired,
        type: formFields.type,
        index: formFields.index,
        createdAt: formFields.createdAt,
      })
      .from(formFields)
      .where(eq(formFields.formId, formId))
      .orderBy(asc(formFields.index));
  }

  public async updateField(payload: UpdateFieldInputType) {
    const {
      id,
      label,
      description,
      helpText,
      placeholder,
      options,
      validationRules,
      min,
      max,
      pattern,
      isRequired,
      type,
      index,
    } =
      await updateFieldInput.parseAsync(payload);

    const result = await db
      .update(formFields)
      .set({
        label,
        description,
        helpText,
        placeholder,
        options,
        validationRules,
        min,
        max,
        pattern,
        isRequired,
        type,
        index,
      })
      .where(eq(formFields.id, id))
      .returning({
        id: formFields.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form field with id ${id} does not exist`);
    }

    return {
      id: result[0].id,
    };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const result = await db.delete(formFields).where(eq(formFields.id, id)).returning({
      id: formFields.id,
    });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form field with id ${id} does not exist`);
    }

    return {
      id: result[0].id,
    };
  }
}

export default FormFieldService;
