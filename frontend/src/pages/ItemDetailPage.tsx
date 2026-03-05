import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryApi, Item } from '@/api/inventory';
import { getErrorMessage } from '@/api/client';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await inventoryApi.getItemById(id);
        setItem(response.item);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !item) return;
    
    const confirmed = window.confirm(`¿Estás seguro de eliminar "${item.nombre}"?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await inventoryApi.deleteItem(id);
      navigate('/inventory');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const getRarityColor = (rareza: string) => {
    switch (rareza) {
      case 'Legendaria': return 'var(--rarity-legendary)';
      case 'Épica': return 'var(--rarity-epic)';
      case 'Rara': return 'var(--rarity-rare)';
      case 'Común': return 'var(--rarity-common)';
      default: return 'var(--color-rune-gray)';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-abyss)',
        color: 'var(--color-gold)',
        fontSize: '1.2rem'
      }}>
        ⏳ Cargando...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-abyss)',
        padding: '2rem'
      }}>
        <div style={{
          color: 'var(--color-crimson-bright)',
          marginBottom: '1rem',
          fontSize: '1.2rem'
        }}>
          ⚠️ {error || 'Ítem no encontrado'}
        </div>
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '0.7rem 1.5rem',
            background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-bright))',
            border: 'none',
            color: 'var(--color-abyss)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            letterSpacing: '0.2em'
          }}
        >
          ← Volver al Inventario
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-abyss)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Botón volver */}
        <button
          onClick={() => navigate('/inventory')}
          style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid var(--color-gold-dark)',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            letterSpacing: '0.1em'
          }}
        >
          ← Volver
        </button>

        {/* Card principal */}
        <div style={{
          background: 'linear-gradient(145deg, var(--color-stone), var(--color-stone-dark))',
          border: `2px solid ${getRarityColor(item.rareza)}`,
          padding: '2.5rem',
          boxShadow: `0 0 30px ${getRarityColor(item.rareza)}66`
        }}>
          {/* Imagen grande */}
          <div style={{
            fontSize: '6rem',
            textAlign: 'center',
            marginBottom: '2rem',
            filter: `drop-shadow(0 0 20px ${getRarityColor(item.rareza)})`
          }}>
            {item.imagen || '⚔️'}
          </div>

          {/* Nombre y rareza */}
          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: '2.2rem',
            color: getRarityColor(item.rareza),
            textAlign: 'center',
            marginBottom: '0.5rem',
            filter: `drop-shadow(0 0 15px ${getRarityColor(item.rareza)})`
          }}>
            {item.nombre}
          </h1>

          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 1rem',
              background: `${getRarityColor(item.rareza)}33`,
              border: `1px solid ${getRarityColor(item.rareza)}`,
              color: getRarityColor(item.rareza),
              fontSize: '0.75rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginRight: '0.5rem'
            }}>
              {item.rareza}
            </span>
            <span style={{
              display: 'inline-block',
              padding: '0.3rem 1rem',
              background: 'rgba(200,134,10,0.15)',
              border: '1px solid var(--color-gold-dark)',
              color: 'var(--color-gold)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              {item.tipo}
            </span>
          </div>

          {/* Descripción */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--color-parchment-dim)',
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: '2rem',
            lineHeight: '1.8'
          }}>
            {item.descripcion}
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
            padding: '2rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(200,134,10,0.15)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-rune-gray)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                Ataque
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--color-crimson-bright)'
              }}>
                {item.ataque}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--color-rune-gray)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>
                Defensa
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--color-ice-bright)'
              }}>
                {item.defensa}
              </div>
            </div>
          </div>

          {/* Habilidades */}
          {item.habilidades.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                ⚡ Habilidades
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0
              }}>
                {item.habilidades.map((hab, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(123,53,208,0.1)',
                      border: '1px solid rgba(123,53,208,0.3)',
                      marginBottom: '0.5rem',
                      color: 'var(--color-parchment)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    • {hab}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Efectos */}
          {item.efectos.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-gold)',
                marginBottom: '1rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
              }}>
                ✨ Efectos
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0
              }}>
                {item.efectos.map((efecto, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(26,140,69,0.1)',
                      border: '1px solid rgba(26,140,69,0.3)',
                      marginBottom: '0.5rem',
                      color: 'var(--color-parchment)',
                      fontFamily: 'var(--font-body)'
                    }}
                  >
                    • {efecto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón eliminar */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'linear-gradient(135deg, var(--color-blood), var(--color-crimson-bright))',
              border: 'none',
              color: 'var(--color-parchment)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.6 : 1
            }}
          >
            {deleting ? '🗑️ Eliminando...' : '🗑️ Eliminar Ítem'}
          </button>
        </div>
      </div>
    </div>
  );
}