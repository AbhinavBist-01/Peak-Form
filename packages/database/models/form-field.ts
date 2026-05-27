import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  integer,
  pgEnum,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";
import { forms } from "../schema";

export const fieldTypesEnum = pgEnum("field_types", [
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

export interface FieldValidationRules {
  customErrorMessage?: string;
  conditionalLogic?: {
    fieldId: string;
    operator: "equals" | "not_equals" | "contains" | "not_empty";
    value?: string;
  };
}

export const formFields = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .notNull()
      .references(() => forms.id),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),
    helpText: text("help_text"),
    placeholder: text("placeholder"),
    options: jsonb("options").$type<string[]>(),
    validationRules: jsonb("validation_rules").$type<FieldValidationRules>(),
    min: integer("min"),
    max: integer("max"),
    pattern: text("pattern"),

    isRequired: boolean("is_required").default(false),

    type: fieldTypesEnum("type").notNull(),

    index: numeric("index", { scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      uniqueFormIdAndIndex: unique().on(table.formId, table.index),
    };
  },
);
