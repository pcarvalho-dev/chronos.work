# Geração Automática de Documentação OpenAPI

Este projeto agora gera automaticamente a documentação OpenAPI a partir do código TypeScript.

## Como funciona

A documentação é gerada a partir de:
- **Schemas Zod** definidos em `src/utils/openapi-generator.ts`
- **Rotas registradas** automaticamente com metadados OpenAPI
- **Exemplos** incluídos diretamente no código

## Comandos disponíveis

### Gerar documentação manualmente
```bash
npm run docs:generate
```

### Iniciar servidor (gera documentação automaticamente)
```bash
npm start
# ou
npm run dev
```

A documentação é gerada automaticamente antes de iniciar o servidor!

## Como adicionar novos endpoints

1. **Defina o schema Zod no arquivo `src/utils/openapi-generator.ts`**:
```typescript
const MyRequestSchema = registry.register(
  'MyRequest',
  z.object({
    field: z.string().openapi({
      description: 'Descrição do campo',
      example: 'valor de exemplo'
    })
  })
);
```

2. **Registre a rota no mesmo arquivo**:
```typescript
registry.registerPath({
  method: 'post',
  path: '/my-endpoint',
  tags: ['My Tag'],
  summary: 'Título do endpoint',
  description: 'Descrição detalhada',
  request: {
    body: {
      content: {
        'application/json': {
          schema: MyRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Sucesso',
      content: {
        'application/json': {
          schema: MyResponseSchema
        }
      }
    }
  }
});
```

3. **Execute o comando para regenerar**:
```bash
npm run docs:generate
```

## Vantagens

✅ **Sem edição manual** - O `openapi.json` é gerado automaticamente
✅ **Sempre atualizado** - Gerado antes de cada execução do servidor
✅ **Type-safe** - Usa os mesmos schemas Zod da validação
✅ **Exemplos integrados** - Exemplos definidos junto com o código
✅ **Versionado** - Alterações na documentação aparecem no Git

## Arquivos importantes

- `src/utils/openapi-generator.ts` - Define schemas e rotas com metadados OpenAPI
- `scripts/generate-openapi.ts` - Script que gera o arquivo `openapi.json`
- `openapi.json` - Arquivo gerado (não editar manualmente!)

## Visualizar documentação

Acesse: http://localhost:8000/docs

A interface Scalar permite testar todos os endpoints interativamente!
