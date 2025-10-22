import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

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

export const RegisterRequestSchema = registry.register(
  'RegisterRequest',
  z.object({
    name: z.string().openapi({
      description: 'Nome completo do usuário',
      example: 'Pablo'
    }),
    email: z.string().email().openapi({
      description: 'Email do usuário (deve ser único)',
      example: 'pablo@email.com'
    }),
    password: z.string().min(6).openapi({
      description: 'Senha do usuário',
      example: '123456'
    })
  })
);

const UserSchema = registry.register(
  'User',
  z.object({
    id: z.number().int().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Pablo' }),
    email: z.string().email().openapi({ example: 'pablo@email.com' })
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

const LoginResponseSchema = z.object({
  message: z.string().openapi({ example: 'Logged in successfully' }),
  user: UserSchema
});

const CheckInResponseSchema = z.object({
  message: z.string().openapi({ example: 'Checked in successfully' }),
  checkIn: TimeLogSchema
});

const CheckOutResponseSchema = z.object({
  message: z.string().openapi({ example: 'Checked out successfully' }),
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
          schema: SuccessMessageSchema
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
  path: '/timelog/checkin',
  tags: ['Time Tracking'],
  summary: 'Registrar entrada',
  description: 'Registra o início do turno de trabalho do usuário autenticado',
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
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
  security: [{ cookieAuth: [] }],
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
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
          description: 'Autenticação via sessão usando cookie'
        }
      }
    }
  });
}
