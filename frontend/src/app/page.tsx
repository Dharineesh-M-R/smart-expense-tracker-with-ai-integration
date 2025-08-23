"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-[length:400%_400%]"></div>

      {/* Overlay for subtle fade */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      {/* Main Card */}
      <Card className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl text-center p-8 bg-white/90 border border-yellow-300">
        <CardContent>
          <h1 className="text-3xl font-bold mb-4 text-yellow-600">
            Welcome to Smart Expense Tracker
          </h1>
          <p className="text-gray-700 mb-8">
            Track your expenses easily and get smart budget advice.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/signup">
              <Button className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full rounded-2xl border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold shadow-sm transition-transform transform hover:scale-105"
              >
                Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
