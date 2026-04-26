"use client";
import Link from "next/link";
import Container from "./Container";
import { CirclePlus, History, House, MapPinned } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUp,
  UserButton,
} from "@clerk/nextjs";

const navItems = [
  { title: "Home", href: "/", icon: House },
  { title: "Map", href: "/map", icon: MapPinned },
  { title: "Add", href: "/add", icon: CirclePlus },
  { title: "Activity", href: "/activity", icon: History },
];

export default function Navbar({ className }: { className?: string }) {
  const pathName = usePathname();

  return (
    <nav
      className={`h-16  top-0 z-50 
      bg-white/80 
      border-b border-gray-200 
      ${className}`}
    >
      <Container className="flex items-center justify-between h-full">
        {/* Logo */}
        <div className="text-xl font-semibold tracking-tight">StreetFood</div>

        {/* Nav Links */}
        <div className="flex items-center  gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathName === "/"
                  : pathName.startsWith(item.href);

              return <NavLink key={item.href} {...item} isActive={isActive} />;
            })}
          </div>
          {/* if not logged in  */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-secondary text-white px-4 py-2 rounded-lg">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          {/* if logged in */}
          <SignedIn>
            <div className="scale-125">
              <UserButton />
            </div>
          </SignedIn>
          {/* signup  */}
        </div>
      </Container>
    </nav>
  );
}

type NavItemProps = {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
};
function NavLink({ title, href, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        text-sm font-medium transition-all duration-200
        
        ${
          isActive
            ? "bg-white shadow text-secondary"
            : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
        }
      `}
    >
      <Icon
        size={18}
        className={`transition-transform duration-200 ${
          isActive ? "scale-110" : "group-hover:scale-105"
        }`}
      />
      {title}
    </Link>
  );
}
