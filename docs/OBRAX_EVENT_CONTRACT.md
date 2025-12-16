OBRAX QUANTUM — Contratos de Eventos

Versão: 1.1.0
Última atualização: 2025-12-16
Status: Fase de Fundação (Governança)
Autor: Projeto OBRAX (curadoria manual)

Este documento define os eventos oficiais de negócio do sistema OBRAX QUANTUM.
Eventos representam estado consolidado persistido no backend.

⚠️ REGRA FUNDAMENTAL DO SISTEMA

🔒 SOMENTE O BACKEND PODE EMITIR EVENTOS OFICIAIS.

Frontend NUNCA é source de evento

n8n NUNCA é source de evento

Frontend apenas solicita ações via API

n8n apenas processa tarefas e retorna resultados

Evento ≠ webhook ≠ log ≠ automação intermediária

👉 Evento é registro oficial de estado, não passo interno.

1. Estrutura Padrão de Evento (Evento Oficial)

Todos os eventos oficiais seguem obrigatoriamente a estrutura abaixo:

{
  "event_id": "uuid-v4",
  "event_type": "DOMAIN.ACTION",
  "timestamp": "ISO-8601",
  "source": "backend",
  "entity": "string",
  "entity_id": "string|number",
  "payload": {},
  "metadata": {
    "user_id": "string|null",
    "correlation_id": "string|null",
    "version": "1.0"
  }
}

Campos obrigatórios
Campo	Obrigatório	Observação
event_id	Sim	UUID do evento
event_type	Sim	Formato DOMINIO.ACAO
timestamp	Sim	ISO 8601
source	Sim	Sempre backend
entity	Sim	Entidade persistida
entity_id	Sim	ID real da entidade
payload	Sim	Estado relevante
2. 🚫 Eventos de Autenticação (FORA DO ESCOPO ATUAL)

Eventos de autenticação NÃO FAZEM PARTE do contrato nesta fase.

Eventos como:

AUTH.LOGIN_SUCCESS

AUTH.LOGIN_FAILED

AUTH.LOGOUT

❌ NÃO DEVEM SER IMPLEMENTADOS
❌ NÃO DEVEM DISPARAR AUTOMAÇÕES

📌 Motivo:

Autenticação não representa evento de negócio

Login não é prioridade funcional

Evita induzir refactors e automações desnecessárias

👉 Se necessário no futuro, criar:

OBRAX_SECURITY_EVENT_CONTRACT.md (FUTURO)

3. Eventos de Obras (Work)
3.1 WORK.CREATED

Disparado quando uma obra é criada e persistida no backend.

{
  "event_type": "WORK.CREATED",
  "source": "backend",
  "entity": "work",
  "entity_id": 12,
  "payload": {
    "name": "Torre Infinita",
    "work_type": "RESIDENTIAL|COMMERCIAL|INDUSTRIAL|INFRASTRUCTURE",
    "status": "ACTIVE",
    "location": "string"
  }
}


Usos permitidos:

Criar pastas

Criar planilhas

Inicializar dashboards

Notificar responsáveis

3.2 WORK.UPDATED
{
  "event_type": "WORK.UPDATED",
  "source": "backend",
  "entity": "work",
  "entity_id": 12,
  "payload": {
    "changes": {
      "field": {
        "old_value": "any",
        "new_value": "any"
      }
    }
  }
}

3.3 WORK.STATUS_CHANGED
{
  "event_type": "WORK.STATUS_CHANGED",
  "source": "backend",
  "entity": "work",
  "entity_id": 12,
  "payload": {
    "old_status": "ACTIVE|PAUSED|COMPLETED|CANCELLED",
    "new_status": "ACTIVE|PAUSED|COMPLETED|CANCELLED",
    "reason": "string|null"
  }
}

4. Eventos de Atividades (Activity)
4.1 ACTIVITY.CREATED
{
  "event_type": "ACTIVITY.CREATED",
  "source": "backend",
  "entity": "activity",
  "entity_id": 55,
  "payload": {
    "work_id": 12,
    "name": "Contrapiso sacada ático",
    "priority": "LOW|MEDIUM|HIGH|CRITICAL"
  }
}

4.2 ACTIVITY.COMPLETED
{
  "event_type": "ACTIVITY.COMPLETED",
  "source": "backend",
  "entity": "activity",
  "entity_id": 55,
  "payload": {
    "completed_by": "user_id",
    "notes": "string|null"
  }
}

5. Eventos de Áudio (PIPELINE FUTURO — NÃO IMPLEMENTAR AINDA)

⚠️ IMPORTANTE
Esta seção define contrato futuro.
Documentar ≠ autorizar implementação.

5.1 AUDIO.UPLOADED

Único evento oficial de entrada de áudio.

{
  "event_type": "AUDIO.UPLOADED",
  "source": "backend",
  "entity": "audio_job",
  "entity_id": 88,
  "payload": {
    "audio_url": "https://storage/...",
    "work_id": 12
  }
}


📌 Backend cria o job → dispara o evento.

5.2 AUDIO.PROCESSED

Evento emitido somente após o backend receber e validar o resultado do processamento.

{
  "event_type": "AUDIO.PROCESSED",
  "source": "backend",
  "entity": "audio_job",
  "entity_id": 88,
  "payload": {
    "transcription": "string",
    "summary": "string",
    "categories": ["string"],
    "priority": "LOW|MEDIUM|HIGH"
  }
}


📌 Mesmo que o n8n processe:

transcrição

IA

categorização

👉 o evento só existe quando o backend confirma.

6. 🚫 Eventos de Notificação (NÃO SÃO EVENTOS DE NEGÓCIO)

Notificações NÃO representam estado persistido.

Exemplo:

NOTIFICATION.SEND

❌ Não entram neste contrato
✔ São comandos internos de execução

7. O que NÃO é evento oficial

❌ Não são eventos:

Webhooks internos

Logs

Processos intermediários

Transcrição bruta

Extração de intenção

Notificações

Ações temporárias do n8n

Evento = estado consolidado no backend.

8. Regra de Ouro para o Manus

Antes de implementar qualquer coisa:

O evento existe neste arquivo?

Ele representa estado persistido?

Ele é emitido pelo backend?

Se qualquer resposta for não → PARE.

9. Referências (conceituais)

CloudEvents (inspiração, não implementação)

AsyncAPI (inspiração, não obrigação)
