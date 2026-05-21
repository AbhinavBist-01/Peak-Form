import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().describe("description of the form"),
  expiresAt: z.string().datetime().optional().describe("expiry date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});
