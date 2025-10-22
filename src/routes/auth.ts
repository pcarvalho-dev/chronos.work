import { Router } from 'express';
import passport from 'passport';
import { validate } from '../middlewares/validate.js';
import { loginSchema } from '../schemas/loginSchema.js';
import { registerSchema } from '../schemas/registerSchema.js';
import { UserController } from '../controllers/UserController.js';

const router = Router();

router.post('/login', validate(loginSchema), passport.authenticate('local'), UserController.login);

router.post('/register', validate(registerSchema), UserController.register);

export default router;
