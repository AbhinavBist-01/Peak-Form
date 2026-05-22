import { z } from "zod";

const publicFormFieldOutput = z.object({
  id: z.uuid().describe("The id of the field"),
  formId: z.uuid().describe("The id of the form this field belongs to"),
  label: z.string().describe("The display label of the field"),
  labelKey: z.string().describe("The stable slug key generated from the original label"),
  description: z.string().nullable().describe("The optional field description"),
  placeholder: z.string().nullable().describe("The optional field placeholder"),
  isRequired: z.boolean().nullable().describe("Whether the field is required"),
  type: z
    .enum([
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
    ])
    .describe("The type of the field"),
  index: z.string().describe("The fractional index used for sorting fields"),
  createdAt: z.date().nullable().describe("The date when the field was created"),
});

export const createFormInput = z.object({
  title: z.string().max(55).describe("The title of the form"),
  description: z.string().optional().describe("The description of the form"),
  creatorId: z.uuid().describe("The id of the user creating the form"),
  expiresAt: z.date().optional().describe("The date when the form expires"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const createFormOutput = z.object({
  id: z.uuid().describe("The id of the created form"),
});

export type CreateFormOutputType = z.infer<typeof createFormOutput>;

export const listFormByUserIdInput = z.object({
  userId: z.uuid().describe("The id of the user who created the forms"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const listFormByUserIdOutput = z.array(
  z.object({
    id: z.uuid().describe("The id of the form"),
    title: z.string().describe("The title of the form"),
    description: z.string().nullable().describe("The description of the form"),
    creatorId: z.uuid().describe("The id of the user who created the form"),
    expiresAt: z.date().nullable().describe("The date when the form expires"),
    createdAt: z.date().nullable().describe("The date when the form was created"),
    updatedAt: z.date().nullable().describe("The date when the form was updated"),
  }),
);

export type ListFormByUserIdOutputType = z.infer<typeof listFormByUserIdOutput>;

export const getFormByIdInput = z.object({
  formId: z.uuid().describe("The id of the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const getFormByIdOutput = z.object({
  id: z.uuid().describe("The id of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  expiresAt: z.date().nullable().describe("The date when the form expires"),
  createdAt: z.date().nullable().describe("The date when the form was created"),
  updatedAt: z.date().nullable().describe("The date when the form was updated"),
  fields: z.array(publicFormFieldOutput).describe("The fields belonging to the form"),
});

export type GetFormByIdOutputType = z.infer<typeof getFormByIdOutput>;
