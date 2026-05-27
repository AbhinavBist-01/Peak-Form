import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

function getApiUrl() {
  if (env.NEXT_PUBLIC_API_URL) return env.NEXT_PUBLIC_API_URL;
  return "http://localhost:8000/trpc";
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: getApiUrl(),
    async fetch(url, options) {
      if (!env.NEXT_PUBLIC_API_URL && window.location.hostname !== "localhost") {
        throw new Error("NEXT_PUBLIC_API_URL is not configured for the web deployment.");
      }

      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);

      try {
        return await fetch(url, {
          ...options,
          credentials: "include",
          signal: controller.signal,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          throw new Error(
            "API request timed out. Check NEXT_PUBLIC_API_URL and the API service CORS settings.",
          );
        }

        throw error;
      } finally {
        window.clearTimeout(timeout);
      }
    },
  });
};
