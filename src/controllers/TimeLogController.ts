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
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all time logs for the authenticated user
     */
    static async getTimeLogs(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const user = req.user as User;

            const timeLogs = await timeLogRepository.find({
                where: { user: { id: user.id } },
                order: { checkIn: 'DESC' },
            });

            res.json(timeLogs);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
