import { z } from 'zod';

export const turnoSchema = z.object({
  cliente_id: z.string().uuid(),
  tratamiento_id: z.string().uuid(),
  fecha_turno: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "Fecha inválida"
  })
});
