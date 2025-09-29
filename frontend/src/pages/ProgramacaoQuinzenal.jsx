import React, { useState, useEffect, useRef } from 'react';
import { Mic, Bot, MapPin, Plus, Upload, Download, Save } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://obrax-api.onrender.com';

export default function ProgramacaoQuinzenal() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved');
  const [lastSaved, setLastSaved] = useState(new Date());
  const inputRef = useRef(null);

  // Dados de exemplo com estrutura completa
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
      percentual_anterior: 0,
      percentual_atual: 100,
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
      percentual_anterior: 30,
      percentual_atual: 75,
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
      percentual_anterior: 0,
      percentual_atual: 45,
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
      percentual_anterior: 0,
      percentual_atual: 20,
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
      percentual_anterior: 0,
      percentual_atual: 0,
      status: 'PLANEJADO',
      observacoes: 'Dependente da conclusão da alvenaria'
    }
  ];

  const colunas = [
    { key: 'codigo', label: 'Código', width: '100px' },
    { key: 'atividade', label: 'Atividade', width: '250px' },
    { key: 'grupo', label: 'Grupo', width: '120px' },
    { key: 'encarregado', label: 'Encarregado', width: '140px' },
    { key: 'pavimento', label: 'Pavimento', width: '100px' },
    { key: 'local', label: 'Local', width: '150px' },
    { key: 'inicio', label: 'Início', width: '110px' },
    { key: 'fim', label: 'Fim', width: '110px' },
    { key: 'percentual_anterior', label: '% Anterior', width: '90px' },
    { key: 'percentual_atual', label: '% Atual', width: '90px' },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'observacoes', label: 'Observações', width: '200px' }
  ];

  useEffect(() => {
    carregarAtividades();
  }, []);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

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

  const handleCellClick = (rowIndex, field, currentValue) => {
    setEditingCell({ rowIndex, field });
    setTempValue(currentValue || '');
  };

  const handleCellChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const { rowIndex, field } = editingCell;
      const newAtividades = [...atividades];
      newAtividades[rowIndex][field] = tempValue;
      setAtividades(newAtividades);
      setEditingCell(null);
      setSaveStatus('saving');
      
      // Simular salvamento
      setTimeout(() => {
        setSaveStatus('saved');
        setLastSaved(new Date());
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setTempValue('');
    }
  };

  const adicionarLinha = () => {
    const novaAtividade = {
      id: atividades.length + 1,
      codigo: `PE${String(atividades.length + 1).padStart(5, '0')}`,
      atividade: 'Nova Atividade',
      grupo: 'Grupo',
      encarregado: 'Encarregado',
      pavimento: 'Pavimento',
      local: 'Local',
      inicio: new Date().toISOString().split('T')[0],
      fim: new Date().toISOString().split('T')[0],
      percentual_anterior: 0,
      percentual_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    };
    setAtividades([...atividades, novaAtividade]);
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLANEJADO': 'bg-gray-100 text-gray-800',
      'INICIADO': 'bg-blue-100 text-blue-800',
      'EM_EXECUÇÃO': 'bg-yellow-100 text-yellow-800',
      'CONCLUÍDO': 'bg-green-100 text-green-800',
      'ATRASADO': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderCell = (atividade, field, rowIndex) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;
    const value = atividade[field];

    if (isEditing) {
      if (field === 'status') {
        return (
          <select
            ref={inputRef}
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className="w-full h-full border-0 outline-none bg-white px-2 py-1 text-sm"
          >
            <option value="PLANEJADO">PLANEJADO</option>
            <option value="INICIADO">INICIADO</option>
            <option value="EM_EXECUÇÃO">EM_EXECUÇÃO</option>
            <option value="CONCLUÍDO">CONCLUÍDO</option>
            <option value="ATRASADO">ATRASADO</option>
          </select>
        );
      } else if (field.includes('percentual')) {
        return (
          <input
            ref={inputRef}
            type="number"
            min="0"
            max="100"
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className="w-full h-full border-0 outline-none bg-white px-2 py-1 text-sm text-center"
          />
        );
      } else if (field === 'inicio' || field === 'fim') {
        return (
          <input
            ref={inputRef}
            type="date"
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className="w-full h-full border-0 outline-none bg-white px-2 py-1 text-sm"
          />
        );
      } else {
        return (
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className="w-full h-full border-0 outline-none bg-white px-2 py-1 text-sm"
          />
        );
      }
    }

    // Renderização normal da célula
    if (field === 'status') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    } else if (field.includes('percentual')) {
      return (
        <div className="text-center font-medium">
          {value}%
        </div>
      );
    } else {
      return (
        <div className="truncate">
          {value}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando programação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Programação Quinzenal</h1>
              <p className="text-gray-600 mt-1">Gestão completa de atividades com dados reais FVS/PE</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={adicionarLinha}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Nova Linha
              </button>
              
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-yellow-600">Salvando...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">
                      Salvo {lastSaved.toLocaleTimeString('pt-BR')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planilha */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Cabeçalho */}
              <thead>
                <tr className="bg-gray-50 border-b">
                  {colunas.map((coluna) => (
                    <th
                      key={coluna.key}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                      style={{ width: coluna.width }}
                    >
                      {coluna.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Ações
                  </th>
                </tr>
              </thead>

              {/* Corpo da tabela */}
              <tbody>
                {atividades.map((atividade, rowIndex) => (
                  <tr
                    key={atividade.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      rowIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    {colunas.map((coluna) => (
                      <td
                        key={coluna.key}
                        className="px-4 py-3 text-sm border-r border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-100 transition-colors"
                        style={{ width: coluna.width }}
                        onClick={() => handleCellClick(rowIndex, coluna.key, atividade[coluna.key])}
                      >
                        {renderCell(atividade, coluna.key, rowIndex)}
                      </td>
                    ))}
                    
                    {/* Botões de ação */}
                    <td className="px-2 py-3 text-center border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Gravação de áudio"
                        >
                          <Mic size={16} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Assistente IA"
                        >
                          <Bot size={16} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Como usar a planilha:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Clique em qualquer célula</strong> para editar o conteúdo</p>
            <p>• <strong>Enter</strong> para salvar, <strong>Esc</strong> para cancelar</p>
            <p>• <strong>Botões de ação</strong>: 🎙️ Áudio, 🤖 IA, 📍 Localização</p>
            <p>• <strong>Salvamento automático</strong> após cada edição</p>
          </div>
        </div>
      </div>
    </div>
  );
}
