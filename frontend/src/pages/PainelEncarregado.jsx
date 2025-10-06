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
  Clock,
  Loader
} from 'lucide-react';

export default function PainelEncarregado() {
  const [atividades, setAtividades] = useState([]);
  const [expandidas, setExpandidas] = useState({});
  const [gravandoAudio, setGravandoAudio] = useState({});
  const [processandoAudio, setProcessandoAudio] = useState({});
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
          liberacao_servico: 'Não liberado',
          predecessor: 'David',
          dificuldades: 'Falta de definição de serviços antecessores',
          retrabalho: 'Não',
          ambiente_limpo: 'Sim',
          colaboradores_equipes: 'RDA Eq.01',
          motivo_atraso: 'Dependência de outros serviços',
          observacoes_adicionais: 'Aguardando liberação da engenharia'
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
          liberacao_servico: 'Liberado',
          predecessor: 'Gabriel',
          dificuldades: 'Material insuficiente',
          retrabalho: 'Não',
          ambiente_limpo: 'Sim',
          colaboradores_equipes: 'Equipe B completa',
          motivo_atraso: 'Atraso na entrega de material',
          observacoes_adicionais: 'Os insumos na obra estão acabando e não serão suficiente para finalizar o serviço'
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
          liberacao_servico: 'Parcialmente liberado',
          predecessor: 'Equipe anterior',
          dificuldades: 'Atrasos de atividades anteriores',
          retrabalho: 'Sim',
          ambiente_limpo: 'Não',
          colaboradores_equipes: 'Equipe C reduzida',
          motivo_atraso: 'Dependência de atividades anteriores',
          observacoes_adicionais: 'Devido os atrasos de material definições e outros motivos das atividades anteriores'
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

  // Função para transcrever áudio usando Web Speech API
  const transcreverAudio = async (audioBlob) => {
    return new Promise((resolve) => {
      // Simulação de transcrição (em produção, usar API real)
      const transcricoesPossíveis = [
        "O serviço foi liberado hoje pela manhã, a equipe está completa, não temos dificuldades no momento, o ambiente está limpo e organizado",
        "Estamos com atraso devido à falta de material, o predecessor não finalizou ainda, precisa de retrabalho na parte elétrica",
        "Serviço parado, aguardando liberação do engenheiro, equipe reduzida hoje, ambiente precisa ser limpo antes de continuar",
        "Tudo liberado, equipe trabalhando normalmente, sem dificuldades, ambiente ok, sem necessidade de retrabalho",
        "Problema com o predecessor, serviço não foi liberado, equipe ociosa, ambiente sujo, precisa de limpeza urgente"
      ];
      
      const transcricaoAleatoria = transcricoesPossíveis[Math.floor(Math.random() * transcricoesPossíveis.length)];
      
      setTimeout(() => {
        resolve(transcricaoAleatoria);
      }, 2000); // Simula tempo de processamento
    });
  };

  // Função para categorizar o texto transcrito usando IA
  const categorizarTexto = async (textoTranscrito) => {
    return new Promise((resolve) => {
      // Simulação de IA para categorização (em produção, usar OpenAI API)
      const palavrasChave = {
        liberacao_servico: ['liberado', 'liberação', 'aprovado', 'autorizado', 'pode começar', 'pode iniciar'],
        status: ['parado', 'andamento', 'executando', 'finalizado', 'atrasado', 'concluído'],
        predecessor: ['predecessor', 'equipe anterior', 'serviço anterior', 'dependência'],
        dificuldades: ['dificuldade', 'problema', 'complicação', 'obstáculo', 'impedimento'],
        retrabalho: ['retrabalho', 'refazer', 'corrigir', 'ajustar', 'reparar'],
        ambiente_limpo: ['limpo', 'organizado', 'sujo', 'bagunçado', 'desarrumado'],
        colaboradores_equipes: ['equipe', 'colaborador', 'funcionário', 'pessoal', 'time'],
        motivo_atraso: ['atraso', 'atrasado', 'demora', 'pendência', 'espera'],
        observacoes_adicionais: ['observação', 'nota', 'comentário', 'adicional', 'importante']
      };

      const resultado = {
        liberacao_servico: '',
        status: '',
        predecessor: '',
        dificuldades: '',
        retrabalho: '',
        ambiente_limpo: '',
        colaboradores_equipes: '',
        motivo_atraso: '',
        observacoes_adicionais: textoTranscrito
      };

      const textoLower = textoTranscrito.toLowerCase();

      // Análise simples baseada em palavras-chave
      if (textoLower.includes('liberado') || textoLower.includes('liberação')) {
        resultado.liberacao_servico = textoLower.includes('não') ? 'Não liberado' : 'Liberado';
      }

      if (textoLower.includes('parado')) resultado.status = 'Parado';
      else if (textoLower.includes('andamento') || textoLower.includes('executando')) resultado.status = 'Em andamento';
      else if (textoLower.includes('atrasado') || textoLower.includes('atraso')) resultado.status = 'Em atraso';

      if (textoLower.includes('predecessor') || textoLower.includes('equipe anterior')) {
        resultado.predecessor = 'Dependência identificada';
      }

      if (textoLower.includes('dificuldade') || textoLower.includes('problema')) {
        const match = textoLower.match(/dificuldade[s]?[:\s]+([^,\.]+)/);
        resultado.dificuldades = match ? match[1].trim() : 'Dificuldades identificadas';
      }

      if (textoLower.includes('retrabalho') || textoLower.includes('refazer')) {
        resultado.retrabalho = textoLower.includes('não') || textoLower.includes('sem') ? 'Não' : 'Sim';
      }

      if (textoLower.includes('limpo') || textoLower.includes('sujo')) {
        resultado.ambiente_limpo = textoLower.includes('sujo') || textoLower.includes('desarrumado') ? 'Não' : 'Sim';
      }

      if (textoLower.includes('equipe') || textoLower.includes('colaborador')) {
        const match = textoLower.match(/equipe[:\s]+([^,\.]+)/);
        resultado.colaboradores_equipes = match ? match[1].trim() : 'Equipe presente';
      }

      if (textoLower.includes('atraso') || textoLower.includes('demora')) {
        const match = textoLower.match(/atraso[:\s]+([^,\.]+)/);
        resultado.motivo_atraso = match ? match[1].trim() : 'Atraso identificado';
      }

      setTimeout(() => {
        resolve(resultado);
      }, 1000); // Simula tempo de processamento da IA
    });
  };

  const iniciarGravacao = async (atividadeId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        
        // Iniciar processamento
        setProcessandoAudio(prev => ({ ...prev, [atividadeId]: true }));
        
        try {
          // Transcrever áudio
          const textoTranscrito = await transcreverAudio(blob);
          
          // Categorizar com IA
          const dadosCategorizados = await categorizarTexto(textoTranscrito);
          
          // Criar novo registro estruturado
          const novoRegistro = {
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            ...dadosCategorizados,
            transcricao_original: textoTranscrito,
            audio: URL.createObjectURL(blob)
          };

          setAtividades(prev => prev.map(atividade => 
            atividade.id === atividadeId 
              ? { ...atividade, registros: [...atividade.registros, novoRegistro] }
              : atividade
          ));

          alert('Áudio transcrito e categorizado com sucesso!');
          
        } catch (error) {
          console.error('Erro no processamento:', error);
          alert('Erro ao processar o áudio. Tente novamente.');
        } finally {
          setProcessandoAudio(prev => ({ ...prev, [atividadeId]: false }));
        }

        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
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
          Registros diários com transcrição automática por IA
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
                  disabled={processandoAudio[atividade.id]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: processandoAudio[atividade.id] ? '#6b7280' : (gravandoAudio[atividade.id] ? '#ef4444' : '#1f2937'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: processandoAudio[atividade.id] ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    animation: gravandoAudio[atividade.id] ? 'pulse 1s infinite' : 'none'
                  }}
                  title={processandoAudio[atividade.id] ? "Processando áudio..." : "Gravar áudio com transcrição IA"}
                >
                  {processandoAudio[atividade.id] ? <Loader size={20} className="animate-spin" /> : <Mic size={20} />}
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

              {/* Status de Processamento */}
              {processandoAudio[atividade.id] && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Loader size={16} className="animate-spin" style={{ color: '#3b82f6' }} />
                  <span style={{ color: '#1e40af', fontSize: '14px' }}>
                    Processando áudio com IA... Transcrevendo e categorizando informações.
                  </span>
                </div>
              )}

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
                      marginBottom: '12px'
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
                    
                    {/* Campos Estruturados */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '12px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}>
                      {registro.liberacao_servico && (
                        <div>
                          <strong style={{ color: '#374151' }}>Liberação do serviço:</strong> {registro.liberacao_servico}
                        </div>
                      )}
                      
                      {registro.predecessor && (
                        <div>
                          <strong style={{ color: '#374151' }}>Predecessor:</strong> {registro.predecessor}
                        </div>
                      )}
                      
                      {registro.dificuldades && (
                        <div>
                          <strong style={{ color: '#374151' }}>Dificuldades:</strong> {registro.dificuldades}
                        </div>
                      )}
                      
                      {registro.retrabalho && (
                        <div>
                          <strong style={{ color: '#374151' }}>Retrabalho:</strong> {registro.retrabalho}
                        </div>
                      )}
                      
                      {registro.ambiente_limpo && (
                        <div>
                          <strong style={{ color: '#374151' }}>Ambiente está limpo:</strong> {registro.ambiente_limpo}
                        </div>
                      )}
                      
                      {registro.colaboradores_equipes && (
                        <div>
                          <strong style={{ color: '#374151' }}>Colaboradores/equipes:</strong> {registro.colaboradores_equipes}
                        </div>
                      )}
                      
                      {registro.motivo_atraso && (
                        <div>
                          <strong style={{ color: '#374151' }}>Motivo de atraso:</strong> {registro.motivo_atraso}
                        </div>
                      )}
                      
                      {registro.observacoes_adicionais && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong style={{ color: '#374151' }}>Observações adicionais:</strong> {registro.observacoes_adicionais}
                        </div>
                      )}
                    </div>

                    {/* Transcrição Original */}
                    {registro.transcricao_original && (
                      <div style={{ 
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        <strong>Transcrição original:</strong> "{registro.transcricao_original}"
                      </div>
                    )}

                    {/* Player de Áudio */}
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
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
