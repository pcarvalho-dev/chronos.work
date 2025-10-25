# ⚠️ FIX: Erro ENETUNREACH no Render + Supabase

## Problema
Você está vendo este erro nos logs do Render:
```
Error: connect ENETUNREACH 2600:1f18:... - Local (:::0)
  code: 'ENETUNREACH',
  address: '2600:1f18:2e13:9d30:f143:cf5f:2d1:136c',
```

## Causa
O Render está tentando conectar via IPv6, mas a infraestrutura não suporta.

## ✅ Solução em 5 Passos

### Passo 1: Pegar a Connection String CORRETA do Supabase

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** (ícone de engrenagem) > **Database**
4. Role até **Connection String**
5. **IMPORTANTE**: Clique na aba **Transaction** (não Session!)
6. Você verá algo assim:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
7. Copie e substitua `[YOUR-PASSWORD]` pela senha do seu banco

**Exemplo de string correta:**
```
postgresql://postgres.abcdefgh:minhasenha123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Características da string CORRETA:**
- ✅ Contém `pooler.supabase.com` no host
- ✅ Porta é `6543` (não 5432)
- ✅ Tem o formato `postgres.xxxxx` no username

### Passo 2: Configurar no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Selecione seu Web Service
3. Vá em **Environment**

### Passo 3: REMOVER variáveis antigas

Se você tiver estas variáveis, **DELETE todas elas**:
- ❌ `DB_HOST` - **REMOVER**
- ❌ `DB_PORT` - **REMOVER**
- ❌ `DB_USERNAME` - **REMOVER**
- ❌ `DB_PASSWORD` - **REMOVER**
- ❌ `DB_DATABASE` - **REMOVER**
- ❌ `DB_SSL` - **REMOVER**

### Passo 4: ADICIONAR a variável correta

Adicione APENAS esta variável:
- **Key**: `DATABASE_URL`
- **Value**: Cole a connection string do Supabase (com a senha substituída)

Exemplo:
```
DATABASE_URL=postgresql://postgres.abcdefgh:minhasenha123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Passo 5: Verificar outras variáveis obrigatórias

Certifique-se de que você também tem:
```
JWT_ACCESS_SECRET=seu-secret-aqui
JWT_REFRESH_SECRET=seu-refresh-secret-aqui
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-app-password
SMTP_FROM=Chronos.work <seu-email@gmail.com>
FRONTEND_URL=https://seu-frontend.vercel.app
```

### Passo 6: Redeploy

1. Salve as alterações nas variáveis de ambiente
2. O Render vai fazer redeploy automaticamente
3. **OU** vá em **Manual Deploy** > **Deploy latest commit**

### Passo 7: Verificar os logs

Após o deploy, nos logs você deve ver:
```
✓ Using DATABASE_URL for database connection
```

**Se aparecer isso, está ERRADO:**
```
✓ Using individual DB_* variables for database connection
```

## 🔍 Como saber se funcionou?

Nos logs do Render, você deve ver:
1. `✓ Using DATABASE_URL for database connection`
2. As migrations rodando com sucesso
3. O servidor iniciando normalmente

## ❓ Perguntas Frequentes

### Posso usar a connection string "Session" ao invés de "Transaction"?
Não recomendado. Use **Transaction** para melhor compatibilidade com TypeORM.

### A porta deve ser 6543 ou 5432?
- **6543** = Connection Pooler (✅ use este)
- **5432** = Direct Connection (❌ causa ENETUNREACH)

### Preciso do NODE_OPTIONS?
Com as mudanças no código, não deveria ser mais necessário, mas se quiser adicionar como garantia:
```
NODE_OPTIONS=--dns-result-order=ipv4first
```

### Como gerar JWT secrets seguros?
No terminal, rode:
```bash
openssl rand -base64 32
```

### Onde pego a senha do banco Supabase?
A senha foi definida quando você criou o projeto. Se esqueceu:
1. Vá em **Settings** > **Database**
2. Clique em **Reset database password**

## 📞 Precisa de ajuda?

Se mesmo após seguir todos os passos o erro persistir:
1. Copie os logs completos do Render
2. Verifique se a string tem a senha correta
3. Teste a conexão localmente primeiro com a mesma string

## ✅ Checklist Final

- [ ] Peguei a connection string do modo **Transaction** no Supabase
- [ ] Substituí `[YOUR-PASSWORD]` pela senha real
- [ ] Removi todas as variáveis `DB_*` do Render
- [ ] Adicionei a variável `DATABASE_URL` no Render
- [ ] Fiz redeploy manual no Render
- [ ] Verifiquei os logs e apareceu "Using DATABASE_URL"
- [ ] As migrations rodaram com sucesso
- [ ] O servidor iniciou normalmente

**Se todos os itens estão checados, seu deploy deve estar funcionando! 🎉**
