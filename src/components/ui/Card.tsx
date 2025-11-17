import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("card bg-base-100", {
  variants: {
    variant: {
      default: "shadow-xl",
      elevated: "shadow-2xl",
      small: "shadow-md",
      admin: "shadow-md hover:bg-base-200 cursor-pointer",
      bordered: "card-bordered shadow-md",
    },
    padding: {
      none: "",
      sm: "p-2",
      md: "p-4",
      lg: "p-6",
      xl: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "none",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export default function Card({
  className,
  variant,
  padding,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </div>
  );
}
