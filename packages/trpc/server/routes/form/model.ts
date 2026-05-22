import { z } from "zod";

export const fieldTypeModel = z.enum([
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

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().describe("description of the form"),
  expiresAt: z.string().datetime().optional().describe("expiry date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const listFormsInputModel = z.undefined();

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    creatorId: z.string().describe("id of the user who created the form"),
    expiresAt: z.date().nullable().describe("expiry date of the form"),
    createdAt: z.date().nullable().describe("created date of the form"),
    updatedAt: z.date().nullable().describe("updated date of the form"),
  }),
);

export const getFormByIdInputModel = z.object({
  formId: z.string().uuid().describe("id of the public form to fetch"),
});

export const getFormByIdOutputModel = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().describe("description of the form"),
  expiresAt: z.date().nullable().describe("expiry date of the form"),
  createdAt: z.date().nullable().describe("created date of the form"),
  updatedAt: z.date().nullable().describe("updated date of the form"),
  fields: z
    .array(
      z.object({
        id: z.string().describe("id of the field"),
        formId: z.string().describe("id of the form this field belongs to"),
        label: z.string().describe("display label of the field"),
        labelKey: z.string().describe("stable slug key generated from the original label"),
        description: z.string().nullable().describe("optional field description"),
        placeholder: z.string().nullable().describe("optional field placeholder"),
        isRequired: z.boolean().nullable().default(false).describe("whether the field is required"),
        type: fieldTypeModel.describe("type of the field"),
        index: z.string().describe("fractional index used for sorting fields"),
        createdAt: z.date().nullable().describe("created date of the field"),
      }),
    )
    .describe("fields belonging to the form"),
});

export const createFieldInputModel = z.object({
  formId: z.string().uuid().describe("id of the form this field belongs to"),
  label: z.string().min(1).max(100).describe("display label of the field"),
  description: z.string().optional().describe("optional field description"),
  placeholder: z.string().optional().describe("optional field placeholder"),
  isRequired: z.boolean().optional().describe("whether the field is required").default(false),
  type: fieldTypeModel.describe("type of the field"),
  index: z.string().min(1).describe("fractional index used for sorting fields"),
});

export const createFieldOutputModel = z.object({
  id: z.string().describe("id of the created field"),
});

export const getFieldsInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to list fields for"),
});

export const getFieldsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the field"),
    formId: z.string().describe("id of the form this field belongs to"),
    label: z.string().describe("display label of the field"),
    labelKey: z.string().describe("stable slug key generated from the original label"),
    description: z.string().nullable().describe("optional field description"),
    placeholder: z.string().nullable().describe("optional field placeholder"),
    isRequired: z.boolean().nullable().default(false).describe("whether the field is required"),
    type: fieldTypeModel.describe("type of the field"),
    index: z.string().describe("fractional index used for sorting fields"),
    createdAt: z.date().nullable().describe("created date of the field"),
  }),
);

export const updateFieldInputModel = z.object({
  id: z.string().uuid().describe("id of the field to update"),
  label: z.string().min(1).max(100).optional().describe("display label of the field"),
  description: z.string().optional().nullable().describe("optional field description"),
  placeholder: z.string().optional().nullable().describe("optional field placeholder"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeModel.optional().describe("type of the field"),
  index: z.string().min(1).optional().describe("fractional index used for sorting fields"),
});

export const updateFieldOutputModel = z.object({
  id: z.string().describe("id of the updated field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().uuid().describe("id of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("id of the deleted field"),
});
