"use client";

import { ArrowLeft, Menu } from "lucide-react";
import Link from "next/link";

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
      <Link
        href="/"
        className="text-sm  hover:underline flex items-center bg-primary gap-2  text-white px-2 py-1.5 rounded-md"
      >
        <ArrowLeft size={18} /> Back to App
      </Link>
    </div>
  );
}
