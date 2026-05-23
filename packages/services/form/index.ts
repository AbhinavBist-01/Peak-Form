import { and, asc, db, desc, eq, gt, isNull, or } from "@repo/database";
import { formFields } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submission";
import { forms } from "@repo/database/models/form";
import {
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

class FormService {
  public async createForm(payload: CreateFormInputType): Promise<CreateFormOutputType> {
    const { title, description, creatorId, expiresAt } = await createFormInput.parseAsync(payload);

    const formInputResult = await db
      .insert(forms)
      .values({
        title,
        description,
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
        title: forms.title,
        description: forms.description,
        creatorId: forms.creatorId,
        status: forms.status,
        visibility: forms.visibility,
        publishedAt: forms.publishedAt,
        themeConfig: forms.themeConfig,
        expiresAt: forms.expiresAt,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
      })
      .from(forms)
      .where(eq(forms.creatorId, userId))
      .orderBy(desc(forms.createdAt));

    return listFormByUserIdOutput.parse(result);
  }

  public async listPublicForms(): Promise<ListPublicFormsOutputType> {
    const result = await db
      .select({
        id: forms.id,
        title: forms.title,
        description: forms.description,
        publishedAt: forms.publishedAt,
        themeConfig: forms.themeConfig,
        expiresAt: forms.expiresAt,
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
    const { formId } = await getFormByIdInput.parseAsync(payload);

    const result = await db
      .select({
        form: {
          id: forms.id,
          title: forms.title,
          description: forms.description,
          status: forms.status,
          visibility: forms.visibility,
          publishedAt: forms.publishedAt,
          themeConfig: forms.themeConfig,
          expiresAt: forms.expiresAt,
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
      .where(and(eq(forms.id, formId), eq(forms.status, "published")))
      .orderBy(asc(formFields.index));

    if (!result || result.length === 0 || !result[0]?.form.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    if (result[0].form.expiresAt && result[0].form.expiresAt.getTime() < Date.now()) {
      throw new Error("This form is no longer accepting submissions");
    }

    return getFormByIdOutput.parse({
      ...result[0].form,
      fields: result
        .map(({ field }) => field)
        .filter((field): field is NonNullable<typeof field> => Boolean(field?.id)),
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
          title: forms.title,
          description: forms.description,
          status: forms.status,
          visibility: forms.visibility,
          publishedAt: forms.publishedAt,
          themeConfig: forms.themeConfig,
          expiresAt: forms.expiresAt,
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
      fields: result
        .map(({ field }) => field)
        .filter((field): field is NonNullable<typeof field> => Boolean(field?.id)),
    });
  }

  public async updateFormSettings(
    payload: UpdateFormSettingsInputType,
  ): Promise<UpdateFormSettingsOutputType> {
    const { formId, userId, title, description, visibility, expiresAt, themeConfig } =
      await updateFormSettingsInput.parseAsync(payload);

    const result = await db
      .update(forms)
      .set({
        title,
        description,
        visibility,
        expiresAt,
        themeConfig,
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
}

export default FormService;
