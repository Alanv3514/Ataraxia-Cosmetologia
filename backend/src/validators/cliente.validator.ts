import { z } from 'zod';

export const clienteSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().min(7).max(15),
  email: z.string().email(),
  telefono: z.string().min(6)
});
