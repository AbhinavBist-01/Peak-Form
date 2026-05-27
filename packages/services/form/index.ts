import { createHmac, randomBytes } from "node:crypto";
import { and, asc, count, db, desc, eq, gt, isNull, ne, or } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { forms } from "@repo/database/models/form";
import { usersTable } from "@repo/database/models/user";
import {
  adminOverviewInput,
  adminOverviewOutput,
  archiveFormInput,
  archiveFormOutput,
  cloneFormInput,
  cloneFormOutput,
  createFormInput,
  createFormOutput,
  deleteFormInput,
  deleteFormOutput,
  getFormByIdInput,
  getFormByIdOutput,
  getFormForEditorInput,
  getFormForEditorOutput,
  listFormByUserIdInput,
  listFormByUserIdOutput,
  listPublicFormsOutput,
  publishFormInput,
  publishFormOutput,
  unpublishFormInput,
  unpublishFormOutput,
  updateFormSettingsInput,
  updateFormSettingsOutput,
  type AdminOverviewInputType,
  type AdminOverviewOutputType,
  type ArchiveFormInputType,
  type ArchiveFormOutputType,
  type CloneFormInputType,
  type CloneFormOutputType,
  type CreateFormInputType,
  type CreateFormOutputType,
  type DeleteFormInputType,
  type DeleteFormOutputType,
  type GetFormByIdInputType,
  type GetFormByIdOutputType,
  type GetFormForEditorInputType,
  type GetFormForEditorOutputType,
  type ListFormByUserIdInputType,
  type ListFormByUserIdOutputType,
  type ListPublicFormsOutputType,
  type PublishFormInputType,
  type PublishFormOutputType,
  type UnpublishFormInputType,
  type UnpublishFormOutputType,
  type UpdateFormSettingsInputType,
  type UpdateFormSettingsOutputType,
} from "./model";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeSlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "form"
  );
}

function formIdentifierWhere(identifier: string) {
  return UUID_PATTERN.test(identifier)
    ? or(eq(forms.id, identifier), eq(forms.slug, identifier))
    : eq(forms.slug, identifier);
}

function hashPassword(password: string, salt: string) {
  return createHmac("sha256", salt).update(password).digest("hex");
}

function verifyFormPassword({
  password,
  passwordHash,
  passwordSalt,
}: {
  password?: string;
  passwordHash: string | null;
  passwordSalt: string | null;
}) {
  if (!passwordHash || !passwordSalt) {
    return true;
  }

  if (!password) {
    return false;
  }

  return hashPassword(password, passwordSalt) === passwordHash;
}

function getPasswordUpdate(password: string | null | undefined) {
  if (password === undefined) {
    return {};
  }

  if (password === null) {
    return {
      passwordHash: null,
      passwordSalt: null,
    };
  }

  const passwordSalt = randomBytes(16).toString("hex");

  return {
    passwordHash: hashPassword(password, passwordSalt),
    passwordSalt,
  };
}

class FormService {
  public async createForm(payload: CreateFormInputType): Promise<CreateFormOutputType> {
    const { title, description, creatorId, expiresAt, slug } = await createFormInput.parseAsync(payload);
    const formSlug = slug
      ? await this.assertAvailableSlug({ slug, formId: null })
      : await this.createUniqueSlug(title);

    const formInputResult = await db
      .insert(forms)
      .values({
        title,
        description,
        slug: formSlug,
        creatorId,
        expiresAt,
      })
      .returning({
        id: forms.id,
      });

    if (!formInputResult || formInputResult.length === 0 || !formInputResult[0]?.id)
      throw new Error("Failed to create form");

    return createFormOutput.parse({
      id: formInputResult[0].id,
    });
  }

  public async listFormByUserId(
    payload: ListFormByUserIdInputType,
  ): Promise<ListFormByUserIdOutputType> {
    const { userId } = await listFormByUserIdInput.parseAsync(payload);

    const result = await db
      .select({
        id: forms.id,
        slug: forms.slug,
        title: forms.title,
        description: forms.description,
        creatorId: forms.creatorId,
        status: forms.status,
        visibility: forms.visibility,
        publishedAt: forms.publishedAt,
        themeConfig: forms.themeConfig,
        expiresAt: forms.expiresAt,
        pageSize: forms.pageSize,
        isPasswordProtected: forms.passwordHash,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
      })
      .from(forms)
      .where(eq(forms.creatorId, userId))
      .orderBy(desc(forms.createdAt));

    return listFormByUserIdOutput.parse(
      result.map((form) => ({
        ...form,
        isPasswordProtected: Boolean(form.isPasswordProtected),
      })),
    );
  }

  public async listPublicForms(): Promise<ListPublicFormsOutputType> {
    const result = await db
      .select({
        id: forms.id,
        slug: forms.slug,
        title: forms.title,
        description: forms.description,
        publishedAt: forms.publishedAt,
        themeConfig: forms.themeConfig,
        expiresAt: forms.expiresAt,
        pageSize: forms.pageSize,
        createdAt: forms.createdAt,
      })
      .from(forms)
      .where(
        and(
          eq(forms.status, "published"),
          eq(forms.visibility, "public"),
          or(isNull(forms.expiresAt), gt(forms.expiresAt, new Date())),
        ),
      )
      .orderBy(desc(forms.publishedAt), desc(forms.createdAt));

    return listPublicFormsOutput.parse(result);
  }

  public async deleteForm(payload: DeleteFormInputType): Promise<DeleteFormOutputType> {
    const { formId, userId } = await deleteFormInput.parseAsync(payload);

    const result = await db.transaction(async (tx) => {
      const [ownedForm] = await tx
        .select({
          id: forms.id,
        })
        .from(forms)
        .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
        .limit(1);

      if (!ownedForm) {
        return [];
      }

      await tx.delete(formSubmissionsTable).where(eq(formSubmissionsTable.formId, formId));
      await tx.delete(formFields).where(eq(formFields.formId, formId));

      return tx.delete(forms).where(eq(forms.id, formId)).returning({
        id: forms.id,
      });
    });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return deleteFormOutput.parse({
      id: result[0].id,
    });
  }

  public async getFormById(payload: GetFormByIdInputType): Promise<GetFormByIdOutputType> {
    const { formId, password } = await getFormByIdInput.parseAsync(payload);

    const result = await db
      .select({
        form: {
          id: forms.id,
          slug: forms.slug,
          title: forms.title,
          description: forms.description,
          status: forms.status,
          visibility: forms.visibility,
          publishedAt: forms.publishedAt,
          themeConfig: forms.themeConfig,
          expiresAt: forms.expiresAt,
          pageSize: forms.pageSize,
          passwordHash: forms.passwordHash,
          passwordSalt: forms.passwordSalt,
          createdAt: forms.createdAt,
          updatedAt: forms.updatedAt,
        },
        field: {
          id: formFields.id,
          formId: formFields.formId,
          label: formFields.label,
          labelKey: formFields.labelKey,
          description: formFields.description,
          helpText: formFields.helpText,
          placeholder: formFields.placeholder,
          options: formFields.options,
          validationRules: formFields.validationRules,
          min: formFields.min,
          max: formFields.max,
          pattern: formFields.pattern,
          isRequired: formFields.isRequired,
          type: formFields.type,
          index: formFields.index,
          createdAt: formFields.createdAt,
        },
      })
      .from(forms)
      .leftJoin(formFields, eq(formFields.formId, forms.id))
      .where(and(formIdentifierWhere(formId), eq(forms.status, "published")))
      .orderBy(asc(formFields.index));

    if (!result || result.length === 0 || !result[0]?.form.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    if (result[0].form.expiresAt && result[0].form.expiresAt.getTime() < Date.now()) {
      throw new Error("This form is no longer accepting submissions");
    }

    const canReadFields = verifyFormPassword({
      password,
      passwordHash: result[0].form.passwordHash,
      passwordSalt: result[0].form.passwordSalt,
    });

    const { passwordHash, passwordSalt, ...form } = result[0].form;

    return getFormByIdOutput.parse({
      ...form,
      isPasswordProtected: Boolean(passwordHash && passwordSalt),
      requiresPassword: !canReadFields,
      fields: canReadFields
        ? result
            .map(({ field }) => field)
            .filter((field): field is NonNullable<typeof field> => Boolean(field?.id))
        : [],
    });
  }

  public async getFormForEditor(
    payload: GetFormForEditorInputType,
  ): Promise<GetFormForEditorOutputType> {
    const { formId, userId } = await getFormForEditorInput.parseAsync(payload);

    const result = await db
      .select({
        form: {
          id: forms.id,
          slug: forms.slug,
          title: forms.title,
          description: forms.description,
          status: forms.status,
          visibility: forms.visibility,
          publishedAt: forms.publishedAt,
          themeConfig: forms.themeConfig,
          expiresAt: forms.expiresAt,
          pageSize: forms.pageSize,
          passwordHash: forms.passwordHash,
          passwordSalt: forms.passwordSalt,
          createdAt: forms.createdAt,
          updatedAt: forms.updatedAt,
        },
        field: {
          id: formFields.id,
          formId: formFields.formId,
          label: formFields.label,
          labelKey: formFields.labelKey,
          description: formFields.description,
          helpText: formFields.helpText,
          placeholder: formFields.placeholder,
          options: formFields.options,
          validationRules: formFields.validationRules,
          min: formFields.min,
          max: formFields.max,
          pattern: formFields.pattern,
          isRequired: formFields.isRequired,
          type: formFields.type,
          index: formFields.index,
          createdAt: formFields.createdAt,
        },
      })
      .from(forms)
      .leftJoin(formFields, eq(formFields.formId, forms.id))
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .orderBy(asc(formFields.index));

    if (!result || result.length === 0 || !result[0]?.form.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return getFormForEditorOutput.parse({
      ...result[0].form,
      isPasswordProtected: Boolean(result[0].form.passwordHash && result[0].form.passwordSalt),
      requiresPassword: false,
      fields: result
        .map(({ field }) => field)
        .filter((field): field is NonNullable<typeof field> => Boolean(field?.id)),
    });
  }

  public async updateFormSettings(
    payload: UpdateFormSettingsInputType,
  ): Promise<UpdateFormSettingsOutputType> {
    const { formId, userId, title, description, slug, visibility, expiresAt, themeConfig, pageSize, password } =
      await updateFormSettingsInput.parseAsync(payload);
    const nextSlug =
      slug === undefined
        ? undefined
        : slug === null
          ? null
          : await this.assertAvailableSlug({ slug, formId });

    const result = await db
      .update(forms)
      .set({
        title,
        description,
        slug: nextSlug,
        visibility,
        expiresAt,
        themeConfig,
        pageSize,
        ...getPasswordUpdate(password),
      })
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .returning({
        id: forms.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return updateFormSettingsOutput.parse({
      id: result[0].id,
    });
  }

  public async publishForm(payload: PublishFormInputType): Promise<PublishFormOutputType> {
    const { formId, userId } = await publishFormInput.parseAsync(payload);
    const publishedAt = new Date();

    const result = await db
      .update(forms)
      .set({
        status: "published",
        publishedAt,
      })
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .returning({
        id: forms.id,
        publishedAt: forms.publishedAt,
      });

    if (!result || result.length === 0 || !result[0]?.id || !result[0].publishedAt) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return publishFormOutput.parse({
      id: result[0].id,
      publishedAt: result[0].publishedAt,
    });
  }

  public async unpublishForm(payload: UnpublishFormInputType): Promise<UnpublishFormOutputType> {
    const { formId, userId } = await unpublishFormInput.parseAsync(payload);

    const result = await db
      .update(forms)
      .set({
        status: "draft",
        publishedAt: null,
      })
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .returning({
        id: forms.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return unpublishFormOutput.parse({
      id: result[0].id,
    });
  }

  public async archiveForm(payload: ArchiveFormInputType): Promise<ArchiveFormOutputType> {
    const { formId, userId } = await archiveFormInput.parseAsync(payload);

    const result = await db
      .update(forms)
      .set({
        status: "archived",
        publishedAt: null,
      })
      .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
      .returning({
        id: forms.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return archiveFormOutput.parse({
      id: result[0].id,
    });
  }

  public async cloneForm(payload: CloneFormInputType): Promise<CloneFormOutputType> {
    const { formId, userId } = await cloneFormInput.parseAsync(payload);

    const result = await db.transaction(async (tx) => {
      const [sourceForm] = await tx
        .select()
        .from(forms)
        .where(and(eq(forms.id, formId), eq(forms.creatorId, userId)))
        .limit(1);

      if (!sourceForm) {
        return null;
      }

      const sourceFields = await tx
        .select()
        .from(formFields)
        .where(eq(formFields.formId, formId))
        .orderBy(asc(formFields.index));
      const copySlug = await this.createUniqueSlug(`copy-${sourceForm.slug ?? sourceForm.title}`);
      const [clonedForm] = await tx
        .insert(forms)
        .values({
          title: `Copy of ${sourceForm.title}`.slice(0, 55),
          description: sourceForm.description,
          slug: copySlug,
          creatorId: userId,
          status: "draft",
          visibility: "unlisted",
          themeConfig: sourceForm.themeConfig,
          expiresAt: sourceForm.expiresAt,
          pageSize: sourceForm.pageSize,
          passwordHash: sourceForm.passwordHash,
          passwordSalt: sourceForm.passwordSalt,
        })
        .returning({ id: forms.id });

      if (!clonedForm) {
        return null;
      }

      const fieldIdMap = new Map<string, string>();

      for (const field of sourceFields) {
        const [clonedField] = await tx
          .insert(formFields)
          .values({
            formId: clonedForm.id,
            label: field.label,
            labelKey: field.labelKey,
            description: field.description,
            helpText: field.helpText,
            placeholder: field.placeholder,
            options: field.options,
            validationRules: field.validationRules,
            min: field.min,
            max: field.max,
            pattern: field.pattern,
            isRequired: field.isRequired,
            type: field.type,
            index: field.index,
          })
          .returning({ id: formFields.id });

        if (clonedField) {
          fieldIdMap.set(field.id, clonedField.id);
        }
      }

      for (const field of sourceFields) {
        const validationRules = field.validationRules;
        const condition = validationRules?.conditionalLogic;
        const oldDependsOn = condition?.fieldId;
        const clonedFieldId = fieldIdMap.get(field.id);
        const clonedDependsOn = oldDependsOn ? fieldIdMap.get(oldDependsOn) : undefined;

        if (!clonedFieldId || !condition || !clonedDependsOn) {
          continue;
        }

        await tx
          .update(formFields)
          .set({
            validationRules: {
              ...validationRules,
              conditionalLogic: {
                ...condition,
                fieldId: clonedDependsOn,
              },
            },
          })
          .where(eq(formFields.id, clonedFieldId));
      }

      return clonedForm;
    });

    if (!result?.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return cloneFormOutput.parse({ id: result.id });
  }

  public async getAdminOverview(payload: AdminOverviewInputType): Promise<AdminOverviewOutputType> {
    const { userId } = await adminOverviewInput.parseAsync(payload);
    const [user] = await db
      .select({
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user || user.role !== "admin") {
      throw new Error("Admin access required");
    }

    const [[usersTotal], [formsTotal], [publishedTotal], [responsesTotal], recentForms] =
      await Promise.all([
        db.select({ value: count() }).from(usersTable),
        db.select({ value: count() }).from(forms),
        db.select({ value: count() }).from(forms).where(eq(forms.status, "published")),
        db.select({ value: count() }).from(formSubmissionsTable),
        db
          .select({
            id: forms.id,
            slug: forms.slug,
            title: forms.title,
            status: forms.status,
            visibility: forms.visibility,
            creatorEmail: usersTable.email,
            createdAt: forms.createdAt,
          })
          .from(forms)
          .innerJoin(usersTable, eq(usersTable.id, forms.creatorId))
          .orderBy(desc(forms.createdAt))
          .limit(8),
      ]);

    return adminOverviewOutput.parse({
      userCount: usersTotal?.value ?? 0,
      formCount: formsTotal?.value ?? 0,
      publishedCount: publishedTotal?.value ?? 0,
      responseCount: responsesTotal?.value ?? 0,
      recentForms,
    });
  }

  private async assertAvailableSlug({
    slug,
    formId,
  }: {
    slug: string;
    formId: string | null;
  }) {
    const normalizedSlug = normalizeSlug(slug);
    const [existing] = await db
      .select({ id: forms.id })
      .from(forms)
      .where(
        formId
          ? and(eq(forms.slug, normalizedSlug), ne(forms.id, formId))
          : eq(forms.slug, normalizedSlug),
      )
      .limit(1);

    if (existing) {
      throw new Error(`Slug "${normalizedSlug}" is already in use`);
    }

    return normalizedSlug;
  }

  private async createUniqueSlug(value: string) {
    const baseSlug = normalizeSlug(value);

    for (let index = 0; index < 50; index += 1) {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`.slice(0, 100);
      const [existing] = await db
        .select({ id: forms.id })
        .from(forms)
        .where(eq(forms.slug, slug))
        .limit(1);

      if (!existing) {
        return slug;
      }
    }

    return `${baseSlug.slice(0, 91)}-${randomBytes(4).toString("hex")}`;
  }
}

export default FormService;
