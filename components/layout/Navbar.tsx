"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Container from "./Container";
import { CirclePlus, History, House, MapPinned } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavItemProps, NavLinksProps } from "@/types/navbar";

const navItems: NavLinksProps[] = [
  { title: "Home", href: "/", icon: House },
  { title: "Map", href: "/map", icon: MapPinned },
  { title: "Add", href: "/add", icon: CirclePlus },
  { title: "Activity", href: "/activity", icon: History },
];
export default function Navbar({ className }: { className?: string }) {
  const pathName = usePathname();
  return (
    <nav className={`bg-white w-full  border-b ${className}`}>
      <Container className="flex items-center justify-between h-full">
        <div className="text-xl font-bold">StreetFood</div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="flex gap-4 ">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathName === "/"
                    : pathName.startsWith(item.href);

                return (
                  <NavLinks
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                    isActive={isActive}
                    key={item.href}
                  />
                );
              })}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Container>
    </nav>
  );
}

function NavLinks({ title, href, icon: Icon, isActive }: NavItemProps) {
  return (
    <NavigationMenuLink
      asChild
      className={`${navigationMenuTriggerStyle()}  ${isActive ? "text-primary " : "text-muted-foreground"} hidden md:flex`}
      key={href}
    >
      <Link href={href}>
        <Icon size={20} />
        {title}
      </Link>
    </NavigationMenuLink>
  );
}
