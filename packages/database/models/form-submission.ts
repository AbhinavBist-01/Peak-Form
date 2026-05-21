import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
  json,
} from "drizzle-orm/pg-core";
import { forms } from "../schema";

export interface FormSubmissionValues {
  formFieldId: string;
  value: string;
}

export type FormSubmissionValuesRow = FormSubmissionValues[];

export const formSubmissionsTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id),

  values: json("values").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
