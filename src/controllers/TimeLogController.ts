import type { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { UserCheckIn } from '../models/UserCheckIn.js';
import { User } from '../models/User.js';
import { IsNull } from 'typeorm';

export class TimeLogController {
    /**
     * Handle user check-in
     */
    static async checkIn(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const userRepository = AppDataSource.getRepository(User);

            const user = await userRepository.findOne({ where: { id: (req.user as User).id } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user already has an active check-in
            const activeCheckIn = await timeLogRepository.findOne({
                where: { user: { id: user.id }, checkOut: IsNull() },
            });

            if (activeCheckIn) {
                return res.status(400).json({ message: 'User already checked in' });
            }

            const checkIn = timeLogRepository.create({
                user,
                checkIn: new Date(),
            });

            await timeLogRepository.save(checkIn);

            res.status(201).json({ message: 'Checked in successfully', checkIn });
        } catch (error) {
            console.error('Error in checkIn:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle user check-out
     */
    static async checkOut(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const userRepository = AppDataSource.getRepository(User);

            const user = await userRepository.findOne({ where: { id: (req.user as User).id } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const timeLog = await timeLogRepository.findOne({
                where: { user: { id: user.id }, checkOut: IsNull() },
            });

            if (!timeLog) {
                return res.status(400).json({ message: 'User not checked in' });
            }

            timeLog.checkOut = new Date();

            await timeLogRepository.save(timeLog);

            res.json({ message: 'Checked out successfully', timeLog });
        } catch (error) {
            console.error('Error in checkOut:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all time logs for the authenticated user
     */
    static async getTimeLogs(req: Request, res: Response) {
        console.log('[TimeLogController.getTimeLogs] Method called');
        console.log('[TimeLogController.getTimeLogs] User:', req.user);
        console.log('[TimeLogController.getTimeLogs] Is Authenticated:', req.isAuthenticated());

        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const user = req.user as User;

            console.log('[TimeLogController.getTimeLogs] User after cast:', user);

            if (!user) {
                console.log('[TimeLogController.getTimeLogs] User is undefined/null');
                return res.status(401).json({ message: 'User not authenticated' });
            }

            console.log('[TimeLogController.getTimeLogs] Querying database for user ID:', user.id);

            const timeLogs = await timeLogRepository.createQueryBuilder('checkIn')
                .where('checkIn.userId = :userId', { userId: user.id })
                .orderBy('checkIn.checkIn', 'DESC')
                .getMany();

            console.log('[TimeLogController.getTimeLogs] Found', timeLogs.length, 'time logs for user', user.id);
            res.json(timeLogs);
        } catch (error) {
            console.error('[TimeLogController.getTimeLogs] Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
