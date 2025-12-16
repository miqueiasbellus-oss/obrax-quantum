# OBRAX QUANTUM — Contratos de Eventos

> **Versão:** 1.0.0  
> **Última atualização:** 2025-12-16  
> **Autor:** Manus AI

Este documento define os contratos de eventos utilizados para comunicação entre os componentes do sistema OBRAX QUANTUM (Frontend, Backend, n8n). Todo novo evento deve ser documentado aqui antes da implementação.

---

## 1. Estrutura Padrão de Evento

Todos os eventos seguem a estrutura base abaixo:

```json
{
  "event_id": "uuid-v4",
  "event_type": "DOMAIN.ACTION",
  "timestamp": "2025-12-16T12:00:00Z",
  "source": "frontend|backend|n8n",
  "payload": { ... },
  "metadata": {
    "user_id": "string|null",
    "correlation_id": "string|null",
    "version": "1.0"
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `event_id` | UUID v4 | Sim | Identificador único do evento |
| `event_type` | String | Sim | Tipo do evento no formato `DOMÍNIO.AÇÃO` |
| `timestamp` | ISO 8601 | Sim | Data/hora de criação do evento |
| `source` | Enum | Sim | Origem do evento |
| `payload` | Object | Sim | Dados específicos do evento |
| `metadata` | Object | Não | Informações adicionais de contexto |

---

## 2. Eventos de Autenticação

### 2.1 AUTH.LOGIN_SUCCESS

Disparado quando um usuário realiza login com sucesso.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "AUTH.LOGIN_SUCCESS",
  "payload": {
    "user_id": "string",
    "username": "string",
    "access_token": "string",
    "expires_at": "2025-12-17T12:00:00Z"
  }
}
```

### 2.2 AUTH.LOGIN_FAILED

Disparado quando uma tentativa de login falha.

**Source:** `backend`  
**Consumers:** `n8n` (para alertas de segurança)

```json
{
  "event_type": "AUTH.LOGIN_FAILED",
  "payload": {
    "username": "string",
    "reason": "invalid_credentials|user_not_found|account_locked",
    "ip_address": "string"
  }
}
```

### 2.3 AUTH.LOGOUT

Disparado quando um usuário realiza logout.

**Source:** `frontend`  
**Consumers:** `backend`, `n8n`

```json
{
  "event_type": "AUTH.LOGOUT",
  "payload": {
    "user_id": "string",
    "reason": "user_initiated|session_expired|forced"
  }
}
```

---

## 3. Eventos de Obras

### 3.1 WORK.CREATED

Disparado quando uma nova obra é criada.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "WORK.CREATED",
  "payload": {
    "work_id": "integer",
    "name": "string",
    "work_type": "RESIDENTIAL|COMMERCIAL|INDUSTRIAL|INFRASTRUCTURE",
    "status": "ACTIVE|PAUSED|COMPLETED|CANCELLED",
    "location": "string",
    "budget": "number|null",
    "start_date": "ISO 8601|null",
    "end_date": "ISO 8601|null",
    "created_by": "string"
  }
}
```

### 3.2 WORK.UPDATED

Disparado quando uma obra é atualizada.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "WORK.UPDATED",
  "payload": {
    "work_id": "integer",
    "changes": {
      "field_name": {
        "old_value": "any",
        "new_value": "any"
      }
    },
    "updated_by": "string"
  }
}
```

### 3.3 WORK.STATUS_CHANGED

Disparado quando o status de uma obra muda.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "WORK.STATUS_CHANGED",
  "payload": {
    "work_id": "integer",
    "old_status": "ACTIVE|PAUSED|COMPLETED|CANCELLED",
    "new_status": "ACTIVE|PAUSED|COMPLETED|CANCELLED",
    "reason": "string|null",
    "changed_by": "string"
  }
}
```

---

## 4. Eventos de Atividades

### 4.1 ACTIVITY.CREATED

Disparado quando uma nova atividade é criada.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "ACTIVITY.CREATED",
  "payload": {
    "activity_id": "integer",
    "work_id": "integer",
    "name": "string",
    "description": "string|null",
    "status": "PENDING|IN_PROGRESS|COMPLETED|BLOCKED",
    "priority": "LOW|MEDIUM|HIGH|CRITICAL",
    "assigned_to": "string|null",
    "due_date": "ISO 8601|null",
    "created_by": "string"
  }
}
```

### 4.2 ACTIVITY.COMPLETED

Disparado quando uma atividade é concluída.

**Source:** `backend`  
**Consumers:** `frontend`, `n8n`

```json
{
  "event_type": "ACTIVITY.COMPLETED",
  "payload": {
    "activity_id": "integer",
    "work_id": "integer",
    "completed_by": "string",
    "completion_notes": "string|null",
    "evidence_urls": ["string"]
  }
}
```

---

## 5. Eventos de Áudio/Transcrição

### 5.1 AUDIO.RECEIVED

Disparado quando um áudio é recebido (ex: via WhatsApp).

**Source:** `n8n`  
**Consumers:** `n8n` (workflow de transcrição)

```json
{
  "event_type": "AUDIO.RECEIVED",
  "payload": {
    "audio_id": "string",
    "source": "whatsapp|telegram|web",
    "sender_id": "string",
    "sender_name": "string",
    "audio_url": "string",
    "duration_seconds": "number",
    "mime_type": "audio/ogg|audio/mp3|audio/wav"
  }
}
```

### 5.2 AUDIO.TRANSCRIBED

Disparado quando um áudio é transcrito com sucesso.

**Source:** `n8n`  
**Consumers:** `backend`, `n8n`

```json
{
  "event_type": "AUDIO.TRANSCRIBED",
  "payload": {
    "audio_id": "string",
    "transcription": "string",
    "language": "pt-BR|en-US",
    "confidence": "number (0-1)",
    "duration_ms": "number",
    "model": "whisper-1"
  }
}
```

### 5.3 AUDIO.INTENT_EXTRACTED

Disparado quando uma intenção é extraída de uma transcrição.

**Source:** `n8n`  
**Consumers:** `backend`, `n8n`

```json
{
  "event_type": "AUDIO.INTENT_EXTRACTED",
  "payload": {
    "audio_id": "string",
    "intent_code": "INTENT_001",
    "intent_name": "string",
    "entities": {
      "work_name": "string|null",
      "activity_name": "string|null",
      "date": "ISO 8601|null",
      "quantity": "number|null"
    },
    "confidence": "number (0-1)",
    "raw_transcription": "string"
  }
}
```

---

## 6. Eventos de Notificação

### 6.1 NOTIFICATION.SEND

Disparado para enviar uma notificação ao usuário.

**Source:** `backend`, `n8n`  
**Consumers:** `n8n` (workflow de notificação)

```json
{
  "event_type": "NOTIFICATION.SEND",
  "payload": {
    "recipient_id": "string",
    "channel": "whatsapp|email|push|sms",
    "template": "string",
    "variables": { ... },
    "priority": "low|normal|high"
  }
}
```

---

## 7. Adicionando Novos Eventos

Para adicionar um novo evento ao sistema:

1. **Defina o evento** seguindo a estrutura padrão.
2. **Documente o evento** neste arquivo com source, consumers e payload.
3. **Atualize o mapa de intenções** em `docs/OBRAX_INTENT_MAP.md` se aplicável.
4. **Implemente o evento** no source (backend ou n8n).
5. **Implemente os consumers** (frontend, backend ou n8n).
6. **Teste o fluxo completo** antes de fazer merge.

---

## Referências

- [CloudEvents Specification](https://cloudevents.io/)
- [AsyncAPI Specification](https://www.asyncapi.com/)
