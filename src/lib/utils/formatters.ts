/**
 * Utilitários de formatação de campos
 */

export const formatCPF = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const formatCNPJ = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");

export const formatTelefone = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

export const formatCEP = (value: string): string =>
  value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");

/**
 * Remove formatação de strings
 */
export const removeFormatting = (value: string): string => value.replace(/\D/g, "");
