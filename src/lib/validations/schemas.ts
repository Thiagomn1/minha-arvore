/**
 * Schemas de validação com Zod
 */
import { z } from "zod";
import {
  REGEX_PATTERNS,
  PERSON_TYPE,
  PRODUCT_STATUS,
  ORDER_STATUS,
} from "../constants";

export const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .regex(
    REGEX_PATTERNS.PASSWORD,
    "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
  );

export const addressSchema = z.object({
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  cep: z.string().regex(REGEX_PATTERNS.CEP, "CEP inválido"),
});

export const registerUserSchema = z
  .object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    tipoPessoa: z.enum([PERSON_TYPE.INDIVIDUAL, PERSON_TYPE.COMPANY]),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    telefone: z.string().regex(REGEX_PATTERNS.PHONE, "Telefone inválido"),
    endereco: addressSchema,
    aceitouTermos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos",
    }),
  })
  .refine(
    (data) => {
      if (data.tipoPessoa === PERSON_TYPE.INDIVIDUAL) {
        return data.cpf && REGEX_PATTERNS.CPF.test(data.cpf);
      }
      if (data.tipoPessoa === PERSON_TYPE.COMPANY) {
        return data.cnpj && REGEX_PATTERNS.CNPJ.test(data.cnpj);
      }
      return false;
    },
    {
      message: "CPF ou CNPJ inválido",
      path: ["cpf"],
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const updateUserDadosSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
});

export const updateUserEnderecoSchema = z.object({
  endereco: addressSchema.partial(),
});

export const updateUserSenhaSchema = z.object({
  senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
  novaSenha: passwordSchema,
});

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  imageUrl: z.string().url("URL de imagem inválida"),
  category: z.string().min(1, "Categoria é obrigatória"),
  status: z
    .enum([PRODUCT_STATUS.AVAILABLE, PRODUCT_STATUS.UNAVAILABLE])
    .default(PRODUCT_STATUS.AVAILABLE),
});

export const updateProductSchema = productSchema.partial();

export const createOrderSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1, "O pedido deve ter pelo menos um produto"),
  total: z.number().positive("Total deve ser positivo"),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.IN_PROGRESS,
    ORDER_STATUS.PLANTED,
  ]),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserDadosInput = z.infer<typeof updateUserDadosSchema>;
export type UpdateUserEnderecoInput = z.infer<typeof updateUserEnderecoSchema>;
export type UpdateUserSenhaInput = z.infer<typeof updateUserSenhaSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
