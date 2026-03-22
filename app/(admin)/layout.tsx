"use client";
import ProjectList from "@/components/admin/project-list";
import Sidebar from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen ">
      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
        fixed z-50 top-0 left-0 h-full w-64 bg-white border-r
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b flex items-center px-4">
          {/* Hamburger */}
          <button
            className="md:hidden mr-3 text-xl"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="font-semibold">Admin Panel</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
