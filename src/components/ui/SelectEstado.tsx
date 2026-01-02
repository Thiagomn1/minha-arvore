"use client";
import { useState, useMemo } from "react";
import Select, { SingleValue } from "react-select";
import { useEstados } from "@/hooks/useEstados";

type EstadoOption = {
  value: number;
  label: string;
};

interface SelectEstadoProps {
  onChange: (uf: string | null) => void;
  value?: string | null;
}

export const SelectEstado = ({ onChange, value }: SelectEstadoProps) => {
  const { estados } = useEstados();
  const [selectedEstado, setSelectedEstado] = useState<number | null>(null);

  const estadoOptions: EstadoOption[] = estados.map((estado) => ({
    value: estado.id,
    label: estado.nome,
  }));

  const currentSelectedId = useMemo(() => {
    if (selectedEstado) return selectedEstado;
    if (value && estados.length > 0) {
      const estado = estados.find((e) => e.sigla === value);
      return estado?.id || null;
    }
    return null;
  }, [selectedEstado, value, estados]);

  const selectedOptionEstado = estadoOptions.find(
    (e) => e.value === currentSelectedId
  );

  const handleEstadoUpdate = (event: SingleValue<EstadoOption>) => {
    if (!event) return;
    setSelectedEstado(event.value);
    const selectedUf = estados.find((e) => e.id === event.value)?.sigla || null;
    onChange(selectedUf);
  };

  return (
    <Select
      placeholder="Estado"
      options={estadoOptions}
      value={selectedOptionEstado}
      onChange={handleEstadoUpdate}
    />
  );
};
