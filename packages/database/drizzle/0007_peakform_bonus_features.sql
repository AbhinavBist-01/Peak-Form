ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar(20) DEFAULT 'creator' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "slug" varchar(100);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "page_size" varchar(10) DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "password_hash" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "password_salt" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
