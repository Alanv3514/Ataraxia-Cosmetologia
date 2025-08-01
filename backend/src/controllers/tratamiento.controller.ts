import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// POST /api/tratamientos
export const crearTratamiento = async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    const tratamiento = await prisma.tratamiento.create({
      data: { nombre, descripcion, precio: parseFloat(precio) }
    });
    res.status(201).json(tratamiento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tratamiento' });
  }
};

// GET /api/tratamientos
export const listarTratamientos = async (_req: Request, res: Response) => {
  const lista = await prisma.tratamiento.findMany();
  res.json(lista);
};

// PUT /api/tratamientos/:id
export const actualizarTratamiento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;

  try {
    const actualizado = await prisma.tratamiento.update({
      where: { id },
      data: { nombre, descripcion, precio: parseFloat(precio) }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(404).json({ error: 'Tratamiento no encontrado' });
  }
};

// DELETE /api/tratamientos/:id
export const eliminarTratamiento = async (req: Request, res: Response) => {
  try {
    const eliminado = await prisma.tratamiento.delete({ where: { id: req.params.id } });
    res.json(eliminado);
  } catch {
    res.status(404).json({ error: 'Tratamiento no encontrado' });
  }
};
