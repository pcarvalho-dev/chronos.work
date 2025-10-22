import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';

export class UserController {
    /**
     * Handle user login
     * This method is called after passport authentication succeeds
     */
    static async login(req: Request, res: Response) {
        res.json({ message: 'Logged in successfully', user: req.user });
    }

    /**
     * Handle user registration
     */
    static async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({ where: { email } });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = userRepository.create({
                name,
                email,
                password: hashedPassword,
            });

            await userRepository.save(user);

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
