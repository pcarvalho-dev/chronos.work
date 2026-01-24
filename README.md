# Chronos.work

API de controle de ponto e gerenciamento de tempo de trabalho construída com Node.js, Express, TypeORM e PostgreSQL.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Documentação Interativa](#documentação-interativa)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Migrations](#migrations)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Sobre o Projeto

Chronos.work é uma API REST para gerenciamento de tempo de trabalho que permite aos usuários fazer check-in e check-out, registrando suas horas de trabalho de forma simples e eficiente.

## ✨ Funcionalidades

- 🔐 **Autenticação de Usuários**: Sistema completo de registro e login com Passport.js
- ⏰ **Check-in/Check-out**: Registre entrada e saída do trabalho
- 📊 **Histórico de Registros**: Visualize todos os seus registros de ponto
- 📝 **Documentação Automática**: OpenAPI gerada automaticamente a partir do código
- 🎨 **Interface Interativa**: Teste a API diretamente pelo navegador com Scalar
- 🔒 **Senhas Seguras**: Hash de senhas com bcrypt
- ✅ **Validação de Dados**: Validação com Zod

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express 5.x** - Framework web
- **TypeORM 0.3.x** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional

### Autenticação
- **Passport.js** - Middleware de autenticação
- **express-session** - Gerenciamento de sessões
- **bcrypt** - Hash de senhas

### Validação e Documentação
- **Zod** - Validação de schemas
- **@asteasolutions/zod-to-openapi** - Geração automática de OpenAPI
- **Scalar** - Interface interativa de documentação

### DevOps
- **Docker Compose** - Orquestração de containers
- **tsx** - Execução de TypeScript
- **nodemon** - Auto-reload em desenvolvimento

## 📦 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Git

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone git@github.com:pcarvalho-dev/chronos.work.git
cd chronos.work
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=chronos_work_db
PORT=8000
SECRET=seu-secret-key-aqui
```

4. **Inicie o banco de dados com Docker**
```bash
docker-compose up -d
```

5. **Execute as migrations**
```bash
npm run migration:run
```

6. **Inicie o servidor**
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:8000`

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USERNAME` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do banco | `postgres` |
| `DB_DATABASE` | Nome do banco | `chronos_work_db` |
| `PORT` | Porta da API | `8000` |
| `SECRET` | Secret para sessões | - |

## 📖 Uso

### Registro de Usuário
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pablo",
    "email": "pablo@email.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pablo@email.com",
    "password": "123456"
  }' \
  -c cookies.txt
```

### Check-in
```bash
curl -X POST http://localhost:8000/timelog/checkin \
  -b cookies.txt
```

### Check-out
```bash
curl -X POST http://localhost:8000/timelog/checkout \
  -b cookies.txt
```

### Listar Registros
```bash
curl -X GET http://localhost:8000/timelog \
  -b cookies.txt
```

## 🔌 API Endpoints

### Autenticação (`/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Criar nova conta | ❌ |
| POST | `/auth/login` | Fazer login | ❌ |

### Controle de Ponto (`/timelog`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/timelog/checkin` | Registrar entrada | ✅ |
| POST | `/timelog/checkout` | Registrar saída | ✅ |
| GET | `/timelog` | Listar registros | ✅ |

### Outros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Health check |
| GET | `/docs` | Documentação interativa |
| GET | `/openapi.json` | Especificação OpenAPI |

## 📚 Documentação Interativa

Acesse a documentação interativa da API em:

**http://localhost:8000/docs**

A interface Scalar permite:
- ✅ Visualizar todos os endpoints
- ✅ Testar requisições diretamente no navegador
- ✅ Ver exemplos de request/response
- ✅ Explorar schemas de dados

### Geração Automática de Documentação

A documentação OpenAPI é gerada automaticamente a partir do código:

```bash
# Gerar documentação manualmente
npm run docs:gen

# A documentação é gerada automaticamente ao executar
npm start
npm run dev
```

Para saber mais sobre como adicionar novos endpoints à documentação, consulte o arquivo [OPENAPI_README.md](./OPENAPI_README.md).

## 📁 Estrutura do Projeto

```
chronos_work/
├── src/
│   ├── config/              # Configurações (Passport, etc)
│   ├── controllers/         # Lógica de negócio
│   │   ├── UserController.ts
│   │   └── TimeLogController.ts
│   ├── database/           # Configuração do banco
│   │   ├── data-source.ts
│   │   └── migrations/     # Migrations do TypeORM
│   ├── middlewares/        # Middlewares Express
│   │   ├── auth.ts
│   │   └── validate.ts
│   ├── models/             # Entidades TypeORM
│   │   ├── User.ts
│   │   └── UserCheckIn.ts
│   ├── routes/             # Definição de rotas
│   │   ├── auth.ts
│   │   └── timeLog.ts
│   ├── schemas/            # Schemas de validação Zod
│   │   ├── loginSchema.ts
│   │   └── registerSchema.ts
│   ├── utils/              # Utilitários
│   │   └── openapi-generator.ts
│   └── index.ts            # Entry point
├── scripts/                # Scripts auxiliares
│   └── generate-openapi.ts
├── docker-compose.yml      # Configuração Docker
├── openapi.json           # Especificação OpenAPI (gerado)
├── package.json
├── tsconfig.json
├── CLAUDE.md              # Instruções para Claude Code
├── OPENAPI_README.md      # Guia de documentação
└── README.md              # Este arquivo
```

### Arquitetura MVC

O projeto segue o padrão **Model-View-Controller (MVC)**:

- **Models** (`src/models/`): Definem a estrutura de dados com TypeORM
- **Controllers** (`src/controllers/`): Contêm a lógica de negócio
- **Routes** (`src/routes/`): Mapeiam URLs para controllers

## 🗄️ Migrations

### Executar Migrations
```bash
npm run migration:run
```

### Reverter Migration
```bash
npm run migration:revert
```

### Gerar Nova Migration
```bash
npm run migration:gen --name=NomeDaMigration
```

### Acesso Direto ao TypeORM CLI
```bash
npm run typeorm -- [comando]
```

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia servidor (gera docs automaticamente) |
| `npm run dev` | Modo desenvolvimento com auto-reload |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm run start:prod` | Inicia servidor de produção |
| `npm run docs:gen` | Gera documentação OpenAPI |
| `npm run migration:run` | Executa migrations pendentes |
| `npm run migration:revert` | Reverte última migration |
| `npm run migration:gen` | Gera nova migration |

## 🧪 Desenvolvimento

### Adicionando Novos Endpoints

1. **Crie o schema Zod** em `src/schemas/`
2. **Crie o controller** em `src/controllers/`
3. **Defina a rota** em `src/routes/`
4. **Adicione à documentação** em `src/utils/openapi-generator.ts`
5. **Gere a documentação**: `npm run docs:gen`

### Exemplo Completo

Consulte o arquivo [CLAUDE.md](./CLAUDE.md) para padrões de código e melhores práticas.

## 🐳 Docker

O projeto inclui `docker-compose.yml` para PostgreSQL:

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

**Pablo Carvalho**

- GitHub: [@pcarvalho-dev](https://github.com/pcarvalho-dev)
- Projeto: [chronos.work](https://github.com/pcarvalho-dev/chronos.work)
