import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

/**
 * Componente reutilizável de input com label e erro
 */
export function FormInput({
  label,
  error,
  fullWidth = true,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className={`form-control ${fullWidth ? "w-full" : ""}`}>
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
      </label>
      <input
        className={`input input-bordered w-full ${className}`}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
