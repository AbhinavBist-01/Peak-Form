import { formSubmissionService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { createFormSubmissionInputModel, createFormSubmissionOutputModel } from "./model";

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
});
