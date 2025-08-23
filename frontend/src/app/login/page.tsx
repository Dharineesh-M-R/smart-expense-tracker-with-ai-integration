"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 for redirect
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeButton from "@/components/HomeButton"; // 👈 common home button

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 🚀 For now just redirect, no auth logic
    router.push("/dashboard");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-[length:400%_400%]"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* Home Button */}
      <HomeButton />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white/90 border border-yellow-300">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2 text-yellow-600 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Login to continue tracking your expenses.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email Address"
              className="rounded-2xl border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
            />
            <Input
              type="password"
              placeholder="Password"
              className="rounded-2xl border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
            />

            <Button
              type="submit"
              className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Login
            </Button>
          </form>

          {/* Forgot password + Sign up link */}
          <div className="flex justify-between items-center mt-6 text-sm">
            <Link
              href="/forgotpass"
              className="text-yellow-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
            <Link
              href="/signup"
              className="text-yellow-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
