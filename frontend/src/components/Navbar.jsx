import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, CheckSquare, Package, BarChart3, CreditCard, LogIn } from 'lucide-react';

const navigation = [
  { name: 'Obras', href: '/obras', icon: Building2 },
  { name: 'Equipes', href: '/equipes', icon: Users },
  { name: 'Checklists', href: '/checklists', icon: CheckSquare },
  { name: 'Materiais', href: '/materiais', icon: Package },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'ERP', href: '/erp', icon: CreditCard },
];

export default function Navbar({ apiStatus }) {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          OBRAX <span>QUANTUM</span>
        </Link>
        
        <nav className="nav-links">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="navbar-actions">
          <span className={`status-pill ${apiStatus.online ? 'online' : apiStatus.error ? 'offline' : 'connecting'}`}>
            {apiStatus.online ? 'API Online' : apiStatus.error ? 'API Offline' : 'Conectando...'}
          </span>
          <button className="login-btn">
            <LogIn size={18} />
            Fazer Login
          </button>
        </div>
      </div>
    </header>
  );
}

