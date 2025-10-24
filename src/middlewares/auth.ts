import type { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwtService.js';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';

/**
 * Extend Express Request to include user property
 */
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

/**
 * Middleware to check if a user is authenticated via JWT
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = JwtService.verifyAccessToken(token);

        // Get user from database
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: payload.userId } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
