import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Loader
} from 'lucide-react';
import api from '../lib/api';

export default function PainelEncarregado() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);

  const OBRA_ID = 1; // Mock obra ID

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/sprint0/tasks/list/${OBRA_ID}`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setError('Erro ao carregar tarefas. Verifique se o backend está online.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPCC = async (task) => {
    const actionKey = `pcc-${task.id}`;
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      
      const response = await api.post('/api/sprint0/pcc/confirm', {
        obra_id: OBRA_ID,
        atividade_id: task.id,
        equipe_id: task.team_members?.[0] || 1,
        task_id: task.id
      });

      if (response.data.success) {
        alert(`PCC confirmado! Novo status: ${response.data.new_status}`);
        await fetchTasks(); // Reload tasks
      }
    } catch (err) {
      console.error('Erro ao confirmar PCC:', err);
      alert(`Erro ao confirmar PCC: ${err.response?.data?.detail || err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleFVS = async (task, status) => {
    const actionKey = `fvs-${status}-${task.id}`;
    try {
      setActionLoading(prev => ({ ...prev, [actionKey]: true }));
      
      const response = await api.post('/api/sprint0/fvs/inspect', {
        obra_id: OBRA_ID,
        service_id: task.id,
        task_id: task.id,
        status: status,
        observations: status === 'FAIL' ? 'Reprovado na inspeção visual' : 'Aprovado na inspeção visual'
      });

      if (response.data.success) {
        if (response.data.nc_event) {
          alert(`FVS registrado como ${status}. NC #${response.data.nc_event.id} criada automaticamente.`);
        } else {
          alert(`FVS registrado como ${status}. Novo status: ${response.data.new_status}`);
        }
        await fetchTasks(); // Reload tasks
      }
    } catch (err) {
      console.error('Erro ao registrar FVS:', err);
      alert(`Erro ao registrar FVS: ${err.response?.data?.detail || err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLANNED': '#6b7280',
      'PCC_REQUIRED': '#f59e0b',
      'PCC_CONFIRMED': '#10b981',
      'READY': '#3b82f6',
      'IN_EXECUTION': '#8b5cf6',
      'INSPECTION_PENDING': '#f59e0b',
      'INSPECTED_PASS': '#10b981',
      'INSPECTED_FAIL': '#ef4444',
      'PARTIAL_CLOSED': '#3b82f6',
      'CLOSED': '#6b7280',
      'REWORK': '#f97316',
      'BLOCKED': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'PLANNED': 'Planejado',
      'PCC_REQUIRED': 'PCC Requerido',
      'PCC_CONFIRMED': 'PCC Confirmado',
      'READY': 'Pronto',
      'IN_EXECUTION': 'Em Execução',
      'INSPECTION_PENDING': 'Aguardando Inspeção',
      'INSPECTED_PASS': 'Aprovado',
      'INSPECTED_FAIL': 'Reprovado',
      'PARTIAL_CLOSED': 'Parcialmente Fechado',
      'CLOSED': 'Fechado',
      'REWORK': 'Retrabalho',
      'BLOCKED': 'Bloqueado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTasks}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Painel do Encarregado</h1>
          <p className="mt-2 text-gray-600">Gestão de qualidade com fluxo PCC → FVS → NC</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-600">Não há tarefas cadastradas para esta obra.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description || 'Sem descrição'}</p>
                    {task.ifs_code && (
                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">IFS:</span> {task.ifs_code}
                      </p>
                    )}
                    {task.discipline && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Disciplina:</span> {task.discipline}
                      </p>
                    )}
                    {task.front && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Frente:</span> {task.front}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                {/* Task Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Progresso:</span> {task.progress_percentage || 0}%
                  </div>
                  {task.responsible_user && (
                    <div>
                      <span className="font-medium">Responsável:</span> {task.responsible_user}
                    </div>
                  )}
                  {task.priority && (
                    <div>
                      <span className="font-medium">Prioridade:</span> {task.priority}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {/* PCC Button */}
                  {task.status === 'PCC_REQUIRED' && (
                    <button
                      onClick={() => handleConfirmPCC(task)}
                      disabled={actionLoading[`pcc-${task.id}`]}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {actionLoading[`pcc-${task.id}`] ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar PCC
                        </>
                      )}
                    </button>
                  )}

                  {/* FVS Buttons */}
                  {task.status === 'INSPECTION_PENDING' && (
                    <>
                      <button
                        onClick={() => handleFVS(task, 'PASS')}
                        disabled={actionLoading[`fvs-PASS-${task.id}`]}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[`fvs-PASS-${task.id}`] ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            FVS PASS
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleFVS(task, 'FAIL')}
                        disabled={actionLoading[`fvs-FAIL-${task.id}`]}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading[`fvs-FAIL-${task.id}`] ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Registrando...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-2" />
                            FVS FAIL
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {/* No actions available */}
                  {task.status !== 'PCC_REQUIRED' && task.status !== 'INSPECTION_PENDING' && (
                    <p className="text-sm text-gray-500 italic">
                      Nenhuma ação disponível para o estado atual
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
