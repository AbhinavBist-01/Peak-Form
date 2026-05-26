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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  type FormValues = {
    email: string;
    password: string;
  };

  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();
  const { signInWithEmailAndPasswordAsync } = useSignin();

  async function onSubmit(values: FormValues) {
    console.log("Login form submitted:", values);
    await signInWithEmailAndPasswordAsync({
      email: values.email,
      password: values.password,
    });
    router.replace("/dashboard");
  }

  function onError(errors: FieldErrors<FormValues>) {
    console.log("Login form errors:", errors);
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="peak-glass border-[#c3c8c1]/70 bg-white/86 shadow-2xl">
        <CardHeader className="gap-3">
          <CardTitle className="peak-serif text-3xl font-semibold tracking-normal text-[#061b0e]">
            Welcome back
          </CardTitle>
          <CardDescription className="text-[#59645b]">
            Sign in to manage your forms, responses, and public links.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm text-[#4d6453] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required {...register("password")} />
              </Field>
              <Field>
                <Button type="submit" className="bg-[#061b0e] text-white hover:bg-[#1b3022]">
                  Login
                </Button>
                <Button variant="outline" type="button" className="border-[#4d6453]/35 bg-white/60">
                  Login with Google
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

