import { z } from 'zod';

// Schema para lançamento manual de check-in
export const manualCheckInSchema = z.object({
  checkIn: z.string().datetime('Data e hora de check-in inválida'),
  reason: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
  checkInLocation: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Schema para lançamento manual de check-out
export const manualCheckOutSchema = z.object({
  timeLogId: z.number().int('ID do registro de ponto inválido'),
  checkOut: z.string().datetime('Data e hora de check-out inválida'),
  reason: z.string().min(10, 'Motivo deve ter no mínimo 10 caracteres'),
  checkOutLocation: z.string().optional(),
  outLatitude: z.number().min(-90).max(90).optional(),
  outLongitude: z.number().min(-180).max(180).optional(),
});

// Schema para aprovação de lançamento manual
export const approveTimeLogSchema = z.object({
  timeLogId: z.number().int('ID do registro de ponto inválido'),
});

// Schema para rejeição de lançamento manual
export const rejectTimeLogSchema = z.object({
  timeLogId: z.number().int('ID do registro de ponto inválido'),
  rejectionReason: z.string().min(10, 'Motivo da rejeição deve ter no mínimo 10 caracteres'),
});
