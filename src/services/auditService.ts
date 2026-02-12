import { AppDataSource } from '../database/data-source.js';
import { UserMovementHistory } from '../models/UserMovementHistory.js';
import { AuditConfiguration } from '../models/AuditConfiguration.js';
import type { User } from '../models/User.js';

// Campos que nunca devem ser rastreados
const EXCLUDED_FIELDS = [
    'password',
    'refreshToken',
    'resetPasswordToken',
    'resetPasswordExpires',
    'updatedAt'
];

/**
 * Campos padrão que devem ser rastreados se nenhuma configuração existir
 */
const DEFAULT_TRACKED_FIELDS = [
    'salary',
    'position',
    'department',
    'isActive',
    'isApproved',
    'role',
    'hireDate',
    'employmentType',
    'workSchedule'
];

/**
 * Formata um valor para exibição legível
 */
function formatValue(value: any): string {
    if (value === null || value === undefined) {
        return 'Não definido';
    }
    if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
    }
    if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    return String(value);
}

/**
 * Gera um diff legível entre dois valores
 */
function generateDiff(fieldName: string, oldValue: any, newValue: any): string {
    const oldFormatted = formatValue(oldValue);
    const newFormatted = formatValue(newValue);

    return `${fieldName}: ${oldFormatted} → ${newFormatted}`;
}

/**
 * Busca a configuração de auditoria da empresa
 */
export async function getAuditConfiguration(companyId: number): Promise<AuditConfiguration | null> {
    const configRepo = AppDataSource.getRepository(AuditConfiguration);
    return await configRepo.findOne({ where: { companyId } });
}

/**
 * Busca ou cria configuração padrão de auditoria para uma empresa
 */
export async function getOrCreateAuditConfiguration(companyId: number): Promise<AuditConfiguration> {
    let config = await getAuditConfiguration(companyId);

    if (!config) {
        const configRepo = AppDataSource.getRepository(AuditConfiguration);
        config = configRepo.create({
            companyId,
            trackedFields: DEFAULT_TRACKED_FIELDS,
            requireJustification: false,
            isEnabled: true
        });
        await configRepo.save(config);
    }

    return config;
}

/**
 * Verifica se um campo deve ser rastreado
 */
export function shouldTrackField(
    fieldName: string,
    trackedFields: string[]
): boolean {
    // Nunca rastrear campos excluídos
    if (EXCLUDED_FIELDS.includes(fieldName)) {
        return false;
    }

    // Rastrear se estiver na lista de campos configurados
    return trackedFields.includes(fieldName);
}

/**
 * Rastreia alterações feitas em um usuário
 */
export async function trackUserChanges(
    userId: number,
    oldData: User,
    newData: Partial<User>,
    changedById: number,
    ipAddress?: string,
    userAgent?: string,
    justification?: string
): Promise<void> {
    if (!oldData.companyId) {
        // Não rastrear se usuário não tem empresa associada
        return;
    }

    // Buscar configuração
    const config = await getOrCreateAuditConfiguration(oldData.companyId);

    // Verificar se auditoria está ativa
    if (!config.isEnabled) {
        return;
    }

    const historyRepo = AppDataSource.getRepository(UserMovementHistory);
    const changes: UserMovementHistory[] = [];

    // Iterar sobre os campos alterados
    for (const [key, newValue] of Object.entries(newData)) {
        const fieldName = key;

        // Verificar se deve rastrear este campo
        if (!shouldTrackField(fieldName, config.trackedFields)) {
            continue;
        }

        const oldValue = (oldData as any)[fieldName];

        // Verificar se realmente houve alteração
        if (oldValue === newValue) {
            continue;
        }

        // Criar registro de histórico
        const historyData: Record<string, unknown> = {
            userId,
            fieldName,
            diff: generateDiff(fieldName, oldValue, newValue),
            changedById,
            companyId: oldData.companyId
        };
        if (oldValue !== undefined) historyData['oldValue'] = JSON.stringify(oldValue);
        if (newValue !== undefined) historyData['newValue'] = JSON.stringify(newValue);
        if (justification !== undefined) historyData['justification'] = justification;
        if (ipAddress !== undefined) historyData['ipAddress'] = ipAddress;
        if (userAgent !== undefined) historyData['userAgent'] = userAgent;
        const history = historyRepo.create(historyData as Partial<UserMovementHistory>);

        changes.push(history);
    }

    // Salvar todas as alterações
    if (changes.length > 0) {
        await historyRepo.save(changes);
    }
}

/**
 * Obtém o nome legível de um campo
 */
export function getFieldDisplayName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
        name: 'Nome',
        email: 'E-mail',
        cpf: 'CPF',
        rg: 'RG',
        birthDate: 'Data de Nascimento',
        gender: 'Gênero',
        maritalStatus: 'Estado Civil',
        phone: 'Telefone',
        mobilePhone: 'Celular',
        address: 'Endereço',
        addressNumber: 'Número',
        addressComplement: 'Complemento',
        neighborhood: 'Bairro',
        city: 'Cidade',
        state: 'Estado',
        zipCode: 'CEP',
        country: 'País',
        employeeId: 'Matrícula',
        department: 'Departamento',
        position: 'Cargo',
        hireDate: 'Data de Admissão',
        salary: 'Salário',
        workSchedule: 'Horário de Trabalho',
        employmentType: 'Tipo de Vínculo',
        directSupervisor: 'Supervisor Direto',
        bankName: 'Banco',
        bankAccount: 'Conta Bancária',
        bankAgency: 'Agência',
        bankAccountType: 'Tipo de Conta',
        pix: 'Chave PIX',
        emergencyContactName: 'Contato de Emergência - Nome',
        emergencyContactPhone: 'Contato de Emergência - Telefone',
        emergencyContactRelationship: 'Contato de Emergência - Relação',
        education: 'Escolaridade',
        notes: 'Observações',
        isActive: 'Ativo',
        isApproved: 'Aprovado',
        role: 'Função',
        profilePhoto: 'Foto de Perfil'
    };

    return fieldNames[fieldName] || fieldName;
}
