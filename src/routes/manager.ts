import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { isAuthenticated, isManager } from '../middlewares/auth.js';
import { createInvitationSchema, updateInvitationSchema, invitationCodeSchema } from '../schemas/invitationSchema.js';
import { approveEmployeeSchema, employeeApprovalListSchema } from '../schemas/approvalSchema.js';
import { createCompanySchema, updateCompanySchema } from '../schemas/companySchema.js';
import { createUserSchema, updateUserSchema, changeUserPasswordSchema } from '../schemas/userManagementSchema.js';
import { createManualTimeLogSchema, approveOrRejectTimeLogSchema } from '../schemas/timeLogManagementSchema.js';
import { ManagerController } from '../controllers/ManagerController.js';

const router = Router();

// All routes require authentication and manager role
router.use(isAuthenticated);
router.use(isManager);

// Company management
router.get('/company', ManagerController.getCompany);
router.put('/company', validate(updateCompanySchema), ManagerController.updateCompany);

// Invitation management
router.post('/invitations', validate(createInvitationSchema), ManagerController.createInvitation);
router.get('/invitations', ManagerController.getInvitations);
router.delete('/invitations/:invitationId', ManagerController.cancelInvitation);

// Employee management (legacy routes)
router.get('/employees', ManagerController.getEmployees);
router.get('/employees/pending', ManagerController.getPendingApprovals);
router.post('/employees/approve', validate(approveEmployeeSchema), ManagerController.approveEmployee);

// User management (new routes)
router.get('/users', ManagerController.getUsers);
router.get('/users/:id', ManagerController.getUserById);
router.post('/users', validate(createUserSchema), ManagerController.createUser);
router.put('/users/:id', validate(updateUserSchema), ManagerController.updateUser);
router.patch('/users/:id/toggle-status', ManagerController.toggleUserStatus);
router.delete('/users/:id', ManagerController.deleteUser);
router.post('/users/change-password', validate(changeUserPasswordSchema), ManagerController.changeUserPassword);
router.get('/users/:userId/time-logs', ManagerController.getUserTimeLogs);

// Time log management
router.post('/time-logs/manual', validate(createManualTimeLogSchema), ManagerController.createManualTimeLog);
router.post('/time-logs/approve', validate(approveOrRejectTimeLogSchema), ManagerController.approveOrRejectTimeLog);
router.get('/time-logs/pending', ManagerController.getManagerPendingTimeLogs);
router.get('/time-logs/report', ManagerController.getTimeLogReport);

export default router;