import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Bot,
  HardHat,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://obrax-api.onrender.com';

export default function PainelEncarregado() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [encarregadoId] = useState('João Silva');
  const [atividadesExpandidas, setAtividadesExpandidas] = useState(new Set());
  const [gravandoAudio, setGravandoAudio] = useState(null);
  const [percentualInput, setPercentualInput] = useState({});

  // Dados de exemplo com histórico de registros
  const dadosExemplo = [
    {
      id: 1,
      codigo: 'PE01201',
      atividade: 'Forro',
      local: 'Pavimento Tipo 2 - Corredor do living',
      equipe: 'RDA Eq.01',
      prazo: '15/01/25',
      status_atual: 'PARADO',
      percentual_pagamento: 0,
      registros: [
        {
          data: '01/01/25',
          hora: '11:16',
          status: 'PARADO',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        },
        {
          data: '02/01/25',
          hora: '09:16',
          status: 'PARADO',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        },
        {
          data: '03/01/25',
          hora: '11:16',
          status: 'PARADO',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        }
      ]
    },
    {
      id: 2,
      codigo: 'PE00201',
      atividade: 'Execução de radier',
      local: 'Subsolo - Área de Fundação',
      equipe: 'Equipe B',
      prazo: '25/01/25',
      status_atual: 'EM_ANDAMENTO',
      percentual_pagamento: 75,
      registros: [
        {
          data: '01/01/25',
          hora: '11:16',
          status: 'PARADO',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        },
        {
          data: '06/01/25',
          hora: '14:18',
          status: 'EM_ANDAMENTO',
          descricao: 'Esta acontecendo isso isso e isso',
          dificuldades: '',
          predecessor: 'Gabriel',
          material: 'Os insumos na obra estão acabando e não serão suficiente para finalizar o serviço'
        },
        {
          data: '07/01/25',
          hora: '17:16',
          status: 'PARADO',
          descricao: 'O material ainda não chegou e a equipe esta alocada agora em outro serviço',
          dificuldades: '',
          predecessor: 'Gabriel'
        },
        {
          data: '08/01/25',
          hora: '15:24',
          status: 'EM_ANDAMENTO',
          descricao: '',
          dificuldades: '',
          predecessor: ''
        }
      ]
    },
    {
      id: 3,
      codigo: 'PE00601',
      atividade: 'Formas para laje',
      local: '1º Andar - Laje L1',
      equipe: 'Equipe C',
      prazo: '02/02/25',
      status_atual: 'EM_ATRASO',
      percentual_pagamento: 45,
      registros: [
        {
          data: '09/01/25',
          hora: '16:30',
          status: 'EM_ATRASO',
          descricao: 'Devido os atrasos de material definições e outros motivos das atividades anteriores',
          dificuldades: '',
          predecessor: ''
        }
      ]
    },
    {
      id: 4,
      codigo: 'PE03501',
      atividade: 'Pintura esmalte',
      local: '2º Andar - Esquadrias',
      equipe: 'Equipe D',
      prazo: '10/02/25',
      status_atual: 'FINALIZADO_PARCIALMENTE',
      percentual_pagamento: 80,
      registros: [
        {
          data: '10/01/25',
          hora: '16:30',
          status: 'FINALIZADO_PARCIALMENTE',
          descricao: 'Faltou finalizar a elétrica na frente do quadro não permitindo acabamento do forro',
          dificuldades: '',
          predecessor: ''
        }
      ]
    }
  ];

  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/encarregado/${encarregadoId}/atividades`, {
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

  const toggleAtividade = (atividadeId) => {
    const novasExpandidas = new Set(atividadesExpandidas);
    if (novasExpandidas.has(atividadeId)) {
      novasExpandidas.delete(atividadeId);
    } else {
      novasExpandidas.add(atividadeId);
    }
    setAtividadesExpandidas(novasExpandidas);
  };

  const iniciarGravacao = (atividadeId) => {
    setGravandoAudio(atividadeId);
    // Simular gravação
    setTimeout(() => {
      setGravandoAudio(null);
      alert('Áudio gravado e enviado com sucesso!');
    }, 3000);
  };

  const abrirAssistente = (tipo, atividade) => {
    let mensagem = '';
    switch (tipo) {
      case 'robo':
        mensagem = `🤖 Consultando normas e manuais para: ${atividade.atividade}\n\nReferências encontradas:\n• NBR 15575 - Desempenho de edificações\n• Manual técnico de execução\n• Procedimentos de qualidade`;
        break;
      case 'mestre':
        mensagem = `👷 Instrução do Mestre de Obras para: ${atividade.atividade}\n\n"Verificar alinhamento e prumo antes de fixar. Usar nível a laser para garantir precisão. Equipe deve usar EPI completo."`;
        break;
      case 'engenheiro':
        mensagem = `📊 Instrução do Engenheiro para: ${atividade.atividade}\n\n"Seguir projeto executivo PE-${atividade.codigo}. Tolerância máxima de 5mm. Realizar controle tecnológico conforme especificação."`;
        break;
    }
    alert(mensagem);
  };

  const atualizarPercentual = (atividadeId, percentual) => {
    setPercentualInput({
      ...percentualInput,
      [atividadeId]: percentual
    });
    
    // Atualizar na lista de atividades
    const novasAtividades = atividades.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, percentual_pagamento: percentual }
        : atividade
    );
    setAtividades(novasAtividades);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PARADO': 'text-yellow-600',
      'EM_ANDAMENTO': 'text-green-600',
      'EM_ATRASO': 'text-red-600',
      'FINALIZADO': 'text-blue-600',
      'FINALIZADO_PARCIALMENTE': 'text-green-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const getStatusText = (status) => {
    const texts = {
      'PARADO': 'Parado',
      'EM_ANDAMENTO': 'Em Andamento',
      'EM_ATRASO': 'Em Atraso',
      'FINALIZADO': 'Finalizado',
      'FINALIZADO_PARCIALMENTE': 'Finalizado Parcialmente'
    };
    return texts[status] || status;
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
              <p className="text-gray-600 mt-1">Registros diários e controle de atividades</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{encarregadoId}</span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {atividades.map((atividade) => {
            const isExpanded = atividadesExpandidas.has(atividade.id);
            const ultimoRegistro = atividade.registros[atividade.registros.length - 1];

            return (
              <div key={atividade.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Card Principal */}
                <div className="p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{atividade.atividade}</h3>
                        <span className="text-sm text-gray-500">Prazo</span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm text-gray-600">Local: {atividade.local}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Equipe: {atividade.equipe}</span>
                        <span className={`text-sm font-medium ${getStatusColor(atividade.status_atual)}`}>
                          {getStatusText(atividade.status_atual)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Campo de Percentual */}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentualInput[atividade.id] || atividade.percentual_pagamento}
                          onChange={(e) => atualizarPercentual(atividade.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => abrirAssistente('robo', atividade)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Assistente IA - Normas e Manuais"
                        >
                          <Bot size={20} />
                        </button>
                        
                        <button
                          onClick={() => abrirAssistente('mestre', atividade)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Instrução do Mestre"
                        >
                          <HardHat size={20} />
                        </button>
                        
                        <button
                          onClick={() => abrirAssistente('engenheiro', atividade)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Instrução do Engenheiro"
                        >
                          <BarChart3 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Botão de Microfone */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => iniciarGravacao(atividade.id)}
                      disabled={gravandoAudio === atividade.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        gravandoAudio === atividade.id
                          ? 'bg-red-100 text-red-800 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Mic size={20} className={gravandoAudio === atividade.id ? 'animate-pulse' : ''} />
                      {gravandoAudio === atividade.id ? 'Gravando...' : 'Gravar Áudio'}
                    </button>

                    <button
                      onClick={() => toggleAtividade(atividade.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      {isExpanded ? 'Ocultar' : 'Ver'} Registros
                    </button>
                  </div>
                </div>

                {/* Registros Expandidos */}
                {isExpanded && (
                  <div className="border-t bg-gray-50">
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Histórico de Registros</h4>
                      <div className="space-y-3">
                        {atividade.registros.map((registro, index) => (
                          <div key={index} className="bg-white rounded border p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900">
                                  {registro.hora} {registro.data}
                                </span>
                                <span className={`text-sm font-medium ${getStatusColor(registro.status)}`}>
                                  Status: {getStatusText(registro.status)}
                                </span>
                              </div>
                            </div>
                            
                            {registro.descricao && (
                              <p className="text-sm text-gray-700 mb-2">{registro.descricao}</p>
                            )}
                            
                            {registro.dificuldades && (
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Dificuldades:</span> {registro.dificuldades}
                              </p>
                            )}
                            
                            {registro.predecessor && (
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Predecessor:</span> {registro.predecessor}
                              </p>
                            )}
                            
                            {registro.material && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Material:</span> {registro.material}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instruções */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">📱 Como usar o painel:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>🤖 Robô:</strong> Consulta normas e manuais de execução</p>
            <p>• <strong>👷 Capacete:</strong> Recebe instrução do mestre de obras</p>
            <p>• <strong>📊 Gráfico:</strong> Recebe instrução do engenheiro</p>
            <p>• <strong>🎙️ Microfone:</strong> Grava áudio do que está acontecendo</p>
            <p>• <strong>%:</strong> Atualiza percentual para pagamento do serviço</p>
            <p>• <strong>Registros:</strong> Clique para ver histórico completo da atividade</p>
          </div>
        </div>
      </div>
    </div>
  );
}
