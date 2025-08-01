import { Router } from 'express';
import { crearCliente } from '../controllers/cliente.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { clienteSchema } from '../validators/cliente.validator';

const router = Router();

router.post('/', validateBody(clienteSchema), crearCliente);

export default router;
