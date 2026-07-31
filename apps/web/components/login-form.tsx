"use client";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { signInWithEmailAndPasswordAsync, error, status } = useSignin();
  const isSubmitting = status === "pending";

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
      <Card className="claude-card rounded-2xl border-[#E5DFD5] bg-[#FFFDF9] p-2 shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-[#78726A]">
            Sign in to manage your forms, responses, and public links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <GoogleAuthButton />
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#9E978F]">
              <div className="h-px flex-1 bg-[#E5DFD5]" />
              <span>OR</span>
              <div className="h-px flex-1 bg-[#E5DFD5]" />
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-medium text-[#2D2926]">
                  Email Address
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  aria-invalid={!!errors.email}
                  className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] placeholder:text-[#9E978F] focus:border-[#DA7756] focus:ring-0"
                  {...register("email", {
                    required: "Enter your email.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-medium text-[#2D2926]">
                    Password
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] focus:border-[#DA7756] focus:ring-0"
                  {...register("password", {
                    required: "Enter your password.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters.",
                    },
                  })}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Field className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="claude-button h-11 w-full rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
                >
                  {isSubmitting ? "Signing in..." : "Sign in to PeakForms"}
                </Button>
                <FieldError>{error?.message}</FieldError>
                <FieldDescription className="pt-2 text-center text-xs text-[#78726A]">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-medium text-[#DA7756] underline-offset-4 hover:underline">
                    Create account
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
