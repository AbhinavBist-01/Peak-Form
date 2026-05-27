import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { formFieldService, formService } from "../../services";
import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  archiveFormInputModel,
  archiveFormOutputModel,
  cloneFormInputModel,
  cloneFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  getFormByIdInputModel,
  getFormByIdOutputModel,
  getFormForEditorInputModel,
  getFormForEditorOutputModel,
  getFieldsInputModel,
  getFieldsOutputModel,
  getAdminOverviewInputModel,
  getAdminOverviewOutputModel,
  listFormsInputModel,
  listFormsOutputModel,
  listPublicFormsInputModel,
  listPublicFormsOutputModel,
  publishFormInputModel,
  publishFormOutputModel,
  unpublishFormInputModel,
  unpublishFormOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
  updateFormSettingsInputModel,
  updateFormSettingsOutputModel,
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
        slug: input.slug,
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

  listPublicForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/listPublicForms",
        tags: TAGS,
        summary: "List published public forms",
      },
    })
    .input(listPublicFormsInputModel)
    .output(listPublicFormsOutputModel)
    .query(async () => {
      return formService.listPublicForms();
    }),

  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/deleteForm",
        tags: TAGS,
        summary: "Delete a form created by the logged-in user",
        protect: true,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { id } = await formService.deleteForm({
        formId: input.formId,
        userId: ctx.user.id,
      });
      return { id };
    }),

  updateFormSettings: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/updateFormSettings",
        tags: TAGS,
        summary: "Update form lifecycle and presentation settings",
        protect: true,
      },
    })
    .input(updateFormSettingsInputModel)
    .output(updateFormSettingsOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { id } = await formService.updateFormSettings({
        formId: input.formId,
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        slug: input.slug,
        visibility: input.visibility,
        expiresAt:
          input.expiresAt === undefined
            ? undefined
            : input.expiresAt === null
              ? null
              : new Date(input.expiresAt),
        themeConfig: input.themeConfig,
        pageSize: input.pageSize,
        password: input.password,
      });

      return { id };
    }),

  publishForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/publishForm",
        tags: TAGS,
        summary: "Publish a form",
        protect: true,
      },
    })
    .input(publishFormInputModel)
    .output(publishFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formService.publishForm({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  unpublishForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/unpublishForm",
        tags: TAGS,
        summary: "Unpublish a form",
        protect: true,
      },
    })
    .input(unpublishFormInputModel)
    .output(unpublishFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formService.unpublishForm({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  archiveForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/archiveForm",
        tags: TAGS,
        summary: "Archive a form",
        protect: true,
      },
    })
    .input(archiveFormInputModel)
    .output(archiveFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formService.archiveForm({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  cloneForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/cloneForm",
        tags: TAGS,
        summary: "Clone a form with all fields",
        protect: true,
      },
    })
    .input(cloneFormInputModel)
    .output(cloneFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      return formService.cloneForm({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormById",
        tags: TAGS,
        summary: "Get a public form by id",
      },
    })
    .input(getFormByIdInputModel)
    .output(getFormByIdOutputModel)
    .query(async ({ input }) => {
      return formService.getFormById(input);
    }),

  getFormForEditor: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getFormForEditor",
        tags: TAGS,
        summary: "Get a form owned by the logged-in user for editing",
        protect: true,
      },
    })
    .input(getFormForEditorInputModel)
    .output(getFormForEditorOutputModel)
    .query(async ({ input, ctx }) => {
      return formService.getFormForEditor({
        formId: input.formId,
        userId: ctx.user.id,
      });
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
      const { id } = await formFieldService.createField(
        input as Parameters<typeof formFieldService.createField>[0],
      );
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
      const { id } = await formFieldService.updateField(
        input as Parameters<typeof formFieldService.updateField>[0],
      );
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

  getAdminOverview: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/getAdminOverview",
        tags: ["Admin"],
        summary: "Get admin platform overview",
        protect: true,
      },
    })
    .input(getAdminOverviewInputModel)
    .output(getAdminOverviewOutputModel)
    .query(async ({ ctx }) => {
      return formService.getAdminOverview({ userId: ctx.user.id });
    }),
});
