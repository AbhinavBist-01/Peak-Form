import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().max(55).describe("The title of the form"),
  description: z.string().optional().describe("The description of the form"),
  creatorId: z.uuid().describe("The id of the user creating the form"),
  expiresAt: z.date().optional().describe("The date when the form expires"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;
