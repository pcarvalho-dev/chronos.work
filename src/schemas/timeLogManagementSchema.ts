import { z } from 'zod';

// Schema for creating manual time log entry
export const createManualTimeLogSchema = z.object({
  userId: z.number().int('ID do usuário inválido'),
  checkIn: z.string().datetime('Data e hora de check-in inválida'),
  checkOut: z.string().datetime('Data e hora de check-out inválida').optional(),
  reason: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
  checkInLocation: z.string().optional(),
  checkOutLocation: z.string().optional(),
});

// Schema for approving or rejecting time log
export const approveOrRejectTimeLogSchema = z.object({
  timeLogId: z.number().int('ID do registro de ponto inválido'),
  approved: z.boolean(),
  rejectionReason: z.string().min(10, 'Motivo da rejeição deve ter no mínimo 10 caracteres').optional(),
});
