import { Router } from 'express';
import { login, logout } from '../controllers/authController';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../validators/authValidators';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);

export default router;
