import type { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { UserCheckIn } from '../models/UserCheckIn.js';
import { User } from '../models/User.js';
import { IsNull } from 'typeorm';
import { LocationService } from '../services/locationService.js';

export class TimeLogController {
    /**
     * Handle user check-in
     */
    static async checkIn(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Photo is required for check-in' });
            }

            const { latitude, longitude } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Latitude and longitude are required' });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (!LocationService.isValidCoordinates(lat, lon)) {
                return res.status(400).json({ message: 'Invalid coordinates' });
            }

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

            // Fetch address from coordinates
            const location = await LocationService.getAddressFromCoordinates(lat, lon);

            // With Cloudinary, req.file.path contains the full Cloudinary URL
            const checkInPhoto = (req.file as any).path;

            const checkIn = timeLogRepository.create({
                user,
                checkIn: new Date(),
                checkInPhoto,
                latitude: lat,
                longitude: lon,
                checkInLocation: location,
            });

            await timeLogRepository.save(checkIn);

            res.status(201).json({ message: 'Checked in successfully', timeLog: checkIn });
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
            if (!req.file) {
                return res.status(400).json({ message: 'Photo is required for check-out' });
            }

            const { latitude, longitude } = req.body;

            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Latitude and longitude are required' });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (!LocationService.isValidCoordinates(lat, lon)) {
                return res.status(400).json({ message: 'Invalid coordinates' });
            }

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

            // Fetch address from coordinates
            const location = await LocationService.getAddressFromCoordinates(lat, lon);

            timeLog.checkOut = new Date();
            // With Cloudinary, req.file.path contains the full Cloudinary URL
            timeLog.checkOutPhoto = (req.file as any).path;
            timeLog.outLatitude = lat;
            timeLog.outLongitude = lon;
            timeLog.checkOutLocation = location;

            await timeLogRepository.save(timeLog);

            res.json({ message: 'Checked out successfully', timeLog });
        } catch (error) {
            console.error('Error in checkOut:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all time logs for the authenticated user
     * Returns all fields including photos, coordinates, and location addresses
     * Supports optional date filtering via query parameters:
     * - startDate: filter logs from this date (inclusive, format: YYYY-MM-DD)
     * - endDate: filter logs until this date (inclusive, format: YYYY-MM-DD)
     */
    static async getTimeLogs(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const user = req.user as User;

            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            const { startDate, endDate } = req.query;

            // Build query
            const queryBuilder = timeLogRepository.createQueryBuilder('checkIn')
                .where('checkIn.userId = :userId', { userId: user.id });

            // Add date filters if provided
            if (startDate) {
                const start = new Date(startDate as string);
                start.setHours(0, 0, 0, 0); // Start of day
                queryBuilder.andWhere('checkIn.checkIn >= :startDate', { startDate: start });
            }

            if (endDate) {
                const end = new Date(endDate as string);
                end.setHours(23, 59, 59, 999); // End of day
                queryBuilder.andWhere('checkIn.checkIn <= :endDate', { endDate: end });
            }

            // Returns all fields including location data (latitude, longitude, addresses)
            const timeLogs = await queryBuilder
                .orderBy('checkIn.checkIn', 'DESC')
                .getMany();

            res.json(timeLogs);
        } catch (error) {
            console.error('Error in getTimeLogs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle manual check-in entry (retroactive)
     */
    static async manualCheckIn(req: Request, res: Response) {
        try {
            const { checkIn, reason, checkInLocation, latitude, longitude } = req.body;
            const user = req.user as User;
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);

            // Check if user has an active check-in
            const activeCheckIn = await timeLogRepository.findOne({
                where: { user: { id: user.id }, checkOut: IsNull() },
            });

            if (activeCheckIn) {
                return res.status(400).json({ message: 'Você já possui um check-in ativo. Faça o check-out primeiro.' });
            }

            // Create manual check-in entry
            const manualCheckIn = timeLogRepository.create({
                user,
                checkIn: new Date(checkIn),
                checkInLocation,
                latitude,
                longitude,
                isManual: true,
                reason,
                status: 'pending_approval',
            });

            await timeLogRepository.save(manualCheckIn);

            res.status(201).json({
                message: 'Lançamento manual de check-in criado. Aguardando aprovação.',
                checkIn: manualCheckIn
            });
        } catch (error) {
            console.error('Error in manualCheckIn:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle manual check-out entry (retroactive)
     */
    static async manualCheckOut(req: Request, res: Response) {
        try {
            const { timeLogId, checkOut, reason, checkOutLocation, outLatitude, outLongitude } = req.body;
            const user = req.user as User;
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);

            // Find the time log entry
            const timeLog = await timeLogRepository.findOne({
                where: { id: timeLogId, user: { id: user.id } },
            });

            if (!timeLog) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }

            if (timeLog.checkOut) {
                return res.status(400).json({ message: 'Este registro já possui check-out' });
            }

            // Update with manual check-out
            timeLog.checkOut = new Date(checkOut);
            timeLog.checkOutLocation = checkOutLocation;
            timeLog.outLatitude = outLatitude;
            timeLog.outLongitude = outLongitude;
            timeLog.isManual = true;
            timeLog.reason = reason;
            timeLog.status = 'pending_approval';

            await timeLogRepository.save(timeLog);

            res.json({
                message: 'Lançamento manual de check-out criado. Aguardando aprovação.',
                timeLog
            });
        } catch (error) {
            console.error('Error in manualCheckOut:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Approve a manual time log entry (manager only)
     */
    static async approveTimeLog(req: Request, res: Response) {
        try {
            const { timeLogId } = req.body;
            const approver = req.user as User;
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);

            const timeLog = await timeLogRepository.findOne({
                where: { id: timeLogId },
                relations: ['user'],
            });

            if (!timeLog) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }

            if (!timeLog.isManual) {
                return res.status(400).json({ message: 'Este registro não é um lançamento manual' });
            }

            if (timeLog.status !== 'pending_approval') {
                return res.status(400).json({ message: 'Este registro já foi processado' });
            }

            timeLog.status = 'approved';
            timeLog.approver = approver;
            timeLog.approvalDate = new Date();

            await timeLogRepository.save(timeLog);

            res.json({
                message: 'Lançamento manual aprovado com sucesso',
                timeLog
            });
        } catch (error) {
            console.error('Error in approveTimeLog:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Reject a manual time log entry (manager only)
     */
    static async rejectTimeLog(req: Request, res: Response) {
        try {
            const { timeLogId, rejectionReason } = req.body;
            const approver = req.user as User;
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);

            const timeLog = await timeLogRepository.findOne({
                where: { id: timeLogId },
                relations: ['user'],
            });

            if (!timeLog) {
                return res.status(404).json({ message: 'Registro de ponto não encontrado' });
            }

            if (!timeLog.isManual) {
                return res.status(400).json({ message: 'Este registro não é um lançamento manual' });
            }

            if (timeLog.status !== 'pending_approval') {
                return res.status(400).json({ message: 'Este registro já foi processado' });
            }

            timeLog.status = 'rejected';
            timeLog.approver = approver;
            timeLog.approvalDate = new Date();
            timeLog.rejectionReason = rejectionReason;

            await timeLogRepository.save(timeLog);

            res.json({
                message: 'Lançamento manual rejeitado',
                timeLog
            });
        } catch (error) {
            console.error('Error in rejectTimeLog:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all pending manual time log entries (manager only)
     */
    static async getPendingTimeLogs(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);

            const pendingTimeLogs = await timeLogRepository.find({
                where: { status: 'pending_approval', isManual: true },
                relations: ['user'],
                order: { checkIn: 'DESC' },
            });

            res.json(pendingTimeLogs);
        } catch (error) {
            console.error('Error in getPendingTimeLogs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
