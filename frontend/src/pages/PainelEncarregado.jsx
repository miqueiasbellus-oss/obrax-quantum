import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  CameraIcon,
  MicrophoneIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://obrax-api.onrender.com';

const PainelEncarregado = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [encarregadoId, setEncarregadoId] = useState('joao@obra.com');
  const [quinzena] = useState('2024-Q1-1');
  const [atividadeExpandida, setAtividadeExpandida] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [filtroStatus, setFiltroStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const encarregados = [
    { id: 'joao@obra.com', nome: 'João Silva' },
    { id: 'maria@obra.com', nome: 'Maria Oliveira' },
    { id: 'carlos@obra.com', nome: 'Carlos Santos' },
    { id: 'ana@obra.com', nome: 'Ana Costa' },
    { id: 'pedro@obra.com', nome: 'Pedro Lima' }
  ];

  useEffect(() => {
    carregarAtividades();
  }, [encarregadoId]);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/encarregado/${encarregadoId}/atividades`, {
        params: { quinzena }
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAtividades = async () => {
    setRefreshing(true);
    await carregarAtividades();
    setRefreshing(false);
  };

  const atualizarStatus = async (atividadeId, acao, dados = {}) => {
    try {
      await axios.post(`${API_BASE}/atividade/${atividadeId}/status`, {
        acao,
        ...dados
      }, {
        params: { encarregado_id: encarregadoId }
      });
      
      carregarAtividades();
      setShowModal(false);
      setModalData({});
      
      alert(`Status atualizado: ${acao}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const reportarDificuldade = async (atividadeId, mensagem) => {
    try {
      await axios.post(`${API_BASE}/atividade/${atividadeId}/dificuldade`, {
        mensagem
      }, {
        params: { encarregado_id: encarregadoId }
      });
      
      alert('Dificuldade reportada aos responsáveis!');
      setShowModal(false);
      setModalData({});
    } catch (error) {
      console.error('Erro ao reportar dificuldade:', error);
      alert('Erro ao reportar dificuldade');
    }
  };

  const preencherFVS = async (atividadeId, fvsData) => {
    try {
      const response = await axios.post(`${API_BASE}/atividade/${atividadeId}/fvs`, fvsData, {
        params: { inspetor_id: encarregadoId }
      });
      
      if (response.data.resultado === 'PASS') {
        alert('FVS aprovado! Atividade liberada para medição.');
      } else {
        alert('FVS reprovado. NC gerada: ' + response.data.nc_gerada);
      }
      
      carregarAtividades();
      setShowModal(false);
      setModalData({});
    } catch (error) {
      console.error('Erro ao preencher FVS:', error);
      alert('Erro ao preencher FVS');
    }
  };

  const openModal = (type, atividade) => {
    setModalType(type);
    setModalData({ atividade });
    setShowModal(true);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'PLANNED': 'bg-gray-100 text-gray-800 border-gray-300',
      'READY': 'bg-blue-100 text-blue-800 border-blue-300',
      'IN_EXECUTION': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'INSPECTION_PENDING': 'bg-orange-100 text-orange-800 border-orange-300',
      'INSPECTED_PASS': 'bg-green-100 text-green-800 border-green-300',
      'PAUSED': 'bg-red-100 text-red-800 border-red-300'
    };

    const statusLabels = {
      'PLANNED': 'Planejado',
      'READY': 'Pronto',
      'IN_EXECUTION': 'Em Execução',
      'INSPECTION_PENDING': 'Aguardando Inspeção',
      'INSPECTED_PASS': 'Aprovado',
      'PAUSED': 'Parado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const AtividadeCard = ({ atividade }) => {
    const isExpanded = atividadeExpandida === atividade.id;
    const isAtrasada = atividade.dias_atraso && atividade.dias_atraso > 0;
    const prazoFim = atividade.prazo_fim ? new Date(atividade.prazo_fim) : null;
    const hoje = new Date();
    const diasRestantes = prazoFim ? Math.ceil((prazoFim - hoje) / (1000 * 60 * 60 * 24)) : null;

    return (
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${isAtrasada ? 'border-red-500' : 'border-blue-500'} mb-4 overflow-hidden`}>
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setAtividadeExpandida(isExpanded ? null : atividade.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{atividade.codigo}</h3>
                <StatusBadge status={atividade.status} />
              </div>
              <p className="text-gray-700 font-medium">{atividade.atividade}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{atividade.pavimento} - {atividade.local}</span>
                </div>
                {prazoFim && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{prazoFim.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {diasRestantes !== null && (
                  <div className={`flex items-center gap-1 ${diasRestantes < 0 ? 'text-red-600' : diasRestantes <= 2 ? 'text-orange-600' : 'text-gray-600'}`}>
                    <ClockIcon className="w-4 h-4" />
                    <span>
                      {diasRestantes < 0 ? `${Math.abs(diasRestantes)} dias em atraso` : 
                       diasRestantes === 0 ? 'Vence hoje' :
                       `${diasRestantes} dias restantes`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isAtrasada && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-800 text-sm font-medium">
                  Atividade em atraso: {atividade.dias_atraso} dias
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[120px]">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, atividade.perc_prog_atual))}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700 min-w-[35px]">{atividade.perc_prog_atual}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              {atividade.audios_orientacao && atividade.audios_orientacao.length > 0 && (
                <div className="flex items-center gap-1 text-blue-600">
                  <SpeakerWaveIcon className="w-4 h-4" />
                  <span className="text-xs">{atividade.audios_orientacao.length}</span>
                </div>
              )}
              {atividade.ai_refs && atividade.ai_refs.length > 0 && (
                <div className="flex items-center gap-1 text-purple-600">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span className="text-xs">{atividade.ai_refs.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t bg-gray-50 p-4">
            {/* Áudios de Orientação */}
            {atividade.audios_orientacao && atividade.audios_orientacao.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <SpeakerWaveIcon className="w-4 h-4" />
                  Orientações (Áudio)
                </h4>
                <div className="space-y-2">
                  {atividade.audios_orientacao.map((audio, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50">
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">Orientação {index + 1}</span>
                      <span className="text-xs text-gray-500 ml-auto">2:30</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Referências de IA */}
            {atividade.ai_refs && atividade.ai_refs.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  Referências (IA)
                </h4>
                <div className="space-y-1">
                  {atividade.ai_refs.map((ref, index) => (
                    <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer p-2 hover:bg-blue-50 rounded">
                      📄 {ref}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botão de Dificuldade */}
            <div className="mb-4">
              <button
                onClick={() => openModal('dificuldade', atividade)}
                className="w-full bg-orange-100 text-orange-800 border border-orange-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-orange-200 transition-colors font-medium"
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                Estou com dificuldade
              </button>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => openModal('parado', atividade)}
                className="bg-red-100 text-red-800 border border-red-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-red-200 transition-colors font-medium"
              >
                <PauseIcon className="w-5 h-5" />
                Parado
              </button>
              
              <button
                onClick={() => atualizarStatus(atividade.id, 'EM_ANDAMENTO')}
                className="bg-green-100 text-green-800 border border-green-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-green-200 transition-colors font-medium"
              >
                <PlayIcon className="w-5 h-5" />
                Em andamento
              </button>
              
              <button
                onClick={() => openModal('parcial', atividade)}
                className="bg-purple-100 text-purple-800 border border-purple-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-purple-200 transition-colors font-medium"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Fechamento Parcial
              </button>
              
              <button
                onClick={() => openModal('finalizado', atividade)}
                className="bg-blue-100 text-blue-800 border border-blue-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors font-medium"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Finalizar
              </button>
            </div>

            {/* Botão FVS */}
            <button
              onClick={() => openModal('fvs', atividade)}
              className="w-full bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors font-medium"
            >
              <CameraIcon className="w-5 h-5" />
              Preencher FVS
            </button>
          </div>
        )}
      </div>
    );
  };

  // Modal Component
  const Modal = () => {
    const [formData, setFormData] = useState({});

    const handleSubmit = () => {
      const atividade = modalData.atividade;

      switch (modalType) {
        case 'dificuldade':
          reportarDificuldade(atividade.id, formData.mensagem);
          break;
        case 'parado':
          atualizarStatus(atividade.id, 'PARADO', {
            motivo_atraso: formData.motivo_atraso,
            observacao: formData.observacao
          });
          break;
        case 'parcial':
        case 'finalizado':
          atualizarStatus(atividade.id, modalType === 'parcial' ? 'PARCIAL' : 'FINALIZADO', {
            percentual_para_pagar: parseFloat(formData.percentual),
            observacao: formData.observacao
          });
          break;
        case 'fvs':
          preencherFVS(atividade.id, {
            itens_verificados: [
              { item: 'Qualidade do serviço', verificado: formData.qualidade || false },
              { item: 'Tolerâncias dimensionais', verificado: formData.tolerancias || false },
              { item: 'Acabamento', verificado: formData.acabamento || false },
              { item: 'Conformidade com projeto', verificado: formData.conformidade || false }
            ],
            fotos_evidencia: formData.fotos || [],
            tolerancias_ok: formData.tolerancias_ok !== false,
            observacoes: formData.observacoes
          });
          break;
      }
    };

    if (!showModal) return null;

    const modalTitles = {
      'dificuldade': 'Reportar Dificuldade',
      'parado': 'Marcar como Parado',
      'parcial': 'Fechamento Parcial',
      'finalizado': 'Finalizar Atividade',
      'fvs': 'Preencher FVS'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{modalTitles[modalType]}</h2>

          <div className="space-y-4">
            {modalType === 'dificuldade' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  value={formData.mensagem || ''}
                  onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Descreva a dificuldade..."
                />
              </div>
            )}

            {modalType === 'parado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <select
                    value={formData.motivo_atraso || ''}
                    onChange={(e) => setFormData({...formData, motivo_atraso: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Selecionar motivo...</option>
                    <option value="Falta de material">Falta de material</option>
                    <option value="Chuva">Chuva</option>
                    <option value="Falta de equipamento">Falta de equipamento</option>
                    <option value="Aguardando liberação">Aguardando liberação</option>
                    <option value="Problema técnico">Problema técnico</option>
                    <option value="Falta de mão de obra">Falta de mão de obra</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <textarea
                    value={formData.observacao || ''}
                    onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                    placeholder="Detalhes adicionais..."
                  />
                </div>
              </>
            )}

            {(modalType === 'parcial' || modalType === 'finalizado') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentual para pagamento (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentual || ''}
                    onChange={(e) => setFormData({...formData, percentual: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <textarea
                    value={formData.observacao || ''}
                    onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                    placeholder="Observações sobre a execução..."
                  />
                </div>
              </>
            )}

            {modalType === 'fvs' && (
              <>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Itens de Verificação</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.qualidade || false}
                        onChange={(e) => setFormData({...formData, qualidade: e.target.checked})}
                        className="mr-2"
                      />
                      Qualidade do serviço
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.tolerancias || false}
                        onChange={(e) => setFormData({...formData, tolerancias: e.target.checked})}
                        className="mr-2"
                      />
                      Tolerâncias dimensionais
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.acabamento || false}
                        onChange={(e) => setFormData({...formData, acabamento: e.target.checked})}
                        className="mr-2"
                      />
                      Acabamento
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.conformidade || false}
                        onChange={(e) => setFormData({...formData, conformidade: e.target.checked})}
                        className="mr-2"
                      />
                      Conformidade com projeto
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tolerâncias OK?</label>
                  <select
                    value={formData.tolerancias_ok !== false ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, tolerancias_ok: e.target.value === 'true'})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Observações sobre a inspeção..."
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    📷 Lembre-se de tirar fotos das evidências antes de submeter o FVS.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const atividadesFiltradas = filtroStatus 
    ? atividades.filter(a => a.status === filtroStatus)
    : atividades;

  const encarregadoAtual = encarregados.find(e => e.id === encarregadoId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Encarregado</h1>
                <p className="text-sm text-gray-600">{encarregadoAtual?.nome}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refreshAtividades}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Atualizar"
              >
                <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encarregado</label>
              <select
                value={encarregadoId}
                onChange={(e) => setEncarregadoId(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {encarregados.map(enc => (
                  <option key={enc.id} value={enc.id}>{enc.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Todos os Status</option>
                <option value="PLANNED">Planejado</option>
                <option value="READY">Pronto</option>
                <option value="IN_EXECUTION">Em Execução</option>
                <option value="INSPECTION_PENDING">Aguardando Inspeção</option>
                <option value="PAUSED">Parado</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <ChartBarIcon className="w-4 h-4 inline mr-1" />
                {atividadesFiltradas.length} atividades
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {atividades.filter(a => a.status === 'IN_EXECUTION').length}
            </div>
            <div className="text-sm text-gray-600">Em Execução</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {atividades.filter(a => a.dias_atraso > 0).length}
            </div>
            <div className="text-sm text-gray-600">Em Atraso</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {atividades.filter(a => a.status === 'INSPECTED_PASS').length}
            </div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {Math.round(atividades.reduce((acc, a) => acc + (a.perc_prog_atual || 0), 0) / atividades.length) || 0}%
            </div>
            <div className="text-sm text-gray-600">Progresso Médio</div>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando suas atividades...</span>
            </div>
          </div>
        ) : atividadesFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-500">
              <CheckCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-sm">
                {filtroStatus ? 'Nenhuma atividade com este status.' : 'Você não possui atividades pendentes no momento.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {atividadesFiltradas.map((atividade) => (
              <AtividadeCard key={atividade.id} atividade={atividade} />
            ))}
          </div>
        )}
      </div>

      <Modal />
    </div>
  );
};

export default PainelEncarregado;
