import type { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { UserMovementHistory } from '../models/UserMovementHistory.js';
import { User } from '../models/User.js';
import { getOrCreateAuditConfiguration, getFieldDisplayName } from '../services/auditService.js';
import { AuditConfiguration } from '../models/AuditConfiguration.js';
import { logger } from '../utils/logger.js';

export class AuditController {
    /**
     * Busca o histórico de movimentações de um usuário
     * GET /audit/history/:userId
     */
    static async getHistory(req: Request, res: Response) {
        try {
            const currentUser = req.user as User;
            const { userId, fieldName, changedById, dateFrom, dateTo, page, limit } = req.query;

            // Construir query
            const historyRepo = AppDataSource.getRepository(UserMovementHistory);
            let queryBuilder = historyRepo
                .createQueryBuilder('history')
                .leftJoinAndSelect('history.user', 'user')
                .leftJoinAndSelect('history.changedBy', 'changedBy')
                .where('history.companyId = :companyId', { companyId: currentUser.companyId });

            // Aplicar filtros
            if (userId) {
                queryBuilder = queryBuilder.andWhere('history.userId = :userId', { userId });
            }

            if (fieldName) {
                queryBuilder = queryBuilder.andWhere('history.fieldName = :fieldName', { fieldName });
            }

            if (changedById) {
                queryBuilder = queryBuilder.andWhere('history.changedById = :changedById', { changedById });
            }

            if (dateFrom) {
                queryBuilder = queryBuilder.andWhere('history.createdAt >= :dateFrom', {
                    dateFrom: new Date(dateFrom as string)
                });
            }

            if (dateTo) {
                queryBuilder = queryBuilder.andWhere('history.createdAt <= :dateTo', {
                    dateTo: new Date(dateTo as string)
                });
            }

            // Paginação
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;

            queryBuilder = queryBuilder
                .orderBy('history.createdAt', 'DESC')
                .skip((pageNum - 1) * limitNum)
                .take(limitNum);

            const [results, total] = await queryBuilder.getManyAndCount();

            // Formatar resultados
            const formattedResults = results.map(history => ({
                id: history.id,
                user: {
                    id: history.user?.id,
                    name: history.user?.name,
                    email: history.user?.email
                },
                fieldName: history.fieldName,
                fieldDisplayName: getFieldDisplayName(history.fieldName),
                oldValue: history.oldValue ? JSON.parse(history.oldValue) : null,
                newValue: history.newValue ? JSON.parse(history.newValue) : null,
                diff: history.diff,
                changedBy: {
                    id: history.changedBy?.id,
                    name: history.changedBy?.name,
                    email: history.changedBy?.email
                },
                justification: history.justification,
                ipAddress: history.ipAddress,
                createdAt: history.createdAt
            }));

            res.json({
                data: formattedResults,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });
        } catch (error) {
            logger.error('Failed to fetch audit history', error as Error, {
                userId: req.query.userId as string,
                companyId: currentUser?.companyId,
                action: 'getHistory'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Busca a configuração de auditoria da empresa
     * GET /audit/configuration
     */
    static async getConfiguration(req: Request, res: Response) {
        try {
            const currentUser = req.user as User;

            if (!currentUser.companyId) {
                return res.status(400).json({ message: 'Usuário não possui empresa associada' });
            }

            const config = await getOrCreateAuditConfiguration(currentUser.companyId);

            res.json({
                trackedFields: config.trackedFields,
                requireJustification: config.requireJustification,
                isEnabled: config.isEnabled,
                updatedAt: config.updatedAt
            });
        } catch (error) {
            logger.error('Failed to fetch audit configuration', error as Error, {
                companyId: currentUser?.companyId,
                action: 'getConfiguration'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Atualiza a configuração de auditoria da empresa
     * PUT /audit/configuration
     */
    static async updateConfiguration(req: Request, res: Response) {
        try {
            const currentUser = req.user as User;
            const { trackedFields, requireJustification, isEnabled } = req.body;

            if (!currentUser.companyId) {
                return res.status(400).json({ message: 'Usuário não possui empresa associada' });
            }

            const configRepo = AppDataSource.getRepository(AuditConfiguration);
            let config = await configRepo.findOne({
                where: { companyId: currentUser.companyId }
            });

            if (!config) {
                // Criar nova configuração
                config = configRepo.create({
                    companyId: currentUser.companyId,
                    trackedFields,
                    requireJustification,
                    isEnabled
                });
            } else {
                // Atualizar configuração existente
                config.trackedFields = trackedFields;
                config.requireJustification = requireJustification;
                config.isEnabled = isEnabled;
            }

            await configRepo.save(config);

            res.json({
                message: 'Configuração de auditoria atualizada com sucesso',
                data: {
                    trackedFields: config.trackedFields,
                    requireJustification: config.requireJustification,
                    isEnabled: config.isEnabled,
                    updatedAt: config.updatedAt
                }
            });
        } catch (error) {
            logger.error('Failed to update audit configuration', error as Error, {
                companyId: currentUser?.companyId,
                action: 'updateConfiguration',
                metadata: req.body
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    /**
     * Lista todos os campos disponíveis para rastreamento
     * GET /audit/available-fields
     */
    static async getAvailableFields(req: Request, res: Response) {
        try {
            const allFields = [
                'name',
                'email',
                'cpf',
                'rg',
                'birthDate',
                'gender',
                'maritalStatus',
                'phone',
                'mobilePhone',
                'address',
                'addressNumber',
                'addressComplement',
                'neighborhood',
                'city',
                'state',
                'zipCode',
                'country',
                'employeeId',
                'department',
                'position',
                'hireDate',
                'salary',
                'workSchedule',
                'employmentType',
                'directSupervisor',
                'bankName',
                'bankAccount',
                'bankAgency',
                'bankAccountType',
                'pix',
                'emergencyContactName',
                'emergencyContactPhone',
                'emergencyContactRelationship',
                'education',
                'notes',
                'isActive',
                'isApproved',
                'role',
                'profilePhoto'
            ];

            const fields = allFields.map(field => ({
                value: field,
                label: getFieldDisplayName(field)
            }));

            res.json({ data: fields });
        } catch (error) {
            logger.error('Failed to fetch available audit fields', error as Error, {
                action: 'getAvailableFields'
            });
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}
