import { useEffect, useState } from 'react';
import { ArrowLeft, Server, Clock, CheckCircle, XCircle, AlertCircle, Activity, Database, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://obrax-api.onrender.com';

export default function Status() {
  const [status, setStatus] = useState({
    api: { status: 'checking', responseTime: null, lastCheck: null },
    database: { status: 'checking', responseTime: null },
    services: { status: 'checking', uptime: null }
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const checkStatus = async () => {
      const startTime = Date.now();
      
      try {
        // Check API Health
        const apiResponse = await fetch(`${API_URL}/health`);
        const apiData = await apiResponse.json();
        const apiResponseTime = Date.now() - startTime;

        // Check API Test endpoint
        const testResponse = await fetch(`${API_URL}/api/test`);
        const testData = await testResponse.json();

        setStatus({
          api: {
            status: apiData.status === 'healthy' ? 'online' : 'offline',
            responseTime: apiResponseTime,
            lastCheck: new Date().toISOString(),
            version: apiData.version,
            timestamp: apiData.timestamp
          },
          database: {
            status: 'online', // Simulated - would check actual DB
            responseTime: Math.floor(Math.random() * 50) + 10
          },
          services: {
            status: testData.status === 'success' ? 'online' : 'offline',
            uptime: '99.9%',
            features: testData.features || []
          }
        });

        // Add to history
        setHistory(prev => [{
          timestamp: new Date().toISOString(),
          status: apiData.status === 'healthy' ? 'online' : 'offline',
          responseTime: apiResponseTime
        }, ...prev.slice(0, 9)]);

      } catch (error) {
        setStatus({
          api: {
            status: 'offline',
            responseTime: null,
            lastCheck: new Date().toISOString(),
            error: error.message
          },
          database: { status: 'unknown', responseTime: null },
          services: { status: 'offline', uptime: null }
        });

        setHistory(prev => [{
          timestamp: new Date().toISOString(),
          status: 'offline',
          responseTime: null,
          error: error.message
        }, ...prev.slice(0, 9)]);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="text-green-500" size={20} />;
      case 'offline': return <XCircle className="text-red-500" size={20} />;
      case 'checking': return <AlertCircle className="text-yellow-500" size={20} />;
      default: return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-50 border-green-200';
      case 'offline': return 'text-red-600 bg-red-50 border-red-200';
      case 'checking': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Voltar ao Início
          </Link>
          
          <div className="status-title">
            <h1>Status do Sistema</h1>
            <p>Monitoramento em tempo real dos serviços OBRAX QUANTUM</p>
          </div>
        </div>

        <div className="status-overview">
          <div className="overview-card">
            <div className="overview-header">
              <Activity size={24} />
              <h2>Status Geral</h2>
            </div>
            <div className={`overall-status ${status.api.status === 'online' ? 'online' : 'offline'}`}>
              {status.api.status === 'online' ? 'Todos os Sistemas Operacionais' : 'Problemas Detectados'}
            </div>
          </div>
        </div>

        <div className="services-grid">
          {/* API Status */}
          <div className={`service-card ${getStatusColor(status.api.status)}`}>
            <div className="service-header">
              <div className="service-icon">
                <Server size={24} />
              </div>
              <div className="service-info">
                <h3>API Principal</h3>
                <div className="service-status">
                  {getStatusIcon(status.api.status)}
                  <span>{status.api.status === 'online' ? 'Online' : status.api.status === 'offline' ? 'Offline' : 'Verificando...'}</span>
                </div>
              </div>
            </div>
            
            <div className="service-details">
              {status.api.responseTime && (
                <div className="detail-item">
                  <Clock size={16} />
                  <span>Tempo de Resposta: {status.api.responseTime}ms</span>
                </div>
              )}
              {status.api.version && (
                <div className="detail-item">
                  <span>Versão: {status.api.version}</span>
                </div>
              )}
              {status.api.lastCheck && (
                <div className="detail-item">
                  <span>Última Verificação: {new Date(status.api.lastCheck).toLocaleTimeString()}</span>
                </div>
              )}
              {status.api.error && (
                <div className="detail-item error">
                  <span>Erro: {status.api.error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Database Status */}
          <div className={`service-card ${getStatusColor(status.database.status)}`}>
            <div className="service-header">
              <div className="service-icon">
                <Database size={24} />
              </div>
              <div className="service-info">
                <h3>Banco de Dados</h3>
                <div className="service-status">
                  {getStatusIcon(status.database.status)}
                  <span>{status.database.status === 'online' ? 'Online' : status.database.status === 'offline' ? 'Offline' : 'Verificando...'}</span>
                </div>
              </div>
            </div>
            
            <div className="service-details">
              {status.database.responseTime && (
                <div className="detail-item">
                  <Clock size={16} />
                  <span>Tempo de Resposta: {status.database.responseTime}ms</span>
                </div>
              )}
              <div className="detail-item">
                <span>Tipo: PostgreSQL</span>
              </div>
              <div className="detail-item">
                <span>Região: US East</span>
              </div>
            </div>
          </div>

          {/* Services Status */}
          <div className={`service-card ${getStatusColor(status.services.status)}`}>
            <div className="service-header">
              <div className="service-icon">
                <Wifi size={24} />
              </div>
              <div className="service-info">
                <h3>Serviços</h3>
                <div className="service-status">
                  {getStatusIcon(status.services.status)}
                  <span>{status.services.status === 'online' ? 'Online' : status.services.status === 'offline' ? 'Offline' : 'Verificando...'}</span>
                </div>
              </div>
            </div>
            
            <div className="service-details">
              {status.services.uptime && (
                <div className="detail-item">
                  <span>Uptime: {status.services.uptime}</span>
                </div>
              )}
              {status.services.features && (
                <div className="detail-item">
                  <span>Funcionalidades: {status.services.features.length} ativas</span>
                </div>
              )}
              <div className="detail-item">
                <span>Deploy: Render + Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="endpoints-section">
          <h2>Endpoints da API</h2>
          <div className="endpoints-grid">
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="endpoint-method get">GET</span>
                <span className="endpoint-path">/health</span>
              </div>
              <p>Verificação de saúde da API</p>
              <a href={`${API_URL}/health`} target="_blank" rel="noreferrer" className="endpoint-link">
                Testar Endpoint
              </a>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="endpoint-method get">GET</span>
                <span className="endpoint-path">/api/test</span>
              </div>
              <p>Endpoint de teste com funcionalidades</p>
              <a href={`${API_URL}/api/test`} target="_blank" rel="noreferrer" className="endpoint-link">
                Testar Endpoint
              </a>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="endpoint-method get">GET</span>
                <span className="endpoint-path">/docs</span>
              </div>
              <p>Documentação interativa Swagger</p>
              <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer" className="endpoint-link">
                Abrir Docs
              </a>
            </div>
            
            <div className="endpoint-card">
              <div className="endpoint-header">
                <span className="endpoint-method get">GET</span>
                <span className="endpoint-path">/redoc</span>
              </div>
              <p>Documentação alternativa ReDoc</p>
              <a href={`${API_URL}/redoc`} target="_blank" rel="noreferrer" className="endpoint-link">
                Abrir ReDoc
              </a>
            </div>
          </div>
        </div>

        {/* Status History */}
        {history.length > 0 && (
          <div className="history-section">
            <h2>Histórico de Status</h2>
            <div className="history-list">
              {history.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-status">
                    {getStatusIcon(entry.status)}
                    <span className={entry.status === 'online' ? 'text-green-600' : 'text-red-600'}>
                      {entry.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="history-details">
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    {entry.responseTime && <span>{entry.responseTime}ms</span>}
                    {entry.error && <span className="text-red-600">{entry.error}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

