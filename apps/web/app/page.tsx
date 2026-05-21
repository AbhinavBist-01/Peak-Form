"use client";

import { useUser } from "~/hooks/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.id) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user]);
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">{JSON.stringify(user, null, 2)}</h1>
      </div>
    </main>
  );
}
