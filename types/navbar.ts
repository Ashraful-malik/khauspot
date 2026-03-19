import { LucideIcon } from "lucide-react";

export type NavItemProps = {
  href: string;
  title: string;
  icon: LucideIcon;
  isActive: boolean;
};

export type NavLinksProps = {
  title: string;
  href: string;
  icon: LucideIcon;
};
