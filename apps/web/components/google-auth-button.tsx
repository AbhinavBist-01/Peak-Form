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
      className="w-full border-[#c3c8c1]/80 bg-white/88 text-[#191c1b] hover:bg-white"
      onClick={continueWithGoogle}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
        <path
          fill="#4285F4"
          d="M21.8 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.7 3.1-4.3 3.1-7.7Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.6c-.9.6-2 .9-3.5.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.7A10 10 0 0 0 12 22Z"
        />
        <path
          fill="#FBBC05"
          d="M6.4 13.8A6 6 0 0 1 6 12c0-.6.1-1.2.4-1.8V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.7Z"
        />
        <path
          fill="#EA4335"
          d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.3 2.7c.8-2.3 3-4.1 5.6-4.1Z"
        />
      </svg>
      Login with Google
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
