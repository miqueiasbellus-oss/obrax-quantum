import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, UserCheck, BarChart3, Building2, Package, CreditCard, LogIn, LogOut } from 'lucide-react';
import authService from '../lib/auth';

const navigation = [
  { name: 'Programação Quinzenal', href: '/programacao-quinzenal', icon: Calendar },
  { name: 'Painel Encarregado', href: '/painel-encarregado', icon: UserCheck },
  { name: 'Status', href: '/status', icon: BarChart3 },
  { name: 'Obras', href: '/obras', icon: Building2 },
  { name: 'Materiais', href: '/materiais', icon: Package },
  { name: 'ERP', href: '/erp', icon: CreditCard },
];

export default function Navbar({ apiStatus }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    authService.logout();
  };

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
          {isAuthenticated ? (
            <button className="login-btn" onClick={handleLogoutClick}>
              <LogOut size={18} />
              Sair
            </button>
          ) : (
            <button className="login-btn" onClick={handleLoginClick}>
              <LogIn size={18} />
              Fazer Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
