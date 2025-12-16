OBRAX INTENT MAP — Mapa Formal de Intenções (Fundação)
1) Definição formal

INTENT_MAP é o catálogo declarativo que descreve:

quais intenções o usuário pode solicitar,

quais validações o backend deve aplicar antes de persistir,

quais eventos oficiais podem ser emitidos como resultado,

qual impacto esperado em máquina de estados (PO11) e ciclos (PO14), quando aplicável.

Intenção não é evento. Intenção pode resultar em evento somente após validação do backend.

2) Regras do INTENT_MAP

Quem origina: usuário via frontend (ou integrações), sempre como intenção.

Quem valida e decide: exclusivamente o backend.

Quem emite evento: exclusivamente o backend.

Se a intenção não passar validações: não há evento oficial.

Campos obrigatórios por intenção: NÃO DEFINIDO (não há lista canônica única explicitada).

Idempotência (evitar duplicidade de intenção): NÃO DEFINIDO.

Nome oficial do “evento de tarefas”: a especificação lista tasks(...) e não um events_tasks formal; portanto, “evento de tarefa” aqui é tratado como persistência em tasks (conforme documento), e o nome events_tasks deve ser considerado NÃO DEFINIDO.

3) INTENÇÕES OFICIAIS → EVENTOS POSSÍVEIS

Abaixo, cada intenção está descrita no formato:

INTENÇÃO → validações mínimas → persistência/eventos oficiais → impacto de estado

3.1 Programação Viva
INT-01 — Criar tarefa por objeto IFS

Descrição: criar uma tarefa vinculada a um objeto IFS.
Validações mínimas (backend): objeto IFS válido; obra_id válido.
Evento/persistência oficial: tasks(...) (registro/persistência de tarefa).
Impacto PO11: tarefa nasce em PLANNED (estado inicial implícito).
Observações: evento explícito de “programação” separado NÃO DEFINIDO.

3.2 PCC (Pré-condições)
INT-02 — Solicitar PCC (PCC_REQUIRED)

Descrição: marcar/registrar que uma atividade requer PCC.
Validações mínimas: atividade_id válido; obra_id válido; perfil autorizado.
Evento oficial: events_pcc(requested_at, …)
Impacto PO11: PLANNED → PCC_REQUIRED (quando aplicável).

INT-03 — Confirmar PCC

Descrição: confirmar pré-condições (checklist) para liberar execução.
Validações mínimas: existência de solicitação PCC; usuário autorizado; dados mínimos de confirmação.
Evento oficial: events_pcc(confirmed_at, confirmed_flag, …)
Impacto PO11: PCC_REQUIRED → PCC_CONFIRMED → READY (gates: PCC confirmado).

3.3 Execução / FPM (Fechamento Parcial)
INT-04 — Iniciar execução de tarefa

Descrição: registrar início de execução.
Validações mínimas: tarefa em estado compatível (READY); usuário autorizado.
Evento/persistência oficial: tasks(started_at, status, …) (atualização/persistência).
Impacto PO11: READY → IN_EXECUTION.

INT-05 — Emitir FPM (parcial)

Descrição: registrar fechamento parcial e criar remanescente/reabertura conforme regra.
Validações mínimas: tarefa em execução; percentual válido (ex.: 25/50/75/90/95/100); usuário autorizado.
Evento/persistência oficial: tasks(status='PARTIAL_CLOSED', updated_at, …) + criação de “tarefa remanescente” (mecanismo descrito).
Impacto PO11: IN_EXECUTION → PARTIAL_CLOSED (+ reabertura automática conforme dependências).
Observação: formato exato do evento FPM como tabela-evento separada NÃO DEFINIDO.

INT-06 — Fechar tarefa (conclusão)

Descrição: registrar conclusão de execução.
Validações mínimas: FVS PASS quando exigido; PCC confirmado; usuário autorizado.
Evento/persistência oficial: tasks(closed_at, status, …)
Impacto PO11: IN_EXECUTION → INSPECTION_PENDING (se inspeção for gate) → CLOSED após PASS.

3.4 FVS (Fiscalização Visual de Serviço)
INT-07 — Registrar inspeção FVS

Descrição: registrar resultado de inspeção (PASS/FAIL) e retrabalho.
Validações mínimas: serviço/tarefa vinculada; inspetor autorizado; evidências (fotos obrigatórias quando aplicável).
Evento oficial: events_fvs(inspected_at, status{PASS|FAIL}, rework_count, …)
Impacto PO11:

PASS: INSPECTION_PENDING → INSPECTED_PASS → CLOSED (ou libera avanço)

FAIL: INSPECTION_PENDING → INSPECTED_FAIL → REWORK (+ cria NC)

INT-08 — Registrar retrabalho (decorrente de FAIL)

Descrição: registrar rework e re-inspeção.
Validações mínimas: existir FAIL anterior; usuário autorizado.
Evento oficial: events_fvs(rework_count incrementado / nova inspeção)
Impacto PO11: mantém/retorna para REWORK → INSPECTION_PENDING.

3.5 NC (Não Conformidade)
INT-09 — Abrir NC

Descrição: criar não conformidade originada de FVS / Auditoria / Cliente / Laboratório.
Validações mínimas: origem válida; obra_id/service_id; usuário autorizado.
Evento oficial: events_nc(created_at, origin, status='ABERTA', …)
Impacto PO11: FAIL normalmente empurra para REWORK; status NC corre em pipeline próprio.

INT-10 — Fechar NC

Descrição: encerrar NC após correção/validação.
Validações mínimas: NC existente; critérios de fechamento atendidos.
Evento oficial: events_nc(status='FECHADA', …)
Impacto: não definido como transição direta de PO11; efeito é de controle/auditoria (NÃO DEFINIDO).

3.6 Materiais (PO14: Recebimento, Inspeção, Estoque)
INT-11 — Registrar FVM (recebimento/inspeção de material)

Descrição: registrar recebimento e decisão (aprovado/rejeitado/restrições/em análise).
Validações mínimas: material_sku; fornecedor; obra_id; evidências (NF/inspeção quando aplicável).
Evento oficial: events_fvm(received_at, status{APROVADO|REJEITADO|ACEITO_COM_RESTRICOES|EM_ANALISE}, …)
Impacto PO14: RECEIVED → INSPECTED → (APPROVED | REJECTED | ACCEPTED_WITH_RESTRICTIONS)

INT-12 — Movimentar estoque (entrada/saída/quebra/transferência)

Descrição: registrar movimentações e saldo.
Validações mínimas: localização; saldo; obra_id; material_sku.
Evento/persistência oficial: materials_stock(movimentacoes, localizacao, saldo, …)
Impacto PO14: STORED → RESERVED → ISSUED → CONSUMED/RETURNED/SCRAPPED (quando aplicável).
Observação: tabela events_materials_stock não está explicitada como evento; o registro citado é materials_stock(...).

INT-13 — Solicitar material (MRW por voz → catálogo + saldo)

Descrição: intenção de solicitação guiada.
Validações mínimas: obra_id; necessidade vinculada a tarefa/atividade; usuário autorizado.
Evento oficial: NÃO DEFINIDO (há endpoint /materiais/solicitar, mas não há tabela-evento explícita).
Impacto: provável geração/atualização de reservas (NÃO DEFINIDO).

3.7 Testes de laboratório
INT-14 — Registrar teste de laboratório

Descrição: registrar ensaio e resultado (aprovado/reprovado).
Validações mínimas: material_sku; amostra/lote; obra_id; laboratório/usuário autorizado.
Evento oficial: lab_tests(tested_at, status{APROVADO|REPROVADO}, …)
Impacto: efeito em qualidade/fornecedor/NC; transição direta em PO11 NÃO DEFINIDO.

3.8 Entregas / Fornecedores
INT-15 — Registrar entrega (ETA vs recebido)

Descrição: registrar promessa e recebimento.
Validações mínimas: supplier_id; material_sku; obra_id.
Evento oficial: deliveries(eta_at, received_at, …)
Impacto: influencia KPIs e disponibilidade; transição direta PO14 depende de FVM (NÃO DEFINIDO).

3.9 Atas e Salas por Atividade
INT-16 — Iniciar ata (voz)

Descrição: iniciar registro de ata e diarização posterior.
Validações mínimas: usuário autorizado; contexto (obra/atividade quando aplicável).
Evento oficial: meeting_atas(started_at, …)

INT-17 — Finalizar ata + diarização + ações

Descrição: finalizar e gerar decisões/ações/prazos.
Validações mínimas: ata em andamento; usuário autorizado.
Evento oficial: meeting_atas(ended_at, diarizacao, decisoes, acoes, …)

INT-18 — Postar mídia/mensagem em Sala por Atividade

Descrição: registrar mensagens (áudio/foto/vídeo) e confirmação de leitura.
Validações mínimas: atividade_id válido; usuário autorizado.
Evento oficial: activity_rooms(activity_id, mensagens, confirm_read, …)

3.10 Mapa Vivo / IFS
INT-19 — Consultar estado do mapa (planejado/executado/as-built)

Descrição: consulta do estado vivo.
Validações mínimas: permissões por papel; obra_id.
Evento oficial: nenhum (consulta não é evento).

INT-20 — Atualizar atributos de objeto IFS (quando aplicável)

Descrição: persistir atributos do objeto.
Validações mínimas: object_id; autorização.
Evento/persistência oficial: ifs_objects(object_id, tipo, atributos, …)

4) Tabela-resumo: intenção → evento oficial

Criar tarefa IFS → tasks(...)

Solicitar PCC → events_pcc(requested_at, …)

Confirmar PCC → events_pcc(confirmed_at, confirmed_flag, …)

Registrar inspeção FVS → events_fvs(...)

Abrir/Fechar NC → events_nc(...)

Registrar FVM → events_fvm(...)

Movimentar estoque → materials_stock(...)

Registrar teste laboratório → lab_tests(...)

Registrar entrega → deliveries(...)

Iniciar/Finalizar ata → meeting_atas(...)

Postar em sala → activity_rooms(...)

Atualizar objeto IFS → ifs_objects(...)

Solicitar material (MRW) → NÃO DEFINIDO como evento/tabela oficial

5) Limites explícitos do INTENT_MAP

Eventos e tabelas acima são apenas os que aparecem na especificação base.

Onde a especificação não define “tabela-evento” (ex.: MRW, FPM como evento separado), foi marcado como NÃO DEFINIDO.

Nenhuma intenção aqui autoriza implementação; é contrato documental.
