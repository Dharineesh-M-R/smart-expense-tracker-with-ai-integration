"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HomeButton from "@/components/HomeButton";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email and password!");
    setLoading(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      const data = res.data;
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", data.user.id); // Save userId separately
      alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-yellow-400 via-white to-yellow-300 bg-[length:400%_400%]"></div>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      <HomeButton />

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-md transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

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
