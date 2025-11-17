import { InputHTMLAttributes, ReactNode } from "react";

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
}

/**
 * Componente reutilizável de checkbox com label e erro
 */
export function FormCheckbox({
  label,
  error,
  className = "",
  ...props
}: FormCheckboxProps) {
  return (
    <div className="form-control">
      <label className="cursor-pointer flex items-center gap-2">
        <input
          type="checkbox"
          className={`checkbox checkbox-primary ${className}`}
          {...props}
        />
        <span className="label-text text-sm">{label}</span>
      </label>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  );
}
