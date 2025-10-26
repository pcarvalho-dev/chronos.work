import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';
import emailService from '../services/emailService.js';
import { JwtService } from '../services/jwtService.js';

export class UserController {
    /**
     * Handle user login
     */
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate tokens
            const { accessToken, refreshToken } = JwtService.generateTokens(user.id, user.email);

            // Save refresh token to database
            user.refreshToken = refreshToken;
            await userRepository.save(user);

            // Remove sensitive data from response
            const { password: _, refreshToken: __, ...userResponse } = user as any;

            res.json({
                message: 'Logged in successfully',
                user: userResponse,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handle user registration
     */
    static async register(req: Request, res: Response) {
        const { password, ...userData } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const existingUser = await userRepository.findOne({ where: { email: userData.email } });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // ... (processedData fica igual)
            const processedData: any = { ...userData };
            if (processedData.birthDate) {
                processedData.birthDate = new Date(processedData.birthDate);
            }
            if (processedData.hireDate) {
                processedData.hireDate = new Date(processedData.hireDate);
            }

            const newUser = await userRepository.save({
                ...processedData,
                password: hashedPassword,
            });

            const { accessToken, refreshToken } = JwtService.generateTokens(newUser.id, newUser.email);

            newUser.refreshToken = refreshToken;
            await userRepository.save(newUser);

            emailService.sendWelcomeEmail(newUser.email, newUser.name).catch(err => {
                console.error('Error sending welcome email:', err);
            });

            const { password: _, refreshToken: __, ...userResponse } = newUser as any;

            res.status(201).json({
                message: 'User created successfully',
                user: userResponse,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Refresh access token using refresh token
     */
    static async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        try {
            // Verify refresh token
            const payload = JwtService.verifyRefreshToken(refreshToken);

            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: payload.userId } });

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            // Generate new tokens
            const tokens = JwtService.generateTokens(user.id, user.email);

            // Update refresh token in database
            user.refreshToken = tokens.refreshToken;
            await userRepository.save(user);

            res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
    }

    /**
     * Logout user by invalidating refresh token
     */
    static async logout(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userRepository = AppDataSource.getRepository(User);

            // Clear refresh token
            user.refreshToken = null as any;
            await userRepository.save(user);

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get authenticated user profile
     */
    static async getProfile(req: Request, res: Response) {
        try {
            const user = req.user as User;

            // Remove sensitive data from response
            const { password: _, refreshToken: __, ...userProfile } = user as any;

            res.json({
                user: userProfile
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update authenticated user profile
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const userRepository = AppDataSource.getRepository(User);
            const updateData = req.body;

            // If email is being updated, check if it's already in use by another user
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await userRepository.findOne({
                    where: { email: updateData.email }
                });

                if (existingUser) {
                    return res.status(400).json({ message: 'Email já está em uso' });
                }
            }

            // Process date fields if present
            if (updateData.birthDate) {
                updateData.birthDate = new Date(updateData.birthDate);
            }
            if (updateData.hireDate) {
                updateData.hireDate = new Date(updateData.hireDate);
            }

            // Update user fields
            Object.assign(user, updateData);

            // Save updated user
            await userRepository.save(user);

            // Remove sensitive data from response
            const { password: _, refreshToken: __, ...userProfile } = user as any;

            res.json({
                message: 'Perfil atualizado com sucesso',
                user: userProfile
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get authenticated user profile photo
     */
    static async getProfilePhoto(req: Request, res: Response) {
        try {
            const user = req.user as User;

            if (!user.profilePhoto) {
                return res.status(404).json({
                    message: 'Foto de perfil não encontrada',
                    profilePhoto: null
                });
            }

            res.json({
                profilePhoto: user.profilePhoto
            });
        } catch (error) {
            console.error('Get profile photo error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Upload profile photo
     */
    static async uploadPhoto(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Nenhum arquivo foi enviado' });
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = req.user as User;

            // With Cloudinary, req.file.path contains the full Cloudinary URL
            user.profilePhoto = (req.file as any).path;
            await userRepository.save(user);

            res.json({
                message: 'Foto de perfil atualizada com sucesso',
                profilePhoto: user.profilePhoto
            });
        } catch (error) {
            console.error('Upload photo error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Request password reset
     */
    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                // Don't reveal if user exists or not for security
                return res.json({ message: 'Se o email existir, um link de recuperação será enviado' });
            }

            // Generate reset token
            const resetToken = uuidv4();
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

            await userRepository.save(user);

            // Send reset email
            await emailService.sendPasswordResetEmail(user.email, user.name, resetToken);

            res.json({ message: 'Se o email existir, um link de recuperação será enviado' });
        } catch (error) {
            console.error('Forgot password error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Reset password with token
     */
    static async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { resetPasswordToken: token }
            });

            if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
                return res.status(400).json({ message: 'Token inválido ou expirado' });
            }

            // Update password
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = null as any;
            user.resetPasswordExpires = null as any;

            await userRepository.save(user);

            res.json({ message: 'Senha redefinida com sucesso' });
        } catch (error) {
            console.error('Reset password error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
