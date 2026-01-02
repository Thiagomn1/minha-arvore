import { FormSelect } from "@/components/forms/FormSelect";
import { FormInput } from "@/components/forms/FormInput";
import { formatCPF, formatCNPJ } from "@/lib/utils/formatters";

interface PersonTypeSectionProps {
  tipoPessoa: "" | "PF" | "PJ";
  cpf: string;
  cnpj: string;
  onTipoPessoaChange: (value: "" | "PF" | "PJ") => void;
  onCpfChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
  errors: {
    tipoPessoa?: string;
    cpf?: string;
    cnpj?: string;
  };
}

export function PersonTypeSection({
  tipoPessoa,
  cpf,
  cnpj,
  onTipoPessoaChange,
  onCpfChange,
  onCnpjChange,
  errors,
}: PersonTypeSectionProps) {
  return (
    <>
      <FormSelect
        label="Tipo de Pessoa"
        value={tipoPessoa}
        onChange={(e) => onTipoPessoaChange(e.target.value as "" | "PF" | "PJ")}
        options={[
          { value: "PF", label: "Pessoa Física" },
          { value: "PJ", label: "Pessoa Jurídica" },
        ]}
        error={errors.tipoPessoa}
        required
      />

      {tipoPessoa === "PF" && (
        <FormInput
          label="CPF"
          type="text"
          value={cpf}
          onChange={(e) => onCpfChange(formatCPF(e.target.value))}
          maxLength={14}
          placeholder="000.000.000-00"
          error={errors.cpf}
          required
        />
      )}

      {tipoPessoa === "PJ" && (
        <FormInput
          label="CNPJ"
          type="text"
          value={cnpj}
          onChange={(e) => onCnpjChange(formatCNPJ(e.target.value))}
          maxLength={18}
          placeholder="00.000.000/0000-00"
          error={errors.cnpj}
          required
        />
      )}
    </>
  );
}
