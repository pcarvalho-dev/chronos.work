import { z } from 'zod';

export const employeeRegisterSchema = z.object({
  // Código de convite obrigatório
  invitationCode: z.string().min(1, 'Código de convite é obrigatório'),
  
  // Dados básicos do funcionário
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  
  // Informações pessoais (opcionais)
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos').optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().or(z.string().date()).optional(),
  gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional(),
  maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  
  // Endereço (opcional)
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional(),
  country: z.string().default('Brasil').optional(),
  
  // Informações profissionais (opcionais)
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().datetime().or(z.string().date()).optional(),
  salary: z.number().positive('Salário deve ser positivo').optional(),
  workSchedule: z.string().optional(),
  employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional(),
  directSupervisor: z.string().optional(),
  
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