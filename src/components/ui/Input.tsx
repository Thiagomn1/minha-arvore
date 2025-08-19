"use client";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-semibold">{label}</span>
        </label>
      )}
      <input
        className={`input input-bordered w-full ${error ? "input-error" : ""} ${
          className || ""
        }`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
