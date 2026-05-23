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

export const getFormSubmissionAnalyticsForUserInput = z.object({
  formId: z.uuid().describe("The id of the form to analyze"),
  userId: z.uuid().describe("The id of the form creator"),
});

export type GetFormSubmissionAnalyticsForUserInputType = z.infer<
  typeof getFormSubmissionAnalyticsForUserInput
>;

export const formSubmissionAnalyticsOutput = z.object({
  responseCount: z.number().int().nonnegative().describe("Total number of responses"),
  completionTrend: z
    .array(
      z.object({
        date: z.string().describe("Response date in YYYY-MM-DD format"),
        count: z.number().int().nonnegative().describe("Responses submitted on the date"),
      }),
    )
    .describe("Responses grouped by submission date"),
  fieldSummaries: z
    .array(
      z.object({
        fieldId: z.uuid().describe("The id of the field"),
        label: z.string().describe("The field label"),
        labelKey: z.string().describe("The stable field key"),
        type: z.string().describe("The field type"),
        totalAnswers: z.number().int().nonnegative().describe("Number of non-empty answers"),
        completionRate: z.number().min(0).max(100).describe("Answered response percentage"),
        ratingAverage: z.number().nullable().describe("Average rating for rating fields"),
        distribution: z
          .array(
            z.object({
              value: z.string().describe("Submitted option or rating value"),
              count: z.number().int().nonnegative().describe("Number of times this value was submitted"),
              percentage: z.number().min(0).max(100).describe("Share of answered values"),
            }),
          )
          .describe("Distribution for rating/select/radio/checkbox fields"),
      }),
    )
    .describe("Per-field answer summaries"),
});

export type FormSubmissionAnalyticsOutputType = z.infer<typeof formSubmissionAnalyticsOutput>;

export const getFormSubmissionByIdForUserInput = z.object({
  submissionId: z.uuid().describe("The id of the submission to fetch"),
  userId: z.uuid().describe("The id of the form creator"),
});

export type GetFormSubmissionByIdForUserInputType = z.infer<
  typeof getFormSubmissionByIdForUserInput
>;

export const getFormSubmissionByIdOutput = z.object({
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
});

export type GetFormSubmissionByIdOutputType = z.infer<typeof getFormSubmissionByIdOutput>;

export const deleteFormSubmissionForUserInput = z.object({
  submissionId: z.uuid().describe("The id of the submission to delete"),
  userId: z.uuid().describe("The id of the form creator"),
});

export type DeleteFormSubmissionForUserInputType = z.infer<
  typeof deleteFormSubmissionForUserInput
>;

export const deleteFormSubmissionOutput = z.object({
  id: z.uuid().describe("The id of the deleted submission"),
});

export type DeleteFormSubmissionOutputType = z.infer<typeof deleteFormSubmissionOutput>;

export const exportFormSubmissionsCsvForUserInput = z.object({
  formId: z.uuid().describe("The id of the form to export"),
  userId: z.uuid().describe("The id of the form creator"),
});

export type ExportFormSubmissionsCsvForUserInputType = z.infer<
  typeof exportFormSubmissionsCsvForUserInput
>;

export const exportFormSubmissionsCsvOutput = z.object({
  fileName: z.string().describe("Suggested CSV filename"),
  mimeType: z.string().describe("CSV mime type"),
  csv: z.string().describe("CSV file contents"),
});

export type ExportFormSubmissionsCsvOutputType = z.infer<typeof exportFormSubmissionsCsvOutput>;
