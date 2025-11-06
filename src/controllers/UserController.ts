import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';
import { Invitation } from '../models/Invitation.js';
import emailService from '../services/emailService.js';
import { JwtService } from '../services/jwtService.js';
import { trackUserChanges } from '../services/auditService.js';

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
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            // Check if user is active and approved
            if (!user.isActive) {
                return res.status(403).json({ message: 'Conta desativada' });
            }

            if (user.role === 'employee' && !user.isApproved) {
                return res.status(403).json({ message: 'Conta aguardando aprovação do gestor' });
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
     * Handle employee registration with invitation code
     */
    static async registerEmployee(req: Request, res: Response) {
        const { invitationCode, password, ...userData } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const invitationRepository = AppDataSource.getRepository(Invitation);

            // Check if user already exists
            const existingUser = await userRepository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário com este email já existe' });
            }

            // Validate invitation code
            const invitation = await invitationRepository.findOne({
                where: { 
                    code: invitationCode,
                    isActive: true,
                    isUsed: false
                },
                relations: ['company']
            });

            if (!invitation) {
                return res.status(400).json({ message: 'Código de convite inválido ou expirado' });
            }

            // Check if invitation is expired
            if (invitation.expiresAt && invitation.expiresAt < new Date()) {
                return res.status(400).json({ message: 'Código de convite expirado' });
            }

            // Check if invitation email matches
            if (invitation.email !== userData.email) {
                return res.status(400).json({ message: 'Email não corresponde ao convite' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Process date fields
            const processedData: any = { ...userData };
            if (processedData.birthDate) {
                processedData.birthDate = new Date(processedData.birthDate);
            }
            if (processedData.hireDate) {
                processedData.hireDate = new Date(processedData.hireDate);
            }

            // Start transaction
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // Create employee user
                const newEmployee = queryRunner.manager.create(User, {
                    ...processedData,
                    password: hashedPassword,
                    role: 'employee',
                    companyId: invitation.companyId,
                    invitationId: invitation.id,
                    invitationCode: invitationCode,
                    isActive: false, // Needs approval
                    isApproved: false,
                });

                const savedEmployee = await queryRunner.manager.save(User, newEmployee);

                // Mark invitation as used
                invitation.isUsed = true;
                invitation.usedAt = new Date();
                invitation.usedById = savedEmployee.id;
                await queryRunner.manager.save(Invitation, invitation);

                // Commit transaction
                await queryRunner.commitTransaction();

                // Send registration confirmation email
                emailService.sendRegistrationConfirmationEmail(savedEmployee.email, savedEmployee.name).catch(err => {
                    console.error('Error sending registration confirmation email:', err);
                });

                // Remove sensitive data from response
                const { password: _, refreshToken: __, ...userResponse } = savedEmployee as any;

                res.status(201).json({
                    message: 'Cadastro realizado com sucesso. Aguarde aprovação do gestor.',
                    user: userResponse,
                    requiresApproval: true
                });

            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }

        } catch (error) {
            console.error('Employee registration error:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
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
            // Verify refresh token JWT signature and expiration
            const payload = JwtService.verifyRefreshToken(refreshToken);

            // Get user from database
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: payload.userId } });

            if (!user) {
                console.error('Refresh token error: User not found for userId:', payload.userId);
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }

            // Check if the refresh token matches the one stored in database
            if (user.refreshToken !== refreshToken) {
                console.error('Refresh token error: Token mismatch for user:', user.email);
                console.error('Stored token:', user.refreshToken ? 'exists' : 'null');
                console.error('Provided token:', refreshToken ? 'exists' : 'null');
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }

            // Check if user is active and approved
            if (!user.isActive) {
                return res.status(403).json({ message: 'Conta desativada' });
            }

            if (user.role === 'employee' && !user.isApproved) {
                return res.status(403).json({ message: 'Conta aguardando aprovação do gestor' });
            }

            // Generate new tokens
            const tokens = JwtService.generateTokens(user.id, user.email);

            // Update refresh token in database (token rotation)
            user.refreshToken = tokens.refreshToken;
            await userRepository.save(user);

            res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            });
        } catch (error) {
            console.error('Refresh token error:', error);
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
            }
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
            const { justification, ...updateData } = req.body;

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

            // Create a copy of the old user data for audit tracking
            const oldUserData = { ...user };

            // Track changes before saving (audit trail)
            await trackUserChanges(
                user.id,
                oldUserData,
                updateData,
                user.id, // User is updating their own profile
                req.ip,
                req.get('user-agent'),
                justification
            );

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
