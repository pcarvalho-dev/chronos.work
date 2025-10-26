import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { registerSchema } from '../schemas/registerSchema.js';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas/passwordResetSchema.js';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema.js';
import { updateProfileSchema } from '../schemas/updateProfileSchema.js';
import { UserController } from '../controllers/UserController.js';
import { upload } from '../config/multer.js';

const router = Router();

router.post('/login', validate(loginSchema), UserController.login);

router.post('/register', validate(registerSchema), UserController.register);

router.post('/refresh-token', validate(refreshTokenSchema), UserController.refreshToken);

router.post('/logout', isAuthenticated, UserController.logout);

router.get('/profile', isAuthenticated, UserController.getProfile);

router.put('/profile', isAuthenticated, validate(updateProfileSchema), UserController.updateProfile);

router.get('/profile-photo', isAuthenticated, UserController.getProfilePhoto);

router.post('/forgot-password', validate(forgotPasswordSchema), UserController.forgotPassword);

router.post('/reset-password', validate(resetPasswordSchema), UserController.resetPassword);

router.post('/upload-photo', isAuthenticated, upload.single('photo'), UserController.uploadPhoto);

export default router;
