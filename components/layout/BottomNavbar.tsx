"use client";
import { NavItemProps, NavLinksProps } from "@/types/navbar";
import { House, MapPinned, CirclePlus, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: NavLinksProps[] = [
  { title: "Home", href: "/", icon: House },
  { title: "Map", href: "/map", icon: MapPinned },
  { title: "Add", href: "/add", icon: CirclePlus },
  { title: "Activity", href: "/activity", icon: History },
];

export default function BottomNavbar() {
  const pathName = usePathname();

  return (
    <div className="h-16 bg-white px-3 border-t border-gray-200/25">
      <nav className="flex items-center justify-between w-full h-full ">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathName === "/"
              : pathName.startsWith(item.href);

          return (
            <NavItem
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
              isActive={isActive}
            />
          );
        })}
      </nav>
    </div>
  );
}

function NavItem({ href, icon: Icon, isActive, title }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 active:scale-95"
    >
      <Icon
        size={20}
        className={`transition-all duration-200 ${
          isActive ? "scale-110 text-primary" : "scale-100 text-gray-400"
        }`}
      />

      <span
        className={`text-xs ${isActive ? "text-primary font-medium" : "text-gray-400 "}`}
      >
        {title}
      </span>
    </Link>
  );
}
