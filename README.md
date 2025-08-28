# OBRAX QUANTUM

Sistema de gestão de obras: ERP nativo, controle total e obra viva — simples no campo, poderoso no escritório.

## Visão Geral

O OBRAX QUANTUM é um sistema completo de gestão de obras que combina:
- **ERP nativo** para controle financeiro completo
- **Interface simples** para o pessoal de campo (baixa alfabetização)
- **Dashboards poderosos** para gestão e engenharia
- **Inteligência Artificial** integrada para automação
- **Controle total** de qualidade, materiais e execução

## Arquitetura

```
obrax-quantum/
├── backend/          # FastAPI + PostgreSQL
├── frontend/         # React + Tailwind (Web Dashboard)
├── pwa/             # React PWA (Campo/Mobile)
├── docs/            # Documentação
└── scripts/         # Scripts de deploy e utilitários
```

## Stack Tecnológica

- **Backend**: Python + FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React + Tailwind CSS + Vite
- **PWA**: React + Service Workers + IndexedDB
- **IA**: OpenAI API + Whisper + OpenCV
- **Deploy**: Railway (backend) + Vercel (frontend)

## Funcionalidades Principais

### Para o Encarregado (PWA)
- Login simples (Google)
- Minhas atividades hoje (lista visual)
- Checklist com fotos (5 ícones: ✅❌⚠️📷🎤)
- Solicitar materiais (voz → texto)
- Confirmar conclusão (FPM básico)

### Para o Engenheiro/Gestor (Web)
- Dashboard geral (atividades, status, atrasos)
- Criar/editar atividades (com dependências)
- Aprovar solicitações de materiais
- Ver progresso em tempo real
- Relatórios básicos (PDF/Excel)

## Desenvolvimento

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- PostgreSQL 14+

### Instalação Local

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev

# PWA
cd pwa
npm install
npm run dev
```

## Deploy

- **Backend**: Railway (automático via Git)
- **Frontend**: Vercel (automático via Git)
- **Banco**: PostgreSQL no Railway

## Roadmap

- [x] **Sprint 0**: Fundações (RBAC, modelos, eventos)
- [ ] **Sprint 1**: Atividades e Estados
- [ ] **Sprint 2**: Checklists e Campo
- [ ] **Sprint 3**: Materiais Essenciais
- [ ] **Sprint 4**: Dashboard Operacional
- [ ] **Sprint 5**: Finalização e Testes

## Licença

Proprietary - OBRAX QUANTUM © 2025

