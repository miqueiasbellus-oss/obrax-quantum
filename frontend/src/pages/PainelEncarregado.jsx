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
      'PARADO': '#FFA500',
      'EM_ANDAMENTO': '#32CD32',
      'EM_ATRASO': '#FF4444',
      'FINALIZADO': '#4169E1',
      'FINALIZADO_PARCIALMENTE': '#32CD32'
    };
    return colors[status] || '#666666';
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
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando suas atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        borderBottom: '1px solid #e5e7eb' 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '16px 24px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827', 
                margin: '0 0 4px 0' 
              }}>
                Painel do Encarregado
              </h1>
              <p style={{ 
                color: '#6b7280', 
                margin: 0, 
                fontSize: '14px' 
              }}>
                Registros diários e controle de atividades
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                fontWeight: '500' 
              }}>
                {encarregadoId}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#9ca3af' 
              }}>
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '24px' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {atividades.map((atividade) => {
            const isExpanded = atividadesExpandidas.has(atividade.id);

            return (
              <div key={atividade.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {/* Card Principal */}
                <div style={{ 
                  padding: '20px', 
                  borderLeft: '4px solid #3b82f6',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px', 
                        marginBottom: '8px' 
                      }}>
                        <h3 style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          color: '#111827', 
                          margin: 0 
                        }}>
                          {atividade.atividade}
                        </h3>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#6b7280' 
                        }}>
                          Prazo
                        </span>
                      </div>
                      
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        marginBottom: '4px' 
                      }}>
                        Local: {atividade.local}
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px' 
                      }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#6b7280' 
                        }}>
                          Equipe: {atividade.equipe}
                        </span>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '500',
                          color: getStatusColor(atividade.status_atual)
                        }}>
                          {getStatusText(atividade.status_atual)}
                        </span>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px' 
                    }}>
                      {/* Campo de Percentual */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px' 
                      }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentualInput[atividade.id] || atividade.percentual_pagamento}
                          onChange={(e) => atualizarPercentual(atividade.id, parseInt(e.target.value) || 0)}
                          style={{
                            width: '60px',
                            textAlign: 'center',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '14px'
                          }}
                        />
                        <span style={{ 
                          fontSize: '14px', 
                          color: '#6b7280' 
                        }}>
                          %
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px' 
                      }}>
                        <button
                          onClick={() => abrirAssistente('robo', atividade)}
                          style={{
                            padding: '8px',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Assistente IA - Normas e Manuais"
                        >
                          <Bot size={20} />
                        </button>
                        
                        <button
                          onClick={() => abrirAssistente('mestre', atividade)}
                          style={{
                            padding: '8px',
                            backgroundColor: '#fed7aa',
                            color: '#ea580c',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Instrução do Mestre"
                        >
                          <HardHat size={20} />
                        </button>
                        
                        <button
                          onClick={() => abrirAssistente('engenheiro', atividade)}
                          style={{
                            padding: '8px',
                            backgroundColor: '#bbf7d0',
                            color: '#16a34a',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Instrução do Engenheiro"
                        >
                          <BarChart3 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Microfone e Expandir */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginTop: '16px' 
                  }}>
                    <button
                      onClick={() => iniciarGravacao(atividade.id)}
                      disabled={gravandoAudio === atividade.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: gravandoAudio === atividade.id ? '#fecaca' : '#f3f4f6',
                        color: gravandoAudio === atividade.id ? '#dc2626' : '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: gravandoAudio === atividade.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      <Mic size={20} style={{ 
                        animation: gravandoAudio === atividade.id ? 'pulse 1s infinite' : 'none' 
                      }} />
                      {gravandoAudio === atividade.id ? 'Gravando...' : 'Gravar Áudio'}
                    </button>

                    <button
                      onClick={() => toggleAtividade(atividade.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      {isExpanded ? 'Ocultar' : 'Ver'} Registros
                    </button>
                  </div>
                </div>

                {/* Registros Expandidos */}
                {isExpanded && (
                  <div style={{ 
                    borderTop: '1px solid #e5e7eb', 
                    backgroundColor: '#f9fafb' 
                  }}>
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: '500', 
                        color: '#111827', 
                        margin: '0 0 12px 0' 
                      }}>
                        Histórico de Registros
                      </h4>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '12px' 
                      }}>
                        {atividade.registros.map((registro, index) => (
                          <div key={index} style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb', 
                            padding: '12px' 
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'start', 
                              justifyContent: 'space-between', 
                              marginBottom: '8px' 
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '16px' 
                              }}>
                                <span style={{ 
                                  fontSize: '14px', 
                                  fontWeight: '500', 
                                  color: '#111827' 
                                }}>
                                  {registro.hora} {registro.data}
                                </span>
                                <span style={{ 
                                  fontSize: '14px', 
                                  fontWeight: '500',
                                  color: getStatusColor(registro.status)
                                }}>
                                  Status: {getStatusText(registro.status)}
                                </span>
                              </div>
                            </div>
                            
                            {registro.descricao && (
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#374151', 
                                margin: '0 0 8px 0' 
                              }}>
                                {registro.descricao}
                              </p>
                            )}
                            
                            {registro.dificuldades && (
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                margin: '0 0 8px 0' 
                              }}>
                                <span style={{ fontWeight: '500' }}>Dificuldades:</span> {registro.dificuldades}
                              </p>
                            )}
                            
                            {registro.predecessor && (
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                margin: '0 0 8px 0' 
                              }}>
                                <span style={{ fontWeight: '500' }}>Predecessor:</span> {registro.predecessor}
                              </p>
                            )}
                            
                            {registro.material && (
                              <p style={{ 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                margin: 0 
                              }}>
                                <span style={{ fontWeight: '500' }}>Material:</span> {registro.material}
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
        <div style={{ 
          marginTop: '24px', 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#1e40af', 
            margin: '0 0 8px 0' 
          }}>
            📱 Como usar o painel:
          </h3>
          <div style={{ 
            fontSize: '14px', 
            color: '#1e40af', 
            lineHeight: '1.5' 
          }}>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>🤖 Robô:</strong> Consulta normas e manuais de execução</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>👷 Capacete:</strong> Recebe instrução do mestre de obras</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>📊 Gráfico:</strong> Recebe instrução do engenheiro</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>🎙️ Microfone:</strong> Grava áudio do que está acontecendo</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>%:</strong> Atualiza percentual para pagamento do serviço</p>
            <p style={{ margin: 0 }}>• <strong>Registros:</strong> Clique para ver histórico completo da atividade</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
