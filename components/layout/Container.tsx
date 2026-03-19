import React, { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${className} max-w-6xl mx-auto px-4 `}>{children}</div>
  );
}
