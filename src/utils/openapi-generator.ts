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

const ProfilePhotoResponseSchema = z.object({
  profilePhoto: z.string().nullable().openapi({
    example: '/uploads/profiles/abc123.jpg',
    description: 'URL da foto de perfil do usuário'
  })
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

// Register routes
registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Authentication'],
  summary: 'Registrar novo usuário',
  description: 'Cria uma nova conta de usuário no sistema',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterRequestSchema,
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Usuário criado com sucesso',
      content: {
        'application/json': {
          schema: RegisterResponseSchema
        }
      }
    },
    400: {
      description: 'Erro de validação ou usuário já existe',
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
  description: 'Registra o início do turno de trabalho do usuário autenticado',
  security: [{ bearerAuth: [] }],
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
      description: 'Usuário já possui check-in ativo',
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
  description: 'Registra o fim do turno de trabalho do usuário autenticado',
  security: [{ bearerAuth: [] }],
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
      description: 'Usuário não possui check-in ativo',
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
  description: 'Retorna todos os registros de ponto do usuário autenticado, ordenados por data de entrada (mais recentes primeiro)',
  security: [{ bearerAuth: [] }],
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
      }
    ]
  });
}
