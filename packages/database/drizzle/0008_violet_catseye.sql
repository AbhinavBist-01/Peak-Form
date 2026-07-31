ALTER TABLE "users" ADD COLUMN "role" varchar(20) DEFAULT 'creator' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "slug" varchar(100);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "page_size" varchar(10) DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password_salt" text;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_slug_unique" UNIQUE("slug");