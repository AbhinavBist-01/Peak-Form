import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const envSchema = z.object({
  PORT: z.preprocess(emptyStringToUndefined, z.string().optional()),
  NODE_ENV: z.preprocess(
    emptyStringToUndefined,
    z.enum(["development", "test", "production", "prod"]).default("development"),
  ),
  BASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().default("http://localhost:8000"),
  ),
  FRONTEND_URL: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
