import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 2 | 4 | 6 | 8;
  className?: string;
}

const colsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const gapClasses = {
  2: "gap-2",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

export default function ResponsiveGrid({
  children,
  cols = 3,
  gap = 4,
  className,
}: ResponsiveGridProps) {
  return (
    <div className={cn("grid", colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
