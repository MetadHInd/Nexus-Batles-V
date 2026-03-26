import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import './Navbar.css';

const navLinks = [
  { path: '/dashboard', label: '⚔ Batalla', icon: '⚔' },
  { path: '/missions', label: '🗡 Misiones', icon: '🗡' },
  // Mercado → vista principal: Tienda
  { path: '/shop', label: '🏛 Mercado', icon: '🏛' },
  // Vista secundaria: Subastas
  { path: '/auctions', label: '⚔ Subastas', icon: '⚔' },
  { path: '/inventory', label: '🎒 Inventario', icon: '🎒' },
  { path: '/rankings', label: '🏆 Rankings', icon: '🏆' },
];

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const initial = (user as any)?.username?.charAt(0) || (user as any)?.apodo?.charAt(0) || 'U';

  return (
    <nav className="nexus-nav">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          ⚔ NEXUS V
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="nav-coins">
            ✦ 4,820 monedas
          </div>
          <div className="nav-avatar">
            {initial}
          </div>
        </div>
      </div>
    </nav>
  );
}