import { z } from 'zod';

export const updateProfileSchema = z.object({
  // Informações básicas
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),

  // Informações pessoais
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.string().date()).optional(),
  gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional(),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),

  // Endereço
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().optional(),

  // Informações profissionais
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().datetime().or(z.string().date()).optional(),
  salary: z.number().positive('Salário deve ser positivo').optional(),
  workSchedule: z.string().optional(),
  employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional(),
  directSupervisor: z.string().optional(),

  // Informações bancárias
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional(),
  pix: z.string().optional(),

  // Informações de emergência
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),

  // Informações adicionais
  education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});
