import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Volume2,
  FileText,
  Camera,
  Mic,
  MapPin,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://obrax-api.onrender.com';

export default function PainelEncarregado() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [encarregadoId] = useState('João Silva');
  const [quinzena] = useState('2024-Q1-1');
  const [atividadeExpandida, setAtividadeExpandida] = useState(null);

  // Dados de exemplo para o encarregado
  const dadosExemplo = [
    {
      id: 1,
      codigo: 'PE00101',
      atividade: 'Locação da obra',
      grupo: 'Infraestrutura',
      pavimento: 'Térreo',
      local: 'Área Externa',
      prazo_inicio: '2024-01-15',
      prazo_fim: '2024-01-17',
      percentual_atual: 100,
      status: 'CONCLUÍDO',
      prioridade: 'ALTA',
      observacoes: 'Locação aprovada pela fiscalização',
      dias_atraso: 0,
      equipe_responsavel: 'Equipe A',
      materiais_necessarios: ['Teodolito', 'Estacas', 'Tinta spray'],
      audios_orientacao: ['Orientação sobre marcos de referência', 'Procedimento de conferência'],
      ai_refs: ['NBR 12721 - Locação de obras', 'Manual de topografia']
    },
    {
      id: 2,
      codigo: 'PE00201',
      atividade: 'Execução de radier',
      grupo: 'Infraestrutura',
      pavimento: 'Subsolo',
      local: 'Área de Fundação',
      prazo_inicio: '2024-01-18',
      prazo_fim: '2024-01-25',
      percentual_atual: 75,
      status: 'EM_EXECUÇÃO',
      prioridade: 'ALTA',
      observacoes: 'Aguardando liberação do concreto',
      dias_atraso: 2,
      equipe_responsavel: 'Equipe B',
      materiais_necessarios: ['Concreto C25', 'Armadura CA-50', 'Forma metálica'],
      audios_orientacao: ['Procedimento de concretagem', 'Controle de qualidade'],
      ai_refs: ['NBR 6118 - Estruturas de concreto', 'Manual de concretagem']
    },
    {
      id: 3,
      codigo: 'PE00601',
      atividade: 'Formas para laje',
      grupo: 'Estrutura',
      pavimento: '1º Andar',
      local: 'Laje L1',
      prazo_inicio: '2024-01-26',
      prazo_fim: '2024-02-02',
      percentual_atual: 45,
      status: 'EM_EXECUÇÃO',
      prioridade: 'MÉDIA',
      observacoes: 'Material em estoque suficiente',
      dias_atraso: 0,
      equipe_responsavel: 'Equipe C',
      materiais_necessarios: ['Compensado 18mm', 'Pontaletes', 'Pregos'],
      audios_orientacao: ['Montagem de formas', 'Verificação de prumo e nível'],
      ai_refs: ['Manual de formas', 'Procedimento de montagem']
    }
  ];

  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/encarregado/${encarregadoId}/atividades`, {
        params: { quinzena },
        timeout: 3000
      });
      setAtividades(response.data);
    } catch (error) {
      console.log('Usando dados de exemplo para o encarregado');
      setAtividades(dadosExemplo);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (atividadeId, novoStatus, dados = {}) => {
    try {
      // Simular atualização
      const novasAtividades = atividades.map(atividade => 
        atividade.id === atividadeId 
          ? { ...atividade, status: novoStatus, ...dados }
          : atividade
      );
      setAtividades(novasAtividades);
      alert(`Status atualizado para: ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLANEJADO': 'bg-gray-100 text-gray-800 border-gray-300',
      'EM_EXECUÇÃO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'CONCLUÍDO': 'bg-green-100 text-green-800 border-green-300',
      'PARADO': 'bg-red-100 text-red-800 border-red-300',
      'ATRASADO': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      'ALTA': 'text-red-600',
      'MÉDIA': 'text-yellow-600',
      'BAIXA': 'text-green-600'
    };
    return colors[prioridade] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Encarregado</h1>
              <p className="text-gray-600 mt-1">Interface otimizada para uso em campo</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{encarregadoId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Quinzena: {quinzena}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{atividades.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Em Execução</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {atividades.filter(a => a.status === 'EM_EXECUÇÃO').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Concluídas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {atividades.filter(a => a.status === 'CONCLUÍDO').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Atrasadas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {atividades.filter(a => a.dias_atraso > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Atividades */}
        <div className="space-y-4">
          {atividades.map((atividade) => {
            const isExpanded = atividadeExpandida === atividade.id;
            const isAtrasada = atividade.dias_atraso > 0;

            return (
              <div key={atividade.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Header da Atividade */}
                <div 
                  className={`p-4 cursor-pointer border-l-4 ${isAtrasada ? 'border-red-500 bg-red-50' : 'border-blue-500'}`}
                  onClick={() => setAtividadeExpandida(isExpanded ? null : atividade.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{atividade.codigo}</h3>
                        <span className={`text-sm font-medium ${getPrioridadeColor(atividade.prioridade)}`}>
                          {atividade.prioridade}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(atividade.status)}`}>
                          {atividade.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{atividade.atividade}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Local:</span> {atividade.pavimento} - {atividade.local}
                        </div>
                        <div>
                          <span className="font-medium">Prazo:</span> {new Date(atividade.prazo_fim).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Equipe:</span> {atividade.equipe_responsavel}
                        </div>
                        <div>
                          <span className="font-medium">Progresso:</span> {atividade.percentual_atual}%
                        </div>
                      </div>

                      {isAtrasada && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded">
                          <p className="text-red-800 text-sm font-medium">
                            ⚠️ Atividade em atraso: {atividade.dias_atraso} dias
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - atividade.percentual_atual / 100)}`}
                            className="text-blue-600"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {atividade.percentual_atual}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expandido */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    {/* Materiais Necessários */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Materiais Necessários:</h4>
                      <div className="flex flex-wrap gap-2">
                        {atividade.materiais_necessarios.map((material, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Orientações e Referências */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Volume2 size={16} />
                          Orientações (Áudio)
                        </h4>
                        <div className="space-y-2">
                          {atividade.audios_orientacao.map((audio, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Play size={16} />
                              </button>
                              <span className="text-sm text-gray-600">{audio}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FileText size={16} />
                          Referências (IA)
                        </h4>
                        <div className="space-y-1">
                          {atividade.ai_refs.map((ref, index) => (
                            <div key={index} className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer p-2 bg-white rounded border">
                              📄 {ref}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => atualizarStatus(atividade.id, 'PARADO')}
                        className="flex items-center justify-center gap-2 bg-red-100 text-red-800 border border-red-300 rounded-lg py-2 px-4 hover:bg-red-200 transition-colors"
                      >
                        <Pause size={16} />
                        Parado
                      </button>
                      
                      <button
                        onClick={() => atualizarStatus(atividade.id, 'EM_EXECUÇÃO')}
                        className="flex items-center justify-center gap-2 bg-green-100 text-green-800 border border-green-300 rounded-lg py-2 px-4 hover:bg-green-200 transition-colors"
                      >
                        <Play size={16} />
                        Em Andamento
                      </button>
                      
                      <button
                        onClick={() => atualizarStatus(atividade.id, 'CONCLUÍDO')}
                        className="flex items-center justify-center gap-2 bg-blue-100 text-blue-800 border border-blue-300 rounded-lg py-2 px-4 hover:bg-blue-200 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Finalizar
                      </button>

                      <button className="flex items-center justify-center gap-2 bg-purple-100 text-purple-800 border border-purple-300 rounded-lg py-2 px-4 hover:bg-purple-200 transition-colors">
                        <Camera size={16} />
                        FVS
                      </button>
                    </div>

                    {/* Observações */}
                    {atividade.observacoes && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm text-yellow-800">
                          <strong>Observações:</strong> {atividade.observacoes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instruções */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">📱 Interface otimizada para campo:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Toque na atividade</strong> para expandir e ver detalhes</p>
            <p>• <strong>Botões grandes</strong> para facilitar uso com luvas</p>
            <p>• <strong>Status visual</strong> com cores e indicadores de progresso</p>
            <p>• <strong>Áudios e referências</strong> disponíveis offline</p>
          </div>
        </div>
      </div>
    </div>
  );
}
