import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { registerSchema } from '../schemas/registerSchema.js';
import { managerRegisterSchema } from '../schemas/managerRegisterSchema.js';
import { employeeRegisterSchema } from '../schemas/employeeRegisterSchema.js';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas/passwordResetSchema.js';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema.js';
import { updateProfileSchema } from '../schemas/updateProfileSchema.js';
import { UserController } from '../controllers/UserController.js';
import { ManagerController } from '../controllers/ManagerController.js';
import { upload } from '../config/multer.js';

const router = Router();

router.post('/login', validate(loginSchema), UserController.login);

// Generic user registration
router.post('/register', validate(registerSchema), UserController.register);

// Manager registration (creates company and manager)
router.post('/register-manager', validate(managerRegisterSchema), ManagerController.registerManager);

// Employee registration (requires invitation code)
router.post('/register-employee', validate(employeeRegisterSchema), UserController.registerEmployee);

router.post('/refresh-token', validate(refreshTokenSchema), UserController.refreshToken);

router.post('/logout', isAuthenticated, UserController.logout);

router.get('/profile', isAuthenticated, UserController.getProfile);

router.put('/profile', isAuthenticated, validate(updateProfileSchema), UserController.updateProfile);

router.get('/profile-photo', isAuthenticated, UserController.getProfilePhoto);

router.post('/forgot-password', validate(forgotPasswordSchema), UserController.forgotPassword);

router.post('/reset-password', validate(resetPasswordSchema), UserController.resetPassword);

router.post('/upload-photo', isAuthenticated, upload.single('photo'), UserController.uploadPhoto);

export default router;
