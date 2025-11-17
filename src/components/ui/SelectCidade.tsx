import Select, { SingleValue } from "react-select";
import { useCidades } from "@/hooks/useCidades";

type CidadeOption = {
  value: string; // codigo_ibge
  label: string; // nome da cidade
};

interface SelectCidadeProps {
  uf: string | null;
  onChange: (cidade: string) => void;
}

export const SelectCidade = ({ uf, onChange }: SelectCidadeProps) => {
  const { cidades, loading: loadingCidades } = useCidades({ uf });

  const cidadeOptions: CidadeOption[] = cidades.map((cidade) => ({
    value: cidade.codigo_ibge,
    label: cidade.nome,
  }));

  const handleCidadeUpdate = (event: SingleValue<CidadeOption>) => {
    if (!event) return;
    onChange(event.label);
  };

  return (
    <Select
      isLoading={loadingCidades}
      loadingMessage={() => "Estamos carregando as cidades, aguarde ..."}
      isDisabled={loadingCidades || cidadeOptions.length === 0}
      options={cidadeOptions}
      placeholder="Cidade"
      onChange={handleCidadeUpdate}
    />
  );
};
