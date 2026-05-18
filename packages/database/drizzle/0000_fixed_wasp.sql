CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"salt" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "salt" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" text;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_constraint
		WHERE conname = 'users_email_unique'
	) THEN
		ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
	END IF;
END $$;
