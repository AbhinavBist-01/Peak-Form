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
