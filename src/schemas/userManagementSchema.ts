import { z } from 'zod';

// Schema for creating a new user (by manager)
export const createUserSchema = z.object({
  // Basic information (required)
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  role: z.enum(['employee', 'manager', 'hr', 'admin']).default('employee'),

  // Personal information (optional)
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.string().date()).optional(),
  gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional(),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),

  // Address (optional)
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().default('Brasil').optional(),

  // Professional information (optional)
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().datetime().or(z.string().date()).optional(),
  salary: z.number().positive('Salário deve ser positivo').optional(),
  workSchedule: z.string().optional(),
  employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional(),
  directSupervisor: z.string().optional(),

  // Banking information (optional)
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional(),
  pix: z.string().optional(),

  // Emergency contact (optional)
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),

  // Additional information (optional)
  education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional(),
  notes: z.string().optional(),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  // Basic information
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(['employee', 'manager', 'hr', 'admin']).optional(),

  // Personal information
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.string().date()).optional(),
  gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional(),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),

  // Address
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().optional(),

  // Professional information
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().datetime().or(z.string().date()).optional(),
  salary: z.number().positive('Salário deve ser positivo').optional(),
  workSchedule: z.string().optional(),
  employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional(),
  directSupervisor: z.string().optional(),

  // Banking information
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional(),
  pix: z.string().optional(),

  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),

  // Additional information
  education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Schema for changing user password
export const changeUserPasswordSchema = z.object({
  userId: z.number().int('ID do usuário inválido'),
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});
