import type { UserRole, PersonType } from "@/lib/constants";

/**
 * Tipos relacionados a usuários
 */

export interface Address {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  tipoPessoa: PersonType;
  cpf?: string;
  cnpj?: string;
  telefone: string;
  endereco: Address;
  role: UserRole;
  aceitouTermos: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
}
