import type { Request, Response } from 'express';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../models/User.js';
import { UserCheckIn } from '../models/UserCheckIn.js';
import bcrypt from 'bcrypt';
import emailService from '../services/emailService.js';

export class ManagerController {
  // Listar todos os usuários com filtros
  static async listUsers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, department, isActive, role } = req.query;
      
      const userRepository = AppDataSource.getRepository(User);
      const queryBuilder = userRepository.createQueryBuilder('user');
      
      // Aplicar filtros
      if (search) {
        queryBuilder.andWhere(
          '(user.name ILIKE :search OR user.email ILIKE :search OR user.employeeId ILIKE :search)',
          { search: `%${search}%` }
        );
      }
      
      if (department) {
        queryBuilder.andWhere('user.department = :department', { department });
      }
      
      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive });
      }
      
      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }
      
      // Paginação
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));
      
      // Ordenação
      queryBuilder.orderBy('user.createdAt', 'DESC');
      
      const [users, total] = await queryBuilder.getManyAndCount();
      
      // Remover senhas dos usuários
      const usersWithoutPasswords = users.map(user => {
        const { password, refreshToken, resetPasswordToken, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        users: usersWithoutPasswords,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Obter detalhes de um usuário específico
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({
        where: { id: parseInt(id) }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Remover senha e tokens
      const { password, refreshToken, resetPasswordToken, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Criar novo usuário
  static async createUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
      // Verificar se email já existe
      const existingUser = await userRepository.findOne({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Criar usuário
      const newUser = userRepository.create({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await userRepository.save(newUser);
      
      // Remover senha da resposta
      const { password, refreshToken, resetPasswordToken, ...userWithoutPassword } = savedUser;
      
      // Enviar email de boas-vindas
      emailService.sendWelcomeEmail(userData.email, userData.name).catch(console.error);
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Atualizar usuário
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({
        where: { id: parseInt(id) }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se email já existe em outro usuário
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await userRepository.findOne({
          where: { email: updateData.email }
        });
        
        if (existingUser) {
          return res.status(400).json({ message: 'Email já está em uso por outro usuário' });
        }
      }
      
      // Atualizar usuário
      Object.assign(user, updateData);
      const updatedUser = await userRepository.save(user);
      
      // Remover senha da resposta
      const { password, refreshToken, resetPasswordToken, ...userWithoutPassword } = updatedUser;
      
      res.json({
        message: 'Usuário atualizado com sucesso',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Desativar/Ativar usuário
  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({
        where: { id: parseInt(id) }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      user.isActive = isActive;
      await userRepository.save(user);
      
      res.json({
        message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Deletar usuário
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({
        where: { id: parseInt(id) }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar se é o próprio gestor
      const currentUser = req.user as User;
      if (user.id === currentUser.id) {
        return res.status(400).json({ message: 'Você não pode deletar sua própria conta' });
      }
      
      await userRepository.remove(user);
      
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Alterar senha de usuário
  static async changeUserPassword(req: Request, res: Response) {
    try {
      const { userId, newPassword } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      
      const user = await userRepository.findOne({
        where: { id: userId }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await userRepository.save(user);
      
      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Listar pontos de um usuário
  static async getUserTimeLogs(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50, startDate, endDate } = req.query;
      
      const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
      const queryBuilder = timeLogRepository
        .createQueryBuilder('timeLog')
        .leftJoinAndSelect('timeLog.user', 'user')
        .leftJoinAndSelect('timeLog.approver', 'approver')
        .where('timeLog.user.id = :userId', { userId: parseInt(userId) });
      
      // Filtros de data
      if (startDate) {
        queryBuilder.andWhere('timeLog.checkIn >= :startDate', { startDate: new Date(startDate as string) });
      }
      
      if (endDate) {
        queryBuilder.andWhere('timeLog.checkIn <= :endDate', { endDate: new Date(endDate as string) });
      }
      
      // Paginação
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));
      
      // Ordenação
      queryBuilder.orderBy('timeLog.checkIn', 'DESC');
      
      const [timeLogs, total] = await queryBuilder.getManyAndCount();
      
      res.json({
        timeLogs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pontos do usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Lançar ponto manual
  static async createManualTimeLog(req: Request, res: Response) {
    try {
      const { userId, checkIn, checkOut, reason, checkInLocation, checkOutLocation } = req.body;
      const currentUser = req.user as User;
      
      const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
      const userRepository = AppDataSource.getRepository(User);
      
      // Verificar se usuário existe
      const user = await userRepository.findOne({
        where: { id: userId }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Criar lançamento manual
      const manualTimeLog = timeLogRepository.create({
        user: { id: userId } as User,
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : undefined,
        reason,
        checkInLocation,
        checkOutLocation,
        isManual: true,
        status: 'approved', // Gestor pode aprovar automaticamente
        approver: currentUser,
        approvalDate: new Date()
      });
      
      const savedTimeLog = await timeLogRepository.save(manualTimeLog);
      
      res.status(201).json({
        message: 'Ponto lançado com sucesso',
        timeLog: savedTimeLog
      });
    } catch (error) {
      console.error('Erro ao lançar ponto manual:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Aprovar/Rejeitar lançamentos manuais pendentes
  static async approveTimeLog(req: Request, res: Response) {
    try {
      const { timeLogId, action, rejectionReason } = req.body;
      const currentUser = req.user as User;
      
      const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
      
      const timeLog = await timeLogRepository.findOne({
        where: { id: timeLogId },
        relations: ['user']
      });
      
      if (!timeLog) {
        return res.status(404).json({ message: 'Lançamento não encontrado' });
      }
      
      if (action === 'approve') {
        timeLog.status = 'approved';
        timeLog.approver = currentUser;
        timeLog.approvalDate = new Date();
        timeLog.rejectionReason = undefined;
      } else if (action === 'reject') {
        timeLog.status = 'rejected';
        timeLog.approver = currentUser;
        timeLog.approvalDate = new Date();
        timeLog.rejectionReason = rejectionReason;
      }
      
      await timeLogRepository.save(timeLog);
      
      res.json({
        message: `Lançamento ${action === 'approve' ? 'aprovado' : 'rejeitado'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao aprovar/rejeitar lançamento:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Relatório de pontos
  static async getTimeLogReport(req: Request, res: Response) {
    try {
      const { userId, department, startDate, endDate, page = 1, limit = 50 } = req.query;
      
      const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
      const queryBuilder = timeLogRepository
        .createQueryBuilder('timeLog')
        .leftJoinAndSelect('timeLog.user', 'user')
        .leftJoinAndSelect('timeLog.approver', 'approver');
      
      // Filtros
      if (userId) {
        queryBuilder.andWhere('timeLog.user.id = :userId', { userId: parseInt(userId as string) });
      }
      
      if (department) {
        queryBuilder.andWhere('user.department = :department', { department });
      }
      
      if (startDate) {
        queryBuilder.andWhere('timeLog.checkIn >= :startDate', { startDate: new Date(startDate as string) });
      }
      
      if (endDate) {
        queryBuilder.andWhere('timeLog.checkIn <= :endDate', { endDate: new Date(endDate as string) });
      }
      
      // Paginação
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));
      
      // Ordenação
      queryBuilder.orderBy('timeLog.checkIn', 'DESC');
      
      const [timeLogs, total] = await queryBuilder.getManyAndCount();
      
      // Calcular estatísticas
      const stats = {
        totalTimeLogs: total,
        approvedTimeLogs: timeLogs.filter(tl => tl.status === 'approved').length,
        pendingTimeLogs: timeLogs.filter(tl => tl.status === 'pending_approval').length,
        rejectedTimeLogs: timeLogs.filter(tl => tl.status === 'rejected').length,
        manualTimeLogs: timeLogs.filter(tl => tl.isManual).length
      };
      
      res.json({
        timeLogs,
        stats,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Listar lançamentos pendentes de aprovação
  static async getPendingTimeLogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const timeLogRepository = AppDataSource.getRepository(UserCheckIn);
      const queryBuilder = timeLogRepository
        .createQueryBuilder('timeLog')
        .leftJoinAndSelect('timeLog.user', 'user')
        .where('timeLog.status = :status', { status: 'pending_approval' })
        .andWhere('timeLog.isManual = :isManual', { isManual: true });
      
      // Paginação
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));
      
      // Ordenação
      queryBuilder.orderBy('timeLog.checkIn', 'DESC');
      
      const [timeLogs, total] = await queryBuilder.getManyAndCount();
      
      res.json({
        timeLogs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao buscar lançamentos pendentes:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}