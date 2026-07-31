import { env } from "~/env.js";

export function getApiOrigin() {
  const apiUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc";

  if (
    !env.NEXT_PUBLIC_API_URL &&
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost"
  ) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured for the web deployment.");
  }

  return apiUrl.replace(/\/trpc\/?$/, "");
}
