---
name: Feature Request
about: Solicitar uma nova funcionalidade para o OBRAX QUANTUM
title: '[FEAT] '
labels: enhancement
assignees: ''
---

## Descrição da Feature

<!-- Descreva a funcionalidade que você deseja implementar. Seja específico. -->

## Intenção do Usuário

<!-- Qual é a intenção do usuário que esta feature atende? Consulte docs/OBRAX_INTENT_MAP.md -->

- [ ] Intenção existente: `INTENT_XXX` (especifique)
- [ ] Nova intenção (precisa ser documentada)

**Código da Intenção:** `INTENT_`

**Exemplos de frases que ativam a intenção:**
1. 
2. 
3. 

## Entidade Principal

<!-- Qual é a entidade principal afetada por esta feature? -->

- [ ] Work (Obra)
- [ ] Activity (Atividade)
- [ ] Issue (Problema)
- [ ] Material (Material)
- [ ] Report (Relatório)
- [ ] Visit (Visita)
- [ ] User (Usuário)
- [ ] Outra: _______________

## Evento Gerado

<!-- Qual evento será gerado por esta feature? Consulte docs/OBRAX_EVENT_CONTRACT.md -->

- [ ] Evento existente: `DOMAIN.ACTION` (especifique)
- [ ] Novo evento (precisa ser documentado)

**Tipo do Evento:** `DOMAIN.ACTION`

**Payload esperado:**
```json
{
  "field1": "type",
  "field2": "type"
}
```

## Impacto na UI

<!-- Quais alterações serão necessárias na interface do usuário? -->

### Frontend (Web)

- [ ] Nova página
- [ ] Novo componente
- [ ] Alteração em página existente: _______________
- [ ] Alteração em componente existente: _______________
- [ ] Nenhuma alteração

### PWA (Campo)

- [ ] Nova tela
- [ ] Novo componente
- [ ] Alteração em tela existente: _______________
- [ ] Nenhuma alteração

## Impacto no Backend

<!-- Quais alterações serão necessárias no backend? -->

- [ ] Novo endpoint: `METHOD /path`
- [ ] Alteração em endpoint existente: _______________
- [ ] Novo modelo de dados
- [ ] Alteração em modelo existente: _______________
- [ ] Nenhuma alteração

## Impacto no n8n

<!-- Quais workflows serão necessários ou alterados? -->

- [ ] Novo workflow
- [ ] Alteração em workflow existente: _______________
- [ ] Novo webhook: `/webhook/nome`
- [ ] Integração externa: _______________
- [ ] Nenhuma alteração

## Checklist de Governança

<!-- Marque os itens que foram verificados antes de abrir esta issue -->

- [ ] Li `docs/OBRAX_SYSTEM_RULES.md`
- [ ] Verifiquei se a intenção já existe em `docs/OBRAX_INTENT_MAP.md`
- [ ] Verifiquei se o evento já existe em `docs/OBRAX_EVENT_CONTRACT.md`
- [ ] Esta feature segue a separação de responsabilidades (frontend/backend/n8n)
- [ ] Esta feature não cria um novo projeto ou framework

## Critérios de Aceitação

<!-- Liste os critérios que devem ser atendidos para considerar a feature completa -->

1. 
2. 
3. 

## Mockups / Wireframes

<!-- Se aplicável, adicione imagens ou links para mockups -->

## Notas Adicionais

<!-- Qualquer informação adicional relevante -->
