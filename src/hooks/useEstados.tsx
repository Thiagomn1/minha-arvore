"use client";
import { useQuery } from "@tanstack/react-query";

export interface Regiao {
  id: number;
  sigla: string;
  nome: string;
}

export interface IEstado {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
}

export const useEstados = () => {
  const { data } = useQuery({
    queryKey: ["estados"],
    queryFn: async () => {
      const response = await fetch("https://brasilapi.com.br/api/ibge/uf/v1");
      if (!response.ok) throw new Error("Erro ao buscar estados");
      return response.json() as Promise<IEstado[]>;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 horas - dados IBGE são estáticos
  });

  return {
    estados: data || [],
  };
};
