"use client";

import { useRouter } from "next/navigation";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useLogout, useUser } from "~/hooks/api/auth";

export default function SettingsPage() {
  const router = useRouter();
  const { user, error, isLoading, isFetching } = useUser();
  const { logoutAsync, status } = useLogout();
  const isLoggingOut = status === "pending";

  async function onLogout() {
    await logoutAsync();
    router.replace("/login");
  }

  return (
    <div className="@container/main peak-topography peak-topography-motion flex flex-1 flex-col gap-6 p-4 md:p-6">
      <section className="peak-glass peak-reveal peak-shine grid gap-5 rounded-xl p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#59645b]">Account</p>
          <h2 className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
            User settings
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[#59645b]">
            Review the signed-in creator profile used for dashboard access and response notifications.
          </p>
        </div>
        <div className="grid size-14 place-items-center rounded-2xl border border-[#b4cdb8] bg-[#d0e9d4] text-[#2f5d3b]">
          <IconUserCircle className="size-7" />
        </div>
      </section>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load user settings</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-xl border border-[#c3c8c1]/65 bg-white/82 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl md:p-6">
          <div className="mb-5 grid gap-1">
            <h3 className="text-base font-semibold text-[#2f5d3b]">Profile details</h3>
            <p className="text-sm text-[#59645b]">These values come from your PeakForm account.</p>
          </div>

          {isLoading || isFetching ? (
            <div className="grid gap-4">
              <Skeleton className="h-10 w-full bg-[#edf1ec]" />
              <Skeleton className="h-10 w-full bg-[#edf1ec]" />
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="settings-name" className="text-sm font-medium text-[#3b463d]">
                  Name
                </label>
                <Input id="settings-name" readOnly value={user?.fullName ?? ""} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="settings-email" className="text-sm font-medium text-[#3b463d]">
                  Email
                </label>
                <Input id="settings-email" readOnly value={user?.email ?? ""} />
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-xl border border-[#c3c8c1]/65 bg-[#edf7ea]/90 p-5 shadow-xl shadow-[#4c616c]/10 backdrop-blur-xl">
          <div className="grid gap-2">
            <h3 className="text-base font-semibold text-[#2f5d3b]">Session</h3>
            <p className="text-sm leading-6 text-[#59645b]">
              Sign out when you are done managing forms on this device.
            </p>
          </div>
          <Button
            className="mt-5 w-full bg-[#2f5d3b] text-white hover:bg-[#3f744b]"
            disabled={isLoggingOut}
            onClick={() => void onLogout()}
          >
            <IconLogout className="size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </aside>
      </section>
    </div>
  );
}
