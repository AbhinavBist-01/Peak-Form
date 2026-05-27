import "dotenv/config";
import { randomBytes, createHmac } from "node:crypto";
import { db } from "../index";
import { usersTable } from "../models/user";
import { forms } from "../models/form";
import { formFields } from "../models/form-field";
import { formSubmissionsTable } from "../models/form-submission";
import { eq } from "drizzle-orm";

const DEMO_EMAIL = "demo@peakform.com";
const DEMO_PASSWORD = "demo1234";
const DEMO_NAME = "Demo User";

function hashPassword(password: string, salt: string) {
  return createHmac("sha256", salt).update(password).digest("hex");
}

function createLabelKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "field";
}

async function seed() {
  console.log("Seeding database...");

  const existingUsers = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, DEMO_EMAIL));

  let userId: string;

  if (existingUsers.length > 0) {
    userId = existingUsers[0]!.id;
    await db.update(usersTable).set({ role: "admin" }).where(eq(usersTable.id, userId));
    console.log(`Demo user already exists: ${DEMO_EMAIL}`);
  } else {
    const salt = randomBytes(16).toString("hex");
    const password = hashPassword(DEMO_PASSWORD, salt);

    const [user] = await db
      .insert(usersTable)
      .values({
        fullName: DEMO_NAME,
        email: DEMO_EMAIL,
        password,
        salt,
        role: "admin",
      })
      .returning({ id: usersTable.id });

    userId = user!.id;
    console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  }

  const formDefs = [
    {
      title: "Ghibli Watch Party Feedback",
      slug: "ghibli-watch-party",
      description: "Help us plan the next cozy mountain movie night.",
      visibility: "public" as const,
      pageSize: "3" as const,
      themeConfig: {
        name: "Forest cinema",
        backgroundColor: "#f3f8ef",
        accentColor: "#3f744b",
        textColor: "#243427",
        fontFamily: "Inter",
      },
      fields: [
        { label: "Full Name", type: "TEXT" as const, isRequired: true, placeholder: "Jane Doe" },
        { label: "Email", type: "EMAIL" as const, isRequired: true, placeholder: "jane@example.com" },
        { label: "How did you hear about us?", type: "SELECT" as const, options: ["Social media", "Friend", "Search engine", "Advertisement", "Other"] },
        { label: "Overall satisfaction", type: "RATING" as const, isRequired: true, min: 1, max: 5 },
        { label: "What did you like most?", type: "TEXTAREA" as const, placeholder: "Tell us what stood out..." },
        { label: "Would you recommend us?", type: "YES_NO" as const, isRequired: true },
        { label: "Newsletter signup", type: "CHECKBOX" as const, options: ["Subscribe to updates"] },
      ],
      submissions: [
        [
          { labelKey: "full-name", value: "Alice Johnson" },
          { labelKey: "email", value: "alice@example.com" },
          { labelKey: "how-did-you-hear-about-us", value: "Friend" },
          { labelKey: "overall-satisfaction", value: "5" },
          { labelKey: "what-did-you-like-most", value: "The intuitive interface and quick setup." },
          { labelKey: "would-you-recommend-us", value: "yes" },
          { labelKey: "newsletter-signup", value: "on" },
        ],
        [
          { labelKey: "full-name", value: "Bob Smith" },
          { labelKey: "email", value: "bob@example.com" },
          { labelKey: "how-did-you-hear-about-us", value: "Search engine" },
          { labelKey: "overall-satisfaction", value: "4" },
          { labelKey: "what-did-you-like-most", value: "Clean design and easy form builder." },
          { labelKey: "would-you-recommend-us", value: "yes" },
          { labelKey: "newsletter-signup", value: "" },
        ],
      ],
    },
    {
      title: "Indie Game Launch RSVP",
      slug: "indie-game-launch",
      description: "Join the community playtest and launch stream.",
      visibility: "public" as const,
      pageSize: "2" as const,
      themeConfig: {
        name: "Pixel peak",
        backgroundColor: "#eef7f1",
        accentColor: "#2f7d5b",
        textColor: "#26352d",
        fontFamily: "Inter",
      },
      fields: [
        { label: "Your Name", type: "TEXT" as const, isRequired: true, placeholder: "Your full name" },
        { label: "Email address", type: "EMAIL" as const, isRequired: true, placeholder: "you@example.com" },
        { label: "Will you attend?", type: "RADIO" as const, isRequired: true, options: ["Yes, I'll be there", "No, can't make it", "Maybe"] },
        { label: "Number of guests", type: "NUMBER" as const, min: 1, max: 10, placeholder: "1" },
        { label: "Dietary restrictions", type: "TEXTAREA" as const, placeholder: "Any dietary needs?" },
        { label: "Preferred date", type: "DATE" as const },
      ],
      submissions: [
        [
          { labelKey: "your-name", value: "Carol Davis" },
          { labelKey: "email-address", value: "carol@example.com" },
          { labelKey: "will-you-attend", value: "Yes, I'll be there" },
          { labelKey: "number-of-guests", value: "2" },
          { labelKey: "dietary-restrictions", value: "Vegetarian" },
          { labelKey: "preferred-date", value: "2026-06-15" },
        ],
      ],
    },
    {
      title: "Startup OS Beta Application",
      slug: "startup-os-beta",
      description: "Apply for the private beta of a founder operating system.",
      visibility: "unlisted" as const,
      pageSize: "5" as const,
      password: "peakbeta",
      themeConfig: {
        name: "Launch trail",
        backgroundColor: "#f5faf3",
        accentColor: "#4d8b5c",
        textColor: "#26382b",
        fontFamily: "Inter",
      },
      fields: [
        { label: "Full Name", type: "TEXT" as const, isRequired: true, placeholder: "John Doe" },
        { label: "Email", type: "EMAIL" as const, isRequired: true, placeholder: "john@example.com" },
        { label: "Phone", type: "TEXT" as const, placeholder: "+1 555-0123" },
        { label: "Position", type: "SELECT" as const, isRequired: true, options: ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Designer", "Product Manager"] },
        { label: "Years of experience", type: "NUMBER" as const, isRequired: true, min: 0, max: 50 },
        {
          label: "Cover letter",
          type: "TEXTAREA" as const,
          placeholder: "Tell us why you're a good fit...",
          validationRules: {
            conditionalLogic: {
              fieldId: "position",
              operator: "not_empty" as const,
            },
          },
        },
        { label: "Available to start", type: "DATE" as const, isRequired: true },
        { label: "Agree to terms", type: "CHECKBOX" as const, isRequired: true, options: ["I confirm the information is accurate"] },
      ],
      submissions: [
        [
          { labelKey: "full-name", value: "Diana Lee" },
          { labelKey: "email", value: "diana@example.com" },
          { labelKey: "phone", value: "+1 555-0199" },
          { labelKey: "position", value: "Full Stack Engineer" },
          { labelKey: "years-of-experience", value: "5" },
          { labelKey: "cover-letter", value: "I have extensive experience building full-stack applications with React, Node.js, and PostgreSQL." },
          { labelKey: "available-to-start", value: "2026-07-01" },
          { labelKey: "agree-to-terms", value: "on" },
        ],
      ],
    },
  ];

  for (const formDef of formDefs) {
    const existingForms = await db
      .select({ id: forms.id })
      .from(forms)
      .where(eq(forms.title, formDef.title));

    let formId: string;

    if (existingForms.length > 0) {
      formId = existingForms[0]!.id;
      console.log(`Form "${formDef.title}" already exists, skipping creation`);
      continue;
    }

    const [form] = await db
      .insert(forms)
      .values({
        title: formDef.title,
        description: formDef.description,
        slug: formDef.slug,
        creatorId: userId,
        visibility: formDef.visibility,
        status: "published",
        publishedAt: new Date(),
        themeConfig: formDef.themeConfig,
        pageSize: formDef.pageSize,
        ...(formDef.password
          ? (() => {
              const passwordSalt = randomBytes(16).toString("hex");
              return {
                passwordSalt,
                passwordHash: hashPassword(formDef.password, passwordSalt),
              };
            })()
          : {}),
      })
      .returning({ id: forms.id });

    formId = form!.id;
    console.log(`Created form: "${formDef.title}" (${formId})`);

    const fieldIds: Map<string, string> = new Map();

    const fieldIdsByKey: Map<string, string> = new Map();

    for (let i = 0; i < formDef.fields.length; i++) {
      const fieldDef = formDef.fields[i]!;
      const index = (i + 1).toFixed(2);
      const labelKey = createLabelKey(fieldDef.label);

      const [field] = await db
        .insert(formFields)
        .values({
          formId,
          label: fieldDef.label,
          labelKey,
          type: fieldDef.type,
          isRequired: fieldDef.isRequired ?? false,
          index,
          placeholder: fieldDef.placeholder,
          options: fieldDef.options ?? null,
          validationRules:
            "validationRules" in fieldDef && fieldDef.validationRules
              ? {
                  ...fieldDef.validationRules,
                  conditionalLogic: fieldDef.validationRules.conditionalLogic
                    ? {
                        ...fieldDef.validationRules.conditionalLogic,
                        fieldId:
                          fieldIdsByKey.get(fieldDef.validationRules.conditionalLogic.fieldId) ??
                          fieldDef.validationRules.conditionalLogic.fieldId,
                      }
                    : undefined,
                }
              : null,
          min: fieldDef.min ?? null,
          max: fieldDef.max ?? null,
        })
        .returning({ id: formFields.id });

      fieldIds.set(labelKey, field!.id);
      fieldIdsByKey.set(labelKey, field!.id);
    }

    for (const submissionValues of formDef.submissions) {
      const values = submissionValues
        .map((sv) => {
          const formFieldId = fieldIds.get(sv.labelKey);
          if (!formFieldId) return null;
          return { formFieldId, value: sv.value };
        })
        .filter(Boolean) as { formFieldId: string; value: string }[];

      await db.insert(formSubmissionsTable).values({
        formId,
        values,
      });
    }

    console.log(`  Created ${formDef.submissions.length} submission(s)`);
  }

  console.log("\nSeed complete!");
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
