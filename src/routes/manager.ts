import { Router } from 'express';
import { ManagerController } from '../controllers/ManagerController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { isManager } from '../middlewares/managerAuth.js';
import { validate } from '../middlewares/validate.js';
import {
  listUsersSchema,
  updateUserSchema,
  createUserSchema,
  manualTimeLogSchema,
  approveTimeLogSchema,
  timeLogReportSchema,
  changeUserPasswordSchema
} from '../schemas/managerSchemas.js';

const router = Router();

// Middleware de autenticação e autorização para todas as rotas
router.use(isAuthenticated, isManager);

// Rotas de gerenciamento de usuários
router.get('/users', validate(listUsersSchema, 'query'), ManagerController.listUsers);
router.get('/users/:id', ManagerController.getUserById);
router.post('/users', validate(createUserSchema), ManagerController.createUser);
router.put('/users/:id', validate(updateUserSchema), ManagerController.updateUser);
router.patch('/users/:id/toggle-status', ManagerController.toggleUserStatus);
router.delete('/users/:id', ManagerController.deleteUser);
router.post('/users/change-password', validate(changeUserPasswordSchema), ManagerController.changeUserPassword);

// Rotas de gerenciamento de pontos
router.get('/users/:userId/time-logs', ManagerController.getUserTimeLogs);
router.post('/time-logs/manual', validate(manualTimeLogSchema), ManagerController.createManualTimeLog);
router.post('/time-logs/approve', validate(approveTimeLogSchema), ManagerController.approveTimeLog);
router.get('/time-logs/pending', ManagerController.getPendingTimeLogs);
router.get('/time-logs/report', validate(timeLogReportSchema, 'query'), ManagerController.getTimeLogReport);

export default router;