import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PlayIcon, 
  MicrophoneIcon, 
  CpuChipIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import AudioRecorder from '../components/AudioRecorder';
import AIAssistant from '../components/AIAssistant';
import Viewer3D from '../components/Viewer3D';

const API_BASE = import.meta.env.VITE_API_URL || 'https://obrax-api.onrender.com';

const ProgramacaoQuinzenal = () => {
  const [atividades, setAtividades] = useState([]);
  const [atividadesFiltradas, setAtividadesFiltradas] = useState([]);
  const [quinzena, setQuinzena] = useState('2024-Q1-1');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [filtros, setFiltros] = useState({
    grupo: '',
    encarregado: '',
    status: '',
    busca: ''
  });
  const [showDetalhes, setShowDetalhes] = useState(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(null);
  const [showViewer3D, setShowViewer3D] = useState(null);
  
  const [novaAtividade, setNovaAtividade] = useState({
    codigo: '',
    encarregado_id: '',
    grupo: '',
    atividade: '',
    pavimento: '',
    local: '',
    prazo_inicio: '',
    prazo_fim: '',
    perc_prog_anterior: 0,
    observacoes: ''
  });

  useEffect(() => {
    carregarAtividades();
  }, [quinzena]);

  useEffect(() => {
    aplicarFiltros();
  }, [atividades, filtros]);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/programacao/atividades`, {
        params: { quinzena }
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      // Dados de fallback para desenvolvimento
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...atividades];

    if (filtros.grupo) {
      filtered = filtered.filter(a => a.grupo?.toLowerCase().includes(filtros.grupo.toLowerCase()));
    }
    if (filtros.encarregado) {
      filtered = filtered.filter(a => a.encarregado_id?.toLowerCase().includes(filtros.encarregado.toLowerCase()));
    }
    if (filtros.status) {
      filtered = filtered.filter(a => a.status === filtros.status);
    }
    if (filtros.busca) {
      filtered = filtered.filter(a => 
        a.atividade?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        a.codigo?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        a.local?.toLowerCase().includes(filtros.busca.toLowerCase())
      );
    }

    setAtividadesFiltradas(filtered);
  };

  const adicionarAtividade = async () => {
    try {
      const progResponse = await axios.post(`${API_BASE}/programacao/quinzena`, {
        quinzena,
        autor_id: 'engenheiro@obra.com'
      });

      await axios.post(`${API_BASE}/programacao/${progResponse.data.id}/atividades`, novaAtividade);
      
      setShowAddForm(false);
      setNovaAtividade({
        codigo: '',
        encarregado_id: '',
        grupo: '',
        atividade: '',
        pavimento: '',
        local: '',
        prazo_inicio: '',
        prazo_fim: '',
        perc_prog_anterior: 0,
        observacoes: ''
      });
      carregarAtividades();
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error);
    }
  };

  const iniciarEdicao = (atividade) => {
    setEditingId(atividade.id);
    setEditingData({
      encarregado_id: atividade.encarregado_id,
      pavimento: atividade.pavimento,
      local: atividade.local,
      prazo_inicio: atividade.prazo_inicio ? atividade.prazo_inicio.split('T')[0] : '',
      prazo_fim: atividade.prazo_fim ? atividade.prazo_fim.split('T')[0] : '',
      perc_prog_anterior: atividade.perc_prog_anterior,
      observacoes: atividade.observacoes || ''
    });
  };

  const salvarEdicao = async () => {
    try {
      // Simular salvamento (em produção, fazer PUT para API)
      const atividadeIndex = atividades.findIndex(a => a.id === editingId);
      if (atividadeIndex !== -1) {
        const atividadesAtualizadas = [...atividades];
        atividadesAtualizadas[atividadeIndex] = {
          ...atividadesAtualizadas[atividadeIndex],
          ...editingData
        };
        setAtividades(atividadesAtualizadas);
      }
      
      setEditingId(null);
      setEditingData({});
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditingData({});
  };

  const publicarProgramacao = async () => {
    try {
      const progResponse = await axios.post(`${API_BASE}/programacao/quinzena`, {
        quinzena,
        autor_id: 'engenheiro@obra.com'
      });

      await axios.post(`${API_BASE}/programacao/quinzena/${progResponse.data.id}/publicar`);
      alert('Programação publicada! Encarregados foram notificados.');
    } catch (error) {
      console.error('Erro ao publicar:', error);
    }
  };

  const gerarAIRefs = async (atividadeId) => {
    try {
      await axios.post(`${API_BASE}/atividade/${atividadeId}/ai_refs`);
      carregarAtividades();
      alert('Referências de IA geradas!');
    } catch (error) {
      console.error('Erro ao gerar IA refs:', error);
    }
  };

  const handleAudioSave = async (audioData, duration) => {
    try {
      // Simular upload de áudio
      console.log('Salvando áudio:', { duration, size: audioData.get('audio').size });
      alert(`Orientação de áudio salva! Duração: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`);
      setShowAudioRecorder(null);
      carregarAtividades();
    } catch (error) {
      console.error('Erro ao salvar áudio:', error);
      alert('Erro ao salvar orientação de áudio');
    }
  };

  const handleAISave = async (aiContent) => {
    try {
      // Simular salvamento do conteúdo de IA
      console.log('Salvando conteúdo IA:', aiContent);
      alert('Referências de IA salvas com sucesso!');
      setShowAIAssistant(null);
      carregarAtividades();
    } catch (error) {
      console.error('Erro ao salvar conteúdo IA:', error);
      alert('Erro ao salvar referências de IA');
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'PLANNED': 'bg-gray-100 text-gray-800 border-gray-300',
      'READY': 'bg-blue-100 text-blue-800 border-blue-300',
      'IN_EXECUTION': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'INSPECTION_PENDING': 'bg-orange-100 text-orange-800 border-orange-300',
      'INSPECTED_PASS': 'bg-green-100 text-green-800 border-green-300',
      'CLOSED': 'bg-green-100 text-green-800 border-green-300',
      'PARTIAL_CLOSED': 'bg-purple-100 text-purple-800 border-purple-300',
      'PAUSED': 'bg-red-100 text-red-800 border-red-300'
    };

    const statusLabels = {
      'PLANNED': 'Planejado',
      'READY': 'Pronto',
      'IN_EXECUTION': 'Em Execução',
      'INSPECTION_PENDING': 'Aguardando Inspeção',
      'INSPECTED_PASS': 'Aprovado',
      'CLOSED': 'Fechado',
      'PARTIAL_CLOSED': 'Parcialmente Fechado',
      'PAUSED': 'Parado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const ProgressBar = ({ percentage }) => (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-700 min-w-[35px]">{percentage}%</span>
    </div>
  );

  const grupos = [...new Set(atividades.map(a => a.grupo).filter(Boolean))];
  const encarregados = [...new Set(atividades.map(a => a.encarregado_id).filter(Boolean))];
  const statusOptions = ['PLANNED', 'READY', 'IN_EXECUTION', 'INSPECTION_PENDING', 'INSPECTED_PASS', 'CLOSED'];

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programação Quinzenal</h1>
            <p className="text-gray-600 mt-1">Gestão completa de atividades com dados reais FVS/PE</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Atividade
            </button>
            <button
              onClick={publicarProgramacao}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              Publicar Programação
            </button>
          </div>
        </div>

        {/* Filtros e Controles */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <select
                value={quinzena}
                onChange={(e) => setQuinzena(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="2024-Q1-1">2024 Q1 - 1ª Quinzena</option>
                <option value="2024-Q1-2">2024 Q1 - 2ª Quinzena</option>
                <option value="2024-Q2-1">2024 Q2 - 1ª Quinzena</option>
              </select>

              <select
                value={filtros.grupo}
                onChange={(e) => setFiltros({...filtros, grupo: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos os Grupos</option>
                {grupos.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>

              <select
                value={filtros.encarregado}
                onChange={(e) => setFiltros({...filtros, encarregado: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos os Encarregados</option>
                {encarregados.map(enc => (
                  <option key={enc} value={enc}>{enc}</option>
                ))}
              </select>

              <select
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos os Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar atividade..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[200px]"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {atividadesFiltradas.length} de {atividades.length} atividades
              </span>
              <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg">
                <ArrowDownTrayIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Atividades */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atividade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Encarregado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Carregando atividades...</span>
                    </div>
                  </td>
                </tr>
              ) : atividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="text-center">
                      <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
                      <p className="text-sm">Ajuste os filtros ou adicione uma nova atividade</p>
                    </div>
                  </td>
                </tr>
              ) : (
                atividadesFiltradas.map((atividade) => (
                  <tr key={atividade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{atividade.codigo}</span>
                        <button
                          onClick={() => setShowDetalhes(atividade.id)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={atividade.atividade}>
                          {atividade.atividade}
                        </div>
                        <div className="text-sm text-gray-500">{atividade.grupo}</div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editingId === atividade.id ? (
                        <select
                          value={editingData.encarregado_id}
                          onChange={(e) => setEditingData({...editingData, encarregado_id: e.target.value})}
                          className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                        >
                          <option value="">Selecionar...</option>
                          <option value="joao@obra.com">João Silva</option>
                          <option value="maria@obra.com">Maria Oliveira</option>
                          <option value="carlos@obra.com">Carlos Santos</option>
                          <option value="ana@obra.com">Ana Costa</option>
                          <option value="pedro@obra.com">Pedro Lima</option>
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900">{atividade.encarregado_id}</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4">
                      {editingId === atividade.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editingData.pavimento}
                            onChange={(e) => setEditingData({...editingData, pavimento: e.target.value})}
                            className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                            placeholder="Pavimento"
                          />
                          <input
                            type="text"
                            value={editingData.local}
                            onChange={(e) => setEditingData({...editingData, local: e.target.value})}
                            className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                            placeholder="Local"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm text-gray-900">{atividade.pavimento}</div>
                          <div className="text-sm text-gray-500">{atividade.local}</div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editingId === atividade.id ? (
                        <div className="space-y-1">
                          <input
                            type="date"
                            value={editingData.prazo_inicio}
                            onChange={(e) => setEditingData({...editingData, prazo_inicio: e.target.value})}
                            className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                          />
                          <input
                            type="date"
                            value={editingData.prazo_fim}
                            onChange={(e) => setEditingData({...editingData, prazo_fim: e.target.value})}
                            className="text-sm border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {atividade.prazo_fim ? new Date(atividade.prazo_fim).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <ProgressBar percentage={atividade.perc_prog_atual || 0} />
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={atividade.status} />
                    </td>
                    
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {editingId === atividade.id ? (
                          <>
                            <button
                              onClick={salvarEdicao}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Salvar"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelarEdicao}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Cancelar"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => iniciarEdicao(atividade)}
                              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                              title="Editar"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowAudioRecorder(atividade)}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Gravar orientação"
                            >
                              <MicrophoneIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowAIAssistant(atividade)}
                              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                              title="Assistente IA"
                            >
                              <CpuChipIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowViewer3D(atividade)}
                              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                              title="Visualização 3D"
                            >
                              <CubeIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {showDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detalhes da Atividade</h2>
              <button
                onClick={() => setShowDetalhes(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {(() => {
              const atividade = atividades.find(a => a.id === showDetalhes);
              if (!atividade) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Código</label>
                      <p className="text-sm text-gray-900">{atividade.codigo}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grupo</label>
                      <p className="text-sm text-gray-900">{atividade.grupo}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Atividade</label>
                    <p className="text-sm text-gray-900">{atividade.atividade}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Progresso Anterior</label>
                      <p className="text-sm text-gray-900">{atividade.perc_prog_anterior}%</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Progresso Atual</label>
                      <p className="text-sm text-gray-900">{atividade.perc_prog_atual}%</p>
                    </div>
                  </div>
                  
                  {atividade.observacoes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Observações</label>
                      <p className="text-sm text-gray-900">{atividade.observacoes}</p>
                    </div>
                  )}
                  
                  {atividade.raw_data && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dados Originais (FVS/PE)</label>
                      <div className="bg-gray-50 rounded p-3 text-xs">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(atividade.raw_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal de Nova Atividade */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nova Atividade</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <input
                  type="text"
                  value={novaAtividade.codigo}
                  onChange={(e) => setNovaAtividade({...novaAtividade, codigo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="ATV-2025-0001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Encarregado</label>
                <select
                  value={novaAtividade.encarregado_id}
                  onChange={(e) => setNovaAtividade({...novaAtividade, encarregado_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecionar...</option>
                  <option value="joao@obra.com">João Silva</option>
                  <option value="maria@obra.com">Maria Oliveira</option>
                  <option value="carlos@obra.com">Carlos Santos</option>
                  <option value="ana@obra.com">Ana Costa</option>
                  <option value="pedro@obra.com">Pedro Lima</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo/Disciplina</label>
                <select
                  value={novaAtividade.grupo}
                  onChange={(e) => setNovaAtividade({...novaAtividade, grupo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecionar...</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Estrutura">Estrutura</option>
                  <option value="Alvenaria">Alvenaria</option>
                  <option value="Revestimento">Revestimento</option>
                  <option value="Instalações">Instalações</option>
                  <option value="Acabamento">Acabamento</option>
                  <option value="Pisos">Pisos</option>
                  <option value="Esquadrias">Esquadrias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pavimento</label>
                <input
                  type="text"
                  value={novaAtividade.pavimento}
                  onChange={(e) => setNovaAtividade({...novaAtividade, pavimento: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Pavimento 05"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Atividade</label>
                <input
                  type="text"
                  value={novaAtividade.atividade}
                  onChange={(e) => setNovaAtividade({...novaAtividade, atividade: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nome da atividade"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                <input
                  type="text"
                  value={novaAtividade.local}
                  onChange={(e) => setNovaAtividade({...novaAtividade, local: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Descrição do local"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo Início</label>
                <input
                  type="date"
                  value={novaAtividade.prazo_inicio}
                  onChange={(e) => setNovaAtividade({...novaAtividade, prazo_inicio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo Fim</label>
                <input
                  type="date"
                  value={novaAtividade.prazo_fim}
                  onChange={(e) => setNovaAtividade({...novaAtividade, prazo_fim: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">% Progresso Anterior</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={novaAtividade.perc_prog_anterior}
                  onChange={(e) => setNovaAtividade({...novaAtividade, perc_prog_anterior: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={novaAtividade.observacoes}
                  onChange={(e) => setNovaAtividade({...novaAtividade, observacoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarAtividade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Componentes Modais */}
      {showAudioRecorder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AudioRecorder
            activityName={showAudioRecorder.atividade}
            onSave={handleAudioSave}
            onCancel={() => setShowAudioRecorder(null)}
          />
        </div>
      )}

      {showAIAssistant && (
        <AIAssistant
          activity={showAIAssistant}
          onSave={handleAISave}
          onClose={() => setShowAIAssistant(null)}
        />
      )}

      {showViewer3D && (
        <Viewer3D
          activity={showViewer3D}
          onClose={() => setShowViewer3D(null)}
        />
      )}
    </div>
  );
};

export default ProgramacaoQuinzenal;
