import { z } from "zod";

const emptyStringToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const envSchema = z.object({
  NODE_ENV: z.preprocess(
    emptyStringToUndefined,
    z.enum(["development", "test", "production", "prod"]).default("development"),
  ),
  LOGGER_LEVEL: z.preprocess(
    emptyStringToUndefined,
    z.enum(["error", "debug", "info"]).optional(),
  ),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
