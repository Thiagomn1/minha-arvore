import { FormInput } from "@/components/forms/FormInput";

interface PasswordSectionProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  error?: string;
}

export function PasswordSection({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  error,
}: PasswordSectionProps) {
  return (
    <>
      <FormInput
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="••••••••"
        required
      />

      <FormInput
        label="Confirmar Senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        placeholder="Confirme sua senha"
        error={error}
        required
      />
    </>
  );
}
