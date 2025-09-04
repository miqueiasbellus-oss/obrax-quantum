import { Building2, Users, CheckSquare, Package, BarChart3, CreditCard, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: 'Gestão de Obras',
    description: 'Controle completo de atividades, cronogramas e dependências com visibilidade total do progresso.',
    icon: Building2,
    href: '/obras',
    status: 'development'
  },
  {
    title: 'Equipes de Campo',
    description: 'Interface simples e intuitiva para encarregados e equipes de execução registrarem o progresso.',
    icon: Users,
    href: '/equipes',
    status: 'development'
  },
  {
    title: 'Checklists Visuais',
    description: 'Verificações de qualidade com fotos, evidências e aprovações digitais em tempo real.',
    icon: CheckSquare,
    href: '/checklists',
    status: 'development'
  },
  {
    title: 'Controle de Materiais',
    description: 'Solicitação, aprovação e rastreabilidade completa de materiais com gestão de estoque.',
    icon: Package,
    href: '/materiais',
    status: 'coming-soon'
  },
  {
    title: 'Dashboard Inteligente',
    description: 'KPIs em tempo real, insights com IA e análises preditivas para tomada de decisão.',
    icon: BarChart3,
    href: '/dashboard',
    status: 'coming-soon'
  },
  {
    title: 'ERP Nativo',
    description: 'Controle financeiro completo, integração contábil e gestão administrativa integrada.',
    icon: CreditCard,
    href: '/erp',
    status: 'coming-soon'
  }
];

export default function Home({ apiStatus }) {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Simples no Campo, <br />
            <span className="gradient-text">Poderoso no Escritório</span>
          </h1>
          <p className="hero-description">
            ERP nativo, controle total e obra viva. Zero surpresa, zero retrabalho, zero duplicidade.
            Transforme sua gestão de obras com tecnologia de ponta e simplicidade no campo.
          </p>
          <div className="hero-actions">
            <button className="cta-primary">
              Começar Agora
            </button>
            <button className="cta-secondary">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      <section className="api-status-section">
        <div className={`api-status-card ${apiStatus.online ? 'online' : apiStatus.error ? 'offline' : 'connecting'}`}>
          <div className="status-header">
            <span className="status-icon">
              {apiStatus.online ? '✅' : apiStatus.error ? '❌' : '⏳'}
            </span>
            <h3>
              {apiStatus.online ? 'Sistema Online' : apiStatus.error ? 'Sistema Offline' : 'Conectando...'}
            </h3>
          </div>
          
          <div className="status-details">
            {apiStatus.online && (
              <>
                <p>API funcionando perfeitamente em <strong>{apiStatus.timestamp}</strong></p>
                <div className="status-grid">
                  <div className="status-item">
                    <span>Versão:</span>
                    <strong>{apiStatus.version}</strong>
                  </div>
                  <div className="status-item">
                    <span>Status:</span>
                    <strong>Online</strong>
                  </div>
                  <div className="status-item">
                    <span>Docs:</span>
                    <a href={`${import.meta.env.VITE_API_URL || 'https://obrax-api.onrender.com'}/docs`} target="_blank" rel="noreferrer">
                      Swagger UI
                    </a>
                  </div>
                  <div className="status-item">
                    <span>Detalhes:</span>
                    <Link to="/status" className="status-link">
                      Ver Status Completo <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </>
            )}
            
            {!apiStatus.online && !apiStatus.error && (
              <p>Estabelecendo conexão com a API...</p>
            )}
            
            {apiStatus.error && (
              <div>
                <p>Não foi possível conectar com a API. Verifique sua conexão.</p>
                <Link to="/status" className="status-link">
                  Ver Detalhes do Status <ExternalLink size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Funcionalidades Principais</h2>
          <p>Tudo que você precisa para gerenciar suas obras de forma eficiente e profissional.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
              status={feature.status}
            />
          ))}
        </div>
      </section>

      <section className="sprint-section">
        <div className="sprint-card">
          <h3>Sprint 0 • Fundações</h3>
          <div className="sprint-progress">
            <div className={`sprint-item ${apiStatus.online ? 'completed' : 'pending'}`}>
              <span className="sprint-icon">✓</span>
              <span>Backend FastAPI configurado</span>
            </div>
            <div className="sprint-item completed">
              <span className="sprint-icon">✓</span>
              <span>Frontend Vite + React no Vercel</span>
            </div>
            <div className={`sprint-item ${apiStatus.online ? 'completed' : 'pending'}`}>
              <span className="sprint-icon">✓</span>
              <span>Conexão Frontend ↔ API</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

