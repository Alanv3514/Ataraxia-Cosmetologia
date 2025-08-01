import { Router } from 'express';
import { listarFechasOcupadas, listarTurnosConfirmados, listarTurnosPendientes, solicitarTurno } from '../controllers/turno.controller';
import { validateBody } from '../middlewares/validate.middleware';
import { turnoSchema } from '../validators/turno.validator';
import { confirmarTurno } from '../controllers/turno.controller';
import { verifyToken } from '../middlewares/auth.middleware';


const router = Router();

router.post('/', validateBody(turnoSchema), solicitarTurno);

router.post('/confirmar/:turno_id', verifyToken, confirmarTurno);

router.get('/confirmados', verifyToken, listarTurnosConfirmados);
router.get('/pendientes', verifyToken, listarTurnosPendientes);
router.get('/ocupados', verifyToken, listarFechasOcupadas);

export default router;
