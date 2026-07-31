"use client";

import { useState } from "react";
import { IconLogout, IconUserCircle } from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useUser } from "~/hooks/api/auth";
import { getApiOrigin } from "~/lib/api-url";

export default function SettingsPage() {
  const { user, error, isLoading, isFetching } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function onLogout() {
    setIsLoggingOut(true);
    window.location.href = new URL("/auth/logout", getApiOrigin()).toString();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-5 md:p-8 bg-[#FAF7F2] text-[#2D2926]">
      <section className="claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono text-[#DA7756]">ACCOUNT</span>
          <h2 className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
            User Settings
          </h2>
          <p className="max-w-2xl text-xs text-[#78726A]">
            Signed-in creator profile for form management and response notifications.
          </p>
        </div>
        <div className="grid size-12 place-items-center rounded-2xl bg-[#F7EBE1] text-[#DA7756]">
          <IconUserCircle className="size-6" />
        </div>
      </section>

      {error ? (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900">
          <AlertTitle className="font-medium">Could not load user settings</AlertTitle>
          <AlertDescription className="text-xs">{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E5DFD5] pb-3">
            <h3 className="peak-serif text-xl font-medium text-[#2D2926]">Profile Details</h3>
            <p className="text-xs text-[#78726A]">These values come from your PeakForms account.</p>
          </div>

          {isLoading || isFetching ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full bg-[#E5DFD5]/60" />
              <Skeleton className="h-10 w-full bg-[#E5DFD5]/60" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="settings-name" className="block text-xs font-medium text-[#2D2926]">
                  Full Name
                </label>
                <Input id="settings-name" readOnly value={user?.fullName ?? ""} className="h-11 rounded-xl border-[#E5DFD5] bg-[#FAF7F2] text-xs text-[#2D2926]" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="settings-email" className="block text-xs font-medium text-[#2D2926]">
                  Email Address
                </label>
                <Input id="settings-email" readOnly value={user?.email ?? ""} className="h-11 rounded-xl border-[#E5DFD5] bg-[#FAF7F2] text-xs text-[#2D2926]" />
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 claude-card rounded-2xl bg-[#FFFDF9] border border-[#E5DFD5] p-6 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-[#E5DFD5] pb-3">
            <h3 className="peak-serif text-xl font-medium text-[#2D2926]">Session</h3>
            <p className="text-xs text-[#78726A]">
              Sign out when you are done managing forms on this device.
            </p>
          </div>
          <Button
            className="claude-button w-full rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545] h-11"
            disabled={isLoggingOut}
            onClick={() => void onLogout()}
          >
            <IconLogout className="mr-1.5 size-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </aside>
      </section>
    </div>
  );
}
