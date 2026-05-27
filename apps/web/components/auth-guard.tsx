"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "~/hooks/api/auth";

function getLoginRedirect() {
  if (typeof window === "undefined") {
    return "/login";
  }

  const next = `${window.location.pathname}${window.location.search}`;
  return `/login?next=${encodeURIComponent(next)}`;
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isError } = useUser();

  useEffect(() => {
    if (isError) {
      router.replace(getLoginRedirect());
    }
  }, [isError, router]);

  return children;
}
