import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// POST /api/auth/login
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });

    const valido = await bcrypt.compare(password, admin.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET!, {
      expiresIn: '6h',
    });

    return res.json({ token, admin: { id: admin.id, nombre: admin.nombre } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
// POST /api/auth/register
export const registrarAdmin = async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body;

  try {
    const existe = await prisma.admin.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ error: 'Ya existe un admin con ese email' });

    const hash = await bcrypt.hash(password, 10);

    const nuevo = await prisma.admin.create({
      data: { nombre, email, password: hash }
    });

    return res.status(201).json({ id: nuevo.id, email: nuevo.email, nombre: nuevo.nombre });
  } catch (error) {
    console.error('Error registrando admin:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
};

// GET /api/auth/admins
export const listarAdmins = async (_req: Request, res: Response) => {
  const admins = await prisma.admin.findMany({
    select: { id: true, nombre: true, email: true, creado_en: true }
  });
  res.json(admins);
};