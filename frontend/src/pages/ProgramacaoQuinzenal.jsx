import React, { useState, useEffect } from 'react';
import { PlusIcon, PlayIcon, MicrophoneIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ProgramacaoQuinzenal = () => {
  const [atividades, setAtividades] = useState([]);
  const [quinzena, setQuinzena] = useState('2024-Q1-1');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
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

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/programacao/atividades`, {
        params: { quinzena }
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAtividade = async () => {
    try {
      // Primeiro criar/buscar programação
      const progResponse = await axios.post(`${API_BASE}/programacao/quinzena`, {
        quinzena,
        autor_id: 'engenheiro@obra.com'
      });

      // Adicionar atividade
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

  const publicarProgramacao = async () => {
    try {
      // Buscar ID da programação atual
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

  const StatusBadge = ({ status }) => {
    const colors = {
      'PLANNED': 'bg-gray-100 text-gray-800',
      'READY': 'bg-blue-100 text-blue-800',
      'IN_EXECUTION': 'bg-yellow-100 text-yellow-800',
      'INSPECTION_PENDING': 'bg-orange-100 text-orange-800',
      'INSPECTED_PASS': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-green-100 text-green-800',
      'PARTIAL_CLOSED': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Programação Quinzenal</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Atividade
            </button>
            <button
              onClick={publicarProgramacao}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <PlayIcon className="w-5 h-5" />
              Publicar Programação
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quinzena</label>
            <select
              value={quinzena}
              onChange={(e) => setQuinzena(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="2024-Q1-1">2024 Q1 - 1ª Quinzena</option>
              <option value="2024-Q1-2">2024 Q1 - 2ª Quinzena</option>
              <option value="2024-Q2-1">2024 Q2 - 1ª Quinzena</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formulário de Nova Atividade */}
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
                  <option value="Alvenaria">Alvenaria</option>
                  <option value="Revestimento">Revestimento</option>
                  <option value="Instalações">Instalações</option>
                  <option value="Acabamento">Acabamento</option>
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
                  type="datetime-local"
                  value={novaAtividade.prazo_inicio}
                  onChange={(e) => setNovaAtividade({...novaAtividade, prazo_inicio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo Fim</label>
                <input
                  type="datetime-local"
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
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarAtividade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Atividades */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Encarregado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : atividades.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Nenhuma atividade encontrada para esta quinzena
                  </td>
                </tr>
              ) : (
                atividades.map((atividade) => (
                  <tr key={atividade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {atividade.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{atividade.atividade}</div>
                        <div className="text-sm text-gray-500">{atividade.grupo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atividade.encarregado_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{atividade.pavimento}</div>
                        <div className="text-sm text-gray-500">{atividade.local}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atividade.prazo_fim ? new Date(atividade.prazo_fim).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${atividade.perc_prog_atual}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{atividade.perc_prog_atual}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={atividade.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Gravar orientação"
                        >
                          <MicrophoneIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => gerarAIRefs(atividade.id)}
                          className="text-purple-600 hover:text-purple-900 p-1"
                          title="Gerar referência (IA)"
                        >
                          <CpuChipIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgramacaoQuinzenal;

