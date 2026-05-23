import { and, asc, db, desc, eq } from "@repo/database";
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
  listFormByUserIdInput,
  listFormByUserIdOutput,
  type CreateFormInputType,
  type CreateFormOutputType,
  type DeleteFormInputType,
  type DeleteFormOutputType,
  type GetFormByIdInputType,
  type GetFormByIdOutputType,
  type ListFormByUserIdInputType,
  type ListFormByUserIdOutputType,
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
        expiresAt: forms.expiresAt,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
      })
      .from(forms)
      .where(eq(forms.creatorId, userId))
      .orderBy(desc(forms.createdAt));

    return listFormByUserIdOutput.parse(result);
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
          placeholder: formFields.placeholder,
          isRequired: formFields.isRequired,
          type: formFields.type,
          index: formFields.index,
          createdAt: formFields.createdAt,
        },
      })
      .from(forms)
      .leftJoin(formFields, eq(formFields.formId, forms.id))
      .where(eq(forms.id, formId))
      .orderBy(asc(formFields.index));

    if (!result || result.length === 0 || !result[0]?.form.id) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    return getFormByIdOutput.parse({
      ...result[0].form,
      fields: result
        .map(({ field }) => field)
        .filter((field): field is NonNullable<typeof field> => Boolean(field?.id)),
    });
  }
}

export default FormService;
