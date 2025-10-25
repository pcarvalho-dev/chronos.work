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
     */
    static async getTimeLogs(req: Request, res: Response) {
        try {
            const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
            const user = req.user as User;

            if (!user) {
                return res.status(401).json({ message: 'User not authenticated' });
            }

            // Returns all fields including location data (latitude, longitude, addresses)
            const timeLogs = await timeLogRepository.createQueryBuilder('checkIn')
                .where('checkIn.userId = :userId', { userId: user.id })
                .orderBy('checkIn.checkIn', 'DESC')
                .getMany();

            res.json(timeLogs);
        } catch (error) {
            console.error('Error in getTimeLogs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
