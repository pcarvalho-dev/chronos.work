import { z } from 'zod';

export const createInvitationSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  expiresAt: z.string().datetime().or(z.string().date()).optional(),
});

export const updateInvitationSchema = createInvitationSchema.partial();

export const invitationCodeSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
});