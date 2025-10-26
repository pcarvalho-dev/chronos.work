import { z } from 'zod';

export const approveEmployeeSchema = z.object({
  userId: z.number().int().positive('ID do usuário deve ser um número positivo'),
  approved: z.boolean(),
  notes: z.string().optional(),
});

export const employeeApprovalListSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  search: z.string().optional(),
});