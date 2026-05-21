CREATE TYPE "public"."field_types" AS ENUM('TEXT', 'TEXTAREA', 'SELECT', 'RADIO', 'CHECKBOX', 'PASSWORD', 'EMAIL', 'YES_NO', 'DATE', 'NUMBER');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false,
	"type" "field_types" NOT NULL,
	"index" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "form_fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;