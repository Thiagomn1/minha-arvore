import { useState, useMemo } from "react";
import Select, { SingleValue } from "react-select";
import { useCidades } from "@/hooks/useCidades";

type CidadeOption = {
  value: string; // codigo_ibge
  label: string; // nome da cidade
};

interface SelectCidadeProps {
  uf: string | null;
  onChange: (cidade: string) => void;
  value?: string | null;
}

const formatCityName = (name: string): string => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      const lowercase = ["de", "do", "da", "dos", "das", "e"];
      if (lowercase.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const SelectCidade = ({ uf, onChange, value }: SelectCidadeProps) => {
  const { cidades, loading: loadingCidades } = useCidades({ uf });
  const [selectedCidade, setSelectedCidade] = useState<string | null>(null);

  const cidadeOptions: CidadeOption[] = cidades.map((cidade) => ({
    value: cidade.codigo_ibge,
    label: formatCityName(cidade.nome),
  }));

  const currentSelectedCode = useMemo(() => {
    if (selectedCidade) return selectedCidade;
    if (value && cidades.length > 0) {
      const cidade = cidades.find((c) => c.nome === value);
      return cidade?.codigo_ibge || null;
    }
    return null;
  }, [selectedCidade, value, cidades]);

  const selectedOptionCidade = cidadeOptions.find(
    (c) => c.value === currentSelectedCode
  );

  const handleCidadeUpdate = (event: SingleValue<CidadeOption>) => {
    if (!event) return;
    setSelectedCidade(event.value);
    onChange(event.label);
  };

  return (
    <Select
      isLoading={loadingCidades}
      loadingMessage={() => "Estamos carregando as cidades, aguarde ..."}
      isDisabled={loadingCidades || cidadeOptions.length === 0}
      options={cidadeOptions}
      placeholder="Cidade"
      value={selectedOptionCidade}
      onChange={handleCidadeUpdate}
    />
  );
};
