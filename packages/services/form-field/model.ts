import { z } from "zod";

export const fieldTypeInput = z.enum([
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
]);

export const createFieldInput = z.object({
  formId: z.uuid().describe("The id of the form this field belongs to"),
  label: z.string().min(1).max(100).describe("The display label of the field"),
  description: z.string().optional().describe("The optional field description"),
  placeholder: z.string().optional().describe("The optional field placeholder"),
  isRequired: z.boolean().optional().describe("Whether the field is required"),
  type: fieldTypeInput.describe("The type of the field"),
  index: z.string().min(1).describe("The fractional index used for sorting fields"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z
  .object({
    id: z.uuid().describe("The id of the field to update"),
    label: z.string().min(1).max(100).optional().describe("The display label of the field"),
    description: z.string().optional().nullable().describe("The optional field description"),
    placeholder: z.string().optional().nullable().describe("The optional field placeholder"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    type: fieldTypeInput.optional().describe("The type of the field"),
    index: z.string().min(1).optional().describe("The fractional index used for sorting fields"),
  })
  .refine(
    ({ id, ...values }) => Object.values(values).some((value) => value !== undefined),
    "At least one field must be provided to update",
  );

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
  id: z.uuid().describe("The id of the field to delete"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldsInput = z.object({
  formId: z.uuid().describe("The id of the form to list fields for"),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInput>;
