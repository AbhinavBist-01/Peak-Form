import { z } from "zod";

export const formStatus = z.enum(["draft", "published", "archived"]);
export const formVisibility = z.enum(["public", "unlisted"]);
export const formPageSize = z.enum(["all", "1", "2", "3", "5"]);
export const formThemeConfig = z
  .object({
    name: z.string().optional(),
    backgroundColor: z.string().optional(),
    accentColor: z.string().optional(),
    textColor: z.string().optional(),
    fontFamily: z.string().optional(),
  })
  .strict();

const publicFormFieldOutput = z.object({
  id: z.uuid().describe("The id of the field"),
  formId: z.uuid().describe("The id of the form this field belongs to"),
  label: z.string().describe("The display label of the field"),
  labelKey: z.string().describe("The stable slug key generated from the original label"),
  description: z.string().nullable().describe("The optional field description"),
  helpText: z.string().nullable().describe("The optional respondent-facing helper text"),
  placeholder: z.string().nullable().describe("The optional field placeholder"),
  options: z.array(z.string()).nullable().describe("The options for choice-based fields"),
  validationRules: z
    .object({
      customErrorMessage: z.string().optional(),
      conditionalLogic: z
        .object({
          fieldId: z.uuid(),
          operator: z.enum(["equals", "not_equals", "contains", "not_empty"]),
          value: z.string().optional(),
        })
        .optional(),
    })
    .strict()
    .nullable()
    .describe("Additional validation configuration"),
  min: z.number().nullable().describe("The minimum value or length"),
  max: z.number().nullable().describe("The maximum value or length"),
  pattern: z.string().nullable().describe("A regular expression pattern for text validation"),
  isRequired: z.boolean().nullable().describe("Whether the field is required"),
  type: z
    .enum([
      "TEXT",
      "TEXTAREA",
      "SELECT",
      "RADIO",
      "CHECKBOX",
      "PASSWORD",
      "EMAIL",
      "YES_NO",
      "DATE",
      "NUMBER",
      "RATING",
    ])
    .describe("The type of the field"),
  index: z.string().describe("The fractional index used for sorting fields"),
  createdAt: z.date().nullable().describe("The date when the field was created"),
});

export const createFormInput = z.object({
  title: z.string().max(55).describe("The title of the form"),
  description: z.string().optional().describe("The description of the form"),
  creatorId: z.uuid().describe("The id of the user creating the form"),
  expiresAt: z.date().optional().describe("The date when the form expires"),
  slug: z.string().min(3).max(100).optional().describe("Optional custom form slug"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const createFormOutput = z.object({
  id: z.uuid().describe("The id of the created form"),
});

export type CreateFormOutputType = z.infer<typeof createFormOutput>;

export const listFormByUserIdInput = z.object({
  userId: z.uuid().describe("The id of the user who created the forms"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const listFormByUserIdOutput = z.array(
  z.object({
    id: z.uuid().describe("The id of the form"),
    slug: z.string().nullable().describe("The public slug of the form"),
    title: z.string().describe("The title of the form"),
    description: z.string().nullable().describe("The description of the form"),
    creatorId: z.uuid().describe("The id of the user who created the form"),
    status: formStatus.describe("The lifecycle status of the form"),
    visibility: formVisibility.describe("Whether the form appears in public listings"),
    publishedAt: z.date().nullable().describe("The date when the form was published"),
    themeConfig: formThemeConfig.nullable().describe("The visual theme config for the form"),
    expiresAt: z.date().nullable().describe("The date when the form expires"),
    pageSize: formPageSize.describe("The number of fields shown per public form page"),
    isPasswordProtected: z.boolean().describe("Whether the public form requires a password"),
    createdAt: z.date().nullable().describe("The date when the form was created"),
    updatedAt: z.date().nullable().describe("The date when the form was updated"),
  }),
);

export type ListFormByUserIdOutputType = z.infer<typeof listFormByUserIdOutput>;

export const deleteFormInput = z.object({
  formId: z.uuid().describe("The id of the form to delete"),
  userId: z.uuid().describe("The id of the user deleting the form"),
});

export type DeleteFormInputType = z.infer<typeof deleteFormInput>;

export const deleteFormOutput = z.object({
  id: z.uuid().describe("The id of the deleted form"),
});

export type DeleteFormOutputType = z.infer<typeof deleteFormOutput>;

export const getFormByIdInput = z.object({
  formId: z.string().min(1).max(100).describe("The id or slug of the form"),
  password: z.string().optional().describe("Optional password for protected forms"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const getFormByIdOutput = z.object({
  id: z.uuid().describe("The id of the form"),
  slug: z.string().nullable().describe("The public slug of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
  status: formStatus.describe("The lifecycle status of the form"),
  visibility: formVisibility.describe("Whether the form appears in public listings"),
  publishedAt: z.date().nullable().describe("The date when the form was published"),
  themeConfig: formThemeConfig.nullable().describe("The visual theme config for the form"),
  expiresAt: z.date().nullable().describe("The date when the form expires"),
  pageSize: formPageSize.describe("The number of fields shown per public form page"),
  isPasswordProtected: z.boolean().describe("Whether the public form requires a password"),
  requiresPassword: z.boolean().describe("Whether the supplied password is missing or invalid"),
  createdAt: z.date().nullable().describe("The date when the form was created"),
  updatedAt: z.date().nullable().describe("The date when the form was updated"),
  fields: z.array(publicFormFieldOutput).describe("The fields belonging to the form"),
});

export type GetFormByIdOutputType = z.infer<typeof getFormByIdOutput>;

export const getFormForEditorInput = z.object({
  formId: z.uuid().describe("The id of the form"),
  userId: z.uuid().describe("The id of the form owner"),
});

export type GetFormForEditorInputType = z.infer<typeof getFormForEditorInput>;

export const getFormForEditorOutput = getFormByIdOutput;

export type GetFormForEditorOutputType = z.infer<typeof getFormForEditorOutput>;

export const listPublicFormsOutput = z.array(
  z.object({
    id: z.uuid().describe("The id of the form"),
    slug: z.string().nullable().describe("The public slug of the form"),
    title: z.string().describe("The title of the form"),
    description: z.string().nullable().describe("The description of the form"),
    publishedAt: z.date().nullable().describe("The date when the form was published"),
    themeConfig: formThemeConfig.nullable().describe("The visual theme config for the form"),
    expiresAt: z.date().nullable().describe("The date when the form expires"),
    pageSize: formPageSize.describe("The number of fields shown per public form page"),
    createdAt: z.date().nullable().describe("The date when the form was created"),
  }),
);

export type ListPublicFormsOutputType = z.infer<typeof listPublicFormsOutput>;

export const updateFormSettingsInput = z.object({
  formId: z.uuid().describe("The id of the form to update"),
  userId: z.uuid().describe("The id of the form owner"),
  title: z.string().max(55).optional().describe("The title of the form"),
  description: z.string().max(500).nullable().optional().describe("The description of the form"),
  slug: z.string().min(3).max(100).nullable().optional().describe("The custom public slug"),
  visibility: formVisibility.optional().describe("Whether the form appears in public listings"),
  expiresAt: z.date().nullable().optional().describe("The date when the form expires"),
  themeConfig: formThemeConfig.nullable().optional().describe("The visual theme config for the form"),
  pageSize: formPageSize.optional().describe("The number of fields shown per public form page"),
  password: z.string().min(4).max(100).nullable().optional().describe("Set or clear the form password"),
});

export type UpdateFormSettingsInputType = z.infer<typeof updateFormSettingsInput>;

export const updateFormSettingsOutput = z.object({
  id: z.uuid().describe("The id of the updated form"),
});

export type UpdateFormSettingsOutputType = z.infer<typeof updateFormSettingsOutput>;

export const publishFormInput = z.object({
  formId: z.uuid().describe("The id of the form to publish"),
  userId: z.uuid().describe("The id of the form owner"),
});

export type PublishFormInputType = z.infer<typeof publishFormInput>;

export const publishFormOutput = z.object({
  id: z.uuid().describe("The id of the published form"),
  publishedAt: z.date().describe("The date when the form was published"),
});

export type PublishFormOutputType = z.infer<typeof publishFormOutput>;

export const unpublishFormInput = z.object({
  formId: z.uuid().describe("The id of the form to unpublish"),
  userId: z.uuid().describe("The id of the form owner"),
});

export type UnpublishFormInputType = z.infer<typeof unpublishFormInput>;

export const unpublishFormOutput = z.object({
  id: z.uuid().describe("The id of the unpublished form"),
});

export type UnpublishFormOutputType = z.infer<typeof unpublishFormOutput>;

export const archiveFormInput = z.object({
  formId: z.uuid().describe("The id of the form to archive"),
  userId: z.uuid().describe("The id of the form owner"),
});

export type ArchiveFormInputType = z.infer<typeof archiveFormInput>;

export const archiveFormOutput = z.object({
  id: z.uuid().describe("The id of the archived form"),
});

export type ArchiveFormOutputType = z.infer<typeof archiveFormOutput>;

export const cloneFormInput = z.object({
  formId: z.uuid().describe("The id of the form to clone"),
  userId: z.uuid().describe("The id of the form owner"),
});

export type CloneFormInputType = z.infer<typeof cloneFormInput>;

export const cloneFormOutput = z.object({
  id: z.uuid().describe("The id of the cloned form"),
});

export type CloneFormOutputType = z.infer<typeof cloneFormOutput>;

export const adminOverviewInput = z.object({
  userId: z.uuid().describe("The id of the admin user"),
});

export type AdminOverviewInputType = z.infer<typeof adminOverviewInput>;

export const adminOverviewOutput = z.object({
  userCount: z.number().int().nonnegative(),
  formCount: z.number().int().nonnegative(),
  publishedCount: z.number().int().nonnegative(),
  responseCount: z.number().int().nonnegative(),
  recentForms: z.array(
    z.object({
      id: z.uuid(),
      slug: z.string().nullable(),
      title: z.string(),
      status: formStatus,
      visibility: formVisibility,
      creatorEmail: z.string().email(),
      createdAt: z.date().nullable(),
    }),
  ),
});

export type AdminOverviewOutputType = z.infer<typeof adminOverviewOutput>;
