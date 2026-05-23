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
  "RATING",
]);

export const fieldOptionsInput = z.array(z.string().min(1).max(100)).max(50);
export const fieldValidationRulesInput = z
  .object({
    customErrorMessage: z.string().min(1).max(200).optional(),
  })
  .strict();

function isValidPattern(pattern: string | null | undefined) {
  if (!pattern) {
    return true;
  }

  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

export const createFieldInput = z
  .object({
    formId: z.uuid().describe("The id of the form this field belongs to"),
    label: z.string().min(1).max(100).describe("The display label of the field"),
    description: z.string().optional().describe("The optional field description"),
    helpText: z.string().optional().describe("The optional respondent-facing helper text"),
    placeholder: z.string().optional().describe("The optional field placeholder"),
    options: fieldOptionsInput.optional().describe("The options for choice-based fields"),
    validationRules: fieldValidationRulesInput
      .optional()
      .describe("Additional validation configuration"),
    min: z.number().int().optional().describe("The minimum value or length"),
    max: z.number().int().optional().describe("The maximum value or length"),
    pattern: z.string().optional().describe("A regular expression pattern for text validation"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    type: fieldTypeInput.describe("The type of the field"),
    index: z.string().min(1).describe("The fractional index used for sorting fields"),
  })
  .refine(({ min, max }) => min === undefined || max === undefined || min <= max, {
    message: "Minimum must be less than or equal to maximum",
    path: ["min"],
  })
  .refine(({ pattern }) => isValidPattern(pattern), {
    message: "Pattern must be a valid regular expression",
    path: ["pattern"],
  });

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z
  .object({
    id: z.uuid().describe("The id of the field to update"),
    label: z.string().min(1).max(100).optional().describe("The display label of the field"),
    description: z.string().optional().nullable().describe("The optional field description"),
    helpText: z.string().optional().nullable().describe("The optional respondent-facing helper text"),
    placeholder: z.string().optional().nullable().describe("The optional field placeholder"),
    options: fieldOptionsInput.optional().nullable().describe("The options for choice-based fields"),
    validationRules: fieldValidationRulesInput
      .optional()
      .nullable()
      .describe("Additional validation configuration"),
    min: z.number().int().optional().nullable().describe("The minimum value or length"),
    max: z.number().int().optional().nullable().describe("The maximum value or length"),
    pattern: z.string().optional().nullable().describe("A regular expression pattern for text validation"),
    isRequired: z.boolean().optional().describe("Whether the field is required"),
    type: fieldTypeInput.optional().describe("The type of the field"),
    index: z.string().min(1).optional().describe("The fractional index used for sorting fields"),
  })
  .refine(
    ({ id, ...values }) => Object.values(values).some((value) => value !== undefined),
    "At least one field must be provided to update",
  )
  .refine(({ min, max }) => min === undefined || max === undefined || min === null || max === null || min <= max, {
    message: "Minimum must be less than or equal to maximum",
    path: ["min"],
  })
  .refine(({ pattern }) => isValidPattern(pattern), {
    message: "Pattern must be a valid regular expression",
    path: ["pattern"],
  });

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
  id: z.uuid().describe("The id of the field to delete"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldsInput = z.object({
  formId: z.uuid().describe("The id of the form to list fields for"),
});

export type GetFieldsInputType = z.infer<typeof getFieldsInput>;
