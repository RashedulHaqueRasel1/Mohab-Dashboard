"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/hooks/api";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
.refine((data) => data.newPassword !== data.currentPassword, {
  message: "New password must be different",
  path: ["newPassword"],
});

type FormData = z.infer<typeof passwordSchema>;

export default function PasswordChange() {
  const queryClient = useQueryClient();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { mutate: changePasswordMutation, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Password changed successfully");
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = (data: FormData) => {
    changePasswordMutation(data);
    reset();
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <nav className="flex items-center text-sm text-muted-foreground gap-1.5 flex-wrap">
          <Link href="/dashboard" className="hover:underline hover:text-primary">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/settings" className="hover:underline hover:text-primary">
            Settings
          </Link>
          <span>/</span>
          <span className="text-primary">Password</span>
        </nav>
      </div>

      <Card className="rounded-lg shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              {
                id: "current-password",
                label: "Current Password",
                field: "currentPassword",
                visible: showPasswords.current,
                toggle: () => togglePasswordVisibility("current")
              },
              {
                id: "new-password",
                label: "New Password",
                field: "newPassword",
                visible: showPasswords.new,
                toggle: () => togglePasswordVisibility("new"),
                helpText: "Minimum 8 characters with uppercase, lowercase, number, and special character"
              },
              {
                id: "confirm-password",
                label: "Confirm New Password",
                field: "confirmPassword",
                visible: showPasswords.confirm,
                toggle: () => togglePasswordVisibility("confirm")
              }
            ].map(({ id, label, field, visible, toggle, helpText }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                <div className="relative">
                  <Input
                    id={id}
                    type={visible ? "text" : "password"}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="pr-10"
                    {...register(field as keyof FormData)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    onClick={toggle}
                  >
                    {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors[field as keyof FormData] ? (
                  <p className="text-red-500 text-sm">
                    {errors[field as keyof FormData]?.message}
                  </p>
                ) : helpText ? (
                  <p className="text-muted-foreground text-sm">{helpText}</p>
                ) : null}
              </div>
            ))}

            <Button type="submit" className="w-full mt-6 cursor-pointer" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}