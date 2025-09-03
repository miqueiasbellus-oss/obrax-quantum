import { ArrowLeft, Wrench, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ComingSoon({ title, description, expectedDate }) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        <div className="coming-soon-icon">
          <Wrench size={64} />
        </div>
        
        <h1 className="coming-soon-title">
          {title || 'Funcionalidade em Desenvolvimento'}
        </h1>
        
        <p className="coming-soon-description">
          {description || 'Esta funcionalidade está sendo desenvolvida e estará disponível em breve. Acompanhe nosso progresso!'}
        </p>
        
        {expectedDate && (
          <div className="expected-date">
            <Calendar size={20} />
            <span>Previsão de lançamento: {expectedDate}</span>
          </div>
        )}
        
        <div className="development-status">
          <h3>Status do Desenvolvimento</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-dot planning"></span>
              <span>Planejamento</span>
            </div>
            <div className="status-item">
              <span className="status-dot development"></span>
              <span>Desenvolvimento</span>
            </div>
            <div className="status-item">
              <span className="status-dot testing"></span>
              <span>Testes</span>
            </div>
            <div className="status-item">
              <span className="status-dot release"></span>
              <span>Lançamento</span>
            </div>
          </div>
        </div>
        
        <div className="coming-soon-actions">
          <Link to="/" className="btn-primary">
            <ArrowLeft size={20} />
            Voltar ao Início
          </Link>
          
          <button className="btn-secondary">
            <Users size={20} />
            Notificar quando Pronto
          </button>
        </div>
        
        <div className="contact-info">
          <p>Tem sugestões ou dúvidas sobre esta funcionalidade?</p>
          <a href="mailto:contato@obrax.com" className="contact-link">
            Entre em contato conosco
          </a>
        </div>
      </div>
    </div>
  );
}

