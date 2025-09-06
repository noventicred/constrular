// ============================================================================
// VALIDAÇÕES - NOVA CASA CONSTRUÇÃO
// ============================================================================
// Funções de validação reutilizáveis e schemas Zod
// ============================================================================

import { z } from "zod";
import { VALIDATION } from "./constants";

// ============================================================================
// SCHEMAS DE VALIDAÇÃO
// ============================================================================

// Schema para autenticação
export const authSchemas = {
  signIn: z.object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(
        VALIDATION.MIN_PASSWORD_LENGTH,
        `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`
      ),
  }),

  signUp: z.object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(
        VALIDATION.MIN_PASSWORD_LENGTH,
        `Senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_PASSWORD_LENGTH,
        `Senha deve ter no máximo ${VALIDATION.MAX_PASSWORD_LENGTH} caracteres`
      ),
    fullName: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      ),
  }),

  resetPassword: z.object({
    email: z.string().email("Email inválido"),
  }),
};

// Schema para produtos
export const productSchemas = {
  create: z.object({
    name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      ),
    description: z
      .string()
      .max(
        VALIDATION.MAX_DESCRIPTION_LENGTH,
        `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
      )
      .optional(),
    price: z
      .number()
      .min(
        VALIDATION.MIN_PRICE,
        `Preço deve ser pelo menos R$ ${VALIDATION.MIN_PRICE}`
      )
      .max(
        VALIDATION.MAX_PRICE,
        `Preço deve ser no máximo R$ ${VALIDATION.MAX_PRICE}`
      ),
    original_price: z
      .number()
      .min(
        VALIDATION.MIN_PRICE,
        `Preço original deve ser pelo menos R$ ${VALIDATION.MIN_PRICE}`
      )
      .max(
        VALIDATION.MAX_PRICE,
        `Preço original deve ser no máximo R$ ${VALIDATION.MAX_PRICE}`
      )
      .optional(),
    discount: z
      .number()
      .min(0, "Desconto não pode ser negativo")
      .max(
        VALIDATION.MAX_DISCOUNT,
        `Desconto deve ser no máximo ${VALIDATION.MAX_DISCOUNT}%`
      )
      .optional(),
    image_url: z.string().url("URL da imagem inválida").optional(),
    category_id: z.string().uuid("ID da categoria inválido"),
    in_stock: z.boolean(),
    is_featured: z.boolean(),
    is_special_offer: z.boolean(),
  }),

  update: z.object({
    name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      )
      .optional(),
    description: z
      .string()
      .max(
        VALIDATION.MAX_DESCRIPTION_LENGTH,
        `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
      )
      .optional(),
    price: z
      .number()
      .min(
        VALIDATION.MIN_PRICE,
        `Preço deve ser pelo menos R$ ${VALIDATION.MIN_PRICE}`
      )
      .max(
        VALIDATION.MAX_PRICE,
        `Preço deve ser no máximo R$ ${VALIDATION.MAX_PRICE}`
      )
      .optional(),
    original_price: z
      .number()
      .min(
        VALIDATION.MIN_PRICE,
        `Preço original deve ser pelo menos R$ ${VALIDATION.MIN_PRICE}`
      )
      .max(
        VALIDATION.MAX_PRICE,
        `Preço original deve ser no máximo R$ ${VALIDATION.MAX_PRICE}`
      )
      .optional(),
    discount: z
      .number()
      .min(0, "Desconto não pode ser negativo")
      .max(
        VALIDATION.MAX_DISCOUNT,
        `Desconto deve ser no máximo ${VALIDATION.MAX_DISCOUNT}%`
      )
      .optional(),
    image_url: z.string().url("URL da imagem inválida").optional(),
    category_id: z.string().uuid("ID da categoria inválido").optional(),
    in_stock: z.boolean().optional(),
    is_featured: z.boolean().optional(),
    is_special_offer: z.boolean().optional(),
  }),
};

// Schema para categorias
export const categorySchemas = {
  create: z.object({
    name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      ),
    description: z
      .string()
      .max(
        VALIDATION.MAX_DESCRIPTION_LENGTH,
        `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
      )
      .optional(),
    image_url: z.string().url("URL da imagem inválida").optional(),
    parent_id: z.string().uuid("ID da categoria pai inválido").optional(),
  }),

  update: z.object({
    name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      )
      .optional(),
    description: z
      .string()
      .max(
        VALIDATION.MAX_DESCRIPTION_LENGTH,
        `Descrição deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
      )
      .optional(),
    image_url: z.string().url("URL da imagem inválida").optional(),
    parent_id: z.string().uuid("ID da categoria pai inválido").optional(),
  }),
};

// Schema para perfil do usuário
export const profileSchemas = {
  update: z.object({
    full_name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      )
      .optional(),
    phone: z
      .string()
      .regex(VALIDATION.PHONE_REGEX, "Telefone inválido")
      .optional(),
    street: z
      .string()
      .max(200, "Rua deve ter no máximo 200 caracteres")
      .optional(),
    number: z
      .string()
      .max(20, "Número deve ter no máximo 20 caracteres")
      .optional(),
    complement: z
      .string()
      .max(100, "Complemento deve ter no máximo 100 caracteres")
      .optional(),
    city: z
      .string()
      .max(100, "Cidade deve ter no máximo 100 caracteres")
      .optional(),
    state: z.string().max(2, "Estado deve ter 2 caracteres").optional(),
    zip_code: z
      .string()
      .regex(VALIDATION.ZIP_CODE_REGEX, "CEP inválido")
      .optional(),
    birth_date: z.string().optional(),
    document_number: z
      .string()
      .refine(
        (val) =>
          !val ||
          VALIDATION.CPF_REGEX.test(val) ||
          VALIDATION.CNPJ_REGEX.test(val),
        "CPF ou CNPJ inválido"
      )
      .optional(),
  }),
};

// Schema para contato
export const contactSchemas = {
  send: z.object({
    name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      ),
    email: z.string().email("Email inválido"),
    phone: z.string().regex(VALIDATION.PHONE_REGEX, "Telefone inválido"),
    message: z
      .string()
      .min(10, "Mensagem deve ter pelo menos 10 caracteres")
      .max(
        VALIDATION.MAX_DESCRIPTION_LENGTH,
        `Mensagem deve ter no máximo ${VALIDATION.MAX_DESCRIPTION_LENGTH} caracteres`
      ),
  }),
};

// Schema para newsletter
export const newsletterSchemas = {
  subscribe: z.object({
    email: z.string().email("Email inválido"),
  }),
};

// Schema para endereço de entrega
export const shippingSchemas = {
  address: z.object({
    full_name: z
      .string()
      .min(
        VALIDATION.MIN_NAME_LENGTH,
        `Nome deve ter pelo menos ${VALIDATION.MIN_NAME_LENGTH} caracteres`
      )
      .max(
        VALIDATION.MAX_NAME_LENGTH,
        `Nome deve ter no máximo ${VALIDATION.MAX_NAME_LENGTH} caracteres`
      ),
    phone: z.string().regex(VALIDATION.PHONE_REGEX, "Telefone inválido"),
    street: z
      .string()
      .min(5, "Rua deve ter pelo menos 5 caracteres")
      .max(200, "Rua deve ter no máximo 200 caracteres"),
    number: z
      .string()
      .min(1, "Número é obrigatório")
      .max(20, "Número deve ter no máximo 20 caracteres"),
    complement: z
      .string()
      .max(100, "Complemento deve ter no máximo 100 caracteres")
      .optional(),
    city: z
      .string()
      .min(2, "Cidade deve ter pelo menos 2 caracteres")
      .max(100, "Cidade deve ter no máximo 100 caracteres"),
    state: z.string().length(2, "Estado deve ter 2 caracteres"),
    zip_code: z.string().regex(VALIDATION.ZIP_CODE_REGEX, "CEP inválido"),
  }),
};

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO UTILITÁRIAS
// ============================================================================

export const validators = {
  // Validar email
  isValidEmail: (email: string): boolean => {
    return z.string().email().safeParse(email).success;
  },

  // Validar telefone brasileiro
  isValidPhone: (phone: string): boolean => {
    return VALIDATION.PHONE_REGEX.test(phone);
  },

  // Validar CPF
  isValidCPF: (cpf: string): boolean => {
    return VALIDATION.CPF_REGEX.test(cpf);
  },

  // Validar CNPJ
  isValidCNPJ: (cnpj: string): boolean => {
    return VALIDATION.CNPJ_REGEX.test(cnpj);
  },

  // Validar CEP
  isValidZipCode: (zipCode: string): boolean => {
    return VALIDATION.ZIP_CODE_REGEX.test(zipCode);
  },

  // Validar URL
  isValidUrl: (url: string): boolean => {
    return z.string().url().safeParse(url).success;
  },

  // Validar UUID
  isValidUUID: (uuid: string): boolean => {
    return z.string().uuid().safeParse(uuid).success;
  },

  // Validar preço
  isValidPrice: (price: number): boolean => {
    return price >= VALIDATION.MIN_PRICE && price <= VALIDATION.MAX_PRICE;
  },

  // Validar desconto
  isValidDiscount: (discount: number): boolean => {
    return discount >= 0 && discount <= VALIDATION.MAX_DISCOUNT;
  },
};

// ============================================================================
// FUNÇÕES DE SANITIZAÇÃO
// ============================================================================

export const sanitizers = {
  // Sanitizar string removendo caracteres especiais
  sanitizeString: (str: string): string => {
    return str.trim().replace(/[<>]/g, "");
  },

  // Sanitizar telefone (remover caracteres especiais)
  sanitizePhone: (phone: string): string => {
    return phone.replace(/\D/g, "");
  },

  // Sanitizar CEP
  sanitizeZipCode: (zipCode: string): string => {
    return zipCode.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
  },

  // Sanitizar CPF
  sanitizeCPF: (cpf: string): string => {
    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },

  // Sanitizar CNPJ
  sanitizeCNPJ: (cnpj: string): string => {
    return cnpj
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  },

  // Sanitizar preço
  sanitizePrice: (price: string): number => {
    return parseFloat(price.replace(/[^\d,.-]/g, "").replace(",", "."));
  },
};

export default {
  schemas: {
    auth: authSchemas,
    product: productSchemas,
    category: categorySchemas,
    profile: profileSchemas,
    contact: contactSchemas,
    newsletter: newsletterSchemas,
    shipping: shippingSchemas,
  },
  validators,
  sanitizers,
};
