import { z } from 'zod';

/**
 * Schema para buscar histórico de movimentações
 */
export const getHistoryQuerySchema = z.object({
    userId: z.string().regex(/^\d+$/).transform(Number).optional(),
    fieldName: z.string().optional(),
    changedById: z.string().regex(/^\d+$/).transform(Number).optional(),
    dateFrom: z.string().date().optional(),
    dateTo: z.string().date().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10')
});

/**
 * Schema para parâmetro de userId na rota
 */
export const userIdParamSchema = z.object({
    userId: z.string().regex(/^\d+$/).transform(Number)
});

/**
 * Schema para atualizar configuração de auditoria
 */
export const updateAuditConfigSchema = z.object({
    trackedFields: z.array(z.string()).min(1),
    requireJustification: z.boolean(),
    isEnabled: z.boolean()
});

/**
 * Schema para adicionar justificativa em alterações de usuário
 */
export const updateProfileWithJustificationSchema = z.object({
    justification: z.string().optional()
});
