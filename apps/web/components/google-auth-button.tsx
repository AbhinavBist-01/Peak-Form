"use client";

import { Button } from "~/components/ui/button";
import { env } from "~/env.js";

function getApiOrigin() {
  const apiUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc";
  return apiUrl.replace(/\/trpc\/?$/, "");
}

export function GoogleAuthButton() {
  function continueWithGoogle() {
    const url = new URL("/auth/google", getApiOrigin());
    url.searchParams.set("next", getSafeNextPath());
    window.location.href = url.toString();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-[#c3c8c1]/80 bg-white/80 text-[#2f3b32] hover:bg-white"
      onClick={continueWithGoogle}
    >
      Continue with Google
    </Button>
  );
}

function getSafeNextPath() {
  const nextPath = new URLSearchParams(window.location.search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}
