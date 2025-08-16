"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {  Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Login Successful!");
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-black via-neutral-950 to-gray-900 relative overflow-hidden">
      {/* Soft glowing background shapes */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>

      {/* Glassmorphism inspired card */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200/30 bg-white/90 shadow-xl backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
             Welcome to Mohab Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            Please login with your credentials
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="pl-9 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  className="pl-9 border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 transition-all font-medium cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-black font-semibold hover:underline ml-2">
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
