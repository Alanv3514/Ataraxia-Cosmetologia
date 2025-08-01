import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// POST /api/clientes
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, dni, email, telefono } = req.body;

    const existe = await prisma.cliente.findUnique({ where: { dni } });
    if (existe) return res.status(400).json({ error: 'Cliente ya existe con ese DNI' });

    const nuevo = await prisma.cliente.create({
      data: { nombre, apellido, dni, email, telefono },
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error creando cliente:', error);
    return res.status(500).json({ error: 'Error interno al crear cliente' });
  }
};
