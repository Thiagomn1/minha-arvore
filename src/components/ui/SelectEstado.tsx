"use client";
import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { useEstados } from "@/hooks/useEstados";

type EstadoOption = {
  value: number;
  label: string;
};

interface SelectEstadoProps {
  onChange: (uf: string | null) => void;
}

export const SelectEstado = ({ onChange }: SelectEstadoProps) => {
  const { estados } = useEstados();
  const [selectedEstado, setSelectedEstado] = useState<number | null>(null);

  const estadoOptions: EstadoOption[] = estados.map((estado) => ({
    value: estado.id,
    label: estado.nome,
  }));

  const selectedOptionEstado = estadoOptions.find(
    (e) => e.value === selectedEstado
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
