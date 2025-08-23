"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeButton from "@/components/HomeButton";  // 👈 import

export default function SignupPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-[length:400%_400%]"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* Common Home Button */}
      <HomeButton />

      {/* Signup Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white/90 border border-yellow-300">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2 text-yellow-600 text-center">
            Create an Account
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Sign up to start tracking your expenses smartly.
          </p>

          <form className="flex flex-col gap-4">
            <Input type="text" placeholder="Full Name" />
            <Input type="email" placeholder="Email Address" />
            <Input type="password" placeholder="Password" />
            <Input type="password" placeholder="Re-enter Password" />

            <Button className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105">
              Sign Up
            </Button>
          </form>

          <p className="text-gray-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
