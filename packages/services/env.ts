import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalEnvString = z.preprocess(emptyStringToUndefined, z.string().optional());
const optionalEnvPort = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().optional(),
);
const optionalEnvBoolean = z
  .preprocess(emptyStringToUndefined, z.enum(["true", "false"]).optional())
  .transform((value) => (value === undefined ? undefined : value === "true"));

const envSchema = z.object({
  JWT_SECRET: z.string().min(1).describe("Secret key for signing JWT tokens"),
  GOOGLE_OAUTH_CLIENT_ID: optionalEnvString,
  GOOGLE_OAUTH_CLIENT_SECRET: optionalEnvString,
  GOOGLE_OAUTH_REDIRECT_URI: optionalEnvString,
  SMTP_HOST: optionalEnvString,
  SMTP_PORT: optionalEnvPort,
  SMTP_USER: optionalEnvString,
  SMTP_PASS: optionalEnvString,
  SMTP_FROM: optionalEnvString,
  SMTP_SECURE: optionalEnvBoolean,
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
