import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyProfile, useMyInventory, useActiveMissions } from '@/hooks';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: profile, loading: profileLoading } = useMyProfile();
  const { data: inventory, loading: inventoryLoading } = useMyInventory();
  const { data: missions, loading: missionsLoading } = useActiveMissions();

  // Si no está autenticado, redirigir
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Stats rápidos
  const quickStats = [
    {
      label: 'Items en inventario',
      value: inventory?.length || 0,
      icon: '🎒',
      color: 'var(--color-gold)',
      link: '/inventory'
    },
    {
      label: 'Misiones activas',
      value: missions?.length || 0,
      icon: '⚔️',
      color: 'var(--color-arcane-bright)',
      link: '/missions'
    },
    {
      label: 'Rango',
      value: profile?.rol || 'PLAYER',
      icon: '👑',
      color: 'var(--color-emerald-bright)',
      link: '/profile'
    },
    {
      label: 'Subastas',
      value: 'Activas',
      icon: '💰',
      color: 'var(--color-ice-bright)',
      link: '/auctions'
    }
  ];

  // Módulos principales
  const modules = [
    {
      title: 'Inventario',
      description: 'Gestiona tus ítems y equipo',
      icon: '🎒',
      path: '/inventory',
      color: 'var(--color-gold)',
      bgColor: 'rgba(200,134,10,0.1)'
    },
    {
      title: 'Misiones',
      description: 'Acepta nuevos desafíos',
      icon: '⚔️',
      path: '/missions',
      color: 'var(--color-arcane-bright)',
      bgColor: 'rgba(123,53,208,0.1)'
    },
    {
      title: 'Subastas',
      description: 'Compra y vende con otros jugadores',
      icon: '💰',
      path: '/auctions',
      color: 'var(--color-ice-bright)',
      bgColor: 'rgba(26,127,170,0.1)'
    },
    {
      title: 'Rankings',
      description: 'Compara tu progreso',
      icon: '🏆',
      path: '/rankings',
      color: 'var(--color-emerald-bright)',
      bgColor: 'rgba(26,140,69,0.1)'
    },
    {
      title: 'Perfil',
      description: 'Tu historia y logros',
      icon: '🧙',
      path: '/profile',
      color: 'var(--color-parchment)',
      bgColor: 'rgba(240,222,176,0.1)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-abyss)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header con bienvenida */}
        <div style={{
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--color-gold)',
            marginBottom: '0.5rem',
            filter: 'drop-shadow(0 0 20px rgba(200,134,10,0.3))'
          }}>
            {getGreeting()}, {profile?.apodo || user?.apodo || 'Aventurero'}
          </h1>
          <p style={{
            color: 'var(--color-parchment-dim)',
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            Bienvenido al Nexus Battles V
          </p>
        </div>

        {/* Stats rápidas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {quickStats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              style={{
                textDecoration: 'none',
                background: 'var(--color-stone-dark)',
                border: `1px solid ${stat.color}33`,
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${stat.color}33`;
                e.currentTarget.style.borderColor = stat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${stat.color}33`;
              }}
            >
              <div style={{
                fontSize: '2.5rem',
                filter: `drop-shadow(0 0 10px ${stat.color})`
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: stat.color,
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1
                }}>
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </div>
                <div style={{
                  color: 'var(--color-parchment-dim)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  {stat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Módulos principales */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.5rem',
          color: 'var(--color-gold)',
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(200,134,10,0.2)',
          paddingBottom: '0.5rem'
        }}>
          🏰 Módulos del Juego
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              style={{
                textDecoration: 'none',
                background: module.bgColor,
                border: `1px solid ${module.color}33`,
                padding: '2rem',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${module.color}33`;
                e.currentTarget.style.borderColor = module.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${module.color}33`;
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                filter: `drop-shadow(0 0 15px ${module.color})`
              }}>
                {module.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: module.color,
                marginBottom: '0.5rem'
              }}>
                {module.title}
              </h3>
              <p style={{
                color: 'var(--color-parchment-dim)',
                fontSize: '0.9rem',
                lineHeight: 1.6
              }}>
                {module.description}
              </p>
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                color: module.color,
                fontSize: '1.2rem',
                opacity: 0.5
              }}>
                →
              </div>
            </Link>
          ))}
        </div>

        {/* Actividad reciente / Noticias */}
        <div style={{
          background: 'var(--color-stone-dark)',
          border: '1px solid rgba(200,134,10,0.2)',
          padding: '2rem'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            color: 'var(--color-gold)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📜</span> Tablón de anuncios
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(200,134,10,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  color: 'var(--color-gold)',
                  fontWeight: 'bold'
                }}>
                  ⚔️ Torneo de la semana
                </span>
                <span style={{
                  color: 'var(--color-parchment-dim)',
                  fontSize: '0.8rem'
                }}>
                  Hace 2 horas
                </span>
              </div>
              <p style={{
                color: 'var(--color-parchment)',
                fontSize: '0.9rem'
              }}>
                ¡Inscripciones abiertas! Grandes premios esperan a los valientes.
              </p>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(200,134,10,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  color: 'var(--color-arcane-bright)',
                  fontWeight: 'bold'
                }}>
                  🔮 Nuevas misiones disponibles
                </span>
                <span style={{
                  color: 'var(--color-parchment-dim)',
                  fontSize: '0.8rem'
                }}>
                  Ayer
                </span>
              </div>
              <p style={{
                color: 'var(--color-parchment)',
                fontSize: '0.9rem'
              }}>
                Se han agregado 5 misiones épicas al reino.
              </p>
            </div>

            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(200,134,10,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{
                  color: 'var(--color-emerald-bright)',
                  fontWeight: 'bold'
                }}>
                  🎒 Actualización del inventario
                </span>
                <span style={{
                  color: 'var(--color-parchment-dim)',
                  fontSize: '0.8rem'
                }}>
                  Hace 3 días
                </span>
              </div>
              <p style={{
                color: 'var(--color-parchment)',
                fontSize: '0.9rem'
              }}>
                Ahora puedes filtrar y buscar tus ítems más fácilmente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer con logout */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(200,134,10,0.2)'
        }}>
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              useAuthStore.getState().clearAuth();
              navigate('/login');
            }}
            style={{
              padding: '0.7rem 2rem',
              background: 'transparent',
              border: '1px solid var(--color-crimson)',
              color: 'var(--color-crimson-bright)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168,16,32,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}