import { z } from "zod";

export const createFormInputModel = z.object({
  title: z.string().max(55).describe("title of the form"),
  description: z.string().optional().describe("description of the form"),
  expiresAt: z.string().datetime().optional().describe("expiry date of the form"),
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the form"),
});

export const listFormsInputModel = z.undefined();

export const listFormsOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    creatorId: z.string().describe("id of the user who created the form"),
    expiresAt: z.date().nullable().describe("expiry date of the form"),
    createdAt: z.date().nullable().describe("created date of the form"),
    updatedAt: z.date().nullable().describe("updated date of the form"),
  }),
);
