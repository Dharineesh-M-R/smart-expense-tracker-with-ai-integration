"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeButton from "@/components/HomeButton"; // 👈 common home button

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-[length:400%_400%]"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* Home Button */}
      <HomeButton />

      {/* Forgot Password Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white/90 border border-yellow-300">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2 text-yellow-600 text-center">
            Forgot Password?
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          <form className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email Address"
              className="rounded-2xl border-yellow-300 focus:ring-yellow-400 focus:border-yellow-400"
            />

            <Button className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105">
              Send Reset Link
            </Button>
          </form>

          {/* Back to Login */}
          <p className="text-gray-600 text-sm mt-6 text-center">
            Remembered your password?{" "}
            <Link href="/login" className="text-yellow-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
