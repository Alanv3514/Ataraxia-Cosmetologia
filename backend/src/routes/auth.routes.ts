import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateBody(loginSchema), loginAdmin);

export default router;
