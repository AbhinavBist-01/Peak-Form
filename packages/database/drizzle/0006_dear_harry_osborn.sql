ALTER TYPE "public"."field_types" ADD VALUE 'RATING';--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "help_text" text;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "options" jsonb;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "validation_rules" jsonb;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "min" integer;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "max" integer;--> statement-breakpoint
ALTER TABLE "form_fields" ADD COLUMN "pattern" text;