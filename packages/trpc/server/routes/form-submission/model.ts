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

export const getFormSubmissionsByFormIdInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to list submissions for"),
});

export const getFormSubmissionsByFormIdOutputModel = z.array(
  z.object({
    id: z.string().uuid().describe("id of the form submission"),
    formId: z.string().uuid().describe("id of the submitted form"),
    values: z
      .array(
        z.object({
          formFieldId: z.string().uuid().describe("id of the submitted form field"),
          value: z.string().describe("submitted field value"),
        }),
      )
      .describe("submitted field values"),
    createdAt: z.date().nullable().describe("created date of the form submission"),
  }),
);

export const getFormSubmissionAnalyticsInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to analyze"),
});

export const getFormSubmissionAnalyticsOutputModel = z.object({
  responseCount: z.number().int().nonnegative().describe("total response count"),
  completionTrend: z.array(
    z.object({
      date: z.string().describe("response date"),
      count: z.number().int().nonnegative().describe("response count for the date"),
    }),
  ),
  fieldSummaries: z.array(
    z.object({
      fieldId: z.string().uuid().describe("id of the field"),
      label: z.string().describe("field label"),
      labelKey: z.string().describe("stable field key"),
      type: z.string().describe("field type"),
      totalAnswers: z.number().int().nonnegative().describe("non-empty answers"),
      completionRate: z.number().min(0).max(100).describe("answer completion rate"),
      ratingAverage: z.number().nullable().describe("average rating"),
      distribution: z.array(
        z.object({
          value: z.string().describe("submitted value"),
          count: z.number().int().nonnegative().describe("submission count"),
          percentage: z.number().min(0).max(100).describe("value percentage"),
        }),
      ),
    }),
  ),
});

export const getFormSubmissionByIdInputModel = z.object({
  submissionId: z.string().uuid().describe("id of the form submission"),
});

export const getFormSubmissionByIdOutputModel = z.object({
  id: z.string().uuid().describe("id of the form submission"),
  formId: z.string().uuid().describe("id of the submitted form"),
  values: z.array(
    z.object({
      formFieldId: z.string().uuid().describe("id of the submitted form field"),
      value: z.string().describe("submitted field value"),
    }),
  ),
  createdAt: z.date().nullable().describe("created date of the form submission"),
});

export const deleteFormSubmissionInputModel = z.object({
  submissionId: z.string().uuid().describe("id of the form submission to delete"),
});

export const deleteFormSubmissionOutputModel = z.object({
  id: z.string().uuid().describe("id of the deleted form submission"),
});

export const exportFormSubmissionsCsvInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to export"),
});

export const exportFormSubmissionsCsvOutputModel = z.object({
  fileName: z.string().describe("suggested CSV filename"),
  mimeType: z.string().describe("CSV mime type"),
  csv: z.string().describe("CSV contents"),
});
