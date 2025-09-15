from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uvicorn
import json

from data_loader import data_loader

app = FastAPI(
    title="OBRAX QUANTUM API",
    description="Sistema de Gestão de Obras - ERP Nativo com Dados Reais FVS/PE",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar dados na startup
@app.on_event("startup")
async def startup_event():
    print("Carregando dados reais FVS/PE...")
    data_loader.load_all_data()
    activities = data_loader.generate_activities_from_real_data()
    print(f"Sistema iniciado com {len(activities)} atividades reais")

# Health Check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "OBRAX QUANTUM API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "data_loaded": {
            "fvs_count": len(data_loader.fvs_data),
            "pe_count": len(data_loader.pe_data),
            "activities_count": len(data_loader.loaded_activities)
        }
    }

# ==================== PROGRAMAÇÃO QUINZENAL ====================

@app.post("/programacao/quinzena")
async def criar_programacao(programacao: Dict[str, Any]):
    """Criar nova programação quinzenal"""
    return {
        "id": 1,
        "quinzena": programacao.get("quinzena", "2024-Q1-1"),
        "autor_id": programacao.get("autor_id", "engenheiro@obra.com"),
        "data_criacao": datetime.utcnow().isoformat(),
        "data_publicacao": None,
        "status": "DRAFT"
    }

@app.post("/programacao/quinzena/{programacao_id}/publicar")
async def publicar_programacao(programacao_id: int):
    """Publicar programação e notificar encarregados"""
    activities = data_loader.loaded_activities
    encarregados = list(set([a['encarregado_id'] for a in activities]))
    
    return {
        "message": f"Programação publicada para {len(encarregados)} encarregados",
        "encarregados_notificados": encarregados,
        "total_atividades": len(activities)
    }

@app.get("/programacao/atividades")
async def get_atividades_programacao(
    quinzena: Optional[str] = None,
    encarregado_id: Optional[str] = None
):
    """Listar atividades da programação com filtros"""
    activities = data_loader.loaded_activities
    
    if encarregado_id:
        activities = [a for a in activities if a['encarregado_id'] == encarregado_id]
    
    # Converter datas para strings ISO
    for activity in activities:
        if isinstance(activity.get('prazo_inicio'), datetime):
            activity['prazo_inicio'] = activity['prazo_inicio'].isoformat()
        if isinstance(activity.get('prazo_fim'), datetime):
            activity['prazo_fim'] = activity['prazo_fim'].isoformat()
    
    return activities

@app.post("/programacao/{programacao_id}/atividades")
async def adicionar_atividade(programacao_id: int, atividade: Dict[str, Any]):
    """Adicionar atividade à programação"""
    new_id = len(data_loader.loaded_activities) + 1
    
    new_activity = {
        "id": new_id,
        "programacao_id": programacao_id,
        **atividade,
        "status": "PLANNED",
        "perc_prog_atual": atividade.get("perc_prog_anterior", 0),
        "audios_orientacao": [],
        "ai_refs": []
    }
    
    data_loader.loaded_activities.append(new_activity)
    return new_activity

@app.post("/atividade/{atividade_id}/ai_refs")
async def gerar_ai_refs(atividade_id: int):
    """Gerar referências de IA para atividade"""
    activity = data_loader.get_activity_details(atividade_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    # Gerar referências baseadas nos dados reais
    grupo = activity.get('grupo', 'Geral')
    atividade_nome = activity.get('atividade', '')
    
    refs_simuladas = [
        f"NBR 15575 - Desempenho de edificações - {grupo}",
        f"Manual técnico - {atividade_nome}",
        f"Procedimento padrão - {grupo.lower()}",
        f"Especificação técnica - {activity.get('codigo', '')}"
    ]
    
    # Adicionar referências específicas dos dados reais
    raw_data = activity.get('raw_data', {})
    if 'normas' in raw_data:
        refs_simuladas.extend(raw_data['normas'])
    if 'referencias' in raw_data:
        refs_simuladas.extend(raw_data['referencias'])
    
    activity['ai_refs'] = refs_simuladas
    
    return {"message": "Referências geradas", "refs": refs_simuladas}

# ==================== PAINEL DO ENCARREGADO ====================

@app.get("/encarregado/{encarregado_id}/atividades")
async def get_atividades_encarregado(
    encarregado_id: str,
    quinzena: Optional[str] = None
):
    """Listar atividades do encarregado para a quinzena"""
    activities = data_loader.get_activities_by_encarregado(encarregado_id)
    
    # Calcular dias de atraso e preparar resposta
    summaries = []
    for activity in activities:
        dias_atraso = None
        prazo_fim = activity.get('prazo_fim')
        
        if prazo_fim:
            if isinstance(prazo_fim, str):
                prazo_fim = datetime.fromisoformat(prazo_fim.replace('Z', '+00:00'))
            elif isinstance(prazo_fim, datetime):
                pass
            else:
                prazo_fim = None
                
            if prazo_fim and datetime.now() > prazo_fim:
                dias_atraso = (datetime.now() - prazo_fim).days
        
        # Converter datas para strings
        prazo_inicio_str = None
        prazo_fim_str = None
        
        if activity.get('prazo_inicio'):
            if isinstance(activity['prazo_inicio'], datetime):
                prazo_inicio_str = activity['prazo_inicio'].isoformat()
            else:
                prazo_inicio_str = activity['prazo_inicio']
                
        if activity.get('prazo_fim'):
            if isinstance(activity['prazo_fim'], datetime):
                prazo_fim_str = activity['prazo_fim'].isoformat()
            else:
                prazo_fim_str = activity['prazo_fim']
        
        summary = {
            "id": activity['id'],
            "codigo": activity['codigo'],
            "atividade": activity['atividade'],
            "pavimento": activity['pavimento'],
            "local": activity['local'],
            "prazo_inicio": prazo_inicio_str,
            "prazo_fim": prazo_fim_str,
            "perc_prog_anterior": activity['perc_prog_anterior'],
            "perc_prog_atual": activity['perc_prog_atual'],
            "status": activity['status'],
            "audios_orientacao": activity.get('audios_orientacao', []),
            "ai_refs": activity.get('ai_refs', []),
            "dias_atraso": dias_atraso
        }
        
        summaries.append(summary)
    
    return summaries

@app.post("/atividade/{atividade_id}/dificuldade")
async def reportar_dificuldade(
    atividade_id: int,
    dificuldade: Dict[str, Any],
    encarregado_id: str = Query(...)
):
    """Reportar dificuldade na atividade"""
    activity = data_loader.get_activity_details(atividade_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    # Simular registro da dificuldade
    mensagem = dificuldade.get('mensagem', '')
    
    return {
        "message": "Dificuldade reportada aos responsáveis",
        "atividade_id": atividade_id,
        "encarregado_id": encarregado_id,
        "mensagem": mensagem,
        "responsaveis_notificados": ["engenheiro@obra.com", "mestre@obra.com"]
    }

@app.post("/atividade/{atividade_id}/status")
async def atualizar_status_rapido(
    atividade_id: int,
    atualizacao: Dict[str, Any],
    encarregado_id: str = Query(...)
):
    """Atualização rápida de status da atividade"""
    activity = data_loader.get_activity_details(atividade_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    acao = atualizacao.get('acao')
    
    if acao == 'PARADO':
        activity['status'] = 'PAUSED'
        activity['motivo_atraso'] = atualizacao.get('motivo_atraso')
        
    elif acao == 'EM_ANDAMENTO':
        activity['status'] = 'IN_EXECUTION'
        
    elif acao in ['PARCIAL', 'FINALIZADO']:
        activity['status'] = 'INSPECTION_PENDING'
        percentual = atualizacao.get('percentual_para_pagar', 0)
        activity['perc_prog_atual'] = min(100, max(activity['perc_prog_atual'], percentual))
    
    return {
        "message": f"Status atualizado: {acao}",
        "atividade_id": atividade_id,
        "novo_status": activity['status']
    }

# ==================== FVS ====================

@app.post("/atividade/{atividade_id}/fvs")
async def preencher_fvs(
    atividade_id: int,
    fvs: Dict[str, Any],
    inspetor_id: str = Query(...)
):
    """Preencher FVS da atividade"""
    activity = data_loader.get_activity_details(atividade_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    # Obter template FVS baseado nos dados reais
    fvs_template = data_loader.get_fvs_template(atividade_id)
    
    # Determinar resultado
    tolerancias_ok = fvs.get('tolerancias_ok', True)
    itens_verificados = fvs.get('itens_verificados', [])
    fotos_evidencia = fvs.get('fotos_evidencia', [])
    
    # Critério: pelo menos 80% dos itens verificados e tolerâncias OK
    itens_ok = len([item for item in itens_verificados if item.get('verificado', False)])
    total_itens = len(itens_verificados)
    percentual_ok = (itens_ok / total_itens * 100) if total_itens > 0 else 0
    
    resultado = "PASS" if (tolerancias_ok and percentual_ok >= 80 and len(fotos_evidencia) > 0) else "FAIL"
    
    nc_gerada = None
    if resultado == "FAIL":
        nc_gerada = f"NC-{atividade_id}-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        activity['status'] = 'REWORK'
    else:
        activity['status'] = 'INSPECTED_PASS'
    
    return {
        "resultado": resultado,
        "nc_gerada": nc_gerada,
        "percentual_aprovacao": percentual_ok,
        "itens_verificados": itens_verificados,
        "fvs_template": fvs_template,
        "observacoes": fvs.get('observacoes', '')
    }

@app.get("/atividade/{atividade_id}/fvs/template")
async def get_fvs_template(atividade_id: int):
    """Obter template FVS baseado nos dados reais"""
    template = data_loader.get_fvs_template(atividade_id)
    if not template:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    return template

# ==================== DADOS REAIS ====================

@app.get("/dados/estatisticas")
async def get_estatisticas_dados():
    """Obter estatísticas dos dados carregados"""
    activities = data_loader.loaded_activities
    
    # Estatísticas por grupo
    grupos = {}
    status_count = {}
    encarregados = set()
    
    for activity in activities:
        grupo = activity.get('grupo', 'Outros')
        status = activity.get('status', 'UNKNOWN')
        encarregado = activity.get('encarregado_id', '')
        
        grupos[grupo] = grupos.get(grupo, 0) + 1
        status_count[status] = status_count.get(status, 0) + 1
        if encarregado:
            encarregados.add(encarregado)
    
    return {
        "total_atividades": len(activities),
        "total_fvs": len(data_loader.fvs_data),
        "total_pe": len(data_loader.pe_data),
        "distribuicao_grupos": grupos,
        "distribuicao_status": status_count,
        "total_encarregados": len(encarregados),
        "encarregados": list(encarregados)
    }

@app.get("/dados/atividade/{atividade_id}/detalhes")
async def get_detalhes_atividade(atividade_id: int):
    """Obter detalhes completos de uma atividade incluindo dados originais"""
    activity = data_loader.get_activity_details(atividade_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    return {
        "atividade": activity,
        "fvs_template": data_loader.get_fvs_template(atividade_id),
        "dados_originais": activity.get('raw_data', {}),
        "fonte_arquivo": activity.get('data_source', '')
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
