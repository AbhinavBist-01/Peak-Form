CREATE TYPE "public"."form_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "description" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "visibility" "form_visibility" DEFAULT 'unlisted' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "theme_config" jsonb;
