# OBRAX QUANTUM — Guia para Manus

> **Leia este arquivo antes de fazer qualquer alteração no projeto.**

Este documento é o ponto de entrada para o Manus (ou qualquer IA) que vai trabalhar no projeto OBRAX QUANTUM. Ele contém as regras essenciais e links para a documentação completa.

---

## Regras Obrigatórias

1. **Não criar projetos novos.** Alterar apenas os repositórios existentes.
2. **Consultar a documentação** antes de implementar qualquer feature.
3. **Documentar eventos e intenções** antes de implementar.
4. **Usar Conventional Commits** para todas as alterações.
5. **Não fazer deploy manual.** O Render faz deploy automático.

---

## Arquitetura

| Componente | Tecnologia | URL |
|------------|------------|-----|
| Frontend | Vite + React | https://obrax-quantum.onrender.com |
| Backend | FastAPI | https://obrax-backend.onrender.com |
| Banco de Dados | PostgreSQL | Supabase (gerenciado) |
| Automação | n8n | Instância própria |

---

## Documentação

| Documento | Descrição |
|-----------|-----------|
| [OBRAX_SYSTEM_RULES.md](docs/OBRAX_SYSTEM_RULES.md) | Regras gerais do sistema |
| [OBRAX_EVENT_CONTRACT.md](docs/OBRAX_EVENT_CONTRACT.md) | Contratos de eventos |
| [OBRAX_INTENT_MAP.md](docs/OBRAX_INTENT_MAP.md) | Mapa de intenções do usuário |
| [OBRAX_MANUS_MASTER_PROMPT.md](docs/OBRAX_MANUS_MASTER_PROMPT.md) | Prompt master para sessões |

---

## Checklist Antes de Implementar

- [ ] Li `docs/OBRAX_SYSTEM_RULES.md`
- [ ] Identifiquei a intenção do usuário em `docs/OBRAX_INTENT_MAP.md`
- [ ] Verifiquei se o evento está documentado em `docs/OBRAX_EVENT_CONTRACT.md`
- [ ] Planejei as alterações em cada camada (frontend/backend/n8n)
- [ ] Não vou criar projeto novo, apenas alterar o existente

---

## Endpoints Principais

### Autenticação (públicos)

```
POST /auth/login    → {username, password} → {access_token, token_type}
POST /auth/register → {username, password} → {id, username}
```

### API (protegidos, requer Bearer token)

```
GET  /api/test       → Teste de autenticação
GET  /api/works      → Listar obras
POST /api/works      → Criar obra
GET  /api/activities → Listar atividades
POST /api/activities → Criar atividade
```

---

## Exemplo de cURL

```bash
# Login
curl -X POST 'https://obrax-backend.onrender.com/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin2", "password": "123456"}'

# Listar obras (com token)
curl -X GET 'https://obrax-backend.onrender.com/api/works' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI'

# Criar obra (com token)
curl -X POST 'https://obrax-backend.onrender.com/api/works' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer SEU_TOKEN_AQUI' \
  -d '{
    "name": "Torre Infinita",
    "work_type": "RESIDENTIAL",
    "status": "ACTIVE",
    "location": "Itajaí/SC"
  }'
```

---

## Estrutura do Repositório

```
obrax-quantum/
├── frontend/           # Código do frontend (Vite + React)
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── pages/      # Páginas da aplicação
│   │   └── lib/        # Utilitários (api.js, auth.js)
│   └── ...
├── docs/               # Documentação de governança
│   ├── OBRAX_SYSTEM_RULES.md
│   ├── OBRAX_EVENT_CONTRACT.md
│   ├── OBRAX_INTENT_MAP.md
│   └── OBRAX_MANUS_MASTER_PROMPT.md
├── .github/
│   └── ISSUE_TEMPLATE/ # Templates para issues
├── MANUS.md            # Este arquivo
└── README.md           # Documentação geral
```

---

## Contato

Para dúvidas sobre o projeto, consulte a documentação ou abra uma issue no repositório.
