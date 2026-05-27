import express from "express";
import type { RequestHandler } from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import cookieParser from "cookie-parser";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

function normalizeOrigin(value: string) {
  return new URL(value).origin;
}

type ScalarApiReferenceModule = typeof import("@scalar/express-api-reference");

const importEsm = new Function("specifier", "return import(specifier)") as (
  specifier: string,
) => Promise<ScalarApiReferenceModule>;

let scalarDocsMiddleware: RequestHandler | undefined;

async function getScalarDocsMiddleware() {
  if (!scalarDocsMiddleware) {
    const { apiReference } = await importEsm("@scalar/express-api-reference");
    scalarDocsMiddleware = apiReference({ url: "/openapi.json" });
  }

  return scalarDocsMiddleware;
}

const baseUrl = normalizeOrigin(env.BASE_URL);
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "PeakForm OpenAPI",
  version: "1.0.0",
  baseUrl: `${baseUrl}/api`,
});
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  env.FRONTEND_URL,
]
  .filter((origin): origin is string => Boolean(origin))
  .map(normalizeOrigin);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "PeakForm is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "PeakForm server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", async (req, res, next) => {
  try {
    const middleware = await getScalarDocsMiddleware();
    return middleware(req, res, next);
  } catch (error) {
    return next(error);
  }
});

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
