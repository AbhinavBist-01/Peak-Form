import { z } from "zod";

export const createFormSubmissionInputModel = z.object({
  formId: z.string().uuid().describe("id of the submitted form"),
  values: z
    .array(
      z.object({
        formFieldId: z.string().uuid().describe("id of the submitted form field"),
        value: z.string().describe("submitted field value"),
      }),
    )
    .describe("submitted field values"),
});

export const createFormSubmissionOutputModel = z.object({
  id: z.string().uuid().describe("id of the created form submission"),
});
