import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formStatusEnum = pgEnum("form_status", ["draft", "published", "archived"]);

export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"]);

export interface FormThemeConfig {
  name?: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  fontFamily?: string;
}

export const forms = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 55 }).notNull(),
  description: varchar("description", { length: 500 }),

  creatorId: uuid("creator_id")
    .notNull()
    .references(() => usersTable.id),

  status: formStatusEnum("status").notNull().default("draft"),
  visibility: formVisibilityEnum("visibility").notNull().default("unlisted"),
  publishedAt: timestamp("published_at"),
  themeConfig: jsonb("theme_config").$type<FormThemeConfig>(),

  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
