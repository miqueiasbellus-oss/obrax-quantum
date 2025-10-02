import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Bot, 
  HardHat, 
  BarChart3,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  Users,
  Clock
} from 'lucide-react';

export default function PainelEncarregado() {
  const [atividades, setAtividades] = useState([]);
  const [expandidas, setExpandidas] = useState({});
  const [gravandoAudio, setGravandoAudio] = useState({});
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Dados de exemplo com prazos da programação
  const dadosExemplo = [
    {
      id: 1,
      codigo: 'PE00101',
      atividade: 'Forro',
      local: 'Pavimento Tipo 2 - Corredor do living',
      equipe: 'RDA Eq.01',
      prazoInicio: '2024-01-15',
      prazoFim: '2024-01-17',
      status: 'Parado',
      percentual: 0,
      registros: [
        {
          id: 1,
          data: '01/01/25',
          hora: '11:16',
          status: 'Parado',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        },
        {
          id: 2,
          data: '02/01/25',
          hora: '09:16',
          status: 'Parado',
          descricao: 'Serviço não liberado para execução',
          dificuldades: 'falta de definição de serviços antecessores',
          predecessor: 'David'
        },
        {
          id: 3,
          data: '03/01/25',
          hora: '11:16',
          status: 'Parado',
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
      prazoInicio: '2024-01-18',
      prazoFim: '2024-01-25',
      status: 'Em Andamento',
      percentual: 75,
      registros: [
        {
          id: 1,
          data: '06/01/25',
          hora: '14:18',
          status: 'Em andamento',
          descricao: 'Esta acontecendo isso isso e isso',
          dificuldades: 'Material: Os insumos na obra estão acabando e não serão suficiente para finalizar o serviço',
          predecessor: 'Gabriel'
        },
        {
          id: 2,
          data: '07/01/25',
          hora: '17:16',
          status: 'Parado',
          descricao: 'O material ainda não chegou e a equipe esta alocada agora em outro serviço',
          dificuldades: '',
          predecessor: 'Gabriel'
        },
        {
          id: 3,
          data: '08/01/25',
          hora: '15:24',
          status: 'Em andamento',
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
      prazoInicio: '2024-01-26',
      prazoFim: '2024-02-02',
      status: 'Em Atraso',
      percentual: 45,
      registros: [
        {
          id: 1,
          data: '09/01/25',
          hora: '16:30',
          status: 'Em atraso',
          descricao: 'Devido os atrasos de material definições e outros motivos das atividades anteriores',
          dificuldades: '',
          predecessor: ''
        }
      ]
    },
    {
      id: 4,
      codigo: 'PE01401',
      atividade: 'Revestimento argamassa',
      local: 'Térreo - Fachada Norte',
      equipe: 'Equipe D',
      prazoInicio: '2024-02-16',
      prazoFim: '2024-02-28',
      status: 'Finalizado Parcialmente',
      percentual: 85,
      registros: [
        {
          id: 1,
          data: '10/01/25',
          hora: '18:45',
          status: 'Finalizado parcialmente',
          descricao: 'Faltou finalizar a elétrica na frente do quadro não permitindo o acabamento do forro',
          dificuldades: '',
          predecessor: ''
        }
      ]
    }
  ];

  useEffect(() => {
    setAtividades(dadosExemplo);
  }, []);

  const toggleExpansao = (atividadeId) => {
    setExpandidas(prev => ({
      ...prev,
      [atividadeId]: !prev[atividadeId]
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      'Parado': '#f59e0b',
      'Em Andamento': '#10b981',
      'Em Atraso': '#ef4444',
      'Finalizado': '#3b82f6',
      'Finalizado Parcialmente': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  const iniciarGravacao = async (atividadeId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Adicionar novo registro com áudio
        const novoRegistro = {
          id: Date.now(),
          data: new Date().toLocaleDateString('pt-BR'),
          hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'Em andamento',
          descricao: 'Registro de áudio enviado',
          dificuldades: '',
          predecessor: 'Sistema',
          audio: audioUrl
        };

        setAtividades(prev => prev.map(atividade => 
          atividade.id === atividadeId 
            ? { ...atividade, registros: [...atividade.registros, novoRegistro] }
            : atividade
        ));

        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
        
        alert('Áudio gravado e adicionado aos registros com sucesso!');
      };

      setMediaRecorder(recorder);
      setGravandoAudio(prev => ({ ...prev, [atividadeId]: true }));
      recorder.start();

      // Parar automaticamente após 30 segundos
      setTimeout(() => {
        if (recorder.state === 'recording') {
          pararGravacao(atividadeId);
        }
      }, 30000);

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const pararGravacao = (atividadeId) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setGravandoAudio(prev => ({ ...prev, [atividadeId]: false }));
      setMediaRecorder(null);
    }
  };

  const atualizarPercentual = (atividadeId, novoPercentual) => {
    setAtividades(prev => prev.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, percentual: parseInt(novoPercentual) || 0 }
        : atividade
    ));
  };

  const formatarPrazo = (inicio, fim) => {
    const dataInicio = new Date(inicio).toLocaleDateString('pt-BR');
    const dataFim = new Date(fim).toLocaleDateString('pt-BR');
    return `${dataInicio} - ${dataFim}`;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#111827', 
          margin: '0 0 8px 0' 
        }}>
          Painel do Encarregado
        </h1>
        <p style={{ 
          color: '#6b7280', 
          margin: '0 0 12px 0', 
          fontSize: '16px' 
        }}>
          Registros diários e controle de atividades
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          fontSize: '14px',
          color: '#374151'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} />
            <span>João Silva</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '24px' 
      }}>
        {atividades.map((atividade) => (
          <div key={atividade.id} style={{ 
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            marginBottom: '20px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            {/* Card Principal */}
            <div style={{ 
              padding: '24px',
              borderBottom: expandidas[atividade.id] ? '1px solid #e5e7eb' : 'none'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#111827', 
                    margin: '0 0 8px 0' 
                  }}>
                    {atividade.atividade}
                  </h3>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    <div style={{ marginBottom: '4px' }}>
                      <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {atividade.local}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <Users size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {atividade.equipe}
                    </div>
                    <div>
                      <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {formatarPrazo(atividade.prazoInicio, atividade.prazoFim)}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'right',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '8px'
                }}>
                  <span style={{ 
                    color: getStatusColor(atividade.status),
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {atividade.status}
                  </span>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={atividade.percentual}
                      onChange={(e) => atualizarPercentual(atividade.id, e.target.value)}
                      style={{
                        width: '60px',
                        padding: '4px 8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>%</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <button
                  onClick={() => gravandoAudio[atividade.id] ? pararGravacao(atividade.id) : iniciarGravacao(atividade.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: gravandoAudio[atividade.id] ? '#ef4444' : '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    animation: gravandoAudio[atividade.id] ? 'pulse 1s infinite' : 'none'
                  }}
                  title="Gravar áudio"
                >
                  <Mic size={20} />
                </button>

                <button
                  onClick={() => alert('Assistente IA: Consultando normas e manuais de execução...')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Assistente IA - Normas e manuais"
                >
                  <Bot size={20} />
                </button>

                <button
                  onClick={() => alert('Instrução do Mestre: Reproduzindo orientações técnicas...')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Instrução do Mestre"
                >
                  <HardHat size={20} />
                </button>

                <button
                  onClick={() => alert('Instrução do Engenheiro: Carregando especificações técnicas...')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title="Instrução do Engenheiro"
                >
                  <BarChart3 size={20} />
                </button>
              </div>

              {/* Botão Ver Registros */}
              <button
                onClick={() => toggleExpansao(atividade.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {expandidas[atividade.id] ? 'Ocultar Registros' : 'Ver Registros'}
                {expandidas[atividade.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Registros Expandidos */}
            {expandidas[atividade.id] && (
              <div style={{ 
                backgroundColor: '#f8fafc',
                padding: '20px 24px'
              }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  margin: '0 0 16px 0' 
                }}>
                  Histórico de Registros
                </h4>
                
                {atividade.registros.map((registro) => (
                  <div key={registro.id} style={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        color: '#111827' 
                      }}>
                        {registro.data} {registro.hora}
                      </div>
                      <span style={{ 
                        color: getStatusColor(registro.status),
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        Status: {registro.status}
                      </span>
                    </div>
                    
                    {registro.descricao && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '14px', 
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        <strong>Descrição:</strong> {registro.descricao}
                      </p>
                    )}
                    
                    {registro.dificuldades && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '14px', 
                        color: '#374151',
                        lineHeight: '1.5'
                      }}>
                        <strong>Dificuldades:</strong> {registro.dificuldades}
                      </p>
                    )}
                    
                    {registro.predecessor && (
                      <p style={{ 
                        margin: '0', 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        <strong>Predecessor:</strong> {registro.predecessor}
                      </p>
                    )}

                    {registro.audio && (
                      <div style={{ marginTop: '12px' }}>
                        <audio controls style={{ width: '100%' }}>
                          <source src={registro.audio} type="audio/wav" />
                          Seu navegador não suporta áudio.
                        </audio>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .container {
            padding: 16px !important;
          }
          
          .card {
            margin-bottom: 16px !important;
          }
          
          .header {
            padding: 16px !important;
          }
          
          .buttons {
            flex-wrap: wrap !important;
          }
          
          .button {
            width: 44px !important;
            height: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}
