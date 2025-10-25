# Deploy no Render com Supabase

Este guia mostra como fazer deploy da API Chronos.work no Render usando PostgreSQL do Supabase.

## Pré-requisitos

1. Conta no [Render](https://render.com)
2. Conta no [Supabase](https://supabase.com)
3. Código no GitHub (Render faz deploy direto do repositório)

## Passo 1: Configurar PostgreSQL no Supabase

1. Acesse seu projeto no Supabase
2. Vá em **Project Settings** > **Database**
3. Role até a seção **Connection String**
4. **IMPORTANTE**: Use a string do modo **Transaction** (NÃO use Session)
   - Clique em **Transaction** (não Session)
   - O formato será: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - Note que a porta é **6543** (não 5432) quando usar o pooler
5. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha real do seu banco
6. Copie a string completa com a senha substituída

### Por que usar Transaction Mode?
- Mais compatível com ORMs como TypeORM
- Melhor para aplicações com múltiplas conexões
- Evita problemas de IPv6 que ocorrem no modo direto

## Passo 2: Criar Web Service no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **New** > **Web Service**
3. Conecte seu repositório GitHub
4. Configure o serviço:
   - **Name**: `chronos-work-api` (ou o que preferir)
   - **Environment**: `Node`
   - **Region**: escolha a região mais próxima
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run migration:run && npm run start:prod`

## Passo 3: Configurar Variáveis de Ambiente

Na seção **Environment Variables** do Render, adicione:

### Database (obrigatório)
```bash
DATABASE_URL=postgresql://postgres:[SUA-SENHA]@db.xxxxxx.supabase.co:5432/postgres
```
> **IMPORTANTE**: Use a connection string completa do Supabase copiada no Passo 1

### JWT (obrigatório)
```bash
JWT_ACCESS_SECRET=seu-secret-super-seguro-mude-em-producao-123456
JWT_REFRESH_SECRET=seu-refresh-secret-super-seguro-mude-em-producao-123456
```
> **DICA**: Gere secrets seguros com: `openssl rand -base64 32`

### Email/SMTP (obrigatório)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-app-password-do-gmail
SMTP_FROM=Chronos.work <seu-email@gmail.com>
```
> **NOTA**: Para Gmail, você precisa gerar uma [App Password](https://support.google.com/accounts/answer/185833)

### Frontend (obrigatório)
```bash
FRONTEND_URL=https://seu-frontend.vercel.app
```
> **NOTA**: URL do seu frontend para links em emails de reset de senha

### Opcional (mas recomendado)
```bash
NODE_ENV=production
PORT=8000
```

## Passo 4: Deploy

1. Clique em **Create Web Service**
2. Render irá:
   - Fazer build do código
   - Rodar as migrations (`npm run migration:run`)
   - Iniciar o servidor (`npm run start:prod`)
3. Aguarde o deploy finalizar (3-5 minutos na primeira vez)

## Passo 5: Verificar

1. Acesse a URL do seu serviço (ex: `https://chronos-work-api.onrender.com`)
2. Teste os endpoints:
   - **Health Check**: `GET /health`
   - **API Docs**: `GET /docs`
   - **OpenAPI Spec**: `GET /openapi.json`

## Troubleshooting

### Erro: `ENETUNREACH` ou `connect timeout` (MAIS COMUM)

**Sintoma**: Erro mostrando `Error: connect ENETUNREACH 2600:1f18:...` com endereço IPv6

**Causas possíveis**:
1. **Não está usando DATABASE_URL** - está tentando usar variáveis separadas (DB_HOST, etc)
2. **Connection string errada** - usando conexão direta ao invés do pooler
3. **Variáveis duplicadas** - tem DATABASE_URL E DB_HOST configurados

**Solução passo a passo**:

1. **Verificar qual connection string usar** no Supabase:
   ```
   ❌ ERRADO (Direct Connection - porta 5432):
   postgresql://postgres:pass@db.xxxxx.supabase.co:5432/postgres

   ✅ CORRETO (Transaction Pooler - porta 6543):
   postgresql://postgres.xxxxx:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

2. **No Render, remover TODAS estas variáveis** (se existirem):
   - `DB_HOST` ❌ remover
   - `DB_PORT` ❌ remover
   - `DB_USERNAME` ❌ remover
   - `DB_PASSWORD` ❌ remover
   - `DB_DATABASE` ❌ remover

3. **Adicionar APENAS**:
   - `DATABASE_URL` ✅ com a connection string do Transaction Pooler

4. **Verificar nos logs do Render** se aparece:
   ```
   ✓ Using DATABASE_URL for database connection
   ```
   Se aparecer "Using individual DB_* variables", a DATABASE_URL não está configurada!

5. **Fazer redeploy manual** após as mudanças

### Erro: `Missing environment variable`
- ✅ **Solução**: Verifique se todas as variáveis obrigatórias foram adicionadas no Render
- ✅ **Lista completa**: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `SMTP_*`, `FRONTEND_URL`

### Erro: `Migration failed`
- ✅ **Solução**: Verifique os logs do Render para detalhes
- ✅ **Causa comum**: Migrations já foram executadas (não é um problema se o app iniciar normalmente)

### Erro: `Port already in use`
- ✅ **Solução**: Remova a variável `PORT` ou deixe como `8000` (Render usa porta dinâmica internamente)

### Supabase: Connection limit reached
- ✅ **Solução**: Use **Connection Pooling** do Supabase
- ✅ **Como**: Pegue a connection string de **Transaction pooler mode** no painel do Supabase

## Configuração de Domínio Personalizado

1. No Render, vá em **Settings** > **Custom Domain**
2. Adicione seu domínio (ex: `api.chronos.work`)
3. Configure o DNS conforme instruções do Render
4. Render irá gerar certificado SSL automaticamente

## Monitoramento

- **Logs**: Disponíveis no dashboard do Render em tempo real
- **Metrics**: CPU, memória, e requisições no painel do Render
- **Alerts**: Configure notificações por email em caso de falhas

## Cusas

- **Render Free Tier**:
  - Aplicação hiberna após 15 minutos de inatividade
  - 750 horas/mês grátis
  - **IMPORTANTE**: Primeira requisição após hibernação demora ~30 segundos

- **Supabase Free Tier**:
  - 500MB de banco de dados
  - Pausa automaticamente após 7 dias de inatividade
  - 2GB de transferência/mês

## Próximos Passos

- [ ] Configurar CI/CD para deploy automático
- [ ] Adicionar testes antes do deploy
- [ ] Configurar variáveis de ambiente por ambiente (staging/production)
- [ ] Implementar logging estruturado (Winston, Pino)
- [ ] Adicionar monitoring (Sentry, DataDog, etc.)

## Links Úteis

- [Render Documentation](https://render.com/docs)
- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [TypeORM Migrations](https://typeorm.io/migrations)
