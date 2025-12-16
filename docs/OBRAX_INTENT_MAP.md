OBRAX QUANTUM — Mapa de Intenções

Versão: 1.1.0
Última atualização: 2025-12-16
Status: Fase de Fundação (Governança)
Autor: Projeto OBRAX (curadoria manual)

Este documento define as intenções de negócio reconhecidas pelo sistema OBRAX QUANTUM.
Intenções representam o que o usuário quer fazer, não como isso é implementado.

⚠️ REGRA FUNDAMENTAL SOBRE INTENÇÕES

🔒 INTENÇÃO ≠ IA

Intenções podem ser acionadas 100% via UI tradicional

IA / NLU / Voz são opcionais e futuras

Nenhuma intenção autoriza automaticamente uso de IA

IA só entra quando explicitamente solicitada pelo usuário

👉 O sistema deve funcionar sem IA.

1. Estrutura de uma Intenção

Cada intenção segue obrigatoriamente esta estrutura:

Campo	Descrição
Código	Identificador único (INTENT_XXX)
Nome	Nome humano da intenção
Trigger	UI, Texto ou Voz (opcional)
Entidade Principal	Entidade afetada
Evento Gerado	Evento oficial (se houver)
Resultado Esperado	O que muda no sistema
Observações	Regras importantes
Exemplos	Frases ou ações típicas
2. Intenções Oficiais
INTENT_001 — Criar Obra
Campo	Valor
Código	INTENT_001
Nome	Criar Obra
Trigger	UI (botão), Texto, Voz
Entidade Principal	Work
Evento Gerado	WORK.CREATED
Resultado Esperado	Obra criada e persistida
Observações	Não depende de IA

Exemplos:

Criar nova obra

Nova obra residencial

Cadastrar obra Torre Infinita

INTENT_002 — Listar Obras
Campo	Valor
Código	INTENT_002
Nome	Listar Obras
Trigger	UI
Entidade Principal	Work
Evento Gerado	❌ Nenhum (consulta)
Resultado Esperado	Lista de obras
Observações	Consulta não gera evento
INTENT_003 — Atualizar Status da Obra
Campo	Valor
Código	INTENT_003
Nome	Atualizar Status da Obra
Trigger	UI
Entidade Principal	Work
Evento Gerado	WORK.STATUS_CHANGED
Resultado Esperado	Status atualizado
Observações	Estado persistido
INTENT_004 — Criar Atividade
Campo	Valor
Código	INTENT_004
Nome	Criar Atividade
Trigger	UI
Entidade Principal	Activity
Evento Gerado	ACTIVITY.CREATED
Resultado Esperado	Atividade criada
Observações	Não depende de IA
INTENT_005 — Concluir Atividade
Campo	Valor
Código	INTENT_005
Nome	Concluir Atividade
Trigger	UI
Entidade Principal	Activity
Evento Gerado	ACTIVITY.COMPLETED
Resultado Esperado	Atividade concluída
Observações	Estado final
INTENT_006 — Registrar Problema
Campo	Valor
Código	INTENT_006
Nome	Registrar Problema
Trigger	UI
Entidade Principal	Issue
Evento Gerado	ISSUE.CREATED (futuro)
Resultado Esperado	Problema registrado
Observações	IA opcional no futuro
INTENT_007 — Solicitar Material
Campo	Valor
Código	INTENT_007
Nome	Solicitar Material
Trigger	UI
Entidade Principal	MaterialRequest
Evento Gerado	MATERIAL.REQUESTED (futuro)
Resultado Esperado	Solicitação registrada
Observações	Sem automação obrigatória
INTENT_008 — Consultar Progresso
Campo	Valor
Código	INTENT_008
Nome	Consultar Progresso
Trigger	UI
Entidade Principal	Work, Activity
Evento Gerado	❌ Nenhum
Resultado Esperado	Visão de progresso
Observações	Dashboard apenas
INTENT_009 — Gerar Relatório
Campo	Valor
Código	INTENT_009
Nome	Gerar Relatório
Trigger	UI
Entidade Principal	Report
Evento Gerado	REPORT.GENERATED (futuro)
Resultado Esperado	Relatório disponível
Observações	Pode envolver n8n no futuro
INTENT_010 — Enviar Áudio (PIPELINE FUTURO)
Campo	Valor
Código	INTENT_010
Nome	Enviar Áudio
Trigger	UI (botão)
Entidade Principal	AudioJob
Evento Gerado	AUDIO.UPLOADED
Resultado Esperado	Áudio registrado
Observações	IA não obrigatória
3. Regras Importantes

❌ Intenções não autorizam implementação automática

❌ Intenção não obriga uso de IA

✅ UI tradicional é sempre suficiente

✅ Eventos só existem se documentados no Event Contract

✅ Backend executa, frontend solicita, n8n processa

4. Adicionando Novas Intenções

Para adicionar nova intenção:

Definir código INTENT_XXX

Descrever intenção neste arquivo

Verificar se há evento oficial correspondente

Não implementar nada sem solicitação explícita

Só depois criar código

5. Regra Final para o Manus

❗ Documentar ≠ Implementar

Nenhuma intenção documentada aqui pode ser implementada
sem pedido explícito do usuário.
