import type { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  
  if (!user) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }
  
  if (user.role !== 'manager') {
    return res.status(403).json({ message: 'Acesso negado. Apenas gestores podem acessar esta funcionalidade.' });
  }
  
  next();
};