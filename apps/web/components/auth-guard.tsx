"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "~/components/ui/spinner";
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
  const { user, isError, isLoading, isFetching } = useUser();

  useEffect(() => {
    if (isError) {
      router.replace(getLoginRedirect());
    }
  }, [isError, router]);

  if (isLoading || isFetching || isError || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f5f8f2] text-[#2f5d3b]">
        <div className="flex items-center gap-3 rounded-full border border-[#c3c8c1]/70 bg-white/80 px-5 py-3 text-sm font-medium shadow-sm backdrop-blur">
          <Spinner className="size-4 text-[#4d6453]" />
          Securing your workspace...
        </div>
      </div>
    );
  }

  return children;
}
