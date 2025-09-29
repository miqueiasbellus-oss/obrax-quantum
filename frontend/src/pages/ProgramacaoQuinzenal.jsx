import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PlayIcon, 
  MicrophoneIcon, 
  CpuChipIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentArrowUpIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://obrax-api.onrender.com';

const ProgramacaoQuinzenal = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quinzena, setQuinzena] = useState('2024-Q1-1');
  const [editingCell, setEditingCell] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [validationErrors, setValidationErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(new Date());
  const inputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Dados de exemplo para demonstração (simulando dados reais FVS/PE)
  const dadosExemplo = [
    {
      id: 1,
      codigo: 'PE00101',
      atividade: 'Locação da obra',
      grupo: 'Infraestrutura',
      encarregado: 'João Silva',
      pavimento: 'Térreo',
      local: 'Todo o terreno',
      prazo_inicio: '2024-01-15',
      prazo_fim: '2024-01-17',
      perc_prog_anterior: 0,
      perc_prog_atual: 25,
      status: 'EM_EXECUCAO',
      observacoes: 'Aguardando topógrafo'
    },
    {
      id: 2,
      codigo: 'PE00201',
      atividade: 'Execução de radier',
      grupo: 'Infraestrutura',
      encarregado: 'Maria Oliveira',
      pavimento: 'Subsolo',
      local: 'Área de fundação',
      prazo_inicio: '2024-01-18',
      prazo_fim: '2024-01-22',
      perc_prog_anterior: 0,
      perc_prog_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    },
    {
      id: 3,
      codigo: 'PE00601',
      atividade: 'Formas para laje',
      grupo: 'Estrutura',
      encarregado: 'Carlos Santos',
      pavimento: '1º Pavimento',
      local: 'Laje L1',
      prazo_inicio: '2024-01-25',
      prazo_fim: '2024-01-30',
      perc_prog_anterior: 0,
      perc_prog_atual: 60,
      status: 'EM_EXECUCAO',
      observacoes: 'Material chegou'
    },
    {
      id: 4,
      codigo: 'PE01201',
      atividade: 'Alvenaria de vedação',
      grupo: 'Alvenaria',
      encarregado: 'Ana Costa',
      pavimento: '1º Pavimento',
      local: 'Apartamentos 101-104',
      prazo_inicio: '2024-02-01',
      prazo_fim: '2024-02-10',
      perc_prog_anterior: 0,
      perc_prog_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    },
    {
      id: 5,
      codigo: 'PE01401',
      atividade: 'Revestimento argamassa',
      grupo: 'Revestimento',
      encarregado: 'Pedro Lima',
      pavimento: 'Térreo',
      local: 'Fachada Norte',
      prazo_inicio: '2024-02-15',
      prazo_fim: '2024-02-25',
      perc_prog_anterior: 0,
      perc_prog_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    }
  ];

  useEffect(() => {
    carregarAtividades();
  }, [quinzena]);

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
        params: { quinzena }
      });
      setAtividades(response.data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      // Usar dados de exemplo quando API não estiver disponível
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

  const validateField = (field, value, rowIndex) => {
    const errors = [];
    
    switch (field) {
      case 'codigo':
        if (!value || value.trim() === '') {
          errors.push('Código é obrigatório');
        } else if (atividades.some((a, i) => i !== rowIndex && a.codigo === value)) {
          errors.push('Código já existe');
        }
        break;
      case 'atividade':
        if (!value || value.trim() === '') {
          errors.push('Atividade é obrigatória');
        }
        break;
      case 'perc_prog_anterior':
      case 'perc_prog_atual':
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 100) {
          errors.push('Percentual deve estar entre 0 e 100');
        }
        break;
      case 'prazo_inicio':
      case 'prazo_fim':
        if (value && !Date.parse(value)) {
          errors.push('Data inválida');
        }
        break;
    }
    
    return errors;
  };

  const saveToServer = async (rowIndex, field, value) => {
    setSaveStatus('saving');
    
    try {
      // Simular chamada para API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simular erro ocasional para demonstração
      if (Math.random() < 0.1) {
        throw new Error('Erro de conexão');
      }
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      // Remover erro de validação se existir
      const newErrors = { ...validationErrors };
      const errorKey = `${rowIndex}-${field}`;
      delete newErrors[errorKey];
      setValidationErrors(newErrors);
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSaveStatus('error');
    }
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const { rowIndex, field } = editingCell;
      
      // Validar campo
      const errors = validateField(field, tempValue, rowIndex);
      const errorKey = `${rowIndex}-${field}`;
      
      if (errors.length > 0) {
        setValidationErrors({
          ...validationErrors,
          [errorKey]: errors
        });
      } else {
        // Atualizar dados localmente
        const newAtividades = [...atividades];
        newAtividades[rowIndex][field] = tempValue;
        setAtividades(newAtividades);
        
        // Salvar no servidor com debounce
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        saveTimeoutRef.current = setTimeout(() => {
          saveToServer(rowIndex, field, tempValue);
        }, 1000);
      }
      
      setEditingCell(null);
      setTempValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellBlur();
      
      // Navegar para a próxima linha na mesma coluna
      if (editingCell) {
        const { rowIndex, field } = editingCell;
        const nextRowIndex = rowIndex + 1;
        if (nextRowIndex < atividades.length) {
          setTimeout(() => {
            handleCellClick(nextRowIndex, field, atividades[nextRowIndex][field]);
          }, 50);
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setTempValue('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCellBlur();
      
      // Navegar para a próxima célula
      if (editingCell) {
        const { rowIndex, field } = editingCell;
        const fields = ['codigo', 'atividade', 'grupo', 'encarregado', 'pavimento', 'local', 'prazo_inicio', 'prazo_fim', 'perc_prog_anterior', 'perc_prog_atual', 'status', 'observacoes'];
        const currentFieldIndex = fields.indexOf(field);
        
        if (e.shiftKey) {
          // Shift+Tab - célula anterior
          if (currentFieldIndex > 0) {
            const prevField = fields[currentFieldIndex - 1];
            setTimeout(() => {
              handleCellClick(rowIndex, prevField, atividades[rowIndex][prevField]);
            }, 50);
          } else if (rowIndex > 0) {
            const prevField = fields[fields.length - 1];
            setTimeout(() => {
              handleCellClick(rowIndex - 1, prevField, atividades[rowIndex - 1][prevField]);
            }, 50);
          }
        } else {
          // Tab - próxima célula
          if (currentFieldIndex < fields.length - 1) {
            const nextField = fields[currentFieldIndex + 1];
            setTimeout(() => {
              handleCellClick(rowIndex, nextField, atividades[rowIndex][nextField]);
            }, 50);
          } else if (rowIndex < atividades.length - 1) {
            const nextField = fields[0];
            setTimeout(() => {
              handleCellClick(rowIndex + 1, nextField, atividades[rowIndex + 1][nextField]);
            }, 50);
          }
        }
      }
    }
  };

  const adicionarLinha = (position = 'end') => {
    const novaAtividade = {
      id: Date.now(),
      codigo: `ATV-${String(atividades.length + 1).padStart(3, '0')}`,
      atividade: 'Nova atividade',
      grupo: 'Geral',
      encarregado: '',
      pavimento: '',
      local: '',
      prazo_inicio: '',
      prazo_fim: '',
      perc_prog_anterior: 0,
      perc_prog_atual: 0,
      status: 'PLANEJADO',
      observacoes: ''
    };

    if (position === 'end') {
      setAtividades([...atividades, novaAtividade]);
    } else {
      const novasAtividades = [...atividades];
      novasAtividades.splice(position, 0, novaAtividade);
      setAtividades(novasAtividades);
    }
  };

  const duplicarLinha = (index) => {
    const atividadeOriginal = atividades[index];
    const novaAtividade = {
      ...atividadeOriginal,
      id: Date.now(),
      codigo: `${atividadeOriginal.codigo}-COPY`,
      atividade: `${atividadeOriginal.atividade} (Cópia)`
    };
    
    const novasAtividades = [...atividades];
    novasAtividades.splice(index + 1, 0, novaAtividade);
    setAtividades(novasAtividades);
  };

  const inserirLinhaAcima = (index) => {
    adicionarLinha(index);
  };

  const inserirLinhaAbaixo = (index) => {
    adicionarLinha(index + 1);
  };

  const removerLinha = (index) => {
    const novasAtividades = atividades.filter((_, i) => i !== index);
    setAtividades(novasAtividades);
  };

  const exportarCSV = () => {
    const headers = [
      'Código', 'Atividade', 'Grupo', 'Encarregado', 'Pavimento', 
      'Local', 'Prazo Início', 'Prazo Fim', '% Anterior', '% Atual', 
      'Status', 'Observações'
    ];
    
    const csvContent = [
      headers.join(','),
      ...atividades.map(atividade => [
        atividade.codigo,
        `"${atividade.atividade}"`,
        atividade.grupo,
        atividade.encarregado,
        atividade.pavimento,
        `"${atividade.local}"`,
        atividade.prazo_inicio,
        atividade.prazo_fim,
        atividade.perc_prog_anterior,
        atividade.perc_prog_atual,
        atividade.status,
        `"${atividade.observacoes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `programacao_${quinzena}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importarCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const novasAtividades = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const atividade = {
            id: Date.now() + i,
            codigo: values[0] || `IMP-${i}`,
            atividade: values[1] || 'Atividade importada',
            grupo: values[2] || 'Geral',
            encarregado: values[3] || '',
            pavimento: values[4] || '',
            local: values[5] || '',
            prazo_inicio: values[6] || '',
            prazo_fim: values[7] || '',
            perc_prog_anterior: parseInt(values[8]) || 0,
            perc_prog_atual: parseInt(values[9]) || 0,
            status: values[10] || 'PLANEJADO',
            observacoes: values[11] || ''
          };
          novasAtividades.push(atividade);
        }
        
        setAtividades([...atividades, ...novasAtividades]);
        alert(`${novasAtividades.length} atividades importadas com sucesso!`);
      } catch (error) {
        console.error('Erro ao importar CSV:', error);
        alert('Erro ao importar arquivo CSV. Verifique o formato.');
      }
    };
    reader.readAsText(file);
    
    // Limpar o input para permitir reimportação do mesmo arquivo
    event.target.value = '';
  };

  const publicarProgramacao = async () => {
    try {
      // Simular publicação
      alert('Programação publicada! Encarregados foram notificados.');
    } catch (error) {
      console.error('Erro ao publicar:', error);
    }
  };

  const renderCell = (atividade, field, rowIndex) => {
    const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;
    const value = atividade[field];
    const errorKey = `${rowIndex}-${field}`;
    const hasError = validationErrors[errorKey];
    const cellClass = `px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors min-h-[40px] border-r border-gray-200 ${hasError ? 'bg-red-50 border-red-300' : ''}`;
    const inputClass = `w-full h-full border-0 outline-none px-2 py-1 text-sm ${hasError ? 'bg-red-50 border-red-300' : 'bg-blue-50'}`;

    if (isEditing) {
      if (field === 'status') {
        return (
          <select
            ref={inputRef}
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className={inputClass}
          >
            <option value="PLANEJADO">Planejado</option>
            <option value="EM_EXECUCAO">Em Execução</option>
            <option value="PAUSADO">Pausado</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="INSPECAO">Inspeção</option>
          </select>
        );
      } else if (field === 'grupo') {
        return (
          <select
            ref={inputRef}
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className={inputClass}
          >
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="Estrutura">Estrutura</option>
            <option value="Alvenaria">Alvenaria</option>
            <option value="Revestimento">Revestimento</option>
            <option value="Instalações">Instalações</option>
            <option value="Acabamento">Acabamento</option>
            <option value="Pisos">Pisos</option>
            <option value="Esquadrias">Esquadrias</option>
          </select>
        );
      } else if (field === 'encarregado') {
        return (
          <select
            ref={inputRef}
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className={inputClass}
          >
            <option value="">Selecionar...</option>
            <option value="João Silva">João Silva</option>
            <option value="Maria Oliveira">Maria Oliveira</option>
            <option value="Carlos Santos">Carlos Santos</option>
            <option value="Ana Costa">Ana Costa</option>
            <option value="Pedro Lima">Pedro Lima</option>
          </select>
        );
      } else if (field.includes('perc_prog')) {
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
            className={`${inputClass} text-center`}
          />
        );
      } else if (field.includes('prazo')) {
        return (
          <input
            ref={inputRef}
            type="date"
            value={tempValue}
            onChange={handleCellChange}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyPress}
            className={inputClass}
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
            className={inputClass}
          />
        );
      }
    }

    // Renderização normal da célula
    
    if (field === 'status') {
      const statusColors = {
        'PLANEJADO': 'bg-gray-100 text-gray-800',
        'EM_EXECUCAO': 'bg-blue-100 text-blue-800',
        'PAUSADO': 'bg-red-100 text-red-800',
        'CONCLUIDO': 'bg-green-100 text-green-800',
        'INSPECAO': 'bg-yellow-100 text-yellow-800'
      };
      
      const statusLabels = {
        'PLANEJADO': 'Planejado',
        'EM_EXECUCAO': 'Em Execução',
        'PAUSADO': 'Pausado',
        'CONCLUIDO': 'Concluído',
        'INSPECAO': 'Inspeção'
      };

      return (
        <td 
          className={cellClass}
          onClick={() => handleCellClick(rowIndex, field, value)}
        >
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {statusLabels[value] || value}
          </span>
        </td>
      );
    } else if (field.includes('perc_prog')) {
      return (
        <td 
          className={cellClass + " text-center"}
          onClick={() => handleCellClick(rowIndex, field, value)}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium min-w-[35px]">{value}%</span>
          </div>
        </td>
      );
    } else if (field.includes('prazo')) {
      const formattedDate = value ? new Date(value).toLocaleDateString('pt-BR') : '';
      return (
        <td 
          className={cellClass}
          onClick={() => handleCellClick(rowIndex, field, value)}
        >
          {formattedDate}
        </td>
      );
    } else {
      return (
        <td 
          className={cellClass}
          onClick={() => handleCellClick(rowIndex, field, value)}
          title={value}
        >
          <div className="truncate max-w-[150px]">
            {value}
          </div>
        </td>
      );
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programação Quinzenal</h1>
            <p className="text-gray-600 mt-1">Planilha editável - clique em qualquer célula para editar</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => adicionarLinha()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Nova Linha
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={importarCSV}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="csv-import"
              />
              <label
                htmlFor="csv-import"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors cursor-pointer"
              >
                <DocumentArrowUpIcon className="w-5 h-5" />
                Importar CSV
              </label>
            </div>
            
            <button
              onClick={exportarCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Exportar CSV
            </button>
            
            <button
              onClick={publicarProgramacao}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              Publicar
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quinzena</label>
              <select
                value={quinzena}
                onChange={(e) => setQuinzena(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="2024-Q1-1">2024 Q1 - 1ª Quinzena</option>
                <option value="2024-Q1-2">2024 Q1 - 2ª Quinzena</option>
                <option value="2024-Q2-1">2024 Q2 - 1ª Quinzena</option>
              </select>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {atividades.length} atividades
              </span>
              
              {/* Indicador de salvamento */}
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
                {saveStatus === 'error' && (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-red-600">Erro ao salvar</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Como usar:</strong> Clique em qualquer célula para editar. 
            <strong>Enter</strong> = próxima linha | <strong>Tab</strong> = próxima célula | <strong>Shift+Tab</strong> = célula anterior | <strong>Esc</strong> = cancelar.
            Salvamento automático ativo.
          </p>
        </div>
      </div>

      {/* Planilha */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-8">
                  #
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[100px]">
                  Código
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">
                  Atividade
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">
                  Grupo
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[140px]">
                  Encarregado
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[100px]">
                  Pavimento
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[150px]">
                  Local
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[110px]">
                  Início
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[110px]">
                  Fim
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">
                  % Anterior
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">
                  % Atual
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[120px]">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">
                  Observações
                </th>
                <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="14" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Carregando atividades...</span>
                    </div>
                  </td>
                </tr>
              ) : atividades.length === 0 ? (
                <tr>
                  <td colSpan="14" className="px-6 py-8 text-center text-gray-500">
                    <div className="text-center">
                      <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
                      <p className="text-sm">Clique em "Nova Linha" para adicionar uma atividade</p>
                    </div>
                  </td>
                </tr>
              ) : (
                atividades.map((atividade, index) => (
                  <tr key={atividade.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <td className="px-3 py-2 text-sm text-gray-500 text-center border-r border-gray-200 bg-gray-50">
                      {index + 1}
                    </td>
                    {renderCell(atividade, 'codigo', index)}
                    {renderCell(atividade, 'atividade', index)}
                    {renderCell(atividade, 'grupo', index)}
                    {renderCell(atividade, 'encarregado', index)}
                    {renderCell(atividade, 'pavimento', index)}
                    {renderCell(atividade, 'local', index)}
                    {renderCell(atividade, 'prazo_inicio', index)}
                    {renderCell(atividade, 'prazo_fim', index)}
                    {renderCell(atividade, 'perc_prog_anterior', index)}
                    {renderCell(atividade, 'perc_prog_atual', index)}
                    {renderCell(atividade, 'status', index)}
                    {renderCell(atividade, 'observacoes', index)}
                    <td className="px-3 py-2 text-center border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <div className="relative group">
                          <button
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                            title="Mais opções"
                          >
                            ⋮
                          </button>
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <button
                              onClick={() => inserirLinhaAcima(index)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <PlusIcon className="w-4 h-4" />
                              Inserir acima
                            </button>
                            <button
                              onClick={() => inserirLinhaAbaixo(index)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <PlusIcon className="w-4 h-4" />
                              Inserir abaixo
                            </button>
                            <button
                              onClick={() => duplicarLinha(index)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              📋 Duplicar linha
                            </button>
                            <hr className="my-1" />
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                            >
                              <MicrophoneIcon className="w-4 h-4" />
                              Áudio
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 text-purple-600 flex items-center gap-2"
                            >
                              <CpuChipIcon className="w-4 h-4" />
                              IA
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 text-green-600 flex items-center gap-2"
                            >
                              <CubeIcon className="w-4 h-4" />
                              3D
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => removerLinha(index)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer com estatísticas */}
      <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span>Total: {atividades.length} atividades</span>
            <span>Em execução: {atividades.filter(a => a.status === 'EM_EXECUCAO').length}</span>
            <span>Concluídas: {atividades.filter(a => a.status === 'CONCLUIDO').length}</span>
            <span>Progresso médio: {atividades.length > 0 ? Math.round(atividades.reduce((acc, a) => acc + (a.perc_prog_atual || 0), 0) / atividades.length) : 0}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramacaoQuinzenal;
