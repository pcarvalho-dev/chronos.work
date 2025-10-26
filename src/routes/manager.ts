import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { isAuthenticated, isManager } from '../middlewares/auth.js';
import { createInvitationSchema, updateInvitationSchema, invitationCodeSchema } from '../schemas/invitationSchema.js';
import { approveEmployeeSchema, employeeApprovalListSchema } from '../schemas/approvalSchema.js';
import { createCompanySchema, updateCompanySchema } from '../schemas/companySchema.js';
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

// Employee management
router.get('/employees', ManagerController.getEmployees);
router.get('/employees/pending', ManagerController.getPendingApprovals);
router.post('/employees/approve', validate(approveEmployeeSchema), ManagerController.approveEmployee);

export default router;