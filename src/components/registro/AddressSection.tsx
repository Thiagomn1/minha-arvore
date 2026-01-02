import { FormInput } from "@/components/forms/FormInput";
import { SelectEstado } from "@/components/ui/SelectEstado";
import { SelectCidade } from "@/components/ui/SelectCidade";

export interface Address {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface AddressSectionProps {
  endereco: Address;
  onChange: (field: keyof Address, value: string) => void;
}

export function AddressSection({ endereco, onChange }: AddressSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label="Rua"
        type="text"
        value={endereco.rua}
        onChange={(e) => onChange("rua", e.target.value)}
        required
      />

      <FormInput
        label="Número"
        type="text"
        value={endereco.numero}
        onChange={(e) => onChange("numero", e.target.value)}
        required
      />

      <div className="form-control md:col-span-2">
        <FormInput
          label="Bairro"
          type="text"
          value={endereco.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Estado</span>
        </label>
        <SelectEstado onChange={(estado) => onChange("estado", estado || "")} />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Cidade</span>
        </label>
        <SelectCidade
          uf={endereco.estado}
          onChange={(cidade) => onChange("cidade", cidade || "")}
        />
      </div>

      <div className="md:col-span-2">
        <FormInput
          label="CEP"
          type="text"
          value={endereco.cep}
          onChange={(e) => onChange("cep", e.target.value)}
          required
        />
      </div>
    </div>
  );
}
