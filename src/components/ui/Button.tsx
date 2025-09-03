"use client";

import React from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost"
  | "link"
  | "outline"
  | "neutral";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  outline?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  outline,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "btn rounded-md",
        `btn-${variant}`,
        outline && "btn-outline",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
