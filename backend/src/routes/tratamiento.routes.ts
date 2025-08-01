import { Router } from 'express';
import {
  crearTratamiento,
  listarTratamientos,
  actualizarTratamiento,
  eliminarTratamiento
} from '../controllers/tratamiento.controller';

import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listarTratamientos);
router.post('/', verifyToken, crearTratamiento);
router.put('/:id', verifyToken, actualizarTratamiento);
router.delete('/:id', verifyToken, eliminarTratamiento);

export default router;
