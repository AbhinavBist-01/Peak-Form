import { authenticatedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { createFormInputModel, createFormOutputModel } from "./model";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createForm",
        tags: TAGS,
        summary: "Create a new form",
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description, expiresAt } = input;

      const { id } = await formService.createForm({
        title,
        description,
        creatorId: ctx.user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });

      return { id };
    }),
});
