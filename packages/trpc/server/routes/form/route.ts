import { authenticatedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import {
  createFormInputModel,
  createFormOutputModel,
  listFormsInputModel,
  listFormsOutputModel,
} from "./model";
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

  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/listForms",
        tags: TAGS,
        summary: "List forms created by the logged-in user",
        protect: true,
      },
    })
    .input(listFormsInputModel)
    .output(listFormsOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormByUserId({
        userId: ctx.user.id,
      });
      return forms;
    }),
});
