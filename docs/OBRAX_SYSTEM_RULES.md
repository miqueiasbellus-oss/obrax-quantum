# OBRAX QUANTUM — Regras do Sistema

> **Versão:** 1.0.0  
> **Última atualização:** 2025-12-16  
> **Autor:** Manus AI

Este documento define as regras fundamentais que governam o desenvolvimento, integração e operação do sistema OBRAX QUANTUM. Todas as contribuições, features e integrações devem seguir estas diretrizes.

---

## 1. Arquitetura de Referência

O OBRAX QUANTUM segue uma arquitetura de três camadas com automação via n8n:

| Camada | Tecnologia | URL de Produção |
|--------|------------|-----------------|
| **Frontend** | Vite + React | `https://obrax-quantum.onrender.com` |
| **Backend** | FastAPI (Python) | `https://obrax-backend.onrender.com` |
| **Banco de Dados** | PostgreSQL (Supabase) | Gerenciado via Supabase |
| **Automação** | n8n | Instância própria (a configurar) |

---

## 2. Regras de Desenvolvimento

### 2.1 Separação de Responsabilidades

O sistema segue o princípio de **separação clara de responsabilidades**:

- **Frontend:** Apenas apresentação e interação com o usuário. Não deve conter lógica de negócio complexa.
- **Backend:** Toda lógica de negócio, validação e persistência de dados.
- **n8n:** Orquestração de workflows, integrações externas e automações.

### 2.2 Comunicação entre Camadas

Toda comunicação entre camadas deve seguir o padrão **REST + JSON**:

- Endpoints do backend seguem o padrão `/api/{recurso}` para rotas protegidas.
- Endpoints de autenticação seguem o padrão `/auth/{ação}`.
- Webhooks do n8n devem usar o padrão `/webhook/{evento}`.

### 2.3 Autenticação e Autorização

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação:

- Token armazenado no `localStorage` com a chave `OBRAX_TOKEN`.
- Header de autorização: `Authorization: Bearer <token>`.
- Todas as rotas `/api/*` exigem autenticação.
- Rotas `/auth/*` e `/health` são públicas.

---

## 3. Regras de Integração

### 3.1 Integrações via n8n

Toda integração com serviços externos (WhatsApp, Whisper, OpenAI, etc.) deve ser feita via n8n:

- O frontend **nunca** chama APIs externas diretamente.
- O backend pode chamar APIs externas apenas para operações síncronas simples.
- Operações assíncronas ou complexas devem ser delegadas ao n8n.

### 3.2 Contratos de Eventos

Toda comunicação entre componentes deve seguir os contratos definidos em `docs/OBRAX_EVENT_CONTRACT.md`:

- Eventos devem ter um `event_type` único e documentado.
- Payloads devem seguir o schema JSON definido no contrato.
- Novos eventos devem ser adicionados ao contrato antes da implementação.

### 3.3 Mapa de Intenções

Toda nova funcionalidade deve ser mapeada em `docs/OBRAX_INTENT_MAP.md`:

- Cada intenção deve ter um código único (ex: `INTENT_001`).
- A intenção deve definir: trigger, entidade afetada, evento gerado e resposta esperada.

---

## 4. Regras de Qualidade

### 4.1 Código

- Todo código JavaScript deve usar ES6+ e seguir o padrão do projeto.
- Arquivos TypeScript (`.ts`, `.tsx`) são permitidos, mas devem ser compatíveis com a configuração Vite existente.
- Imports devem usar caminhos relativos sem extensão (Vite resolve automaticamente).

### 4.2 Commits

Commits devem seguir o padrão **Conventional Commits**:

| Prefixo | Uso |
|---------|-----|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alteração em documentação |
| `chore:` | Tarefas de manutenção |
| `refactor:` | Refatoração sem mudança de comportamento |
| `test:` | Adição ou correção de testes |

### 4.3 Issues e Features

Toda nova feature deve ser criada como Issue usando o template em `.github/ISSUE_TEMPLATE/feature_request.md`:

- A issue deve definir a intenção, entidade, evento e impacto na UI.
- A issue deve ser aprovada antes da implementação.

---

## 5. Regras de Deploy

### 5.1 Ambientes

| Ambiente | Branch | Deploy |
|----------|--------|--------|
| Produção | `main` | Automático via Render |
| Desenvolvimento | `dev` | Manual |

### 5.2 Processo de Deploy

1. Alterações são feitas em branch feature (`feat/nome-da-feature`).
2. Pull Request para `main` com revisão obrigatória.
3. Merge dispara deploy automático no Render.
4. Verificação pós-deploy no ambiente de produção.

---

## 6. Glossário

| Termo | Definição |
|-------|-----------|
| **Obra** | Projeto de construção gerenciado pelo sistema |
| **Atividade** | Tarefa dentro de uma obra |
| **Intenção** | Ação que o usuário deseja realizar |
| **Evento** | Mensagem assíncrona entre componentes |
| **Workflow** | Sequência de ações automatizadas no n8n |

---

## Referências

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [n8n Documentation](https://docs.n8n.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
