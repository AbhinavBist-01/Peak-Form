import { z } from "zod";

export const createFormSubmissionInput = z.object({
  formId: z.uuid().describe("The id of the form being submitted"),
  values: z
    .array(
      z.object({
        formFieldId: z.uuid().describe("The id of the submitted form field"),
        value: z.string().describe("The submitted field value"),
      }),
    )
    .describe("Submitted field values"),
});

export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;

export const createFormSubmissionOutput = z.object({
  id: z.uuid().describe("The id of the created form submission"),
});

export type CreateFormSubmissionOutputType = z.infer<typeof createFormSubmissionOutput>;

export const getFormSubmissionsByFormIdInput = z.object({
  formId: z.uuid().describe("The id of the form to list submissions for"),
});

export type GetFormSubmissionsByFormIdInputType = z.infer<typeof getFormSubmissionsByFormIdInput>;

export const getFormSubmissionsByFormIdForUserInput = z.object({
  formId: z.uuid().describe("The id of the form to list submissions for"),
  userId: z.uuid().describe("The id of the form creator"),
});

export type GetFormSubmissionsByFormIdForUserInputType = z.infer<
  typeof getFormSubmissionsByFormIdForUserInput
>;

export const getFormSubmissionsByFormIdOutput = z.array(
  z.object({
    id: z.uuid().describe("The id of the form submission"),
    formId: z.uuid().describe("The id of the submitted form"),
    values: z
      .array(
        z.object({
          formFieldId: z.uuid().describe("The id of the submitted form field"),
          value: z.string().describe("The submitted field value"),
        }),
      )
      .describe("Submitted field values"),
    createdAt: z.date().nullable().describe("The date when the submission was created"),
  }),
);

export type GetFormSubmissionsByFormIdOutputType = z.infer<typeof getFormSubmissionsByFormIdOutput>;
