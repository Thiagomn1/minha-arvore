"use client";
import { useQuery } from "@tanstack/react-query";

export interface ICidade {
  nome: string;
  codigo_ibge: string;
}

interface UseCidadesProps {
  uf: string | null;
}

export const useCidades = ({ uf }: UseCidadesProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cidades", uf],
    queryFn: async () => {
      const response = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
      if (!response.ok) throw new Error("Erro ao buscar cidades");
      return response.json() as Promise<ICidade[]>;
    },
    enabled: !!uf,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas - dados IBGE são estáticos
  });

  return {
    cidades: data || [],
    loading: isLoading,
  };
};
