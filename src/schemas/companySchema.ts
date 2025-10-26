import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2, 'Nome da empresa deve ter no mínimo 2 caracteres'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos'),
  corporateName: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  website: z.string().url('Website deve ser uma URL válida').optional(),
  
  // Endereço da empresa
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().default('Brasil').optional(),
  
  description: z.string().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();