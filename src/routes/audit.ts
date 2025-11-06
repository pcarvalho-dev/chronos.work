import { Router } from 'express';
import { AuditController } from '../controllers/AuditController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { canViewAudit, canManageAuditConfig } from '../middlewares/audit.js';
import { validate } from '../middlewares/validate.js';
import { getHistoryQuerySchema, updateAuditConfigSchema } from '../schemas/auditSchemas.js';

const router = Router();

// Todas as rotas requerem autenticação
router.use(isAuthenticated);

/**
 * GET /audit/history
 * Busca histórico de movimentações
 * Requer: manager, hr ou admin
 */
router.get(
    '/history',
    canViewAudit,
    validate(getHistoryQuerySchema, 'query'),
    AuditController.getHistory
);

/**
 * GET /audit/configuration
 * Busca configuração de auditoria da empresa
 * Requer: manager ou admin
 */
router.get(
    '/configuration',
    canManageAuditConfig,
    AuditController.getConfiguration
);

/**
 * PUT /audit/configuration
 * Atualiza configuração de auditoria da empresa
 * Requer: manager ou admin
 */
router.put(
    '/configuration',
    canManageAuditConfig,
    validate(updateAuditConfigSchema),
    AuditController.updateConfiguration
);

/**
 * GET /audit/available-fields
 * Lista todos os campos disponíveis para rastreamento
 * Requer: manager ou admin
 */
router.get(
    '/available-fields',
    canManageAuditConfig,
    AuditController.getAvailableFields
);

export default router;
