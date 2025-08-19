"use client";
import { useEffect, useState } from "react";

export interface ICidade {
  nome: string;
  codigo_ibge: string;
}

interface UseCidadesProps {
  uf: string | null;
}

export const useCidades = ({ uf }: UseCidadesProps) => {
  const [cidades, setCidades] = useState<ICidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uf) return;

    setLoading(true);
    fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`)
      .then((response) => response.json())
      .then((data: ICidade[]) => setCidades(data))
      .finally(() => setLoading(false)); // 👈 melhor usar finally
  }, [uf]);

  return {
    cidades,
    loading,
  };
};
