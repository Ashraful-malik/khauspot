"use client";
import { ReactNode } from "react";

export default function PageWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`h-full flex flex-col ${className}`}>{children}</div>;
}
