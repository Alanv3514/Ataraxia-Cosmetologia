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
