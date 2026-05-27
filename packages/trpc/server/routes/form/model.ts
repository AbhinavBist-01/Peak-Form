import { z } from "zod";

export const formStatusModel = z.enum(["draft", "published", "archived"]);
export const formVisibilityModel = z.enum(["public", "unlisted"]);
export const formPageSizeModel = z.enum(["all", "1", "2", "3", "5"]);
export const formThemeConfigModel = z
  .object({
    name: z.string().optional(),
    backgroundColor: z.string().optional(),
    accentColor: z.string().optional(),
    textColor: z.string().optional(),
    fontFamily: z.string().optional(),
  })
  .strict();

export const fieldTypeModel = z.enum([
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
]);

export const fieldOptionsModel = z.array(z.string().min(1).max(100)).max(50);
export const fieldValidationRulesModel = z
  .object({
    customErrorMessage: z.string().min(1).max(200).optional(),
    conditionalLogic: z
      .object({
        fieldId: z.string().uuid(),
        operator: z.enum(["equals", "not_equals", "contains", "not_empty"]),
        value: z.string().max(200).optional(),
      })
      .optional(),
  })
  .strict();

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().describe("description of the form"),
  expiresAt: z.string().datetime().optional().describe("expiry date of the form"),
  slug: z.string().min(3).max(100).optional().describe("custom public slug"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const listFormsInputModel = z.undefined();

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    slug: z.string().nullable().describe("custom public slug of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    creatorId: z.string().describe("id of the user who created the form"),
    status: formStatusModel.describe("lifecycle status of the form"),
    visibility: formVisibilityModel.describe("public listing visibility of the form"),
    publishedAt: z.date().nullable().describe("published date of the form"),
    themeConfig: formThemeConfigModel.nullable().describe("visual theme config of the form"),
    expiresAt: z.date().nullable().describe("expiry date of the form"),
    pageSize: formPageSizeModel.describe("fields per public page"),
    isPasswordProtected: z.boolean().describe("whether the form has a public password"),
    createdAt: z.date().nullable().describe("created date of the form"),
    updatedAt: z.date().nullable().describe("updated date of the form"),
  }),
);

export const deleteFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to delete"),
});

export const deleteFormOutputModel = z.object({
  id: z.string().describe("id of the deleted form"),
});

export const getFormByIdInputModel = z.object({
  formId: z.string().min(1).max(100).describe("id or slug of the public form to fetch"),
  password: z.string().optional().describe("optional password for protected forms"),
});

export const getFormByIdOutputModel = z.object({
  id: z.string().describe("id of the form"),
  slug: z.string().nullable().describe("custom public slug of the form"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().describe("description of the form"),
  status: formStatusModel.describe("lifecycle status of the form"),
  visibility: formVisibilityModel.describe("public listing visibility of the form"),
  publishedAt: z.date().nullable().describe("published date of the form"),
  themeConfig: formThemeConfigModel.nullable().describe("visual theme config of the form"),
  expiresAt: z.date().nullable().describe("expiry date of the form"),
  pageSize: formPageSizeModel.describe("fields per public page"),
  isPasswordProtected: z.boolean().describe("whether the form has a public password"),
  requiresPassword: z.boolean().describe("whether a password must be supplied before reading fields"),
  createdAt: z.date().nullable().describe("created date of the form"),
  updatedAt: z.date().nullable().describe("updated date of the form"),
  fields: z
    .array(
      z.object({
        id: z.string().describe("id of the field"),
        formId: z.string().describe("id of the form this field belongs to"),
        label: z.string().describe("display label of the field"),
        labelKey: z.string().describe("stable slug key generated from the original label"),
        description: z.string().nullable().describe("optional field description"),
        helpText: z.string().nullable().describe("optional respondent-facing helper text"),
        placeholder: z.string().nullable().describe("optional field placeholder"),
        options: z.array(z.string()).nullable().describe("options for choice-based fields"),
        validationRules: fieldValidationRulesModel
          .nullable()
          .describe("additional validation configuration"),
        min: z.number().nullable().describe("minimum value or length"),
        max: z.number().nullable().describe("maximum value or length"),
        pattern: z.string().nullable().describe("regular expression pattern for text validation"),
        isRequired: z.boolean().nullable().default(false).describe("whether the field is required"),
        type: fieldTypeModel.describe("type of the field"),
        index: z.string().describe("fractional index used for sorting fields"),
        createdAt: z.date().nullable().describe("created date of the field"),
      }),
    )
    .describe("fields belonging to the form"),
});

export const getFormForEditorInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to fetch for editing"),
});

export const getFormForEditorOutputModel = getFormByIdOutputModel;

export const listPublicFormsInputModel = z.undefined();

export const listPublicFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    slug: z.string().nullable().describe("custom public slug of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    publishedAt: z.date().nullable().describe("published date of the form"),
    themeConfig: formThemeConfigModel.nullable().describe("visual theme config of the form"),
    expiresAt: z.date().nullable().describe("expiry date of the form"),
    pageSize: formPageSizeModel.describe("fields per public page"),
    createdAt: z.date().nullable().describe("created date of the form"),
  }),
);

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe("id of the form this field belongs to"),
    label: z.string().min(1).max(100).describe("display label of the field"),
    description: z.string().optional().describe("optional field description"),
    helpText: z.string().optional().describe("optional respondent-facing helper text"),
    placeholder: z.string().optional().describe("optional field placeholder"),
    options: fieldOptionsModel.optional().describe("options for choice-based fields"),
    validationRules: fieldValidationRulesModel
      .optional()
      .describe("additional validation configuration"),
    min: z.number().int().optional().describe("minimum value or length"),
    max: z.number().int().optional().describe("maximum value or length"),
    pattern: z.string().optional().describe("regular expression pattern for text validation"),
    isRequired: z.boolean().optional().describe("whether the field is required").default(false),
    type: fieldTypeModel.describe("type of the field"),
    index: z.string().min(1).describe("fractional index used for sorting fields"),
  });

export const createFieldOutputModel = z.object({
  id: z.string().describe("id of the created field"),
});

export const getFieldsInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to list fields for"),
});

export const getFieldsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the field"),
    formId: z.string().describe("id of the form this field belongs to"),
    label: z.string().describe("display label of the field"),
    labelKey: z.string().describe("stable slug key generated from the original label"),
    description: z.string().nullable().describe("optional field description"),
    helpText: z.string().nullable().describe("optional respondent-facing helper text"),
    placeholder: z.string().nullable().describe("optional field placeholder"),
    options: z.array(z.string()).nullable().describe("options for choice-based fields"),
    validationRules: fieldValidationRulesModel
      .nullable()
      .describe("additional validation configuration"),
    min: z.number().nullable().describe("minimum value or length"),
    max: z.number().nullable().describe("maximum value or length"),
    pattern: z.string().nullable().describe("regular expression pattern for text validation"),
    isRequired: z.boolean().nullable().default(false).describe("whether the field is required"),
    type: fieldTypeModel.describe("type of the field"),
    index: z.string().describe("fractional index used for sorting fields"),
    createdAt: z.date().nullable().describe("created date of the field"),
  }),
);

export const updateFieldInputModel = z.object({
  id: z.string().uuid().describe("id of the field to update"),
  label: z.string().min(1).max(100).optional().describe("display label of the field"),
  description: z.string().optional().nullable().describe("optional field description"),
  helpText: z.string().optional().nullable().describe("optional respondent-facing helper text"),
  placeholder: z.string().optional().nullable().describe("optional field placeholder"),
  options: fieldOptionsModel.optional().nullable().describe("options for choice-based fields"),
  validationRules: fieldValidationRulesModel
    .optional()
    .nullable()
    .describe("additional validation configuration"),
  min: z.number().int().optional().nullable().describe("minimum value or length"),
  max: z.number().int().optional().nullable().describe("maximum value or length"),
  pattern: z.string().optional().nullable().describe("regular expression pattern for text validation"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  type: fieldTypeModel.optional().describe("type of the field"),
  index: z.string().min(1).optional().describe("fractional index used for sorting fields"),
});

export const updateFieldOutputModel = z.object({
  id: z.string().describe("id of the updated field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().uuid().describe("id of the field to delete"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("id of the deleted field"),
});

export const updateFormSettingsInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to update"),
  title: z.string().max(55).optional().describe("title of the form"),
  description: z.string().max(500).nullable().optional().describe("description of the form"),
  slug: z.string().min(3).max(100).nullable().optional().describe("custom public slug"),
  visibility: formVisibilityModel.optional().describe("public listing visibility of the form"),
  expiresAt: z.string().datetime().nullable().optional().describe("expiry date of the form"),
  themeConfig: formThemeConfigModel
    .nullable()
    .optional()
    .describe("visual theme config of the form"),
  pageSize: formPageSizeModel.optional().describe("fields per public page"),
  password: z.string().min(4).max(100).nullable().optional().describe("set or clear public password"),
});

export const updateFormSettingsOutputModel = z.object({
  id: z.string().describe("id of the updated form"),
});

export const publishFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to publish"),
});

export const publishFormOutputModel = z.object({
  id: z.string().describe("id of the published form"),
  publishedAt: z.date().describe("published date of the form"),
});

export const unpublishFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to unpublish"),
});

export const unpublishFormOutputModel = z.object({
  id: z.string().describe("id of the unpublished form"),
});

export const archiveFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to archive"),
});

export const archiveFormOutputModel = z.object({
  id: z.string().describe("id of the archived form"),
});

export const cloneFormInputModel = z.object({
  formId: z.string().uuid().describe("id of the form to clone"),
});

export const cloneFormOutputModel = z.object({
  id: z.string().describe("id of the cloned form"),
});

export const getAdminOverviewInputModel = z.undefined();

export const getAdminOverviewOutputModel = z.object({
  userCount: z.number().int().nonnegative(),
  formCount: z.number().int().nonnegative(),
  publishedCount: z.number().int().nonnegative(),
  responseCount: z.number().int().nonnegative(),
  recentForms: z.array(
    z.object({
      id: z.string().uuid(),
      slug: z.string().nullable(),
      title: z.string(),
      status: formStatusModel,
      visibility: formVisibilityModel,
      creatorEmail: z.string().email(),
      createdAt: z.date().nullable(),
    }),
  ),
});
