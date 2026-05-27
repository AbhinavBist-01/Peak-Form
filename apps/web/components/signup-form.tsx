"use client";

import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "~/components/google-auth-button";
import { useSignup } from "~/hooks/api/auth";

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

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { createUserWithEmailAndPasswordAsync, error, status } = useSignup();
  const isSubmitting = status === "pending";
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    if (values.password !== values.confirmPassword) return;

    await createUserWithEmailAndPasswordAsync({
      fullName: values.name,
      email: values.email,
      password: values.password,
    });
    router.replace(getSafeNextPath());
  };

  return (
    <Card className="peak-glass peak-shine border-[#c3c8c1]/70 bg-white/86 shadow-2xl" {...props}>
      <CardHeader className="gap-3">
        <CardTitle className="peak-serif text-3xl font-semibold tracking-normal text-[#2f5d3b]">
          Create your PeakForm account
        </CardTitle>
        <CardDescription className="text-[#59645b]">
          Start building polished public forms and response dashboards.
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                aria-invalid={!!errors.name}
                {...register("name", {
                  required: "Enter your full name.",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                  },
                })}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Enter your email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
              <FieldError errors={[errors.email]} />
              <FieldDescription>
                Used for creator notifications and account access.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                aria-invalid={!!errors.password}
                {...register("password", {
                  required: "Enter a password.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />
              <FieldError errors={[errors.password]} />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword", {
                  required: "Confirm your password.",
                  validate: (value) => value === getValues("password") || "Passwords do not match.",
                })}
              />
              <FieldError errors={[errors.confirmPassword]} />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="peak-button-motion bg-[#2f5d3b] text-white hover:bg-[#3f744b]"
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                <FieldError>{error?.message}</FieldError>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-[#4d6453] underline-offset-4 hover:underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
