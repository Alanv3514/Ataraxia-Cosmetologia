import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import redis from '../config/redis';
import { v4 as uuidv4 } from 'uuid';

// POST /api/turnos
export const solicitarTurno = async (req: Request, res: Response) => {
  try {
    const {
      cliente_id,
      tratamiento_id,
      fecha_turno,
    }: { cliente_id: string; tratamiento_id: string; fecha_turno: string } = req.body;

    const turno_id = uuidv4();

    const tratamiento = await prisma.tratamiento.findUnique({ where: { id: tratamiento_id } });
    const cliente = await prisma.cliente.findUnique({ where: { id: cliente_id } });

    if (!cliente || !tratamiento) {
      return res.status(404).json({ error: 'Cliente o tratamiento no encontrado' });
    }

    // Preparar objeto y mensaje
    const turnoPendiente = {
      id: turno_id,
      cliente_id,
      tratamiento_id,
      fecha_turno,
      estado: 'pendiente',
      mensaje_enviado: false,
      creado_en: new Date().toISOString()
    };

    const mensaje = `📅 *Nuevo turno solicitado*
👤 Cliente: ${cliente.nombre} ${cliente.apellido}
🆔 DNI: ${cliente.dni}
📧 Email: ${cliente.email}
📱 Tel: ${cliente.telefono}
💅 Tratamiento: ${tratamiento.nombre}
📆 Fecha: ${new Date(fecha_turno).toLocaleString()}
💰 Seña requerida: ${tratamiento.precio / 2} ARS

*Esperando confirmación humana y comprobante de seña...*`;

    // Guardar en Redis con TTL de 1h
    await redis.setex(`turno:${turno_id}`, 3600, JSON.stringify(turnoPendiente));

    // (Opcional) Aquí podrías enviar el mensaje vía API de WhatsApp
    // await enviarPorWhatsApp(mensaje);

    return res.status(200).json({
      ok: true,
      mensaje_generado: mensaje,
      turno_id,
    });
  } catch (error) {
    console.error('Error solicitando turno:', error);
    return res.status(500).json({ error: 'Error al solicitar turno' });
  }
};

// POST /api/turnos/confirmar/:turno_id
export const confirmarTurno = async (req: Request, res: Response) => {
    const { turno_id } = req.params;
    const { comprobante_senia } = req.body;
    const admin_id = req.user?.id;
  
    if (!comprobante_senia || !turno_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
  
    try {
      const turnoTemp = await redis.get(`turno:${turno_id}`);
  
      if (!turnoTemp) {
        return res.status(404).json({ error: 'Turno temporal no encontrado o expirado' });
      }
  
      const parsed = JSON.parse(turnoTemp);
  
      // Evitar doble reserva para la misma fecha
      const turnoExistente = await prisma.turno.findFirst({
        where: {
          fecha_turno: new Date(parsed.fecha_turno),
          estado: 'confirmado',
        },
      });
  
      if (turnoExistente) {
        return res.status(409).json({ error: 'Fecha ya ocupada por otro turno confirmado' });
      }
  
      const turnoConfirmado = await prisma.turno.create({
        data: {
          cliente_id: parsed.cliente_id,
          tratamiento_id: parsed.tratamiento_id,
          fecha_turno: new Date(parsed.fecha_turno),
          estado: 'confirmado',
          comprobante_senia,
          mensaje_enviado: true,
          confirmado_por_id: admin_id,
        },
      });
  
      // Borrar de Redis
      await redis.del(`turno:${turno_id}`);
  
      return res.status(201).json({
        ok: true,
        turno: turnoConfirmado,
      });
    } catch (error) {
      console.error('Error al confirmar turno:', error);
      return res.status(500).json({ error: 'Error interno al confirmar turno' });
    }
  };