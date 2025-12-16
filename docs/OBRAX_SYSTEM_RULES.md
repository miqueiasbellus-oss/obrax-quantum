OBRAX QUANTUM — Regras do Sistema

Versão: 1.1.0
Última atualização: 2025-12-16
Status: Governança Ativa — Fase de Fundação
Autor: Projeto OBRAX (curadoria manual)

Este documento define as regras obrigatórias que governam o desenvolvimento, integração e evolução do sistema OBRAX QUANTUM.

Estas regras não são sugestões.
Elas existem para impedir improviso, autoexpansão e alterações fora de escopo.

⚠️ REGRA FUNDAMENTAL DO PROJETO

🔒 DOCUMENTAR ≠ IMPLEMENTAR

Nenhuma documentação autoriza implementação automática

Nenhuma ideia “bem definida” deve virar código sem pedido explícito

O projeto está em FASE DE FUNDAÇÃO

👉 Planejar é obrigatório.
👉 Executar só com autorização.

1. Arquitetura de Referência

O OBRAX QUANTUM segue arquitetura de três camadas:

Camada	Responsabilidade
Frontend	Interface e captura de ações
Backend	Lógica de negócio e estado oficial
n8n	Execução de automações delegadas

📌 Backend é a ÚNICA fonte da verdade.

2. Separação de Responsabilidades (OBRIGATÓRIA)
Frontend

Apenas UI

Apenas chamadas à API

❌ Não contém lógica de negócio

❌ Não chama n8n

❌ Não dispara eventos

Backend

Valida tudo

Persiste tudo

Emite todos os eventos oficiais

Centraliza regras

n8n

Executa tarefas

Processa automações

❌ Não emite eventos oficiais

❌ Não persiste estado final

3. Comunicação Entre Camadas

Comunicação padrão: REST + JSON

Frontend → Backend → (evento) → n8n → Backend

❌ Frontend → n8n (proibido)

Eventos seguem exclusivamente:

docs/OBRAX_EVENT_CONTRACT.md

4. Escopo de Trabalho (REGRA CRÍTICA)

🔒 ESCOPO É FECHADO POR TAREFA

Para cada tarefa, o agente só pode:

Alterar arquivos explicitamente autorizados

Criar arquivos explicitamente solicitados

❌ É PROIBIDO:

Corrigir “erros encontrados”

Refatorar código existente

Ajustar login, tokens, imports ou build

Converter TS ↔ JS

“Melhorar” código sem pedido

Se algo parecer errado:
👉 Pare e pergunte.

5. Intenções e Eventos

Intenções definem o que o usuário quer

Eventos representam estado persistido

Nenhuma intenção autoriza código

Nenhum evento existe fora do contrato

Referências obrigatórias:

docs/OBRAX_INTENT_MAP.md

docs/OBRAX_EVENT_CONTRACT.md

6. IA, Automação e n8n

⚠️ IA NÃO É DEFAULT

IA é opcional

Automação é opt-in

n8n só entra quando explicitamente solicitado

❌ Não antecipar IA
❌ Não criar pipelines futuros
❌ Não “preparar código” sem pedido

7. Qualidade e Commits

Seguir Conventional Commits

Um objetivo por commit

Sem commits “mistos”

8. Deploy

Deploy automático via Render

❌ Proibido deploy manual

❌ Proibido alterar config sem autorização

9. Regra Final (a mais importante)

❗ Se não foi pedido, não faça.

Qualquer violação destas regras:

invalida a entrega

exige refação conforme governança
