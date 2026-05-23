import { formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
  createFormSubmissionInputModel,
  createFormSubmissionOutputModel,
  deleteFormSubmissionInputModel,
  deleteFormSubmissionOutputModel,
  exportFormSubmissionsCsvInputModel,
  exportFormSubmissionsCsvOutputModel,
  getFormSubmissionAnalyticsInputModel,
  getFormSubmissionAnalyticsOutputModel,
  getFormSubmissionByIdInputModel,
  getFormSubmissionByIdOutputModel,
  getFormSubmissionsByFormIdInputModel,
  getFormSubmissionsByFormIdOutputModel,
} from "./model";

const TAGS = ["Form submission"];

export const formSubmissionRouter = router({
  createFormSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createFormSubmission",
        tags: TAGS,
        summary: "Submit a public form response",
      },
    })
    .input(createFormSubmissionInputModel)
    .output(createFormSubmissionOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formSubmissionService.createFormSubmission(input);
      return { id };
    }),

  getFormSubmissionsByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormSubmissionsByFormId",
        tags: TAGS,
        summary: "List submissions for a form owned by the logged-in user",
        protect: true,
      },
    })
    .input(getFormSubmissionsByFormIdInputModel)
    .output(getFormSubmissionsByFormIdOutputModel)
    .query(async ({ input, ctx }) => {
      return formSubmissionService.getFormSubmissionsByFormIdForUser({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  getFormSubmissionAnalytics: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormSubmissionAnalytics",
        tags: TAGS,
        summary: "Get response analytics for a form owned by the logged-in user",
        protect: true,
      },
    })
    .input(getFormSubmissionAnalyticsInputModel)
    .output(getFormSubmissionAnalyticsOutputModel)
    .query(async ({ input, ctx }) => {
      return formSubmissionService.getFormSubmissionAnalyticsForUser({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  getFormSubmissionById: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormSubmissionById",
        tags: TAGS,
        summary: "Get one submission for a form owned by the logged-in user",
        protect: true,
      },
    })
    .input(getFormSubmissionByIdInputModel)
    .output(getFormSubmissionByIdOutputModel)
    .query(async ({ input, ctx }) => {
      return formSubmissionService.getFormSubmissionByIdForUser({
        submissionId: input.submissionId,
        userId: ctx.user.id,
      });
    }),

  deleteFormSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/deleteFormSubmission",
        tags: TAGS,
        summary: "Delete one submission for a form owned by the logged-in user",
        protect: true,
      },
    })
    .input(deleteFormSubmissionInputModel)
    .output(deleteFormSubmissionOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formSubmissionService.deleteFormSubmissionForUser({
        submissionId: input.submissionId,
        userId: ctx.user.id,
      });
    }),

  exportFormSubmissionsCsv: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/exportFormSubmissionsCsv",
        tags: TAGS,
        summary: "Export form submissions as CSV",
        protect: true,
      },
    })
    .input(exportFormSubmissionsCsvInputModel)
    .output(exportFormSubmissionsCsvOutputModel)
    .query(async ({ input, ctx }) => {
      return formSubmissionService.exportFormSubmissionsCsvForUser({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),
});
