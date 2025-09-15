import json
import os
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

class RealDataLoader:
    """Carregador de dados reais FVS e PE"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.fvs_data = []
        self.pe_data = []
        self.loaded_activities = []
        
    def load_all_data(self):
        """Carregar todos os dados FVS e PE"""
        if not os.path.exists(self.data_dir):
            print(f"Diretório {self.data_dir} não encontrado")
            return
            
        for filename in os.listdir(self.data_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(self.data_dir, filename)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # Classificar por tipo (FVS ou PE)
                    if filename.startswith('FS') or 'FS' in filename:
                        self.fvs_data.append({
                            'filename': filename,
                            'data': data
                        })
                    elif filename.startswith('PE') or 'PE' in filename:
                        self.pe_data.append({
                            'filename': filename,
                            'data': data
                        })
                        
                except Exception as e:
                    print(f"Erro ao carregar {filename}: {e}")
                    
        print(f"Carregados {len(self.fvs_data)} FVS e {len(self.pe_data)} PE")
        
    def generate_activities_from_real_data(self) -> List[Dict[str, Any]]:
        """Gerar atividades baseadas nos dados reais"""
        activities = []
        
        # Combinar dados FVS e PE
        all_data = self.fvs_data + self.pe_data
        
        for i, item in enumerate(all_data[:49]):  # Limitar a 49 atividades
            data = item['data']
            filename = item['filename']
            
            # Extrair informações do arquivo
            codigo = filename.replace('.json', '').upper()
            
            # Determinar tipo e grupo
            if 'alvenaria' in filename.lower():
                grupo = 'Alvenaria'
                disciplina = 'Estrutura'
            elif 'concreto' in filename.lower() or 'laje' in filename.lower():
                grupo = 'Estrutura'
                disciplina = 'Estrutura'
            elif 'revestimento' in filename.lower() or 'pintura' in filename.lower():
                grupo = 'Revestimento'
                disciplina = 'Acabamento'
            elif 'instalacoes' in filename.lower() or 'eletrica' in filename.lower() or 'hidro' in filename.lower():
                grupo = 'Instalações'
                disciplina = 'Instalações'
            elif 'esquadria' in filename.lower() or 'caixilho' in filename.lower():
                grupo = 'Esquadrias'
                disciplina = 'Acabamento'
            elif 'forro' in filename.lower() or 'gesso' in filename.lower():
                grupo = 'Acabamento'
                disciplina = 'Acabamento'
            elif 'piso' in filename.lower() or 'ceramica' in filename.lower():
                grupo = 'Pisos'
                disciplina = 'Acabamento'
            elif 'fundacao' in filename.lower() or 'estaca' in filename.lower() or 'sapata' in filename.lower():
                grupo = 'Infraestrutura'
                disciplina = 'Estrutura'
            else:
                grupo = 'Diversos'
                disciplina = 'Geral'
            
            # Extrair nome da atividade
            atividade_nome = data.get('nome', data.get('title', data.get('atividade', codigo)))
            if not atividade_nome or atividade_nome == codigo:
                # Tentar extrair do filename
                parts = filename.replace('.json', '').split('_')
                if len(parts) > 2:
                    atividade_nome = ' '.join(parts[2:]).replace('_', ' ').title()
                else:
                    atividade_nome = codigo.replace('_', ' ').title()
            
            # Gerar dados da atividade
            base_date = datetime.now() - timedelta(days=random.randint(1, 30))
            
            activity = {
                'id': i + 1,
                'codigo': codigo,
                'atividade': atividade_nome,
                'grupo': grupo,
                'disciplina': disciplina,
                'pavimento': f"Pavimento {random.randint(1, 10):02d}",
                'local': data.get('local', f"Área {random.randint(1, 20):02d}"),
                'encarregado_id': random.choice([
                    'joao@obra.com',
                    'maria@obra.com', 
                    'carlos@obra.com',
                    'ana@obra.com',
                    'pedro@obra.com'
                ]),
                'prazo_inicio': base_date,
                'prazo_fim': base_date + timedelta(days=random.randint(3, 15)),
                'perc_prog_anterior': random.randint(0, 30),
                'perc_prog_atual': random.randint(0, 85),
                'status': random.choice([
                    'PLANNED',
                    'READY', 
                    'IN_EXECUTION',
                    'INSPECTION_PENDING'
                ]),
                'observacoes': data.get('observacoes', ''),
                'audios_orientacao': [],
                'ai_refs': [],
                'raw_data': data,  # Manter dados originais
                'data_source': filename
            }
            
            activities.append(activity)
            
        self.loaded_activities = activities
        return activities
    
    def get_activity_details(self, activity_id: int) -> Dict[str, Any]:
        """Obter detalhes completos de uma atividade"""
        for activity in self.loaded_activities:
            if activity['id'] == activity_id:
                return activity
        return None
    
    def get_activities_by_encarregado(self, encarregado_id: str) -> List[Dict[str, Any]]:
        """Obter atividades de um encarregado específico"""
        return [
            activity for activity in self.loaded_activities 
            if activity['encarregado_id'] == encarregado_id
        ]
    
    def get_activities_by_quinzena(self, quinzena: str) -> List[Dict[str, Any]]:
        """Obter atividades de uma quinzena específica"""
        # Por simplicidade, retornar todas as atividades
        # Em produção, filtrar por data real
        return self.loaded_activities
    
    def get_fvs_template(self, activity_id: int) -> Dict[str, Any]:
        """Obter template FVS baseado nos dados reais"""
        activity = self.get_activity_details(activity_id)
        if not activity:
            return {}
            
        raw_data = activity.get('raw_data', {})
        
        # Extrair itens de verificação dos dados reais
        itens_verificacao = []
        
        if 'verificacoes' in raw_data:
            itens_verificacao = raw_data['verificacoes']
        elif 'checklist' in raw_data:
            itens_verificacao = raw_data['checklist']
        else:
            # Itens padrão baseados no grupo
            grupo = activity.get('grupo', '')
            if grupo == 'Estrutura':
                itens_verificacao = [
                    'Dimensões conforme projeto',
                    'Prumo e nível',
                    'Resistência do concreto',
                    'Acabamento superficial'
                ]
            elif grupo == 'Alvenaria':
                itens_verificacao = [
                    'Alinhamento e prumo',
                    'Juntas uniformes',
                    'Amarração adequada',
                    'Limpeza da superfície'
                ]
            elif grupo == 'Revestimento':
                itens_verificacao = [
                    'Aderência adequada',
                    'Espessura conforme especificação',
                    'Acabamento uniforme',
                    'Ausência de fissuras'
                ]
            else:
                itens_verificacao = [
                    'Conformidade com projeto',
                    'Qualidade da execução',
                    'Acabamento adequado',
                    'Funcionalidade testada'
                ]
        
        return {
            'atividade_id': activity_id,
            'atividade_nome': activity['atividade'],
            'itens_verificacao': itens_verificacao,
            'tolerancias': raw_data.get('tolerancias', {}),
            'materiais_especificados': raw_data.get('materiais', []),
            'procedimentos': raw_data.get('procedimentos', [])
        }

# Instância global do carregador
data_loader = RealDataLoader()
