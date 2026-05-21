import { authenticatedProcedure, router } from "../../trpc";
import { formFieldService, formService } from "../../services";
import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  getFieldsInputModel,
  getFieldsOutputModel,
  listFormsInputModel,
  listFormsOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
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

  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/createField",
        tags: TAGS,
        summary: "Create a new form field",
        protect: true,
      },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.createField(input);
      return { id };
    }),

  getFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFields",
        tags: TAGS,
        summary: "List fields for a form",
        protect: true,
      },
    })
    .input(getFieldsInputModel)
    .output(getFieldsOutputModel)
    .query(async ({ input }) => {
      return formFieldService.getFields(input);
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/updateField",
        tags: TAGS,
        summary: "Update a form field",
        protect: true,
      },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.updateField(input);
      return { id };
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/deleteField",
        tags: TAGS,
        summary: "Delete a form field",
        protect: true,
      },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.deleteField(input);
      return { id };
    }),
});
