# Deploy no Google Cloud Run - Chronos.work API

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Preparação do Projeto](#preparação-do-projeto)
- [Deploy Manual](#deploy-manual)
- [Deploy com CI/CD](#deploy-com-cicd)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este guia cobre o deploy completo da API Chronos.work no **Google Cloud Run**, incluindo:
- ✅ Containerização com Docker
- ✅ Cloud SQL (PostgreSQL)
- ✅ Secret Manager para credenciais
- ✅ Cloud Storage para uploads
- ✅ CI/CD com Cloud Build

### Arquitetura no Cloud

```
┌─────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐         ┌──────────────────┐       │
│  │  Cloud Run     │────────▶│  Cloud SQL       │       │
│  │  (API)         │         │  (PostgreSQL)    │       │
│  └────────────────┘         └──────────────────┘       │
│         │                                                │
│         ├──────────────────▶ Secret Manager             │
│         │                                                │
│         └──────────────────▶ Cloud Storage              │
│                               (Uploads)                  │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │  Cloud Build (CI/CD)                       │        │
│  │  GitHub → Build → Deploy                   │        │
│  └────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Pré-requisitos

### 1. Conta Google Cloud
```bash
# Criar projeto
gcloud projects create chronos-work --name="Chronos.work"
gcloud config set project chronos-work

# Habilitar APIs necessárias
gcloud services enable \
    run.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    cloudresourcemanager.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    storage-api.googleapis.com
```

### 2. Ferramentas Instaladas
- **gcloud CLI**: [Instalar](https://cloud.google.com/sdk/docs/install)
- **Docker**: [Instalar](https://docs.docker.com/get-docker/)
- **Git**: [Instalar](https://git-scm.com/)

### 3. Autenticação
```bash
# Login no Google Cloud
gcloud auth login

# Configurar Docker para GCR
gcloud auth configure-docker

# Verificar configuração
gcloud config list
```

---

## 🛠️ Preparação do Projeto

### 1. Testar Localmente com Docker

```bash
# Build da imagem
npm run docker:build

# Ou manualmente
docker build -t chronos-work-api .

# Testar localmente
docker run -p 8000:8000 --env-file .env chronos-work-api

# Verificar
curl http://localhost:8000/health
```

### 2. Testar com Docker Compose

```bash
# Subir ambiente completo (app + postgres)
npm run docker:up

# Ver logs
npm run docker:logs

# Parar
npm run docker:down
```

---

## 🚀 Deploy Manual

### Passo 1: Criar Cloud SQL (PostgreSQL)

```bash
# Criar instância PostgreSQL
gcloud sql instances create chronos-work-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=southamerica-east1 \
    --root-password=YOUR_STRONG_PASSWORD \
    --backup \
    --backup-start-time=03:00

# Criar database
gcloud sql databases create chronos_work \
    --instance=chronos-work-db

# Criar usuário
gcloud sql users create chronos_user \
    --instance=chronos-work-db \
    --password=YOUR_USER_PASSWORD
```

**Nota**: Para produção, use `db-g1-small` ou superior.

### Passo 2: Configurar Secrets

```bash
# JWT Secrets
echo -n "your-super-secret-access-key" | \
    gcloud secrets create jwt-access-secret --data-file=-

echo -n "your-super-secret-refresh-key" | \
    gcloud secrets create jwt-refresh-secret --data-file=-

# Database Password
echo -n "YOUR_USER_PASSWORD" | \
    gcloud secrets create db-password --data-file=-

# SMTP
echo -n "smtp-password" | \
    gcloud secrets create smtp-password --data-file=-

# Cloudinary
echo -n "cloudinary-api-secret" | \
    gcloud secrets create cloudinary-secret --data-file=-
```

### Passo 3: Build e Push da Imagem

```bash
# Definir variáveis
PROJECT_ID=$(gcloud config get-value project)
IMAGE_NAME="gcr.io/${PROJECT_ID}/chronos-work-api"

# Build
docker build -t ${IMAGE_NAME}:latest .

# Push para Google Container Registry
docker push ${IMAGE_NAME}:latest
```

### Passo 4: Deploy no Cloud Run

```bash
# Deploy
gcloud run deploy chronos-work-api \
    --image=${IMAGE_NAME}:latest \
    --platform=managed \
    --region=southamerica-east1 \
    --allow-unauthenticated \
    --min-instances=0 \
    --max-instances=10 \
    --memory=512Mi \
    --cpu=1 \
    --timeout=300 \
    --port=8000 \
    --set-env-vars="NODE_ENV=production,PORT=8000" \
    --set-secrets="JWT_ACCESS_SECRET=jwt-access-secret:latest,JWT_REFRESH_SECRET=jwt-refresh-secret:latest,DB_PASSWORD=db-password:latest,SMTP_PASS=smtp-password:latest,CLOUDINARY_API_SECRET=cloudinary-secret:latest" \
    --add-cloudsql-instances=chronos-work-db

# Obter URL
gcloud run services describe chronos-work-api \
    --region=southamerica-east1 \
    --format='value(status.url)'
```

### Passo 5: Configurar Variáveis de Ambiente

```bash
# Atualizar service com todas env vars
gcloud run services update chronos-work-api \
    --region=southamerica-east1 \
    --set-env-vars="\
DB_HOST=/cloudsql/PROJECT_ID:southamerica-east1:chronos-work-db,\
DB_PORT=5432,\
DB_USERNAME=chronos_user,\
DB_DATABASE=chronos_work,\
FRONTEND_URL=https://seu-frontend.com,\
SMTP_HOST=smtp.gmail.com,\
SMTP_PORT=587,\
SMTP_USER=seu-email@gmail.com,\
SMTP_FROM=noreply@chronos.work,\
CLOUDINARY_CLOUD_NAME=seu-cloud,\
CLOUDINARY_API_KEY=sua-api-key"
```

### Passo 6: Executar Migrações

```bash
# Conectar ao Cloud SQL via Cloud Shell
gcloud sql connect chronos-work-db --user=chronos_user

# Ou usar proxy local
cloud_sql_proxy -instances=PROJECT_ID:southamerica-east1:chronos-work-db=tcp:5432

# Executar migrações (localmente com proxy rodando)
npm run migration:run:prod
```

---

## 🔄 Deploy com CI/CD (Automatizado)

### Passo 1: Criar `cloudbuild.yaml`

```yaml
# cloudbuild.yaml
steps:
  # Build da imagem
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/chronos-work-api:$COMMIT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/chronos-work-api:latest'
      - '.'

  # Push da imagem
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/chronos-work-api:$COMMIT_SHA'

  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/chronos-work-api:latest'

  # Deploy no Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'chronos-work-api'
      - '--image=gcr.io/$PROJECT_ID/chronos-work-api:$COMMIT_SHA'
      - '--region=southamerica-east1'
      - '--platform=managed'

images:
  - 'gcr.io/$PROJECT_ID/chronos-work-api:$COMMIT_SHA'
  - 'gcr.io/$PROJECT_ID/chronos-work-api:latest'

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

timeout: '1200s'
```

### Passo 2: Configurar GitHub Actions (Alternativa)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  PROJECT_ID: chronos-work
  SERVICE_NAME: chronos-work-api
  REGION: southamerica-east1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ env.PROJECT_ID }}

      - name: Configure Docker
        run: gcloud auth configure-docker

      - name: Build
        run: docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA .

      - name: Push
        run: docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA

      - name: Deploy
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
            --region $REGION \
            --platform managed
```

---

## 🗄️ Configuração do Banco de Dados

### Opção 1: Cloud SQL (Recomendado)

**Vantagens**:
- ✅ Gerenciado pelo Google
- ✅ Backups automáticos
- ✅ Alta disponibilidade
- ✅ Escalável

**Custos**: ~$10-50/mês (dependendo do tier)

### Opção 2: PostgreSQL Externo

Você pode usar qualquer PostgreSQL externo:
- Supabase
- Neon
- ElephantSQL
- Railway
- Seu próprio servidor

```bash
# Atualizar env vars
gcloud run services update chronos-work-api \
    --region=southamerica-east1 \
    --set-env-vars="DB_HOST=external-host.com,DB_PORT=5432"
```

---

## 🔐 Variáveis de Ambiente

### Lista Completa

| Variável | Descrição | Obrigatória | Exemplo |
|----------|-----------|-------------|---------|
| `NODE_ENV` | Ambiente | ✅ | `production` |
| `PORT` | Porta da API | ✅ | `8000` |
| `DB_HOST` | Host do PostgreSQL | ✅ | `/cloudsql/...` ou `host.com` |
| `DB_PORT` | Porta do PostgreSQL | ✅ | `5432` |
| `DB_USERNAME` | Usuário do banco | ✅ | `chronos_user` |
| `DB_PASSWORD` | Senha (usar Secret) | ✅ | `secret:db-password` |
| `DB_DATABASE` | Nome do banco | ✅ | `chronos_work` |
| `JWT_ACCESS_SECRET` | Secret JWT access | ✅ | `secret:jwt-access` |
| `JWT_REFRESH_SECRET` | Secret JWT refresh | ✅ | `secret:jwt-refresh` |
| `FRONTEND_URL` | URL do frontend | ✅ | `https://app.chronos.work` |
| `SMTP_HOST` | Servidor SMTP | ✅ | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | ✅ | `587` |
| `SMTP_USER` | Usuário SMTP | ✅ | `email@gmail.com` |
| `SMTP_PASS` | Senha SMTP (Secret) | ✅ | `secret:smtp-pass` |
| `SMTP_FROM` | Email remetente | ✅ | `noreply@chronos.work` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name | ✅ | `chronos-work` |
| `CLOUDINARY_API_KEY` | API Key | ✅ | `123456789` |
| `CLOUDINARY_API_SECRET` | API Secret (Secret) | ✅ | `secret:cloudinary` |

---

## 📊 Monitoramento

### Cloud Logging

```bash
# Ver logs em tempo real
gcloud run services logs tail chronos-work-api \
    --region=southamerica-east1

# Logs de erro
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
    --limit=50 \
    --format=json
```

### Cloud Monitoring

Acesse: https://console.cloud.google.com/monitoring

Métricas importantes:
- **Request Count**: Número de requisições
- **Request Latencies**: Tempo de resposta
- **Container CPU**: Uso de CPU
- **Container Memory**: Uso de memória
- **Billable Instance Time**: Tempo faturável

### Alertas Recomendados

```bash
# Criar alerta para alta latência
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Latency Alert" \
    --condition-display-name="Latency > 2s" \
    --condition-threshold-value=2000 \
    --condition-threshold-duration=60s
```

---

## 🐛 Troubleshooting

### Erro: "Cloud SQL connection failed"

**Causa**: Conexão com Cloud SQL não configurada

**Solução**:
```bash
# Verificar se Cloud SQL está linkado
gcloud run services describe chronos-work-api \
    --region=southamerica-east1 \
    --format="value(metadata.annotations)"

# Adicionar conexão
gcloud run services update chronos-work-api \
    --add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE_NAME
```

### Erro: "Container failed to start"

**Causa**: Variáveis de ambiente faltando ou incorretas

**Solução**:
```bash
# Verificar env vars
gcloud run services describe chronos-work-api \
    --region=southamerica-east1 \
    --format="value(spec.template.spec.containers[0].env)"

# Testar localmente
docker run -p 8000:8000 --env-file .env gcr.io/PROJECT_ID/chronos-work-api
```

### Erro: "Secret not found"

**Causa**: Secret não existe ou permissões incorretas

**Solução**:
```bash
# Listar secrets
gcloud secrets list

# Ver versões
gcloud secrets versions list SECRET_NAME

# Dar permissão ao Cloud Run
gcloud secrets add-iam-policy-binding SECRET_NAME \
    --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

### Performance Lenta

**Soluções**:
1. Aumentar recursos:
```bash
gcloud run services update chronos-work-api \
    --memory=1Gi \
    --cpu=2
```

2. Manter instância warm (evitar cold start):
```bash
gcloud run services update chronos-work-api \
    --min-instances=1
```

3. Otimizar Dockerfile (já otimizado com multi-stage build)

---

## 💰 Estimativa de Custos

### Configuração Básica (Desenvolvimento)
- **Cloud Run**: ~$5-10/mês (0-1 instância)
- **Cloud SQL (db-f1-micro)**: ~$10/mês
- **Cloud Storage**: ~$1/mês
- **Total**: **~$16-21/mês**

### Configuração Produção (Médio Tráfego)
- **Cloud Run**: ~$30-50/mês (1-3 instâncias)
- **Cloud SQL (db-g1-small)**: ~$50/mês
- **Cloud Storage**: ~$5/mês
- **Total**: **~$85-105/mês**

**Dica**: Use o [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)

---

## 🎯 Checklist de Deploy

- [ ] Criar projeto no Google Cloud
- [ ] Habilitar APIs necessárias
- [ ] Criar instância Cloud SQL
- [ ] Configurar secrets no Secret Manager
- [ ] Build e push da imagem Docker
- [ ] Deploy no Cloud Run
- [ ] Executar migrações
- [ ] Configurar domínio customizado (opcional)
- [ ] Configurar CI/CD (opcional)
- [ ] Configurar monitoramento e alertas
- [ ] Testar endpoints
- [ ] Configurar backups automáticos

---

## 📚 Recursos Adicionais

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Best Practices for Cloud Run](https://cloud.google.com/run/docs/tips)

---

**Gerado automaticamente** - Chronos.work API
**Data**: 2025-11-06
**Versão**: 1.0.0
