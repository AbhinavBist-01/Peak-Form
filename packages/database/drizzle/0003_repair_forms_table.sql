CREATE TABLE IF NOT EXISTS "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(55) NOT NULL,
	"description" text,
	"creator_id" uuid NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);

ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "title" varchar(55) NOT NULL;
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "creator_id" uuid NOT NULL;
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "expires_at" timestamp;
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'forms_creator_id_users_id_fk'
	) THEN
		ALTER TABLE "forms"
		ADD CONSTRAINT "forms_creator_id_users_id_fk"
		FOREIGN KEY ("creator_id")
		REFERENCES "public"."users"("id")
		ON DELETE no action
		ON UPDATE no action;
	END IF;
END $$;
