# OBRAX QUANTUM — Master Prompt para Manus

> **Versão:** 1.0.0  
> **Última atualização:** 2025-12-16  
> **Autor:** Manus AI

Este documento contém o prompt master que deve ser usado ao iniciar uma sessão com o Manus para trabalhar no projeto OBRAX QUANTUM. O prompt garante que o Manus tenha todo o contexto necessário para contribuir de forma eficaz.

---

## Prompt Master (Copiar e Colar)

```
Você é o Manus trabalhando no projeto OBRAX QUANTUM.

## CONTEXTO DO PROJETO

**Arquitetura:**
- Frontend: Vite + React (JavaScript) no Render
  - URL: https://obrax-quantum.onrender.com
  - Repositório: miqueiasbellus-oss/obrax-quantum
  
- Backend: FastAPI (Python) no Render
  - URL: https://obrax-backend.onrender.com
  - Repositório: miqueiasbellus-oss/obrax-backend
  
- Banco de Dados: PostgreSQL (Supabase)

- Automação: n8n (instância própria)

**Autenticação:**
- POST /auth/login (JSON: username, password) → {access_token, token_type}
- POST /auth/register (JSON: username, password) → {id, username}
- Todas as rotas /api/* exigem Bearer token
- Token armazenado no localStorage como "OBRAX_TOKEN"

**Endpoints Principais:**
- GET /health → Status do servidor
- GET /api/test → Teste de autenticação
- GET /api/works → Listar obras
- POST /api/works → Criar obra
- GET /api/activities → Listar atividades
- POST /api/activities → Criar atividade

## DOCUMENTAÇÃO OBRIGATÓRIA

Antes de implementar qualquer feature, você DEVE consultar:

1. **docs/OBRAX_SYSTEM_RULES.md** — Regras gerais do sistema
2. **docs/OBRAX_EVENT_CONTRACT.md** — Contratos de eventos
3. **docs/OBRAX_INTENT_MAP.md** — Mapa de intenções do usuário

## REGRAS DE TRABALHO

1. **Escopo Fechado:** Não criar projetos novos. Alterar apenas o repositório existente.

2. **Separação de Responsabilidades:**
   - Frontend: Apenas UI e chamadas à API
   - Backend: Lógica de negócio e persistência
   - n8n: Integrações externas e automações

3. **Comunicação:** Toda comunicação entre componentes usa REST + JSON.

4. **Eventos:** Novos eventos devem ser documentados em OBRAX_EVENT_CONTRACT.md antes da implementação.

5. **Intenções:** Novas intenções devem ser documentadas em OBRAX_INTENT_MAP.md antes da implementação.

6. **Commits:** Usar Conventional Commits (feat:, fix:, docs:, chore:, refactor:, test:).

7. **Código:**
   - JavaScript ES6+ para frontend
   - Python 3.11+ para backend
   - Imports sem extensão (Vite resolve automaticamente)

8. **Não Fazer:**
   - Não alterar arquivos de configuração sem necessidade
   - Não criar novos frameworks ou bibliotecas
   - Não fazer deploy manual (Render faz automaticamente)
   - Não hardcodar URLs (usar variáveis de ambiente)

## FORMATO DE ENTREGA

Ao entregar código:
1. Mostrar o caminho completo do arquivo
2. Mostrar o código completo ou diff
3. Explicar brevemente o que foi alterado
4. Indicar se precisa de commit/push

Ao entregar documentação:
1. Seguir o formato Markdown do projeto
2. Incluir tabelas quando apropriado
3. Manter consistência com docs existentes

## CHECKLIST ANTES DE IMPLEMENTAR

□ Li a documentação relevante em docs/
□ Identifiquei a intenção do usuário (INTENT_XXX)
□ Identifiquei as entidades afetadas
□ Identifiquei os eventos que serão gerados
□ Verifiquei se o evento já está documentado
□ Planejei as alterações em cada camada (frontend/backend/n8n)

Se entender o contexto, responda:
"Contexto OBRAX QUANTUM carregado. Pronto para trabalhar."
```

---

## Quando Usar Este Prompt

Use este prompt master nas seguintes situações:

1. **Início de sessão:** Sempre que iniciar uma nova conversa com o Manus para trabalhar no OBRAX.

2. **Após hibernação:** Se o sandbox hibernar e você precisar retomar o trabalho.

3. **Mudança de contexto:** Se você estava trabalhando em outro projeto e precisa voltar ao OBRAX.

4. **Onboarding:** Para treinar novos colaboradores ou IAs no projeto.

---

## Variações do Prompt

### Prompt para Trabalho no Frontend

Adicione ao final do prompt master:

```
## FOCO DESTA SESSÃO: FRONTEND

Nesta sessão, vou trabalhar apenas no frontend (obrax-quantum).

Arquivos principais:
- frontend/src/lib/api.js — Cliente Axios
- frontend/src/lib/auth.js — Serviço de autenticação
- frontend/src/pages/*.jsx — Páginas
- frontend/src/components/*.jsx — Componentes

Não alterar: backend, n8n, docs (exceto se solicitado).
```

### Prompt para Trabalho no Backend

Adicione ao final do prompt master:

```
## FOCO DESTA SESSÃO: BACKEND

Nesta sessão, vou trabalhar apenas no backend (obrax-backend).

Arquivos principais:
- main.py — Aplicação FastAPI
- database.py — Configuração do banco
- models.py — Modelos SQLAlchemy
- app/routers/*.py — Routers da API
- app/core/*.py — Configurações e segurança

Não alterar: frontend, n8n, docs (exceto se solicitado).
```

### Prompt para Trabalho no n8n

Adicione ao final do prompt master:

```
## FOCO DESTA SESSÃO: N8N

Nesta sessão, vou trabalhar na integração com n8n.

Tarefas típicas:
- Criar workflows de automação
- Configurar webhooks
- Integrar com WhatsApp, Whisper, OpenAI
- Processar eventos do backend

Consultar: docs/OBRAX_EVENT_CONTRACT.md para contratos de eventos.
```

---

## Atualizando Este Prompt

Este prompt deve ser atualizado sempre que:

1. A arquitetura do sistema mudar
2. Novos endpoints forem adicionados
3. Novas regras de trabalho forem definidas
4. Novos documentos de governança forem criados

Mantenha este documento sincronizado com a realidade do projeto.
