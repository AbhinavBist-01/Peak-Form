"use client";

import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { trpc } from "~/trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const { mutateAsync: createUserWithEmailAndPasswordAsync } =
    trpc.auth.createUserWithEmailAndPassword.useMutation();
  const { register, handleSubmit } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" required {...register("name")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              <FieldDescription>
                Used for creator notifications and account access.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required {...register("password")} />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                {...register("confirmPassword")}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" className="peak-button-motion bg-[#2f5d3b] text-white hover:bg-[#3f744b]">
                  Create Account
                </Button>
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
