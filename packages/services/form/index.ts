import { db, desc, eq } from "@repo/database";
import { forms } from "@repo/database/models/form";
import {
  createFormInput,
  listFormByUserIdInput,
  type CreateFormInputType,
  type ListFormByUserIdInputType,
} from "./model";

class FormService {
  public async createForm(payload: CreateFormInputType) {
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

    return {
      id: formInputResult[0].id,
    };
  }

  public async listFormByUserId(payload: ListFormByUserIdInputType) {
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

    return result;
  }
}

export default FormService;
