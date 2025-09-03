import { ArrowRight } from 'lucide-react';

export default function FeatureCard({ title, description, icon: Icon, href, status = 'coming-soon' }) {
  const handleClick = () => {
    if (status === 'available' && href) {
      window.location.href = href;
    }
  };

  return (
    <div className={`feature-card ${status}`} onClick={handleClick}>
      <div className="feature-card-header">
        {Icon && <Icon className="feature-icon" size={24} />}
        <h3 className="feature-title">{title}</h3>
      </div>
      
      <p className="feature-description">{description}</p>
      
      <div className="feature-card-footer">
        <button 
          className={`feature-btn ${status === 'available' ? 'primary' : 'secondary'}`}
          disabled={status !== 'available'}
        >
          {status === 'available' ? 'Abrir' : 'Em Breve'}
          {status === 'available' && <ArrowRight size={16} />}
        </button>
        
        {status === 'available' && (
          <span className="feature-status available">Disponível</span>
        )}
        {status === 'development' && (
          <span className="feature-status development">Em Desenvolvimento</span>
        )}
        {status === 'coming-soon' && (
          <span className="feature-status coming-soon">Planejado</span>
        )}
      </div>
    </div>
  );
}

