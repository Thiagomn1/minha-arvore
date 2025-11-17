/**
 * Constantes centralizadas do sistema
 */

export const PRODUCT_STATUS = {
  AVAILABLE: "Disponível",
  UNAVAILABLE: "Indisponível",
} as const;

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const ORDER_STATUS = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em Processo",
  PLANTED: "Plantado",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const USER_ROLES = {
  USER: "User",
  ADMIN: "Admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const PERSON_TYPE = {
  INDIVIDUAL: "PF",
  COMPANY: "PJ",
} as const;

export type PersonType = (typeof PERSON_TYPE)[keyof typeof PERSON_TYPE];

export const PRODUCT_CATEGORIES = {
  NATIVE: "Nativa",
  FRUIT: "Frutífera",
  ORNAMENTAL: "Ornamental",
  EXOTIC: "Exótica",
} as const;

export type ProductCategory =
  (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Não autorizado",
  FORBIDDEN: "Acesso negado",
  NOT_FOUND: "Não encontrado",
  INVALID_CREDENTIALS: "Credenciais inválidas",
  USER_NOT_FOUND: "Usuário não encontrado",
  PRODUCT_NOT_FOUND: "Produto não encontrado",
  ORDER_NOT_FOUND: "Pedido não encontrado",
  VALIDATION_ERROR: "Erro de validação",
  SERVER_ERROR: "Erro interno do servidor",
  DATABASE_ERROR: "Erro ao conectar com o banco de dados",
} as const;

export const REGEX_PATTERNS = {
  CPF: /^\d{11}$/,
  CNPJ: /^\d{14}$/,
  CEP: /^\d{8}$/,
  PHONE: /^\d{10,11}$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
