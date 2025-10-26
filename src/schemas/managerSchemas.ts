import { z } from 'zod';

// Schema para listar usuários com filtros
export const listUsersSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  search: z.string().optional(),
  department: z.string().optional(),
  isActive: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  role: z.enum(['manager', 'employee']).optional(),
});

// Schema para atualizar usuário
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  salary: z.number().positive().optional(),
  workSchedule: z.string().optional(),
  employmentType: z.string().optional(),
  directSupervisor: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.string().optional(),
  pix: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  education: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(['manager', 'employee']).optional(),
});

// Schema para criar usuário (gestor pode criar funcionários)
export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  address: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  hireDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  salary: z.number().positive().optional(),
  workSchedule: z.string().optional(),
  employmentType: z.string().optional(),
  directSupervisor: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankAgency: z.string().optional(),
  bankAccountType: z.string().optional(),
  pix: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  education: z.string().optional(),
  notes: z.string().optional(),
  role: z.enum(['manager', 'employee']).default('employee'),
});

// Schema para lançamento manual de ponto
export const manualTimeLogSchema = z.object({
  userId: z.number().positive(),
  checkIn: z.string().transform(val => new Date(val)),
  checkOut: z.string().optional().transform(val => val ? new Date(val) : undefined),
  reason: z.string().min(10),
  checkInLocation: z.string().optional(),
  checkOutLocation: z.string().optional(),
});

// Schema para aprovar/rejeitar lançamentos manuais
export const approveTimeLogSchema = z.object({
  timeLogId: z.number().positive(),
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().optional(),
});

// Schema para relatórios de pontos
export const timeLogReportSchema = z.object({
  userId: z.number().positive().optional(),
  department: z.string().optional(),
  startDate: z.string().transform(val => new Date(val)),
  endDate: z.string().transform(val => new Date(val)),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 50),
});

// Schema para alterar senha de usuário
export const changeUserPasswordSchema = z.object({
  userId: z.number().positive(),
  newPassword: z.string().min(6),
});