import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserController } from '../../src/controllers/UserController.js';
import { AppDataSource } from '../../src/database/data-source.js';
import { User } from '../../src/models/User.js';
import { Invitation } from '../../src/models/Invitation.js';
import { JwtService } from '../../src/services/jwtService.js';
import { createMockRequest, createMockResponse, createMockRepository, createMockUser, createMockInvitation } from '../setup/mocks';
import { createLoginData, createMockCompany } from '../setup/fixtures';
import { IsNull } from 'typeorm';

describe('UserController', () => {
    let mockReq: Request;
    let mockRes: Response;
    let mockUserRepository: any;
    let mockInvitationRepository: any;
    let mockManager: User;
    let mockEmployee: User;
    let mockInvitation: Invitation;

    beforeEach(() => {
        // Reset all mocks
        vi.resetAllMocks();

        // Setup mock repositories
        mockUserRepository = createMockRepository<User>();
        mockInvitationRepository = createMockRepository<Invitation>();

        // Setup mock database
        vi.mocked(AppDataSource.getRepository).mockImplementation((entity: any) => {
            if (entity === User) return mockUserRepository;
            if (entity === Invitation) return mockInvitationRepository;
            return createMockRepository();
        });

        // Setup mock JWT service
        vi.spyOn(JwtService, 'generateTokens').mockReturnValue({
            accessToken: 'mock-access-token',
            refreshToken: 'mock-refresh-token',
        });
        vi.spyOn(JwtService, 'verifyAccessToken').mockReturnValue({ userId: 1, email: 'test@test.com' });

        // Setup mock users
        mockManager = createMockUser({
            id: 1,
            role: 'manager',
            isApproved: true,
            isActive: true,
            companyId: 1,
        });

        mockEmployee = createMockUser({
            id: 2,
            role: 'employee',
            isApproved: true,
            isActive: true,
            companyId: 1,
        });

        mockInvitation = createMockInvitation({
            id: 1,
            code: 'ABCD1234',
            email: 'newuser@test.com',
            companyId: 1,
            isActive: true,
            isUsed: false,
        });

        // Setup mock request/response
        mockReq = createMockRequest();
        mockRes = createMockResponse();
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const loginData = createLoginData();
            const hashedPassword = await bcrypt.hash(loginData.password, 10);

            mockUser = {
                ...createMockUser(),
                id: 1,
                email: loginData.email,
                password: hashedPassword,
                isActive: true,
                isApproved: true,
                refreshToken: null,
            };

            mockReq.body = loginData;
            mockUserRepository.findOne.mockResolvedValue(mockUser as any);
            mockUserRepository.save.mockResolvedValue({ ...mockUser, refreshToken: 'mock-refresh-token' } as any);

            await UserController.login(mockReq, mockRes);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: loginData.email }
            });
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Logged in successfully',
                user: expect.objectContaining({
                    id: 1,
                    email: loginData.email,
                }),
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            });
        });

        it('should return 401 with invalid credentials', async () => {
            const loginData = createLoginData();
            const hashedPassword = await bcrypt.hash('wrongpassword', 10);

            mockUser = {
                ...createMockUser(),
                email: loginData.email,
                password: hashedPassword,
            };

            mockReq.body = loginData;
            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            await UserController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Credenciais inválidas'
            });
        });

        it('should return 403 for inactive account', async () => {
            const loginData = createLoginData();
            const hashedPassword = await bcrypt.hash(loginData.password, 10);

            mockUser = {
                ...createMockUser(),
                email: loginData.email,
                password: hashedPassword,
                isActive: false,
            };

            mockReq.body = loginData;
            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            await UserController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Conta desativada'
            });
        });

        it('should return 403 for unapproved employee account', async () => {
            const loginData = createLoginData();
            const hashedPassword = await bcrypt.hash(loginData.password, 10);

            mockUser = {
                ...createMockUser(),
                email: loginData.email,
                password: hashedPassword,
                isActive: true,
                role: 'employee',
                isApproved: false,
            };

            mockReq.body = loginData;
            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            await UserController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Conta aguardando aprovação do gestor'
            });
        });
    });

    describe('registerEmployee', () => {
        it('should register employee successfully with valid invitation', async () => {
            const registerData = {
                ...createMockInvitation(),
                password: 'Password123!',
                name: 'John Doe',
            };

            mockReq.body = registerData;
            mockUserRepository.findOne.mockResolvedValue(null); // No existing user
            mockInvitationRepository.findOne.mockResolvedValue(mockInvitation as any);
            
            const queryRunner = {
                connect: vi.fn().mockResolvedValue(undefined),
                startTransaction: vi.fn().mockResolvedValue(undefined),
                commitTransaction: vi.fn().mockResolvedValue(undefined),
                rollbackTransaction: vi.fn().mockResolvedValue(undefined),
                release: vi.fn().mockResolvedValue(undefined),
                manager: {
                    create: vi.fn().mockReturnValue(registerData),
                    save: vi.fn().mockResolvedValue({ id: 2, ...registerData } as any),
                },
            };

            vi.mocked(AppDataSource.createQueryRunner).mockReturnValue(queryRunner);
            mockUserRepository.save.mockResolvedValue({ id: 2, ...registerData } as any);
            mockInvitationRepository.save.mockResolvedValue({ ...mockInvitation, isUsed: true } as any);

            await UserController.registerEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Cadastro realizado com sucesso. Aguarde aprovação do gestor.',
                user: expect.objectContaining({ id: 2 }),
                requiresApproval: true,
            });
        });

        it('should return 400 if email already exists', async () => {
            const registerData = {
                ...createMockInvitation(),
                password: 'Password123!',
            };

            mockReq.body = registerData;
            mockUserRepository.findOne.mockResolvedValue(mockEmployee as any); // User exists

            await UserController.registerEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Usuário com este email já existe'
            });
        });

        it('should return 400 if invitation is invalid', async () => {
            const registerData = {
                invitationCode: 'INVALID123',
                password: 'Password123!',
            };

            mockReq.body = registerData;
            mockUserRepository.findOne.mockResolvedValue(null);
            mockInvitationRepository.findOne.mockResolvedValue(null); // Invalid invitation

            await UserController.registerEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Código de convite inválido ou expirado'
            });
        });

        it('should return 400 if invitation is expired', async () => {
            const registerData = {
                ...createMockInvitation(),
                password: 'Password123!',
            };

            mockReq.body = registerData;
            mockUserRepository.findOne.mockResolvedValue(null);
            mockInvitationRepository.findOne.mockResolvedValue({
                ...mockInvitation,
                expiresAt: new Date('2023-01-01'), // Expired
            } as any);

            await UserController.registerEmployee(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Código de convite expirado'
            });
        });
    });

    describe('getProfile', () => {
        beforeEach(() => {
            mockReq.user = mockManager;
        });

        it('should return user profile successfully', async () => {
            mockRes = createMockResponse();

            await UserController.getProfile(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                user: expect.objectContaining({
                    id: mockManager.id,
                    email: mockManager.email,
                }),
            });
        });
    });

    describe('updateProfile', () => {
        beforeEach(() => {
            mockReq.user = mockEmployee;
            mockReq.body = {
                name: 'Updated Name',
                phone: '11999999999',
                justification: 'Updating contact info',
            };
        });

        it('should update profile successfully', async () => {
            const updatedUser = {
                ...mockEmployee,
                name: 'Updated Name',
                phone: '11999999999',
            };

            mockUserRepository.save.mockResolvedValue(updatedUser as any);
            vi.spyOn(require('../../src/services/auditService'), 'trackUserChanges').mockResolvedValue(undefined);
            mockRes = createMockResponse();

            await UserController.updateProfile(mockReq, mockRes);

            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Perfil atualizado com sucesso',
                user: expect.objectContaining({
                    name: 'Updated Name',
                    phone: '11999999999',
                }),
            });
        });

        it('should return 400 if email is already in use by another user', async () => {
            mockReq.body = {
                email: 'anotheruser@test.com',
            };

            const anotherUser = createMockUser({
                id: 3,
                email: 'anotheruser@test.com',
            });

            mockUserRepository.findOne.mockResolvedValue(anotherUser as any);
            mockRes = createMockResponse();

            await UserController.updateProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Email já está em uso'
            });
        });
    });

    describe('logout', () => {
        beforeEach(() => {
            mockReq.user = mockManager;
        });

        it('should logout successfully and clear refresh token', async () => {
            mockUserRepository.save.mockResolvedValue({ ...mockManager, refreshToken: null } as any);
            mockRes = createMockResponse();

            await UserController.logout(mockReq, mockRes);

            expect(mockUserRepository.save).toHaveBeenCalledWith({
                ...mockManager,
                refreshToken: null,
            });
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Logged out successfully'
            });
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            const tokenData = {
                refreshToken: 'old-refresh-token',
            };

            mockReq.body = tokenData;
            vi.spyOn(JwtService, 'verifyRefreshToken').mockReturnValue({ userId: 1 });

            mockUserRepository.findOne.mockResolvedValue(mockManager as any);
            mockManager.refreshToken = 'old-refresh-token';
            mockUserRepository.save.mockResolvedValue({ ...mockManager, refreshToken: 'new-refresh-token' } as any);

            await UserController.refreshToken(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                accessToken: 'mock-access-token',
                refreshToken: 'new-refresh-token',
            });
        });

        it('should return 401 for invalid refresh token', async () => {
            const tokenData = {
                refreshToken: 'invalid-token',
            };

            mockReq.body = tokenData;
            vi.spyOn(JwtService, 'verifyRefreshToken').mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await UserController.refreshToken(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Invalid or expired refresh token'
            });
        });
    });

    describe('resetPassword', () => {
        it('should reset password successfully with valid token', async () => {
            const resetData = {
                token: 'valid-reset-token',
                newPassword: 'NewPassword123!',
            };

            mockReq.body = resetData;
            mockUserRepository.findOne.mockResolvedValue({
                ...mockManager,
                resetPasswordToken: 'valid-reset-token',
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
            } as any);

            const hashedPassword = await bcrypt.hash('NewPassword123!', 10);
            mockUserRepository.save.mockResolvedValue({
                ...mockManager,
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            } as any);

            await UserController.resetPassword(mockReq, mockRes);

            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Senha redefinida com sucesso'
            });
        });

        it('should return 400 for invalid reset token', async () => {
            const resetData = {
                token: 'invalid-token',
                newPassword: 'NewPassword123!',
            };

            mockReq.body = resetData;
            mockUserRepository.findOne.mockResolvedValue(null);

            await UserController.resetPassword(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Token inválido ou expirado'
            });
        });
    });

    describe('forgotPassword', () => {
        it('should send password reset email for valid user', async () => {
            const emailData = {
                email: 'test@test.com',
            };

            mockReq.body = emailData;
            mockUserRepository.findOne.mockResolvedValue(mockManager as any);
            mockUserRepository.save.mockResolvedValue(mockManager as any);
            
            vi.spyOn(require('../../src/services/emailService'), 'sendPasswordResetEmail').mockResolvedValue(undefined);

            await UserController.forgotPassword(mockReq, mockRes);

            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Se o email existir, um link de recuperação será enviado'
            });
        });

        it('should not reveal if user exists or not', async () => {
            const emailData = {
                email: 'nonexistent@test.com',
            };

            mockReq.body = emailData;
            mockUserRepository.findOne.mockResolvedValue(null);

            await UserController.forgotPassword(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Se o email existir, um link de recuperação será enviado'
            });
        });
    });
});
