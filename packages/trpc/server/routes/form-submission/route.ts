import { formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
  createFormSubmissionInputModel,
  createFormSubmissionOutputModel,
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
});
