import { z } from 'zod';

export const managerRegisterSchema = z.object({
  // Dados do gestor
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  
  // Dados da empresa
  company: z.object({
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
  }),
  
  // Informações pessoais do gestor (opcionais)
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.string().date()).optional(),
  gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional(),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  
  // Endereço do gestor (opcional)
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().default('Brasil').optional(),
  
  // Informações bancárias (opcionais)
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional(),
  pix: z.string().optional(),
  
  // Informações de emergência (opcionais)
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  
  // Informações adicionais (opcionais)
  education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional(),
  notes: z.string().optional(),
});