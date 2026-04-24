import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import './Navbar.css';

const navLinks = [
  { path: '/dashboard', label: '⚔ Batalla', icon: '⚔' },
  { path: '/missions', label: '🗡 Misiones', icon: '🗡' },
  { path: '/shop', label: '🏛 Mercado', icon: '🏛' },
  { path: '/auctions', label: '⚔ Subastas', icon: '⚔' },
  { path: '/inventory', label: '🎒 Inventario', icon: '🎒' },
  { path: '/rankings', label: '🏆 Rankings', icon: '🏆' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Obtener inicial del usuario
  const initial = user?.name?.charAt(0) || user?.username?.charAt(0) || user?.apodo?.charAt(0) || 'U';
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

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
          {/* Monedas */}
          <div className="nav-coins">
            ✦ 4,820 monedas
          </div>

          {/* Avatar con menú desplegable */}
          <div className="nav-avatar-container" ref={menuRef}>
            <div 
              className="nav-avatar"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {initial}
            </div>

            {/* Menú desplegable */}
            {isMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{initial}</div>
                  <h4>{user?.name || user?.username || 'Aventurero'}</h4>
                  <p>{user?.email}</p>
                  <div className={`role-badge ${isAdmin ? 'admin' : 'player'}`}>
                    {isAdmin ? '👑 ADMINISTRADOR' : '⚔️ AVENTURERO'}
                  </div>
                </div>

                <div className="dropdown-stats">
                  <div className="stat-item">
                    <span>💰</span>
                    <span>4,820</span>
                    <span>Oro</span>
                  </div>
                  <div className="stat-item">
                    <span>⚡</span>
                    <span>85</span>
                    <span>Energía</span>
                  </div>
                  <div className="stat-item">
                    <span>🏆</span>
                    <span>47</span>
                    <span>Victorias</span>
                  </div>
                </div>

                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <span>👤</span> Mi Perfil
                  </Link>
                  <Link to="/inventory" onClick={() => setIsMenuOpen(false)}>
                    <span>🎒</span> Mi Inventario
                  </Link>
                  <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                    <span>🛒</span> Tienda
                  </Link>
                  
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="admin-link">
                      <span>👑</span> Panel Admin
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Link to="/admin" className="nav-link" style={{ color: '#F5C842' }}>
                      👑 Admin
                    </Link>
                    )}
                  
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="logout-btn">
                    <span>🚪</span> Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}