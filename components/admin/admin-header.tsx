"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import { AppleIcon, ArrowLeft, Menu, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function AdminHeader({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <div className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="flex items-center">
        <button className="md:hidden mr-3 text-xl" onClick={onNavigate}>
          <Menu />
        </button>
        {/* Left */}
        <h1 className="font-semibold text-sm">Admin Dashboard</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          {/* link to go back to app */}
          <Link href="/">Back to App</Link>
        </Button>
        {/* logged in user clerk profile  */}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
