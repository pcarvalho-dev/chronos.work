import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// Register security scheme
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Autenticação via JWT Bearer token no header Authorization'
});

// Schemas with OpenAPI metadata
export const LoginRequestSchema = registry.register(
  'LoginRequest',
  z.object({
    email: z.string().email().openapi({
      description: 'Email do usuário',
      example: 'pablo@email.com'
    }),
    password: z.string().openapi({
      description: 'Senha do usuário',
      example: '123456'
    })
  })
);

export const ForgotPasswordRequestSchema = registry.register(
  'ForgotPasswordRequest',
  z.object({
    email: z.string().email().openapi({
      description: 'Email do usuário para recuperação de senha',
      example: 'pablo@email.com'
    })
  })
);

export const ResetPasswordRequestSchema = registry.register(
  'ResetPasswordRequest',
  z.object({
    token: z.string().openapi({
      description: 'Token de recuperação recebido por email',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
    }),
    newPassword: z.string().min(6).openapi({
      description: 'Nova senha',
      example: 'novaSenha123'
    })
  })
);

export const UpdateProfileRequestSchema = registry.register(
  'UpdateProfileRequest',
  z.object({
    // Informações básicas
    name: z.string().min(3).optional().openapi({
      description: 'Nome completo do usuário',
      example: 'Pablo Silva'
    }),
    email: z.string().email().optional().openapi({
      description: 'Email do usuário (deve ser único)',
      example: 'pablo@email.com'
    }),
    // Informações pessoais
    cpf: z.string().regex(/^\d{11}$/).optional().openapi({
      description: 'CPF do usuário (11 dígitos)',
      example: '12345678901'
    }),
    rg: z.string().optional().openapi({
      description: 'RG do usuário',
      example: '123456789'
    }),
    birthDate: z.string().date().optional().openapi({
      description: 'Data de nascimento',
      example: '1990-05-15'
    }),
    gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional().openapi({
      description: 'Gênero do usuário'
    }),
    maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional().openapi({
      description: 'Estado civil'
    }),
    phone: z.string().optional().openapi({
      description: 'Telefone fixo',
      example: '(11) 1234-5678'
    }),
    mobilePhone: z.string().optional().openapi({
      description: 'Telefone celular',
      example: '(11) 91234-5678'
    }),
    // Endereço
    address: z.string().optional().openapi({
      description: 'Logradouro',
      example: 'Rua das Flores'
    }),
    addressNumber: z.string().optional().openapi({
      description: 'Número do endereço',
      example: '123'
    }),
    addressComplement: z.string().optional().openapi({
      description: 'Complemento do endereço',
      example: 'Apto 45'
    }),
    neighborhood: z.string().optional().openapi({
      description: 'Bairro',
      example: 'Centro'
    }),
    city: z.string().optional().openapi({
      description: 'Cidade',
      example: 'São Paulo'
    }),
    state: z.string().length(2).optional().openapi({
      description: 'Estado (UF)',
      example: 'SP'
    }),
    zipCode: z.string().regex(/^\d{8}$/).optional().openapi({
      description: 'CEP (8 dígitos)',
      example: '01234567'
    }),
    country: z.string().optional().openapi({
      description: 'País',
      example: 'Brasil'
    }),
    // Informações profissionais
    employeeId: z.string().optional().openapi({
      description: 'Matrícula do funcionário',
      example: 'EMP001'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento',
      example: 'TI'
    }),
    position: z.string().optional().openapi({
      description: 'Cargo',
      example: 'Desenvolvedor Full Stack'
    }),
    hireDate: z.string().date().optional().openapi({
      description: 'Data de contratação',
      example: '2024-01-15'
    }),
    salary: z.number().positive().optional().openapi({
      description: 'Salário',
      example: 5000.00
    }),
    workSchedule: z.string().optional().openapi({
      description: 'Jornada de trabalho',
      example: 'Segunda a Sexta, 9h às 18h'
    }),
    employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional().openapi({
      description: 'Tipo de contrato'
    }),
    directSupervisor: z.string().optional().openapi({
      description: 'Supervisor direto',
      example: 'João Santos'
    }),
    // Informações bancárias
    bankName: z.string().optional().openapi({
      description: 'Nome do banco',
      example: 'Banco do Brasil'
    }),
    bankAccount: z.string().optional().openapi({
      description: 'Número da conta',
      example: '12345-6'
    }),
    bankAgency: z.string().optional().openapi({
      description: 'Agência bancária',
      example: '1234'
    }),
    bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional().openapi({
      description: 'Tipo de conta bancária'
    }),
    pix: z.string().optional().openapi({
      description: 'Chave PIX',
      example: 'pablo@email.com'
    }),
    // Informações de emergência
    emergencyContactName: z.string().optional().openapi({
      description: 'Nome do contato de emergência',
      example: 'Maria Silva'
    }),
    emergencyContactPhone: z.string().optional().openapi({
      description: 'Telefone do contato de emergência',
      example: '(11) 98765-4321'
    }),
    emergencyContactRelationship: z.string().optional().openapi({
      description: 'Grau de parentesco do contato de emergência',
      example: 'Mãe'
    }),
    // Informações adicionais
    education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional().openapi({
      description: 'Nível de escolaridade'
    }),
    notes: z.string().optional().openapi({
      description: 'Observações adicionais',
      example: 'Funcionário exemplar'
    }),
    isActive: z.boolean().optional().openapi({
      description: 'Status do usuário',
      example: true
    })
  })
);

export const RegisterRequestSchema = registry.register(
  'RegisterRequest',
  z.object({
    // Informações básicas (obrigatórias)
    name: z.string().min(3).openapi({
      description: 'Nome completo do usuário',
      example: 'Pablo Silva'
    }),
    email: z.string().email().openapi({
      description: 'Email do usuário (deve ser único)',
      example: 'pablo@email.com'
    }),
    password: z.string().min(6).openapi({
      description: 'Senha do usuário',
      example: '123456'
    }),
    // Informações pessoais (opcionais)
    cpf: z.string().regex(/^\d{11}$/).optional().openapi({
      description: 'CPF do usuário (11 dígitos)',
      example: '12345678901'
    }),
    rg: z.string().optional().openapi({
      description: 'RG do usuário',
      example: '123456789'
    }),
    birthDate: z.string().date().optional().openapi({
      description: 'Data de nascimento',
      example: '1990-05-15'
    }),
    gender: z.enum(['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']).optional().openapi({
      description: 'Gênero do usuário'
    }),
    maritalStatus: z.enum(['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']).optional().openapi({
      description: 'Estado civil'
    }),
    phone: z.string().optional().openapi({
      description: 'Telefone fixo',
      example: '(11) 1234-5678'
    }),
    mobilePhone: z.string().optional().openapi({
      description: 'Telefone celular',
      example: '(11) 91234-5678'
    }),
    // Endereço (opcional)
    address: z.string().optional().openapi({
      description: 'Logradouro',
      example: 'Rua das Flores'
    }),
    addressNumber: z.string().optional().openapi({
      description: 'Número do endereço',
      example: '123'
    }),
    addressComplement: z.string().optional().openapi({
      description: 'Complemento do endereço',
      example: 'Apto 45'
    }),
    neighborhood: z.string().optional().openapi({
      description: 'Bairro',
      example: 'Centro'
    }),
    city: z.string().optional().openapi({
      description: 'Cidade',
      example: 'São Paulo'
    }),
    state: z.string().length(2).optional().openapi({
      description: 'Estado (UF)',
      example: 'SP'
    }),
    zipCode: z.string().regex(/^\d{8}$/).optional().openapi({
      description: 'CEP (8 dígitos)',
      example: '01234567'
    }),
    country: z.string().optional().openapi({
      description: 'País',
      example: 'Brasil'
    }),
    // Informações profissionais (opcionais)
    employeeId: z.string().optional().openapi({
      description: 'Matrícula do funcionário',
      example: 'EMP001'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento',
      example: 'TI'
    }),
    position: z.string().optional().openapi({
      description: 'Cargo',
      example: 'Desenvolvedor Full Stack'
    }),
    hireDate: z.string().date().optional().openapi({
      description: 'Data de contratação',
      example: '2024-01-15'
    }),
    salary: z.number().positive().optional().openapi({
      description: 'Salário',
      example: 5000.00
    }),
    workSchedule: z.string().optional().openapi({
      description: 'Jornada de trabalho',
      example: 'Segunda a Sexta, 9h às 18h'
    }),
    employmentType: z.enum(['CLT', 'PJ', 'Estagiário', 'Freelancer', 'Temporário', 'Autônomo']).optional().openapi({
      description: 'Tipo de contrato'
    }),
    directSupervisor: z.string().optional().openapi({
      description: 'Supervisor direto',
      example: 'João Santos'
    }),
    // Informações bancárias (opcionais)
    bankName: z.string().optional().openapi({
      description: 'Nome do banco',
      example: 'Banco do Brasil'
    }),
    bankAccount: z.string().optional().openapi({
      description: 'Número da conta',
      example: '12345-6'
    }),
    bankAgency: z.string().optional().openapi({
      description: 'Agência bancária',
      example: '1234'
    }),
    bankAccountType: z.enum(['Corrente', 'Poupança', 'Salário']).optional().openapi({
      description: 'Tipo de conta bancária'
    }),
    pix: z.string().optional().openapi({
      description: 'Chave PIX',
      example: 'pablo@email.com'
    }),
    // Informações de emergência (opcionais)
    emergencyContactName: z.string().optional().openapi({
      description: 'Nome do contato de emergência',
      example: 'Maria Silva'
    }),
    emergencyContactPhone: z.string().optional().openapi({
      description: 'Telefone do contato de emergência',
      example: '(11) 98765-4321'
    }),
    emergencyContactRelationship: z.string().optional().openapi({
      description: 'Grau de parentesco do contato de emergência',
      example: 'Mãe'
    }),
    // Informações adicionais (opcionais)
    education: z.enum(['Fundamental', 'Médio', 'Superior', 'Pós-graduação', 'Mestrado', 'Doutorado']).optional().openapi({
      description: 'Nível de escolaridade'
    }),
    notes: z.string().optional().openapi({
      description: 'Observações adicionais',
      example: 'Funcionário exemplar'
    })
  })
);

const UserSchema = registry.register(
  'User',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Pablo Silva' }),
    email: z.string().email().openapi({ example: 'pablo@email.com' }),
    cpf: z.string().optional().openapi({ example: '12345678901' }),
    rg: z.string().optional().openapi({ example: '123456789' }),
    birthDate: z.string().date().optional().openapi({ example: '1990-05-15' }),
    gender: z.string().optional().openapi({ example: 'Masculino' }),
    maritalStatus: z.string().optional().openapi({ example: 'Solteiro(a)' }),
    phone: z.string().optional().openapi({ example: '(11) 1234-5678' }),
    mobilePhone: z.string().optional().openapi({ example: '(11) 91234-5678' }),
    address: z.string().optional().openapi({ example: 'Rua das Flores' }),
    addressNumber: z.string().optional().openapi({ example: '123' }),
    addressComplement: z.string().optional().openapi({ example: 'Apto 45' }),
    neighborhood: z.string().optional().openapi({ example: 'Centro' }),
    city: z.string().optional().openapi({ example: 'São Paulo' }),
    state: z.string().optional().openapi({ example: 'SP' }),
    zipCode: z.string().optional().openapi({ example: '01234567' }),
    country: z.string().optional().openapi({ example: 'Brasil' }),
    employeeId: z.string().optional().openapi({ example: 'EMP001' }),
    department: z.string().optional().openapi({ example: 'TI' }),
    position: z.string().optional().openapi({ example: 'Desenvolvedor Full Stack' }),
    hireDate: z.string().date().optional().openapi({ example: '2024-01-15' }),
    salary: z.number().optional().openapi({ example: 5000.00 }),
    workSchedule: z.string().optional().openapi({ example: 'Segunda a Sexta, 9h às 18h' }),
    employmentType: z.string().optional().openapi({ example: 'CLT' }),
    directSupervisor: z.string().optional().openapi({ example: 'João Santos' }),
    bankName: z.string().optional().openapi({ example: 'Banco do Brasil' }),
    bankAccount: z.string().optional().openapi({ example: '12345-6' }),
    bankAgency: z.string().optional().openapi({ example: '1234' }),
    bankAccountType: z.string().optional().openapi({ example: 'Corrente' }),
    pix: z.string().optional().openapi({ example: 'pablo@email.com' }),
    emergencyContactName: z.string().optional().openapi({ example: 'Maria Silva' }),
    emergencyContactPhone: z.string().optional().openapi({ example: '(11) 98765-4321' }),
    emergencyContactRelationship: z.string().optional().openapi({ example: 'Mãe' }),
    education: z.string().optional().openapi({ example: 'Superior' }),
    notes: z.string().optional().openapi({ example: 'Funcionário exemplar' }),
    isActive: z.boolean().openapi({ example: true }),
    role: z.enum(['manager', 'employee']).openapi({ example: 'employee' }),
    createdAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' })
  })
);

const TimeLogSchema = registry.register(
  'TimeLog',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    checkIn: z.string().datetime().openapi({
      description: 'Data e hora de entrada',
      example: '2025-10-22T20:00:00.000Z'
    }),
    checkOut: z.string().datetime().nullable().openapi({
      description: 'Data e hora de saída (null se ainda não fez checkout)',
      example: '2025-10-22T23:00:00.000Z'
    }),
    checkInPhoto: z.string().nullable().openapi({
      description: 'URL da foto tirada no momento do check-in',
      example: '/uploads/checkins/abc123.jpg'
    }),
    checkOutPhoto: z.string().nullable().openapi({
      description: 'URL da foto tirada no momento do check-out',
      example: '/uploads/checkins/def456.jpg'
    }),
    latitude: z.number().nullable().openapi({
      description: 'Latitude da localização do check-in',
      example: -23.5505199
    }),
    longitude: z.number().nullable().openapi({
      description: 'Longitude da localização do check-in',
      example: -46.6333094
    }),
    checkInLocation: z.string().nullable().openapi({
      description: 'Endereço completo do check-in obtido via geocoding reverso',
      example: 'Avenida Paulista, 1578, Bela Vista, São Paulo, Brasil'
    }),
    outLatitude: z.number().nullable().openapi({
      description: 'Latitude da localização do check-out',
      example: -23.5505199
    }),
    outLongitude: z.number().nullable().openapi({
      description: 'Longitude da localização do check-out',
      example: -46.6333094
    }),
    checkOutLocation: z.string().nullable().openapi({
      description: 'Endereço completo do check-out obtido via geocoding reverso',
      example: 'Avenida Paulista, 1578, Bela Vista, São Paulo, Brasil'
    }),
    isManual: z.boolean().openapi({
      description: 'Indica se é um lançamento manual',
      example: false
    }),
    reason: z.string().nullable().openapi({
      description: 'Motivo do lançamento manual',
      example: 'Esqueci de bater o ponto'
    }),
    status: z.enum(['pending_approval', 'approved', 'rejected']).openapi({
      description: 'Status do lançamento: pending_approval (aguardando), approved (aprovado), rejected (rejeitado)',
      example: 'approved'
    }),
    approvalDate: z.string().datetime().nullable().openapi({
      description: 'Data de aprovação ou rejeição',
      example: '2025-10-23T10:00:00.000Z'
    }),
    rejectionReason: z.string().nullable().openapi({
      description: 'Motivo da rejeição (se rejeitado)',
      example: null
    })
  })
);

const SuccessMessageSchema = z.object({
  message: z.string().openapi({ example: 'User created successfully' })
});

const RegisterResponseSchema = z.object({
  message: z.string().openapi({ example: 'User created successfully' }),
  user: UserSchema,
  accessToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acesso (válido por 15 minutos)'
  }),
  refreshToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de renovação (válido por 7 dias)'
  })
});

const LoginResponseSchema = z.object({
  message: z.string().openapi({ example: 'Logged in successfully' }),
  user: UserSchema,
  accessToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acesso (válido por 15 minutos)'
  }),
  refreshToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de renovação (válido por 7 dias)'
  })
});

const CheckInResponseSchema = z.object({
  message: z.string().openapi({ example: 'Checked in successfully' }),
  checkIn: TimeLogSchema
});

const CheckOutResponseSchema = z.object({
  message: z.string().openapi({ example: 'Checked out successfully' }),
  timeLog: TimeLogSchema
});

const ForgotPasswordResponseSchema = z.object({
  message: z.string().openapi({ example: 'Se o email existir, um link de recuperação será enviado' })
});

const ResetPasswordResponseSchema = z.object({
  message: z.string().openapi({ example: 'Senha redefinida com sucesso' })
});

const UploadPhotoResponseSchema = z.object({
  message: z.string().openapi({ example: 'Foto de perfil atualizada com sucesso' }),
  profilePhoto: z.string().openapi({ example: '/uploads/profiles/abc123.jpg' })
});

const RefreshTokenRequestSchema = registry.register(
  'RefreshTokenRequest',
  z.object({
    refreshToken: z.string().openapi({
      description: 'Refresh token obtido no login',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
  })
);

const RefreshTokenResponseSchema = z.object({
  accessToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Novo token JWT de acesso'
  }),
  refreshToken: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Novo token JWT de renovação'
  })
});

const LogoutResponseSchema = z.object({
  message: z.string().openapi({ example: 'Logged out successfully' })
});

const ProfileResponseSchema = z.object({
  user: UserSchema
});

const UpdateProfileResponseSchema = z.object({
  message: z.string().openapi({ example: 'Perfil atualizado com sucesso' }),
  user: UserSchema
});

const ProfilePhotoResponseSchema = z.object({
  profilePhoto: z.string().nullable().openapi({
    example: '/uploads/profiles/abc123.jpg',
    description: 'URL da foto de perfil do usuário'
  })
});

// Manual time log schemas
const ManualCheckInRequestSchema = registry.register(
  'ManualCheckInRequest',
  z.object({
    checkIn: z.string().datetime().openapi({
      description: 'Data e hora de entrada (formato ISO 8601)',
      example: '2025-10-22T08:00:00.000Z'
    }),
    reason: z.string().min(10).openapi({
      description: 'Motivo do lançamento manual (mínimo 10 caracteres)',
      example: 'Esqueci de bater o ponto ao chegar no trabalho'
    }),
    checkInLocation: z.string().optional().openapi({
      description: 'Endereço do check-in (opcional)',
      example: 'Escritório Central'
    }),
    latitude: z.number().min(-90).max(90).optional().openapi({
      description: 'Latitude (opcional)',
      example: -23.5505199
    }),
    longitude: z.number().min(-180).max(180).optional().openapi({
      description: 'Longitude (opcional)',
      example: -46.6333094
    })
  })
);

const ManualCheckOutRequestSchema = registry.register(
  'ManualCheckOutRequest',
  z.object({
    timeLogId: z.number().int().openapi({
      description: 'ID do registro de ponto',
      example: 1
    }),
    checkOut: z.string().datetime().openapi({
      description: 'Data e hora de saída (formato ISO 8601)',
      example: '2025-10-22T17:00:00.000Z'
    }),
    reason: z.string().min(10).openapi({
      description: 'Motivo do lançamento manual (mínimo 10 caracteres)',
      example: 'Esqueci de bater o ponto ao sair do trabalho'
    }),
    checkOutLocation: z.string().optional().openapi({
      description: 'Endereço do check-out (opcional)',
      example: 'Escritório Central'
    }),
    outLatitude: z.number().min(-90).max(90).optional().openapi({
      description: 'Latitude (opcional)',
      example: -23.5505199
    }),
    outLongitude: z.number().min(-180).max(180).optional().openapi({
      description: 'Longitude (opcional)',
      example: -46.6333094
    })
  })
);

const ApproveTimeLogRequestSchema = registry.register(
  'ApproveTimeLogRequest',
  z.object({
    timeLogId: z.number().int().openapi({
      description: 'ID do registro de ponto a ser aprovado',
      example: 1
    })
  })
);

const RejectTimeLogRequestSchema = registry.register(
  'RejectTimeLogRequest',
  z.object({
    timeLogId: z.number().int().openapi({
      description: 'ID do registro de ponto a ser rejeitado',
      example: 1
    }),
    rejectionReason: z.string().min(10).openapi({
      description: 'Motivo da rejeição (mínimo 10 caracteres)',
      example: 'Horário informado não corresponde ao expediente'
    })
  })
);

const ManualCheckInResponseSchema = z.object({
  message: z.string().openapi({ example: 'Lançamento manual de check-in criado. Aguardando aprovação.' }),
  checkIn: TimeLogSchema
});

const ManualCheckOutResponseSchema = z.object({
  message: z.string().openapi({ example: 'Lançamento manual de check-out criado. Aguardando aprovação.' }),
  timeLog: TimeLogSchema
});

const ApproveTimeLogResponseSchema = z.object({
  message: z.string().openapi({ example: 'Lançamento manual aprovado com sucesso' }),
  timeLog: TimeLogSchema
});

const RejectTimeLogResponseSchema = z.object({
  message: z.string().openapi({ example: 'Lançamento manual rejeitado' }),
  timeLog: TimeLogSchema
});

const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    message: z.string().openapi({ example: 'Internal server error' }),
    errors: z.array(z.object({
      code: z.string(),
      message: z.string(),
      path: z.array(z.string())
    })).optional()
  })
);



registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Authentication'],
  summary: 'Fazer login',
  description: 'Autentica um usuário e cria uma sessão',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Login realizado com sucesso',
      content: {
        'application/json': {
          schema: LoginResponseSchema
        }
      }
    },
    400: {
      description: 'Credenciais inválidas',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autorizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/forgot-password',
  tags: ['Authentication'],
  summary: 'Solicitar recuperação de senha',
  description: 'Envia um email com link para redefinir a senha',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ForgotPasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Email de recuperação enviado (se o email existir)',
      content: {
        'application/json': {
          schema: ForgotPasswordResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/reset-password',
  tags: ['Authentication'],
  summary: 'Redefinir senha',
  description: 'Redefine a senha usando o token recebido por email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ResetPasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Senha redefinida com sucesso',
      content: {
        'application/json': {
          schema: ResetPasswordResponseSchema
        }
      }
    },
    400: {
      description: 'Token inválido ou expirado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/auth/profile',
  tags: ['Authentication'],
  summary: 'Obter perfil do usuário',
  description: 'Retorna os dados do perfil do usuário autenticado, incluindo foto de perfil',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Perfil retornado com sucesso',
      content: {
        'application/json': {
          schema: ProfileResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/auth/profile',
  tags: ['Authentication'],
  summary: 'Atualizar perfil do usuário',
  description: 'Atualiza as informações do perfil do usuário autenticado. Todos os campos são opcionais - envie apenas os campos que deseja atualizar.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateProfileRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Perfil atualizado com sucesso',
      content: {
        'application/json': {
          schema: UpdateProfileResponseSchema
        }
      }
    },
    400: {
      description: 'Email já está em uso ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/auth/profile-photo',
  tags: ['Authentication'],
  summary: 'Obter foto de perfil do usuário',
  description: 'Retorna a URL da foto de perfil do usuário autenticado',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'URL da foto retornada com sucesso',
      content: {
        'application/json': {
          schema: ProfilePhotoResponseSchema
        }
      }
    },
    404: {
      description: 'Foto de perfil não encontrada',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Foto de perfil não encontrada' }),
            profilePhoto: z.null()
          })
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});


registry.registerPath({
  method: 'post',
  path: '/auth/refresh-token',
  tags: ['Authentication'],
  summary: 'Renovar token de acesso',
  description: 'Gera um novo par de tokens (access e refresh) usando um refresh token válido',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RefreshTokenRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Tokens renovados com sucesso',
      content: {
        'application/json': {
          schema: RefreshTokenResponseSchema
        }
      }
    },
    400: {
      description: 'Refresh token não fornecido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Refresh token inválido ou expirado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Authentication'],
  summary: 'Fazer logout',
  description: 'Invalida o refresh token do usuário autenticado',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Logout realizado com sucesso',
      content: {
        'application/json': {
          schema: LogoutResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});


registry.registerPath({
  method: 'post',
  path: '/auth/upload-photo',
  tags: ['Authentication'],
  summary: 'Upload de foto de perfil',
  description: 'Faz upload de uma foto de perfil do usuário autenticado. Aceita apenas imagens (JPEG, PNG, GIF) até 5MB.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              photo: {
                type: 'string',
                format: 'binary',
                description: 'Arquivo de imagem (JPEG, PNG, GIF)'
              }
            },
            required: ['photo']
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Foto atualizada com sucesso',
      content: {
        'application/json': {
          schema: UploadPhotoResponseSchema
        }
      }
    },
    400: {
      description: 'Nenhum arquivo enviado ou tipo de arquivo inválido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/timelog/checkin',
  tags: ['Time Tracking'],
  summary: 'Registrar entrada',
  description: 'Registra o início do turno de trabalho do usuário autenticado. Requer uma foto e localização (latitude/longitude). O endereço é obtido automaticamente via API de geocoding reverso.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              photo: {
                type: 'string',
                format: 'binary',
                description: 'Foto obrigatória do momento do check-in (JPEG, PNG, GIF até 5MB)'
              },
              latitude: {
                type: 'number',
                description: 'Latitude da localização (-90 a 90)',
                example: -23.5505199
              },
              longitude: {
                type: 'number',
                description: 'Longitude da localização (-180 a 180)',
                example: -46.6333094
              }
            },
            required: ['photo', 'latitude', 'longitude']
          }
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Check-in realizado com sucesso',
      content: {
        'application/json': {
          schema: CheckInResponseSchema
        }
      }
    },
    400: {
      description: 'Foto ou localização não enviada, coordenadas inválidas, usuário já possui check-in ativo, ou tipo de arquivo inválido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/timelog/checkout',
  tags: ['Time Tracking'],
  summary: 'Registrar saída',
  description: 'Registra o fim do turno de trabalho do usuário autenticado. Requer uma foto e localização (latitude/longitude). O endereço é obtido automaticamente via API de geocoding reverso.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              photo: {
                type: 'string',
                format: 'binary',
                description: 'Foto obrigatória do momento do check-out (JPEG, PNG, GIF até 5MB)'
              },
              latitude: {
                type: 'number',
                description: 'Latitude da localização (-90 a 90)',
                example: -23.5505199
              },
              longitude: {
                type: 'number',
                description: 'Longitude da localização (-180 a 180)',
                example: -46.6333094
              }
            },
            required: ['photo', 'latitude', 'longitude']
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Check-out realizado com sucesso',
      content: {
        'application/json': {
          schema: CheckOutResponseSchema
        }
      }
    },
    400: {
      description: 'Foto ou localização não enviada, coordenadas inválidas, usuário não possui check-in ativo, ou tipo de arquivo inválido',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/timelog',
  tags: ['Time Tracking'],
  summary: 'Listar registros de tempo',
  description: 'Retorna todos os registros de ponto do usuário autenticado, incluindo fotos, coordenadas geográficas e endereços completos de cada check-in e check-out. Ordenados por data de entrada (mais recentes primeiro). Suporta filtros opcionais por data.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      startDate: z.string().date().optional().openapi({
        description: 'Data inicial para filtrar os registros (formato: YYYY-MM-DD). Retorna registros a partir desta data (inclusive).',
        example: '2025-10-01'
      }),
      endDate: z.string().date().optional().openapi({
        description: 'Data final para filtrar os registros (formato: YYYY-MM-DD). Retorna registros até esta data (inclusive).',
        example: '2025-10-26'
      })
    })
  },
  responses: {
    200: {
      description: 'Lista de registros retornada com sucesso',
      content: {
        'application/json': {
          schema: z.array(TimeLogSchema)
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// Manual time log endpoints
registry.registerPath({
  method: 'post',
  path: '/timelog/manual-checkin',
  tags: ['Time Tracking'],
  summary: 'Lançar check-in manualmente (retroativo)',
  description: 'Cria um lançamento manual de check-in retroativo. O registro ficará com status "pending_approval" até que um gestor aprove.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ManualCheckInRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Lançamento manual criado com sucesso',
      content: {
        'application/json': {
          schema: ManualCheckInResponseSchema
        }
      }
    },
    400: {
      description: 'Erro de validação ou usuário já possui check-in ativo',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/timelog/manual-checkout',
  tags: ['Time Tracking'],
  summary: 'Lançar check-out manualmente (retroativo)',
  description: 'Adiciona um check-out manual a um registro de ponto existente. O registro ficará com status "pending_approval" até que um gestor aprove.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ManualCheckOutRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Check-out manual adicionado com sucesso',
      content: {
        'application/json': {
          schema: ManualCheckOutResponseSchema
        }
      }
    },
    400: {
      description: 'Registro não encontrado, erro de validação, ou registro já possui check-out',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: 'Registro de ponto não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/timelog/approve',
  tags: ['Time Tracking'],
  summary: 'Aprovar lançamento manual (gestor)',
  description: 'Aprova um lançamento manual de ponto. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ApproveTimeLogRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Lançamento aprovado com sucesso',
      content: {
        'application/json': {
          schema: ApproveTimeLogResponseSchema
        }
      }
    },
    400: {
      description: 'Erro de validação, registro não é manual, ou já foi processado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: 'Registro de ponto não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/timelog/reject',
  tags: ['Time Tracking'],
  summary: 'Rejeitar lançamento manual (gestor)',
  description: 'Rejeita um lançamento manual de ponto com um motivo. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RejectTimeLogRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Lançamento rejeitado',
      content: {
        'application/json': {
          schema: RejectTimeLogResponseSchema
        }
      }
    },
    400: {
      description: 'Erro de validação, registro não é manual, ou já foi processado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: 'Registro de ponto não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/timelog/pending',
  tags: ['Time Tracking'],
  summary: 'Listar lançamentos pendentes de aprovação (gestor)',
  description: 'Retorna todos os lançamentos manuais com status pending_approval. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Lista de lançamentos pendentes',
      content: {
        'application/json': {
          schema: z.array(TimeLogSchema)
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// Company and Invitation schemas
const CompanySchema = registry.register(
  'Company',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Empresa ABC Ltda' }),
    cnpj: z.string().openapi({ example: '12345678000195' }),
    corporateName: z.string().optional().openapi({ example: 'Empresa ABC Ltda' }),
    email: z.string().email().optional().openapi({ example: 'contato@empresa.com' }),
    phone: z.string().optional().openapi({ example: '(11) 1234-5678' }),
    website: z.string().url().optional().openapi({ example: 'https://empresa.com' }),
    address: z.string().optional().openapi({ example: 'Rua das Flores, 123' }),
    addressNumber: z.string().optional().openapi({ example: '123' }),
    addressComplement: z.string().optional().openapi({ example: 'Sala 45' }),
    neighborhood: z.string().optional().openapi({ example: 'Centro' }),
    city: z.string().optional().openapi({ example: 'São Paulo' }),
    state: z.string().optional().openapi({ example: 'SP' }),
    zipCode: z.string().optional().openapi({ example: '01234567' }),
    country: z.string().optional().openapi({ example: 'Brasil' }),
    description: z.string().optional().openapi({ example: 'Empresa de tecnologia' }),
    logo: z.string().optional().openapi({ example: 'https://cloudinary.com/logo.jpg' }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' })
  })
);

const InvitationSchema = registry.register(
  'Invitation',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    code: z.string().openapi({ example: 'ABC12345' }),
    email: z.string().email().openapi({ example: 'funcionario@email.com' }),
    name: z.string().optional().openapi({ example: 'João Silva' }),
    position: z.string().optional().openapi({ example: 'Desenvolvedor' }),
    department: z.string().optional().openapi({ example: 'TI' }),
    isUsed: z.boolean().openapi({ example: false }),
    usedAt: z.string().datetime().nullable().openapi({ example: null }),
    expiresAt: z.string().datetime().nullable().openapi({ example: '2025-11-01T12:00:00.000Z' }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2025-10-23T12:00:00.000Z' })
  })
);

const ManagerRegisterRequestSchema = registry.register(
  'ManagerRegisterRequest',
  z.object({
    // Dados do gestor
    name: z.string().min(3).openapi({
      description: 'Nome completo do gestor',
      example: 'Pablo Silva'
    }),
    email: z.string().email().openapi({
      description: 'Email do gestor',
      example: 'pablo@empresa.com'
    }),
    password: z.string().min(6).openapi({
      description: 'Senha do gestor',
      example: '123456'
    }),
    
    // Dados da empresa
    company: z.object({
      name: z.string().min(2).openapi({
        description: 'Nome da empresa',
        example: 'Empresa ABC Ltda'
      }),
      cnpj: z.string().regex(/^\d{14}$/).openapi({
        description: 'CNPJ da empresa (14 dígitos)',
        example: '12345678000195'
      }),
      corporateName: z.string().optional().openapi({
        description: 'Razão social',
        example: 'Empresa ABC Ltda'
      }),
      email: z.string().email().optional().openapi({
        description: 'Email da empresa',
        example: 'contato@empresa.com'
      }),
      phone: z.string().optional().openapi({
        description: 'Telefone da empresa',
        example: '(11) 1234-5678'
      }),
      website: z.string().url().optional().openapi({
        description: 'Website da empresa',
        example: 'https://empresa.com'
      }),
      address: z.string().optional().openapi({
        description: 'Endereço da empresa',
        example: 'Rua das Flores, 123'
      }),
      city: z.string().optional().openapi({
        description: 'Cidade',
        example: 'São Paulo'
      }),
      state: z.string().length(2).optional().openapi({
        description: 'Estado (UF)',
        example: 'SP'
      }),
      zipCode: z.string().regex(/^\d{8}$/).optional().openapi({
        description: 'CEP (8 dígitos)',
        example: '01234567'
      }),
      country: z.string().default('Brasil').optional().openapi({
        description: 'País',
        example: 'Brasil'
      }),
      description: z.string().optional().openapi({
        description: 'Descrição da empresa',
        example: 'Empresa de tecnologia'
      })
    }),
    
    // Informações pessoais do gestor (opcionais)
    cpf: z.string().regex(/^\d{11}$/).optional().openapi({
      description: 'CPF do gestor (11 dígitos)',
      example: '12345678901'
    }),
    phone: z.string().optional().openapi({
      description: 'Telefone do gestor',
      example: '(11) 91234-5678'
    })
  })
);

const EmployeeRegisterRequestSchema = registry.register(
  'EmployeeRegisterRequest',
  z.object({
    invitationCode: z.string().min(1).openapi({
      description: 'Código de convite obrigatório',
      example: 'ABC12345'
    }),
    name: z.string().min(3).openapi({
      description: 'Nome completo do funcionário',
      example: 'João Silva'
    }),
    email: z.string().email().openapi({
      description: 'Email do funcionário',
      example: 'joao@email.com'
    }),
    password: z.string().min(6).openapi({
      description: 'Senha do funcionário',
      example: '123456'
    }),
    cpf: z.string().regex(/^\d{11}$/).optional().openapi({
      description: 'CPF do funcionário (11 dígitos)',
      example: '12345678901'
    }),
    phone: z.string().optional().openapi({
      description: 'Telefone do funcionário',
      example: '(11) 91234-5678'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento',
      example: 'TI'
    }),
    position: z.string().optional().openapi({
      description: 'Cargo',
      example: 'Desenvolvedor'
    })
  })
);

const CreateInvitationRequestSchema = registry.register(
  'CreateInvitationRequest',
  z.object({
    email: z.string().email().openapi({
      description: 'Email do funcionário a ser convidado',
      example: 'funcionario@email.com'
    }),
    name: z.string().min(2).optional().openapi({
      description: 'Nome do funcionário',
      example: 'João Silva'
    }),
    position: z.string().optional().openapi({
      description: 'Cargo do funcionário',
      example: 'Desenvolvedor'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento do funcionário',
      example: 'TI'
    }),
    expiresAt: z.string().datetime().optional().openapi({
      description: 'Data de expiração do convite (padrão: 7 dias)',
      example: '2025-11-01T12:00:00.000Z'
    })
  })
);

const ApproveEmployeeRequestSchema = registry.register(
  'ApproveEmployeeRequest',
  z.object({
    userId: z.number().int().positive().openapi({
      description: 'ID do usuário funcionário',
      example: 1
    }),
    approved: z.boolean().openapi({
      description: 'Se deve aprovar ou rejeitar',
      example: true
    }),
    notes: z.string().optional().openapi({
      description: 'Observações sobre a aprovação/rejeição',
      example: 'Funcionário aprovado com sucesso'
    })
  })
);

// Response schemas
const ManagerRegisterResponseSchema = z.object({
  message: z.string().openapi({ example: 'Gestor e empresa criados com sucesso' }),
  user: UserSchema,
  company: CompanySchema,
  accessToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
  refreshToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
});

const EmployeeRegisterResponseSchema = z.object({
  message: z.string().openapi({ example: 'Cadastro realizado com sucesso. Aguarde aprovação do gestor.' }),
  user: UserSchema,
  requiresApproval: z.boolean().openapi({ example: true })
});

const CreateInvitationResponseSchema = z.object({
  message: z.string().openapi({ example: 'Convite criado com sucesso' }),
  invitation: InvitationSchema
});

const InvitationListResponseSchema = z.object({
  invitations: z.array(InvitationSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number()
  })
});

const EmployeeListResponseSchema = z.object({
  employees: z.array(UserSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number()
  })
});

const ApproveEmployeeResponseSchema = z.object({
  message: z.string().openapi({ example: 'Funcionário aprovado com sucesso' }),
  employee: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    isApproved: z.boolean(),
    isActive: z.boolean()
  })
});

const CompanyResponseSchema = z.object({
  company: CompanySchema
});

const UpdateCompanyResponseSchema = z.object({
  message: z.string().openapi({ example: 'Empresa atualizada com sucesso' }),
  company: CompanySchema
});

const CancelInvitationResponseSchema = z.object({
  message: z.string().openapi({ example: 'Convite cancelado com sucesso' })
});

// Register new authentication routes
registry.registerPath({
  method: 'post',
  path: '/auth/register-manager',
  tags: ['Authentication'],
  summary: 'Registrar gestor e criar empresa',
  description: 'Cria uma nova empresa e registra o gestor responsável. O gestor é automaticamente aprovado e ativado.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ManagerRegisterRequestSchema,
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Gestor e empresa criados com sucesso',
      content: {
        'application/json': {
          schema: ManagerRegisterResponseSchema
        }
      }
    },
    400: {
      description: 'Email ou CNPJ já existe, ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/auth/register-employee',
  tags: ['Authentication'],
  summary: 'Registrar funcionário com código de convite',
  description: 'Cria uma nova conta de funcionário usando um código de convite válido. O funcionário ficará inativo até aprovação do gestor.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: EmployeeRegisterRequestSchema,
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Funcionário registrado com sucesso. Aguardando aprovação.',
      content: {
        'application/json': {
          schema: EmployeeRegisterResponseSchema
        }
      }
    },
    400: {
      description: 'Código de convite inválido, email já existe, ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// Manager schemas
const ListUsersRequestSchema = registry.register(
  'ListUsersRequest',
  z.object({
    page: z.string().optional().openapi({
      description: 'Número da página (padrão: 1)',
      example: '1'
    }),
    limit: z.string().optional().openapi({
      description: 'Itens por página (padrão: 10)',
      example: '10'
    }),
    search: z.string().optional().openapi({
      description: 'Buscar por nome, email ou matrícula',
      example: 'Pablo'
    }),
    department: z.string().optional().openapi({
      description: 'Filtrar por departamento',
      example: 'TI'
    }),
    isActive: z.string().optional().openapi({
      description: 'Filtrar por status ativo (true/false)',
      example: 'true'
    }),
    role: z.enum(['manager', 'employee']).optional().openapi({
      description: 'Filtrar por tipo de usuário'
    })
  })
);

const CreateUserRequestSchema = registry.register(
  'CreateUserRequest',
  z.object({
    name: z.string().min(2).openapi({
      description: 'Nome completo do usuário',
      example: 'João Silva'
    }),
    email: z.string().email().openapi({
      description: 'Email do usuário',
      example: 'joao@email.com'
    }),
    password: z.string().min(6).openapi({
      description: 'Senha do usuário',
      example: '123456'
    }),
    role: z.enum(['manager', 'employee']).default('employee').openapi({
      description: 'Tipo de usuário'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento',
      example: 'TI'
    }),
    position: z.string().optional().openapi({
      description: 'Cargo',
      example: 'Desenvolvedor'
    }),
    employeeId: z.string().optional().openapi({
      description: 'Matrícula do funcionário',
      example: 'EMP002'
    })
  })
);

const UpdateUserRequestSchema = registry.register(
  'UpdateUserRequest',
  z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(['manager', 'employee']).optional()
  })
);

const ManualTimeLogRequestSchema = registry.register(
  'ManualTimeLogRequest',
  z.object({
    userId: z.number().int().openapi({
      description: 'ID do usuário',
      example: 1
    }),
    checkIn: z.string().datetime().openapi({
      description: 'Data e hora de entrada',
      example: '2025-10-22T08:00:00.000Z'
    }),
    checkOut: z.string().datetime().optional().openapi({
      description: 'Data e hora de saída',
      example: '2025-10-22T17:00:00.000Z'
    }),
    reason: z.string().min(10).openapi({
      description: 'Motivo do lançamento',
      example: 'Funcionário esqueceu de bater o ponto'
    }),
    checkInLocation: z.string().optional().openapi({
      description: 'Local do check-in',
      example: 'Escritório Central'
    }),
    checkOutLocation: z.string().optional().openapi({
      description: 'Local do check-out',
      example: 'Escritório Central'
    })
  })
);


const TimeLogReportRequestSchema = registry.register(
  'TimeLogReportRequest',
  z.object({
    userId: z.string().optional().openapi({
      description: 'ID do usuário (opcional)',
      example: '1'
    }),
    department: z.string().optional().openapi({
      description: 'Departamento (opcional)',
      example: 'TI'
    }),
    startDate: z.string().date().openapi({
      description: 'Data inicial',
      example: '2025-10-01'
    }),
    endDate: z.string().date().openapi({
      description: 'Data final',
      example: '2025-10-31'
    }),
    page: z.string().optional().openapi({
      description: 'Página',
      example: '1'
    }),
    limit: z.string().optional().openapi({
      description: 'Itens por página',
      example: '50'
    })
  })
);

const ChangePasswordRequestSchema = registry.register(
  'ChangePasswordRequest',
  z.object({
    userId: z.number().int().openapi({
      description: 'ID do usuário',
      example: 1
    }),
    newPassword: z.string().min(6).openapi({
      description: 'Nova senha',
      example: 'novaSenha123'
    })
  })
);

const ToggleUserStatusRequestSchema = registry.register(
  'ToggleUserStatusRequest',
  z.object({
    isActive: z.boolean().openapi({
      description: 'Status do usuário',
      example: false
    })
  })
);

// Response schemas
const ListUsersResponseSchema = z.object({
  users: z.array(UserSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

const CreateUserResponseSchema = z.object({
  message: z.string(),
  user: UserSchema
});

const UpdateUserResponseSchema = z.object({
  message: z.string(),
  user: UserSchema
});

const TimeLogReportResponseSchema = z.object({
  timeLogs: z.array(TimeLogSchema),
  stats: z.object({
    totalTimeLogs: z.number(),
    approvedTimeLogs: z.number(),
    pendingTimeLogs: z.number(),
    rejectedTimeLogs: z.number(),
    manualTimeLogs: z.number()
  }),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

// Manager routes
registry.registerPath({
  method: 'get',
  path: '/manager/users',
  tags: ['Manager'],
  summary: 'Listar usuários',
  description: 'Lista todos os usuários com filtros e paginação. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    query: ListUsersRequestSchema
  },
  responses: {
    200: {
      description: 'Lista de usuários retornada com sucesso',
      content: {
        'application/json': {
          schema: ListUsersResponseSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: 'Acesso negado - apenas gestores',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/users/{id}',
  tags: ['Manager'],
  summary: 'Obter usuário por ID',
  description: 'Retorna os dados de um usuário específico. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ID do usuário',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'Usuário retornado com sucesso',
      content: {
        'application/json': {
          schema: UserSchema
        }
      }
    },
    404: {
      description: 'Usuário não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/users',
  tags: ['Manager'],
  summary: 'Criar usuário',
  description: 'Cria um novo usuário no sistema. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Usuário criado com sucesso',
      content: {
        'application/json': {
          schema: CreateUserResponseSchema
        }
      }
    },
    400: {
      description: 'Email já existe ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/manager/users/{id}',
  tags: ['Manager'],
  summary: 'Atualizar usuário',
  description: 'Atualiza os dados de um usuário. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ID do usuário',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateUserRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Usuário atualizado com sucesso',
      content: {
        'application/json': {
          schema: UpdateUserResponseSchema
        }
      }
    },
    404: {
      description: 'Usuário não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'patch',
  path: '/manager/users/{id}/toggle-status',
  tags: ['Manager'],
  summary: 'Ativar/Desativar usuário',
  description: 'Ativa ou desativa um usuário. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ID do usuário',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: ToggleUserStatusRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Status do usuário alterado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string()
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/manager/users/{id}',
  tags: ['Manager'],
  summary: 'Deletar usuário',
  description: 'Remove um usuário do sistema. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ID do usuário',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'Usuário deletado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string()
          })
        }
      }
    },
    400: {
      description: 'Não é possível deletar sua própria conta',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/users/change-password',
  tags: ['Manager'],
  summary: 'Alterar senha de usuário',
  description: 'Altera a senha de um usuário. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChangePasswordRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Senha alterada com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string()
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/users/{userId}/time-logs',
  tags: ['Manager'],
  summary: 'Listar pontos de usuário',
  description: 'Lista todos os pontos de um usuário específico. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      userId: z.string().openapi({
        description: 'ID do usuário',
        example: '1'
      })
    }),
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      startDate: z.string().date().optional(),
      endDate: z.string().date().optional()
    })
  },
  responses: {
    200: {
      description: 'Pontos do usuário retornados com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            timeLogs: z.array(TimeLogSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number()
            })
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/time-logs/manual',
  tags: ['Manager'],
  summary: 'Lançar ponto manual',
  description: 'Cria um lançamento manual de ponto para um usuário. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ManualTimeLogRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Ponto lançado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            timeLog: TimeLogSchema
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/time-logs/approve',
  tags: ['Manager'],
  summary: 'Aprovar/Rejeitar lançamento',
  description: 'Aprova ou rejeita um lançamento manual pendente. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ApproveTimeLogRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Lançamento processado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string()
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/time-logs/pending',
  tags: ['Manager'],
  summary: 'Listar lançamentos pendentes',
  description: 'Lista todos os lançamentos manuais pendentes de aprovação. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional()
    })
  },
  responses: {
    200: {
      description: 'Lançamentos pendentes retornados com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            timeLogs: z.array(TimeLogSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number()
            })
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/time-logs/report',
  tags: ['Manager'],
  summary: 'Relatório de pontos',
  description: 'Gera relatório de pontos com filtros e estatísticas. Requer permissões de gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    query: TimeLogReportRequestSchema
  },
  responses: {
    200: {
      description: 'Relatório gerado com sucesso',
      content: {
        'application/json': {
          schema: TimeLogReportResponseSchema
        }
      }
    }
  }
});

// Company and Invitation Management endpoints
registry.registerPath({
  method: 'get',
  path: '/manager/company',
  tags: ['Manager'],
  summary: 'Obter informações da empresa',
  description: 'Retorna as informações da empresa do gestor autenticado.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Informações da empresa retornadas com sucesso',
      content: {
        'application/json': {
          schema: CompanyResponseSchema
        }
      }
    },
    404: {
      description: 'Empresa não encontrada',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'put',
  path: '/manager/company',
  tags: ['Manager'],
  summary: 'Atualizar informações da empresa',
  description: 'Atualiza as informações da empresa do gestor autenticado.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().min(2).optional(),
            cnpj: z.string().regex(/^\d{14}$/).optional(),
            corporateName: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            website: z.string().url().optional(),
            address: z.string().optional(),
            city: z.string().optional(),
            state: z.string().length(2).optional(),
            zipCode: z.string().regex(/^\d{8}$/).optional(),
            country: z.string().optional(),
            description: z.string().optional()
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Empresa atualizada com sucesso',
      content: {
        'application/json': {
          schema: UpdateCompanyResponseSchema
        }
      }
    },
    400: {
      description: 'CNPJ já está em uso ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/invitations',
  tags: ['Manager'],
  summary: 'Criar convite para funcionário',
  description: 'Cria um convite para um funcionário se juntar à empresa.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateInvitationRequestSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Convite criado com sucesso',
      content: {
        'application/json': {
          schema: CreateInvitationResponseSchema
        }
      }
    },
    400: {
      description: 'Usuário já existe, convite já existe, ou erro de validação',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/invitations',
  tags: ['Manager'],
  summary: 'Listar convites da empresa',
  description: 'Lista todos os convites da empresa com filtros e paginação.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().openapi({
        description: 'Número da página (padrão: 1)',
        example: '1'
      }),
      limit: z.string().optional().openapi({
        description: 'Itens por página (padrão: 10)',
        example: '10'
      }),
      status: z.enum(['used', 'active', 'expired']).optional().openapi({
        description: 'Filtrar por status do convite'
      })
    })
  },
  responses: {
    200: {
      description: 'Lista de convites retornada com sucesso',
      content: {
        'application/json': {
          schema: InvitationListResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'delete',
  path: '/manager/invitations/{invitationId}',
  tags: ['Manager'],
  summary: 'Cancelar convite',
  description: 'Cancela um convite ativo.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      invitationId: z.string().openapi({
        description: 'ID do convite',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'Convite cancelado com sucesso',
      content: {
        'application/json': {
          schema: CancelInvitationResponseSchema
        }
      }
    },
    400: {
      description: 'Convite já foi utilizado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    404: {
      description: 'Convite não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/employees',
  tags: ['Manager'],
  summary: 'Listar funcionários da empresa',
  description: 'Lista todos os funcionários da empresa com filtros e paginação.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().openapi({
        description: 'Número da página (padrão: 1)',
        example: '1'
      }),
      limit: z.string().optional().openapi({
        description: 'Itens por página (padrão: 10)',
        example: '10'
      }),
      status: z.enum(['approved', 'pending', 'active', 'inactive']).optional().openapi({
        description: 'Filtrar por status do funcionário'
      }),
      search: z.string().optional().openapi({
        description: 'Buscar por nome ou email',
        example: 'João'
      })
    })
  },
  responses: {
    200: {
      description: 'Lista de funcionários retornada com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            employees: z.array(UserSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              pages: z.number()
            })
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'get',
  path: '/manager/employees/pending',
  tags: ['Manager'],
  summary: 'Listar funcionários pendentes de aprovação',
  description: 'Lista funcionários que aguardam aprovação do gestor.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.string().optional().openapi({
        description: 'Número da página (padrão: 1)',
        example: '1'
      }),
      limit: z.string().optional().openapi({
        description: 'Itens por página (padrão: 10)',
        example: '10'
      }),
      search: z.string().optional().openapi({
        description: 'Buscar por nome ou email',
        example: 'João'
      })
    })
  },
  responses: {
    200: {
      description: 'Lista de funcionários pendentes retornada com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            employees: z.array(UserSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              pages: z.number()
            })
          })
        }
      }
    }
  }
});

registry.registerPath({
  method: 'post',
  path: '/manager/employees/approve',
  tags: ['Manager'],
  summary: 'Aprovar ou rejeitar funcionário',
  description: 'Aprova ou rejeita um funcionário pendente.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ApproveEmployeeRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Funcionário processado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Funcionário aprovado com sucesso' }),
            employee: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
              isApproved: z.boolean(),
              isActive: z.boolean()
            })
          })
        }
      }
    },
    404: {
      description: 'Funcionário não encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// ==================== AUDIT ENDPOINTS ====================

// Audit Schemas
export const AuditHistoryItemSchema = registry.register(
  'AuditHistoryItem',
  z.object({
    id: z.number().openapi({ example: 1 }),
    user: z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'Pablo Silva' }),
      email: z.string().email().openapi({ example: 'pablo@email.com' })
    }),
    fieldName: z.string().openapi({ example: 'salary' }),
    fieldDisplayName: z.string().openapi({ example: 'Salário' }),
    oldValue: z.any().nullable().openapi({ example: 3000 }),
    newValue: z.any().nullable().openapi({ example: 3500 }),
    diff: z.string().openapi({ example: 'Salário: 3000 → 3500' }),
    changedBy: z.object({
      id: z.number().openapi({ example: 2 }),
      name: z.string().openapi({ example: 'Gestor Silva' }),
      email: z.string().email().openapi({ example: 'gestor@email.com' })
    }),
    justification: z.string().nullable().openapi({ example: 'Promoção aprovada' }),
    ipAddress: z.string().nullable().openapi({ example: '192.168.1.1' }),
    createdAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
  })
);

export const AuditConfigurationSchema = registry.register(
  'AuditConfiguration',
  z.object({
    trackedFields: z.array(z.string()).openapi({
      example: ['salary', 'position', 'department', 'isActive', 'role']
    }),
    requireJustification: z.boolean().openapi({ example: false }),
    isEnabled: z.boolean().openapi({ example: true }),
    updatedAt: z.string().datetime().openapi({ example: '2024-01-15T10:30:00Z' })
  })
);

export const UpdateAuditConfigRequestSchema = registry.register(
  'UpdateAuditConfigRequest',
  z.object({
    trackedFields: z.array(z.string()).openapi({
      example: ['salary', 'position', 'department', 'isActive', 'role']
    }),
    requireJustification: z.boolean().openapi({ example: false }),
    isEnabled: z.boolean().openapi({ example: true })
  })
);

export const AvailableFieldSchema = registry.register(
  'AvailableField',
  z.object({
    value: z.string().openapi({ example: 'salary' }),
    label: z.string().openapi({ example: 'Salário' })
  })
);

// GET /audit/history
registry.registerPath({
  method: 'get',
  path: '/audit/history',
  tags: ['Audit'],
  summary: 'Buscar histórico de alterações',
  description: 'Retorna histórico de alterações de usuários com filtros e paginação. Requer permissão de manager, hr ou admin.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      userId: z.string().regex(/^\d+$/).optional().openapi({
        description: 'ID do usuário para filtrar',
        example: '1'
      }),
      fieldName: z.string().optional().openapi({
        description: 'Nome do campo alterado',
        example: 'salary'
      }),
      changedById: z.string().regex(/^\d+$/).optional().openapi({
        description: 'ID de quem fez a alteração',
        example: '2'
      }),
      dateFrom: z.string().date().optional().openapi({
        description: 'Data inicial (YYYY-MM-DD)',
        example: '2024-01-01'
      }),
      dateTo: z.string().date().optional().openapi({
        description: 'Data final (YYYY-MM-DD)',
        example: '2024-12-31'
      }),
      page: z.string().optional().openapi({
        description: 'Número da página',
        example: '1'
      }),
      limit: z.string().optional().openapi({
        description: 'Itens por página',
        example: '10'
      })
    })
  },
  responses: {
    200: {
      description: 'Histórico retornado com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(AuditHistoryItemSchema),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              pages: z.number()
            })
          })
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: 'Sem permissão',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// GET /audit/configuration
registry.registerPath({
  method: 'get',
  path: '/audit/configuration',
  tags: ['Audit'],
  summary: 'Buscar configuração de auditoria',
  description: 'Retorna configuração de auditoria da empresa. Requer permissão de manager ou admin.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Configuração retornada com sucesso',
      content: {
        'application/json': {
          schema: AuditConfigurationSchema
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: 'Sem permissão',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// PUT /audit/configuration
registry.registerPath({
  method: 'put',
  path: '/audit/configuration',
  tags: ['Audit'],
  summary: 'Atualizar configuração de auditoria',
  description: 'Atualiza configuração de auditoria da empresa. Requer permissão de manager ou admin.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateAuditConfigRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Configuração atualizada com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: AuditConfigurationSchema
          })
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: 'Sem permissão',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

// GET /audit/available-fields
registry.registerPath({
  method: 'get',
  path: '/audit/available-fields',
  tags: ['Audit'],
  summary: 'Listar campos disponíveis para rastreamento',
  description: 'Retorna lista de todos os campos que podem ser rastreados. Requer permissão de manager ou admin.',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Campos retornados com sucesso',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(AvailableFieldSchema)
          })
        }
      }
    },
    401: {
      description: 'Não autenticado',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    },
    403: {
      description: 'Sem permissão',
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      }
    }
  }
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Chronos.work API',
      version: '1.0.0',
      description: 'API para gerenciamento de tempo de trabalho com autenticação de usuários e registro de check-in/check-out.',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints de autenticação de usuários'
      },
      {
        name: 'Time Tracking',
        description: 'Endpoints de controle de ponto'
      },
      {
        name: 'Manager',
        description: 'Endpoints de gerenciamento para gestores'
      },
      {
        name: 'Audit',
        description: 'Endpoints de auditoria e histórico de alterações'
      }
    ]
  });
}
