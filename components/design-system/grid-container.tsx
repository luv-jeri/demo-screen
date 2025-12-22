import React from "react";
import { cn } from "@/lib/utils";

interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function GridContainer({
  children,
  className,
  fullWidth = false,
  ...props
}: GridContainerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto border-x border-border", // Vertical grid lines
        fullWidth ? "w-full" : "max-w-[1400px]",
        className
      )}
      {...props}
    >
      {/* Horizontal lines are handled by sections usually, but we can enforce grid alignment here */}
      {children}
    </div>
  );
}
