import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { registrarAdmin, listarAdmins } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';



const router = Router();

router.post('/login', validateBody(loginSchema), loginAdmin);
router.post('/register', validateBody(loginSchema), registrarAdmin);
router.get('/admins', verifyToken, listarAdmins);

export default router;
