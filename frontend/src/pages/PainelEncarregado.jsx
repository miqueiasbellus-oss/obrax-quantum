import React, { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  CameraIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PainelEncarregado = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [encarregadoId] = useState('joao@obra.com'); // Simular usuário logado
  const [quinzena] = useState('2024-Q1-1');
  const [atividadeExpandida, setAtividadeExpandida] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/encarregado/${encarregadoId}/atividades`, {
        params: { quinzena }
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
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
      'PLANNED': 'bg-gray-100 text-gray-800',
      'READY': 'bg-blue-100 text-blue-800',
      'IN_EXECUTION': 'bg-yellow-100 text-yellow-800',
      'INSPECTION_PENDING': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const AtividadeCard = ({ atividade }) => {
    const isExpanded = atividadeExpandida === atividade.id;
    const isAtrasada = atividade.dias_atraso && atividade.dias_atraso > 0;

    return (
      <div className={`bg-white rounded-lg shadow-md border-l-4 ${isAtrasada ? 'border-red-500' : 'border-blue-500'}`}>
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setAtividadeExpandida(isExpanded ? null : atividade.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{atividade.codigo}</h3>
              <p className="text-gray-600">{atividade.atividade}</p>
            </div>
            <StatusBadge status={atividade.status} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
            <div>
              <span className="font-medium">Local:</span> {atividade.pavimento} - {atividade.local}
            </div>
            <div>
              <span className="font-medium">Prazo:</span> {atividade.prazo_fim ? new Date(atividade.prazo_fim).toLocaleDateString() : '-'}
            </div>
          </div>

          {isAtrasada && (
            <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Atividade em atraso: {atividade.dias_atraso} dias
              </p>
            </div>
          )}

          <div className="flex items-center mb-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${atividade.perc_prog_atual}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium">{atividade.perc_prog_atual}%</span>
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
                      <button className="text-blue-600 hover:text-blue-800">
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">Orientação {index + 1}</span>
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
                    <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
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
                className="w-full bg-orange-100 text-orange-800 border border-orange-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-orange-200"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Estou com dificuldade
              </button>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => openModal('parado', atividade)}
                className="bg-red-100 text-red-800 border border-red-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-red-200"
              >
                <PauseIcon className="w-4 h-4" />
                Parado
              </button>
              
              <button
                onClick={() => atualizarStatus(atividade.id, 'EM_ANDAMENTO')}
                className="bg-green-100 text-green-800 border border-green-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-green-200"
              >
                <PlayIcon className="w-4 h-4" />
                Em andamento
              </button>
              
              <button
                onClick={() => openModal('parcial', atividade)}
                className="bg-purple-100 text-purple-800 border border-purple-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-purple-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Fechamento Parcial
              </button>
              
              <button
                onClick={() => openModal('finalizado', atividade)}
                className="bg-blue-100 text-blue-800 border border-blue-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-blue-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Finalizar
              </button>
            </div>

            {/* Botão FVS */}
            <button
              onClick={() => openModal('fvs', atividade)}
              className="w-full bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-indigo-200"
            >
              <CameraIcon className="w-4 h-4" />
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
              { item: 'Acabamento', verificado: formData.acabamento || false }
            ],
            fotos_evidencia: formData.fotos || [],
            tolerancias_ok: formData.tolerancias_ok !== false,
            observacoes: formData.observacoes
          });
          break;
      }
    };

    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {modalType === 'dificuldade' && 'Reportar Dificuldade'}
            {modalType === 'parado' && 'Marcar como Parado'}
            {modalType === 'parcial' && 'Fechamento Parcial'}
            {modalType === 'finalizado' && 'Finalizar Atividade'}
            {modalType === 'fvs' && 'Preencher FVS'}
          </h2>

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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <textarea
                    value={formData.observacao || ''}
                    onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                  />
                </div>
              </>
            )}

            {modalType === 'fvs' && (
              <>
                <div className="space-y-2">
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
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  📷 Fotos de evidência serão capturadas automaticamente
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Minhas Atividades</h1>
        <p className="text-gray-600">Quinzena: {quinzena} | Encarregado: {encarregadoId}</p>
      </div>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Carregando atividades...</div>
          </div>
        ) : atividades.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Nenhuma atividade encontrada</div>
          </div>
        ) : (
          atividades.map((atividade) => (
            <AtividadeCard key={atividade.id} atividade={atividade} />
          ))
        )}
      </div>

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default PainelEncarregado;

