# OBRAX QUANTUM — Mapa de Intenções

> **Versão:** 1.0.0  
> **Última atualização:** 2025-12-16  
> **Autor:** Manus AI

Este documento mapeia as intenções do usuário que o sistema OBRAX QUANTUM deve reconhecer e processar. Cada intenção define um objetivo do usuário, o trigger que a ativa, as entidades envolvidas, o evento gerado e a resposta esperada.

---

## 1. Estrutura de uma Intenção

Cada intenção segue a estrutura abaixo:

| Campo | Descrição |
|-------|-----------|
| **Código** | Identificador único (ex: `INTENT_001`) |
| **Nome** | Nome descritivo da intenção |
| **Trigger** | Como a intenção é ativada (voz, texto, UI) |
| **Entidade Principal** | Recurso afetado (Obra, Atividade, Material, etc.) |
| **Evento Gerado** | Evento disparado ao processar a intenção |
| **Resposta Esperada** | O que o usuário espera como resultado |
| **Exemplos** | Frases de exemplo que ativam a intenção |

---

## 2. Intenções Cadastradas

### INTENT_001 — Criar Obra

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_001` |
| **Nome** | Criar Obra |
| **Trigger** | Voz, Texto, UI (botão "Nova Obra") |
| **Entidade Principal** | `Work` |
| **Evento Gerado** | `WORK.CREATED` |
| **Resposta Esperada** | Confirmação de criação com ID e nome da obra |

**Exemplos de frases:**
- "Criar uma nova obra chamada Torre Infinita"
- "Cadastrar obra residencial em Itajaí"
- "Nova obra comercial no centro"

---

### INTENT_002 — Listar Obras

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_002` |
| **Nome** | Listar Obras |
| **Trigger** | Voz, Texto, UI (menu "Obras") |
| **Entidade Principal** | `Work` |
| **Evento Gerado** | Nenhum (consulta) |
| **Resposta Esperada** | Lista de obras com nome, status e localização |

**Exemplos de frases:**
- "Quais são as obras ativas?"
- "Listar todas as obras"
- "Mostrar obras em andamento"

---

### INTENT_003 — Atualizar Status da Obra

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_003` |
| **Nome** | Atualizar Status da Obra |
| **Trigger** | Voz, Texto, UI (dropdown de status) |
| **Entidade Principal** | `Work` |
| **Evento Gerado** | `WORK.STATUS_CHANGED` |
| **Resposta Esperada** | Confirmação da mudança de status |

**Exemplos de frases:**
- "Pausar a obra Torre Infinita"
- "Marcar obra como concluída"
- "Reativar a obra do centro"

---

### INTENT_004 — Criar Atividade

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_004` |
| **Nome** | Criar Atividade |
| **Trigger** | Voz, Texto, UI (botão "Nova Atividade") |
| **Entidade Principal** | `Activity` |
| **Evento Gerado** | `ACTIVITY.CREATED` |
| **Resposta Esperada** | Confirmação de criação com ID e nome da atividade |

**Exemplos de frases:**
- "Adicionar atividade de fundação na Torre Infinita"
- "Criar tarefa de instalação elétrica"
- "Nova atividade: pintura externa"

---

### INTENT_005 — Concluir Atividade

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_005` |
| **Nome** | Concluir Atividade |
| **Trigger** | Voz, Texto, UI (checkbox de conclusão) |
| **Entidade Principal** | `Activity` |
| **Evento Gerado** | `ACTIVITY.COMPLETED` |
| **Resposta Esperada** | Confirmação de conclusão |

**Exemplos de frases:**
- "Concluir a atividade de fundação"
- "Marcar instalação elétrica como pronta"
- "Finalizar pintura externa"

---

### INTENT_006 — Registrar Problema

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_006` |
| **Nome** | Registrar Problema |
| **Trigger** | Voz, Texto, UI (botão "Reportar Problema") |
| **Entidade Principal** | `Issue` |
| **Evento Gerado** | `ISSUE.CREATED` |
| **Resposta Esperada** | Confirmação de registro com número do problema |

**Exemplos de frases:**
- "Registrar problema de infiltração no bloco A"
- "Reportar falta de material na obra"
- "Problema: atraso na entrega de concreto"

---

### INTENT_007 — Solicitar Material

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_007` |
| **Nome** | Solicitar Material |
| **Trigger** | Voz, Texto, UI (formulário de solicitação) |
| **Entidade Principal** | `MaterialRequest` |
| **Evento Gerado** | `MATERIAL.REQUESTED` |
| **Resposta Esperada** | Confirmação de solicitação com número do pedido |

**Exemplos de frases:**
- "Solicitar 100 sacos de cimento para Torre Infinita"
- "Pedir mais vergalhões para a obra"
- "Preciso de 50 metros de fio elétrico"

---

### INTENT_008 — Consultar Progresso

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_008` |
| **Nome** | Consultar Progresso |
| **Trigger** | Voz, Texto, UI (dashboard) |
| **Entidade Principal** | `Work`, `Activity` |
| **Evento Gerado** | Nenhum (consulta) |
| **Resposta Esperada** | Percentual de conclusão e atividades pendentes |

**Exemplos de frases:**
- "Qual o progresso da Torre Infinita?"
- "Quantas atividades faltam na obra?"
- "Status geral das obras ativas"

---

### INTENT_009 — Enviar Relatório

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_009` |
| **Nome** | Enviar Relatório |
| **Trigger** | Voz, Texto, UI (botão "Gerar Relatório") |
| **Entidade Principal** | `Report` |
| **Evento Gerado** | `REPORT.GENERATED` |
| **Resposta Esperada** | Link para download ou envio por email/WhatsApp |

**Exemplos de frases:**
- "Gerar relatório semanal da Torre Infinita"
- "Enviar relatório de progresso para o cliente"
- "Relatório de custos do mês"

---

### INTENT_010 — Agendar Visita

| Campo | Valor |
|-------|-------|
| **Código** | `INTENT_010` |
| **Nome** | Agendar Visita |
| **Trigger** | Voz, Texto, UI (calendário) |
| **Entidade Principal** | `Visit` |
| **Evento Gerado** | `VISIT.SCHEDULED` |
| **Resposta Esperada** | Confirmação de agendamento com data e hora |

**Exemplos de frases:**
- "Agendar visita na Torre Infinita para sexta-feira"
- "Marcar inspeção para amanhã às 10h"
- "Visita técnica na obra do centro dia 20"

---

## 3. Adicionando Novas Intenções

Para adicionar uma nova intenção ao sistema:

1. **Defina um código único** seguindo o padrão `INTENT_XXX`.
2. **Documente a intenção** neste arquivo seguindo a estrutura padrão.
3. **Defina o evento** correspondente em `docs/OBRAX_EVENT_CONTRACT.md`.
4. **Implemente o reconhecimento** no n8n (workflow de NLU).
5. **Implemente a ação** no backend (endpoint ou workflow).
6. **Implemente a UI** no frontend (se aplicável).
7. **Teste o fluxo completo** antes de fazer merge.

---

## 4. Matriz de Intenções vs. Entidades

| Intenção | Work | Activity | Issue | Material | Report | Visit |
|----------|------|----------|-------|----------|--------|-------|
| INTENT_001 | **X** | | | | | |
| INTENT_002 | **X** | | | | | |
| INTENT_003 | **X** | | | | | |
| INTENT_004 | | **X** | | | | |
| INTENT_005 | | **X** | | | | |
| INTENT_006 | | | **X** | | | |
| INTENT_007 | | | | **X** | | |
| INTENT_008 | **X** | **X** | | | | |
| INTENT_009 | | | | | **X** | |
| INTENT_010 | | | | | | **X** |

---

## Referências

- [Rasa NLU Documentation](https://rasa.com/docs/rasa/nlu-training-data/)
- [Dialogflow Intent Design](https://cloud.google.com/dialogflow/docs/intents-overview)
