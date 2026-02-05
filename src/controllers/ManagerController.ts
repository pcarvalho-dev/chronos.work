import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { Invitation } from '../models/Invitation.js';
import { JwtService } from '../services/jwtService.js';
import emailService from '../services/emailService.js';
import { trackUserChanges } from '../services/auditService.js';
import { logger } from '../utils/logger.js';

export class ManagerController {
    /**
     * Register manager and create company
     */
    static async registerManager(req: Request, res: Response) {
        const { company, ...managerData } = req.body;

        try {
            const userRepository = AppDataSource.getRepository(User);
            const companyRepository = AppDataSource.getRepository(Company);

            // Check if email already exists
            const existingUser = await userRepository.findOne({ where: { email: managerData.email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email já está em uso' });
            }

            // Check if CNPJ already exists
            const existingCompany = await companyRepository.findOne({ where: { cnpj: company.cnpj } });
            if (existingCompany) {
                return res.status(400).json({ message: 'CNPJ já está em uso' });
            }

            // Start transaction
            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // Create company
                const newCompany = queryRunner.manager.create(Company, company);
                const savedCompany = await queryRunner.manager.save(Company, newCompany);

                // Hash password
                const hashedPassword = await bcrypt.hash(managerData.password, 10);

                // Process date fields
                const processedData: any = { ...managerData };
                if (processedData.birthDate) {
                    processedData.birthDate = new Date(processedData.birthDate);
                }

                // Create manager user
                const newManager = queryRunner.manager.create(User, {
                    ...processedData,
                    password: hashedPassword,
                    role: 'manager',
                    companyId: savedCompany.id,
                    isActive: true,
                    isApproved: true, // Manager is auto-approved
                });

                const savedManager = await queryRunner.manager.save(User, newManager);

                // Generate tokens
                const { accessToken, refreshToken } = JwtService.generateTokens(savedManager.id, savedManager.email);

                // Save refresh token
                savedManager.refreshToken = refreshToken;
                await queryRunner.manager.save(User, savedManager);

                // Commit transaction
                await queryRunner.commitTransaction();

                // Send welcome email
                emailService.sendWelcomeEmail(savedManager.email, savedManager.name).catch(err => {
                    logger.error('Failed to send welcome email after manager registration', err as Error, {
                        userId: savedManager.id,
                        companyId: savedCompany.id,
                        email: savedManager.email,
                        action: 'registerManager'
                    });
                });

                // Remove sensitive data from response
                const { password: _, refreshToken: __, ...managerResponse } = savedManager as any;

                res.status(201).json({
                    message: 'Gestor e empresa criados com sucesso',
                    user: managerResponse,
                    company: savedCompany,
                    accessToken,
                    refreshToken
                });

            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            } finally {
                await queryRunner.release();
            }

        } catch (error) {
            logger.error('Manager registration failed', error as Error, {
                email: managerData.email,
                companyName: company.name,
                cnpj: company.cnpj,
                action: 'registerManager'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Create invitation for employee
     */
    static async createInvitation(req: Request, res: Response) {
        const { email, name, position, department, expiresAt } = req.body;
        const manager = req.user as User;

        try {
            const invitationRepository = AppDataSource.getRepository(Invitation);
            const userRepository = AppDataSource.getRepository(User);

            // Check if user already exists
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário com este email já existe' });
            }

            // Check if invitation already exists and is active
            const existingInvitation = await invitationRepository.findOne({
                where: { email, isActive: true, isUsed: false }
            });
            if (existingInvitation) {
                return res.status(400).json({ message: 'Convite já existe para este email' });
            }

            // Generate unique code
            const code = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();

            // Create invitation
            const invitation = invitationRepository.create({
                code,
                email,
                name,
                position,
                department,
                companyId: manager.companyId!,
                createdById: manager.id,
                expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
            });

            const savedInvitation = await invitationRepository.save(invitation);

            // Send invitation email
            emailService.sendInvitationEmail(email, name || 'Funcionário', code, manager.name).catch(err => {
                logger.error('Failed to send invitation email', err as Error, {
                    userId: manager.id,
                    companyId: manager.companyId,
                    invitationCode: code,
                    recipientEmail: email,
                    action: 'createInvitation'
                });
            });

            res.status(201).json({
                message: 'Convite criado com sucesso',
                invitation: {
                    id: savedInvitation.id,
                    code: savedInvitation.code,
                    email: savedInvitation.email,
                    name: savedInvitation.name,
                    position: savedInvitation.position,
                    department: savedInvitation.department,
                    expiresAt: savedInvitation.expiresAt,
                }
            });

        } catch (error) {
            logger.error('Failed to create employee invitation', error as Error, {
                userId: (req.user as any)?.id,
                companyId: (req.user as any)?.companyId,
                recipientEmail: email,
                action: 'createInvitation'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Get all invitations for manager's company
     */
    static async getInvitations(req: Request, res: Response) {
        const manager = req.user as User;
        const { page = 1, limit = 10, status } = req.query;

        try {
            const invitationRepository = AppDataSource.getRepository(Invitation);
            
            const queryBuilder = invitationRepository
                .createQueryBuilder('invitation')
                .where('invitation.companyId = :companyId', { companyId: manager.companyId })
                .orderBy('invitation.createdAt', 'DESC');

            // Filter by status
            if (status === 'used') {
                queryBuilder.andWhere('invitation.isUsed = true');
            } else if (status === 'active') {
                queryBuilder.andWhere('invitation.isUsed = false AND invitation.isActive = true');
            } else if (status === 'expired') {
                queryBuilder.andWhere('invitation.isUsed = false AND invitation.expiresAt < :now', { now: new Date() });
            }

            const [invitations, total] = await queryBuilder
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getManyAndCount();

            res.json({
                invitations,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Failed to fetch company invitations', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                filters: { status, page, limit },
                action: 'getInvitations'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Cancel invitation
     */
    static async cancelInvitation(req: Request, res: Response) {
        const { invitationId } = req.params;
        const manager = req.user as User;

        try {
            const invitationRepository = AppDataSource.getRepository(Invitation);

            const invitation = await invitationRepository.findOne({
                where: { id: Number(invitationId), companyId: manager.companyId! }
            });

            if (!invitation) {
                return res.status(404).json({ message: 'Convite não encontrado' });
            }

            if (invitation.isUsed) {
                return res.status(400).json({ message: 'Convite já foi utilizado' });
            }

            invitation.isActive = false;
            await invitationRepository.save(invitation);

            res.json({ message: 'Convite cancelado com sucesso' });

        } catch (error) {
            logger.error('Failed to cancel employee invitation', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                invitationId,
                action: 'cancelInvitation'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Get pending employee approvals
     */
    static async getPendingApprovals(req: Request, res: Response) {
        const manager = req.user as User;
        const { page = 1, limit = 10, search } = req.query;

        try {
            const userRepository = AppDataSource.getRepository(User);
            
            const queryBuilder = userRepository
                .createQueryBuilder('user')
                .where('user.companyId = :companyId', { companyId: manager.companyId })
                .andWhere('user.role = :role', { role: 'employee' })
                .andWhere('user.isApproved = false')
                .orderBy('user.createdAt', 'DESC');

            if (search) {
                queryBuilder.andWhere(
                    '(user.name ILIKE :search OR user.email ILIKE :search)',
                    { search: `%${search}%` }
                );
            }

            const [employees, total] = await queryBuilder
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getManyAndCount();

            // Remove sensitive data
            const employeesResponse = employees.map(emp => {
                const { password, refreshToken, ...employee } = emp as any;
                return employee;
            });

            res.json({
                employees: employeesResponse,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Failed to fetch pending employee approvals', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                filters: { search, page, limit },
                action: 'getPendingApprovals'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Approve or reject employee
     */
    static async approveEmployee(req: Request, res: Response) {
        const { userId, approved, notes } = req.body;
        const manager = req.user as User;

        try {
            const userRepository = AppDataSource.getRepository(User);

            const employee = await userRepository.findOne({
                where: {
                    id: userId,
                    companyId: manager.companyId!,
                    role: 'employee'
                }
            });

            if (!employee) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }

            // Create a copy of the old employee data for audit tracking
            const oldEmployeeData = { ...employee };

            // Prepare update data
            const updateData: Partial<User> = {
                isApproved: approved,
                isActive: approved // Auto-activate if approved
            };

            if (notes) {
                updateData.notes = notes;
            }

            // Track changes (audit trail)
            await trackUserChanges(
                employee.id,
                oldEmployeeData,
                updateData,
                manager.id,
                req.ip,
                req.get('user-agent'),
                approved ? 'Aprovação de cadastro' : 'Rejeição de cadastro'
            );

            // Apply changes
            employee.isApproved = approved;
            employee.isActive = approved;

            if (notes) {
                employee.notes = notes;
            }

            await userRepository.save(employee);

            // Send approval/rejection email
            if (approved) {
                emailService.sendApprovalEmail(employee.email, employee.name).catch(err => {
                    logger.error('Failed to send employee approval email', err as Error, {
                        userId: manager.id,
                        companyId: manager.companyId,
                        employeeId: employeeId,
                        employeeEmail: employee.email,
                        action: 'approveEmployee'
                    });
                });
            } else {
                emailService.sendRejectionEmail(employee.email, employee.name, notes).catch(err => {
                    logger.error('Failed to send employee rejection email', err as Error, {
                        userId: manager.id,
                        companyId: manager.companyId,
                        employeeId: employeeId,
                        employeeEmail: employee.email,
                        action: 'rejectEmployee'
                    });
                });
            }

            res.json({ 
                message: approved ? 'Funcionário aprovado com sucesso' : 'Funcionário rejeitado',
                employee: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    isApproved: employee.isApproved,
                    isActive: employee.isActive
                }
            });

        } catch (error) {
            logger.error('Failed to approve/reject employee', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                employeeId: employeeId,
                approved: approved,
                action: 'approveEmployee'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Get all employees
     */
    static async getEmployees(req: Request, res: Response) {
        const manager = req.user as User;
        const { page = 1, limit = 10, status, search } = req.query;

        try {
            const userRepository = AppDataSource.getRepository(User);
            
            const queryBuilder = userRepository
                .createQueryBuilder('user')
                .where('user.companyId = :companyId', { companyId: manager.companyId })
                .andWhere('user.role = :role', { role: 'employee' })
                .orderBy('user.createdAt', 'DESC');

            // Filter by status
            if (status === 'approved') {
                queryBuilder.andWhere('user.isApproved = true');
            } else if (status === 'pending') {
                queryBuilder.andWhere('user.isApproved = false');
            } else if (status === 'active') {
                queryBuilder.andWhere('user.isActive = true');
            } else if (status === 'inactive') {
                queryBuilder.andWhere('user.isActive = false');
            }

            if (search) {
                queryBuilder.andWhere(
                    '(user.name ILIKE :search OR user.email ILIKE :search)',
                    { search: `%${search}%` }
                );
            }

            const [employees, total] = await queryBuilder
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getManyAndCount();

            // Remove sensitive data
            const employeesResponse = employees.map(emp => {
                const { password, refreshToken, ...employee } = emp as any;
                return employee;
            });

            res.json({
                employees: employeesResponse,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Failed to fetch company employees', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                filters: { status, search, page, limit },
                action: 'getEmployees'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Get company information
     */
    static async getCompany(req: Request, res: Response) {
        const manager = req.user as User;

        try {
            const companyRepository = AppDataSource.getRepository(Company);
            
            const company = await companyRepository.findOne({
                where: { id: manager.companyId! }
            });

            if (!company) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }

            res.json({ company });

        } catch (error) {
            logger.error('Failed to fetch company information', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                action: 'getCompany'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Update company information
     */
    static async updateCompany(req: Request, res: Response) {
        const updateData = req.body;
        const manager = req.user as User;

        try {
            const companyRepository = AppDataSource.getRepository(Company);
            
            const company = await companyRepository.findOne({
                where: { id: manager.companyId! }
            });

            if (!company) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }

            // Check if CNPJ is being updated and if it's already in use
            if (updateData.cnpj && updateData.cnpj !== company.cnpj) {
                const existingCompany = await companyRepository.findOne({
                    where: { cnpj: updateData.cnpj }
                });

                if (existingCompany) {
                    return res.status(400).json({ message: 'CNPJ já está em uso' });
                }
            }

            Object.assign(company, updateData);
            await companyRepository.save(company);

            res.json({
                message: 'Empresa atualizada com sucesso',
                company
            });

        } catch (error) {
            logger.error('Failed to update company information', error as Error, {
                userId: manager.id,
                companyId: manager.companyId,
                updateData: Object.keys(updateData),
                action: 'updateCompany'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}