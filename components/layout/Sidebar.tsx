"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const linkClass = (path: string) =>
    `block p-2 rounded ${
      pathname.startsWith(path) ? "bg-gray-100" : "hover:bg-gray-100"
    }`;

  const navlinks = [
    {
      href: "/admin/dashboard",
      title: "Dashboard",
    },
  ];
  return (
    <nav className="p-4 space-y-2">
      {navlinks.map((link) => (
        <Link
          key={link.href}
          onClick={onNavigate}
          href={link.href}
          className={`w-full text-left   ${linkClass(link.href)}`}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
