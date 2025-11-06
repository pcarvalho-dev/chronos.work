# Documentação - Chronos.work API

## 📚 Índice de Documentação

Este diretório contém toda a documentação do projeto Chronos.work API.

---

## 🤖 Documentação Gerada por IA

Localização: [`docs/ai-generated/`](./ai-generated/)

### Testes
- 📖 [Guia de Configuração de Testes](./ai-generated/testing/test-setup-guide.md)
  - Setup completo do Vitest
  - Comandos disponíveis
  - Como escrever testes
  - Troubleshooting

- 📊 [Testes Implementados](./ai-generated/testing/implemented-tests.md)
  - Status atual (35 testes implementados)
  - Roadmap de testes
  - Próximos passos

### API *(Em breve)*
- 🔐 Documentação de Autenticação
- 📡 Guia de Endpoints
- ⚠️ Tratamento de Erros

### Arquitetura *(Em breve)*
- 🏗️ Visão Geral da Arquitetura
- 🗄️ Design do Banco de Dados
- 🎨 Padrões de Design

### Desenvolvimento *(Em breve)*
- 🚀 Guia de Setup
- 👥 Guia de Contribuição
- ✨ Melhores Práticas

---

## 📖 Documentação Manual

### Existente na Raiz do Projeto

- **[README.md](../README.md)** - Visão geral e quick start
- **[CLAUDE.md](../CLAUDE.md)** - Instruções para Claude Code AI
- **[OPENAPI_README.md](../OPENAPI_README.md)** - Documentação da API OpenAPI
- **[DEPLOY_RENDER.md](../DEPLOY_RENDER.md)** - Deploy no Render
- **[RENDER_ENETUNREACH_FIX.md](../RENDER_ENETUNREACH_FIX.md)** - Fix de erro de rede

### API Interativa
- **URL**: http://localhost:8000/docs
- **OpenAPI Spec**: http://localhost:8000/openapi.json

---

## 🧪 Testes

### Status Atual
```
✅ Implementados:     35 testes  (13%)
⏳ Pendentes:        232 testes  (87%)
📦 Total Estimado:   267 testes
```

### Comandos Rápidos
```bash
npm test                 # Rodar todos os testes
npm run test:watch       # Modo watch
npm run test:ui          # Interface visual
npm run test:coverage    # Relatório de cobertura
```

### Documentação Completa
👉 [Guia de Configuração de Testes](./ai-generated/testing/test-setup-guide.md)

---

## 🏗️ Arquitetura

### Stack Tecnológica
- **Runtime**: Node.js com ES Modules
- **Framework**: Express 5.x
- **Database**: PostgreSQL + TypeORM 0.3.x
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Zod
- **Testing**: Vitest 2.1.9
- **Documentation**: Scalar UI + OpenAPI

### Padrão MVC
```
src/
├── models/       # Entidades TypeORM
├── controllers/  # Lógica de negócio
├── routes/       # Definição de rotas
├── services/     # Serviços auxiliares
├── middlewares/  # Middlewares Express
└── schemas/      # Validação Zod
```

---

## 🚀 Quick Start

### 1. Instalação
```bash
npm install
```

### 2. Configuração
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Banco de Dados
```bash
docker-compose up -d          # Subir PostgreSQL
npm run migration:run         # Rodar migrações
```

### 4. Desenvolvimento
```bash
npm run dev                   # Modo desenvolvimento
npm start                     # Modo produção
```

### 5. Testes
```bash
npm test                      # Rodar testes
npm run test:coverage         # Cobertura
```

---

## 📝 Como Contribuir

### Adicionando Documentação

#### Documentação Manual
Adicione arquivos `.md` na raiz do projeto ou crie subpastas em `docs/`.

#### Documentação Gerada por IA
Será salva automaticamente em `docs/ai-generated/` seguindo a estrutura:
```
docs/ai-generated/
├── testing/       # Testes
├── api/           # API
├── architecture/  # Arquitetura
└── development/   # Desenvolvimento
```

### Adicionando Testes
1. Crie arquivo `.spec.ts` em `__tests__/` próximo ao código
2. Siga padrões em [test-setup-guide.md](./ai-generated/testing/test-setup-guide.md)
3. Execute `npm test` para validar
4. Atualize [implemented-tests.md](./ai-generated/testing/implemented-tests.md)

---

## 🔗 Links Úteis

### Projeto
- 🏠 [Repositório GitHub](https://github.com/seu-usuario/chronos-work)
- 🚀 [Deploy Render](https://chronos-work-api.onrender.com)
- 📊 [OpenAPI Docs](http://localhost:8000/docs)

### Tecnologias
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)

---

## 📞 Suporte

### Problemas Comuns
Veja seção de **[Troubleshooting](./ai-generated/testing/test-setup-guide.md#troubleshooting)** no guia de testes.

### Contato
- 📧 Email: suporte@chronos.work
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/chronos-work/issues)

---

**Última Atualização**: 2025-11-06
**Versão da API**: 1.0.0
**Status**: 🚀 Em Desenvolvimento Ativo
