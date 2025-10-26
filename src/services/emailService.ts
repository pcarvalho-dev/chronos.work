import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configure o transporter com suas credenciais SMTP
        // Para desenvolvimento, você pode usar o Ethereal Email (serviço de email de teste)
        // Em produção, use um serviço real como Gmail, SendGrid, etc.
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false, // true para 465, false para outras portas
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"Chronos.work" <noreply@chronos.work>',
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            console.log('Email enviado: %s', info.messageId);
            // Para Ethereal Email, você pode ver o email em:
            if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw error;
        }
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bem-vindo ao Chronos.work!</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Seu cadastro foi realizado com sucesso no Chronos.work.</p>
                        <p>Agora você pode começar a registrar suas horas de trabalho e gerenciar seu tempo de forma eficiente.</p>
                        <p><strong>Próximos passos:</strong></p>
                        <ul>
                            <li>Complete seu perfil com informações adicionais</li>
                            <li>Adicione uma foto de perfil</li>
                            <li>Comece a registrar seu ponto (check-in/check-out)</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Bem-vindo ao Chronos.work!',
            html,
        });
    }

    async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #FF9800;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .warning { color: #d32f2f; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Recuperação de Senha</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta no Chronos.work.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Redefinir Senha</a>
                        </div>
                        <p>Ou copie e cole o link abaixo no seu navegador:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <p class="warning">Este link expira em 1 hora.</p>
                        <p>Se você não solicitou a recuperação de senha, ignore este email. Sua senha permanecerá inalterada.</p>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Recuperação de Senha - Chronos.work',
            html,
        });
    }

    async sendInvitationEmail(to: string, name: string, code: string, managerName: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .code { 
                        background-color: #e3f2fd; 
                        padding: 15px; 
                        text-align: center; 
                        font-size: 24px; 
                        font-weight: bold; 
                        letter-spacing: 2px;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Convite para Chronos.work</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>${managerName} convidou você para fazer parte da equipe no Chronos.work.</p>
                        <p>Use o código abaixo para se cadastrar:</p>
                        <div class="code">${code}</div>
                        <p><strong>Próximos passos:</strong></p>
                        <ul>
                            <li>Acesse o sistema de cadastro</li>
                            <li>Digite o código de convite acima</li>
                            <li>Complete seu cadastro com suas informações</li>
                            <li>Aguarde a aprovação do gestor</li>
                        </ul>
                        <p>Este código expira em 7 dias.</p>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Convite para Chronos.work',
            html,
        });
    }

    async sendRegistrationConfirmationEmail(to: string, name: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .info { background-color: #e8f5e8; padding: 15px; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Cadastro Realizado!</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Seu cadastro foi realizado com sucesso no Chronos.work.</p>
                        <div class="info">
                            <p><strong>Status:</strong> Aguardando aprovação do gestor</p>
                            <p>Você receberá um email assim que sua conta for aprovada e ativada.</p>
                        </div>
                        <p>Enquanto isso, você pode:</p>
                        <ul>
                            <li>Revisar as informações do seu cadastro</li>
                            <li>Entrar em contato com seu gestor se necessário</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Cadastro Realizado - Chronos.work',
            html,
        });
    }

    async sendApprovalEmail(to: string, name: string): Promise<void> {
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Conta Aprovada!</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Sua conta foi aprovada pelo gestor e está ativa no Chronos.work.</p>
                        <p>Agora você pode acessar o sistema e começar a registrar suas horas de trabalho.</p>
                        <div style="text-align: center;">
                            <a href="${loginUrl}" class="button">Acessar Sistema</a>
                        </div>
                        <p><strong>Próximos passos:</strong></p>
                        <ul>
                            <li>Complete seu perfil com informações adicionais</li>
                            <li>Adicione uma foto de perfil</li>
                            <li>Comece a registrar seu ponto (check-in/check-out)</li>
                        </ul>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Conta Aprovada - Chronos.work',
            html,
        });
    }

    async sendRejectionEmail(to: string, name: string, reason?: string): Promise<void> {
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f44336; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9f9f9; }
                    .reason { background-color: #ffebee; padding: 15px; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Cadastro Não Aprovado</h1>
                    </div>
                    <div class="content">
                        <h2>Olá, ${name}!</h2>
                        <p>Infelizmente, seu cadastro não foi aprovado pelo gestor.</p>
                        ${reason ? `
                        <div class="reason">
                            <p><strong>Motivo:</strong> ${reason}</p>
                        </div>
                        ` : ''}
                        <p>Se você acredita que houve um erro, entre em contato com seu gestor para mais informações.</p>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>&copy; 2025 Chronos.work - Sistema de Controle de Ponto</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to,
            subject: 'Cadastro Não Aprovado - Chronos.work',
            html,
        });
    }
}

export default new EmailService();
