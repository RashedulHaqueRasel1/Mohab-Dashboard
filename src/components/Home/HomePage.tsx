"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock } from "lucide-react";

// ✅ Zod schema
const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password is too long"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // react-hook-form setup
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });


  // Submit handler
  const onSubmit = async (values: LoginValues) => {
    setServerError(null);

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setServerError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-black via-neutral-950 to-gray-900 relative overflow-hidden">
      {/* subtle background glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>

      {/* card */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200/30 bg-white/90 shadow-xl backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome to Mohab Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please login with your credentials
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Email</FormLabel>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          className="pl-9 border-gray-300 focus:border-black focus:ring-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800">Password</FormLabel>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          className="pl-9 border-gray-300 focus:border-black focus:ring-black"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Server error */}
              {serverError && (
                <p className="text-sm text-red-600">{serverError}</p>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 transition-all font-medium cursor-pointer"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-600">
          Don’t have an account?
          <a
            href="/register"
            className="text-black font-semibold hover:underline ml-2"
          >
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
