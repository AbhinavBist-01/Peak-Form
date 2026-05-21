import { db } from "@repo/database";
import { forms } from "@repo/database/models/form";
import { createFormInput, type CreateFormInputType } from "./model";

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
}

export default FormService;
