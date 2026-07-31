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
    <Card className="claude-card rounded-2xl border-[#E5DFD5] bg-[#FFFDF9] p-2 shadow-xs" {...props}>
      <CardHeader className="gap-2">
        <CardTitle className="peak-serif text-3xl font-medium tracking-tight text-[#2D2926]">
          Create PeakForms account
        </CardTitle>
        <CardDescription className="text-xs text-[#78726A]">
          Start building clean interactive forms and response dashboards.
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name" className="text-xs font-medium text-[#2D2926]">
                Full Name
              </FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                required
                aria-invalid={!!errors.name}
                className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] placeholder:text-[#9E978F] focus:border-[#DA7756] focus:ring-0"
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
              <FieldLabel htmlFor="password" className="text-xs font-medium text-[#2D2926]">
                Password
              </FieldLabel>
              <Input
                id="password"
                type="password"
                required
                aria-invalid={!!errors.password}
                className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] focus:border-[#DA7756] focus:ring-0"
                {...register("password", {
                  required: "Enter a password.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="text-xs font-medium text-[#2D2926]">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                aria-invalid={!!errors.confirmPassword}
                className="h-11 rounded-xl border-[#E5DFD5] bg-[#FFFDF9] text-xs text-[#2D2926] focus:border-[#DA7756] focus:ring-0"
                {...register("confirmPassword", {
                  required: "Confirm your password.",
                  validate: (value) => value === getValues("password") || "Passwords do not match.",
                })}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
            <FieldGroup className="pt-2">
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="claude-button h-11 w-full rounded-xl bg-[#DA7756] text-xs font-medium text-white hover:bg-[#C66545]"
                >
                  {isSubmitting ? "Creating account..." : "Create free account"}
                </Button>
                <FieldError>{error?.message}</FieldError>
                <FieldDescription className="pt-2 text-center text-xs text-[#78726A]">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-[#DA7756] underline-offset-4 hover:underline">
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
