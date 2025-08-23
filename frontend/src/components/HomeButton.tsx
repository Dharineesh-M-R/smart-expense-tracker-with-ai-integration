"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomeButton() {
  return (
    <div className="absolute top-6 right-6 z-20">
      <Link href="/">
        <Button
          variant="outline"
          className="rounded-2xl border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold shadow-sm"
        >
          Home
        </Button>
      </Link>
    </div>
  );
}
