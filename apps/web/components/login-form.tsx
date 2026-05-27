"use client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { type FieldErrors, useForm } from "react-hook-form";
import { useSignin } from "~/hooks/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "~/components/google-auth-button";

function getSafeNextPath() {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  const nextPath = new URLSearchParams(window.location.search).get("next");

  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard";
  }

  return nextPath;
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  type FormValues = {
    email: string;
    password: string;
  };

  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();
  const { signInWithEmailAndPasswordAsync } = useSignin();

  async function onSubmit(values: FormValues) {
    await signInWithEmailAndPasswordAsync({
      email: values.email,
      password: values.password,
    });
    router.replace(getSafeNextPath());
  }

  function onError(errors: FieldErrors<FormValues>) {
    return errors;
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="peak-glass peak-shine border-[#c3c8c1]/70 bg-white/86 shadow-2xl">
        <CardHeader className="gap-3">
          <CardTitle className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
            Welcome back
          </CardTitle>
          <CardDescription className="text-[#59645b]">
            Sign in to manage your forms, responses, and public links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <GoogleAuthButton />
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#7a857c]">
              <div className="h-px flex-1 bg-[#d9ddd7]" />
              <span>or</span>
              <div className="h-px flex-1 bg-[#d9ddd7]" />
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required {...register("password")} />
              </Field>
              <Field>
                <Button type="submit" className="peak-button-motion bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-medium text-[#4d6453] underline-offset-4 hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

