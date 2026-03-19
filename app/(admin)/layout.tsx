import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-bold text-lg">Admin</h2>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
