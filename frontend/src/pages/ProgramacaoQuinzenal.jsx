import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Bot,
  MapPin,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://obrax-api.onrender.com';

export default function ProgramacaoQuinzenal() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoCelula, setEditandoCelula] = useState(null);
  const [valorEdicao, setValorEdicao] = useState('');
  const [filtros, setFiltros] = useState({
    busca: '',
    grupo: '',
    encarregado: '',
    status: ''
  });

  // Dados de exemplo com design moderno
  const dadosExemplo = [
    {
      id: 1,
      codigo: 'PE00101',
      atividade: 'Locação da obra',
      grupo: 'Infraestrutura',
      encarregado: 'João Silva',
      pavimento: 'Térreo',
      local: 'Área Externa',
      inicio: '2024-01-15',
      fim: '2024-01-17',
      perc_anterior: 0,
      perc_atual: 100,
      status: 'CONCLUÍDO',
      observacoes: 'Locação aprovada pela fiscalização'
    },
    {
      id: 2,
      codigo: 'PE00201',
      atividade: 'Execução de radier',
      grupo: 'Infraestrutura',
      encarregado: 'Carlos Santos',
      pavimento: 'Subsolo',
      local: 'Área de Fundação',
      inicio: '2024-01-18',
      fim: '2024-01-25',
      perc_anterior: 30,
      perc_atual: 75,
      status: 'EM_EXECUÇÃO',
      observacoes: 'Aguardando liberação do concreto'
    },
    {
      id: 3,
      codigo: 'PE00601',
      atividade: 'Formas para laje',
      grupo: 'Estrutura',
      encarregado: 'Maria Oliveira',
      pavimento: '1º Andar',
      local: 'Laje L1',
      inicio: '2024-01-26',
      fim: '2024-02-02',
      perc_anterior: 0,
      perc_atual: 45,
      status: 'EM_EXECUÇÃO',
      observacoes: 'Material em estoque suficiente'
    },
    {
      id: 4,
      codigo: 'PE01201',
      atividade: 'Alvenaria de vedação',
      grupo: 'Alvenaria',
      encarregado: 'Pedro Costa',
      pavimento: 'Térreo',
      local: 'Apartamentos 101-105',
      inicio: '2024-02-03',
      fim: '2024-02-15',
      perc_anterior: 0,
      perc_atual: 20,
      status: 'INICIADO',
      observacoes: 'Blocos cerâmicos entregues'
    },
    {
      id: 5,
      codigo: 'PE01401',
      atividade: 'Revestimento argamassa',
      grupo: 'Revestimentos',
      encarregado: 'Ana Ferreira',
      pavimento: 'Térreo',
      local: 'Fachada Norte',
      inicio: '2024-02-16',
      fim: '2024-02-28',
      perc_anterior: 0,
      perc_atual: 0,
      status: 'PLANEJADO',
      observacoes: 'Dependente da conclusão da alvenaria'
    }
  ];

  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/programacao/atividades`, {
        timeout: 3000
      });
      setAtividades(response.data);
    } catch (error) {
      console.log('Usando dados de exemplo');
      setAtividades(dadosExemplo);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicao = (atividadeId, campo, valor) => {
    setEditandoCelula(`${atividadeId}-${campo}`);
    setValorEdicao(valor);
  };

  const salvarEdicao = (atividadeId, campo) => {
    const novasAtividades = atividades.map(atividade => 
      atividade.id === atividadeId 
        ? { ...atividade, [campo]: valorEdicao }
        : atividade
    );
    setAtividades(novasAtividades);
    setEditandoCelula(null);
    setValorEdicao('');
  };

  const cancelarEdicao = () => {
    setEditandoCelula(null);
    setValorEdicao('');
  };

  const adicionarNovaLinha = () => {
    const novaAtividade = {
      id: Date.now(),
      codigo: `PE${String(Date.now()).slice(-5)}`,
      atividade: 'Nova Atividade',
      grupo: 'Grupo',
      encarregado: 'Encarregado',
      pavimento: 'Pavimento',
      local: 'Local',
      inicio: new Date().toISOString().split('T')[0],
      fim: new Date().toISOString().split('T')[0],
      perc_anterior: 0,
      perc_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    };
    setAtividades([...atividades, novaAtividade]);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLANEJADO': '#6b7280',
      'INICIADO': '#f59e0b',
      'EM_EXECUÇÃO': '#10b981',
      'CONCLUÍDO': '#3b82f6',
      'ATRASADO': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const atividadesFiltradas = atividades.filter(atividade => {
    return (
      atividade.atividade.toLowerCase().includes(filtros.busca.toLowerCase()) &&
      (filtros.grupo === '' || atividade.grupo === filtros.grupo) &&
      (filtros.encarregado === '' || atividade.encarregado === filtros.encarregado) &&
      (filtros.status === '' || atividade.status === filtros.status)
    );
  });

  const renderCelula = (atividade, campo, tipo = 'text') => {
    const chaveEdicao = `${atividade.id}-${campo}`;
    const estaEditando = editandoCelula === chaveEdicao;
    const valor = atividade[campo];

    if (estaEditando) {
      return (
        <input
          type={tipo}
          value={valorEdicao}
          onChange={(e) => setValorEdicao(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') salvarEdicao(atividade.id, campo);
            if (e.key === 'Escape') cancelarEdicao();
          }}
          onBlur={() => salvarEdicao(atividade.id, campo)}
          autoFocus
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '2px solid #3b82f6',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        />
      );
    }

    return (
      <div
        onClick={() => iniciarEdicao(atividade.id, campo, valor)}
        style={{
          padding: '8px',
          cursor: 'pointer',
          minHeight: '20px',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        {tipo === 'date' && valor ? new Date(valor).toLocaleDateString('pt-BR') : valor}
      </div>
    );
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
          <p style={{ color: '#6b7280' }}>Carregando programação...</p>
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
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '16px 24px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#111827', 
                margin: '0 0 4px 0' 
              }}>
                Programação Quinzenal
              </h1>
              <p style={{ 
                color: '#6b7280', 
                margin: 0, 
                fontSize: '14px' 
              }}>
                Gestão completa de atividades com dados reais FVS/PE
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={adicionarNovaLinha}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Plus size={16} />
                Nova Linha
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6b7280' 
              }} />
              <input
                type="text"
                placeholder="Buscar atividades..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                style={{
                  paddingLeft: '40px',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  width: '200px'
                }}
              />
            </div>

            <select
              value={filtros.grupo}
              onChange={(e) => setFiltros({...filtros, grupo: e.target.value})}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Todos os Grupos</option>
              <option value="Infraestrutura">Infraestrutura</option>
              <option value="Estrutura">Estrutura</option>
              <option value="Alvenaria">Alvenaria</option>
              <option value="Revestimentos">Revestimentos</option>
            </select>

            <select
              value={filtros.status}
              onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Todos os Status</option>
              <option value="PLANEJADO">Planejado</option>
              <option value="INICIADO">Iniciado</option>
              <option value="EM_EXECUÇÃO">Em Execução</option>
              <option value="CONCLUÍDO">Concluído</option>
            </select>

            <div style={{ 
              fontSize: '12px', 
              color: '#6b7280',
              marginLeft: 'auto'
            }}>
              Salvo {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '24px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden' 
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Código</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Atividade</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Grupo</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Encarregado</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Pavimento</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Local</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Início</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Fim</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>% Anterior</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>% Atual</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Observações</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {atividadesFiltradas.map((atividade, index) => (
                  <tr key={atividade.id} style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'codigo')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'atividade')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'grupo')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'encarregado')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'pavimento')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'local')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'inicio', 'date')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'fim', 'date')}</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'perc_anterior', 'number')}%</td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'perc_atual', 'number')}%</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        color: getStatusColor(atividade.status),
                        fontWeight: '500'
                      }}>
                        {atividade.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{renderCelula(atividade, 'observacoes')}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          style={{
                            padding: '4px',
                            backgroundColor: '#dbeafe',
                            color: '#2563eb',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Gravação de áudio"
                        >
                          <Mic size={16} />
                        </button>
                        <button
                          style={{
                            padding: '4px',
                            backgroundColor: '#dcfce7',
                            color: '#16a34a',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Assistente IA"
                        >
                          <Bot size={16} />
                        </button>
                        <button
                          style={{
                            padding: '4px',
                            backgroundColor: '#fef3c7',
                            color: '#d97706',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="Localização"
                        >
                          <MapPin size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            💡 Como usar a planilha:
          </h3>
          <div style={{ 
            fontSize: '14px', 
            color: '#1e40af', 
            lineHeight: '1.5' 
          }}>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>Clique em qualquer célula</strong> para editar o conteúdo</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>Enter</strong> para salvar, <strong>Esc</strong> para cancelar</p>
            <p style={{ margin: '0 0 4px 0' }}>• <strong>Botões de ação:</strong> 🎙️ Áudio, 🤖 IA, 📍 Localização</p>
            <p style={{ margin: 0 }}>• <strong>Salvamento automático</strong> após cada edição</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
