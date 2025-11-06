import type { Request, Response, NextFunction } from 'express';
import type { User } from '../models/User.js';

/**
 * Middleware to check if user can view audit logs
 * Only managers, HR, and admins can view audit logs
 */
export const canViewAudit = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = req.user as User;
    const allowedRoles: Array<User['role']> = ['manager', 'hr', 'admin'];

    if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
            message: 'Acesso negado. Apenas gestores, RH e administradores podem acessar o histórico de alterações.'
        });
    }

    next();
};

/**
 * Middleware to check if user can manage audit configuration
 * Only managers and admins can manage audit configuration
 */
export const canManageAuditConfig = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = req.user as User;
    const allowedRoles: Array<User['role']> = ['manager', 'admin'];

    if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
            message: 'Acesso negado. Apenas gestores e administradores podem configurar a auditoria.'
        });
    }

    next();
};
