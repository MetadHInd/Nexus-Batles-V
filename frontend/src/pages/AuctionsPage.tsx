import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { auctionsApi } from '@/api/auctions';
import { getErrorMessage } from '@/api/client';
import type { Auction, AuctionStatus, ItemRarity } from '@/types';

const PAGE_SIZE = 12;

function rarityColor(r: ItemRarity) {
  switch (r) {
    case 'LEGENDARY': return 'var(--gold)';
    case 'EPIC': return 'var(--arcane-glow)';
    case 'RARE': return 'var(--ice-bright)';
    case 'COMMON': return 'var(--rune-gray)';
  }
}

function statusLabel(s: AuctionStatus) {
  if (s === 'ACTIVE') return 'Activa';
  if (s === 'CLOSED') return 'Cerrada';
  return 'Cancelada';
}

function statusTone(s: AuctionStatus) {
  if (s === 'ACTIVE') return 'gold';
  if (s === 'CLOSED') return 'emerald';
  return 'crimson';
}

function formatEnds(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function mockAuctions(): Auction[] {
  const now = Date.now();
  const mk = (i: number, rarity: ItemRarity, status: AuctionStatus): Auction => ({
    id: `mock-${i}`,
    itemId: `item-${i}`,
    itemName: ['Espada del Alba', 'Manto Arcano', 'Escudo de Escarcha', 'Daga Sombría'][i % 4],
    rarity,
    startingPrice: 100 + i * 15,
    currentPrice: 140 + i * 25,
    currentWinnerId: i % 2 === 0 ? 'player-x' : null,
    status,
    endsAt: new Date(now + (i + 1) * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now - (i + 2) * 60 * 60 * 1000).toISOString(),
    bids: [],
  });

  return [
    mk(1, 'LEGENDARY', 'ACTIVE'),
    mk(2, 'EPIC', 'ACTIVE'),
    mk(3, 'RARE', 'ACTIVE'),
    mk(4, 'COMMON', 'ACTIVE'),
    mk(5, 'EPIC', 'CLOSED'),
    mk(6, 'RARE', 'CANCELLED'),
  ];
}

export default function AuctionsPage() {
  const [items, setItems] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'ALL' | AuctionStatus>('ALL');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const offset = (page - 1) * PAGE_SIZE;
    auctionsApi.getAll({ limit: PAGE_SIZE, offset })
      .then((res) => {
        if (!alive) return;
        const data = res.data?.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!alive) return;
        const msg = getErrorMessage(err);
        setError(msg);
        // Mientras el back esté en 501, mostramos un mercado usable (mock) en dev.
        setItems(mockAuctions());
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [page]);

  const filtered = useMemo(() => {
    if (status === 'ALL') return items;
    return items.filter(a => a.status === status);
  }, [items, status]);

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '1.5rem 1rem 2.5rem',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          letterSpacing: '0.45em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          opacity: 0.85,
          marginBottom: '0.6rem',
        }}>
          🏛 Mercado del Nexus
        </div>
        <h1 style={{ marginBottom: '0.35rem' }}>Subastas</h1>
        <p style={{ color: 'var(--parchment-dim)', fontStyle: 'italic' }}>
          Pujas en tiempo real, reliquias raras y tesoros legendarios.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '1rem 0 1.25rem',
      }}>
        {(['ALL', 'ACTIVE', 'CLOSED', 'CANCELLED'] as const).map((k) => (
          <button
            key={k}
            className="nbv-btn nbv-btn-ghost"
            onClick={() => { setStatus(k); setPage(1); }}
            style={{
              fontSize: '0.62rem',
              padding: '0.45rem 1rem',
              borderColor: status === k ? 'rgba(200,134,10,0.55)' : 'rgba(200,134,10,0.25)',
              color: status === k ? 'var(--gold)' : 'var(--parchment-dim)',
              background: status === k ? 'rgba(200,134,10,0.08)' : 'transparent',
              clipPath: 'none',
              borderRadius: '12px',
            }}
          >
            {k === 'ALL' ? 'Todas' : statusLabel(k)}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          border: '1px solid rgba(200,134,10,0.25)',
          background: 'rgba(0,0,0,0.22)',
          padding: '0.9rem 1rem',
          borderRadius: 14,
          marginBottom: '1rem',
          color: 'var(--parchment-dim)',
        }}>
          <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em', marginBottom: '.25rem' }}>
            Estado del mercado
          </div>
          <div style={{ fontStyle: 'italic' }}>
            {error} — mostrando datos de demostración mientras el backend de subastas se conecta.
          </div>
        </div>
      )}

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1rem',
          color: 'var(--gold)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.35em',
          opacity: 0.85,
        }}>
          ⚜ Cargando subastas...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          border: '1px solid rgba(200,134,10,0.25)',
          background: 'rgba(0,0,0,0.22)',
          padding: '1.25rem',
          borderRadius: 14,
          textAlign: 'center',
          color: 'var(--parchment-dim)',
          fontStyle: 'italic',
        }}>
          No hay subastas para este filtro.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '0.9rem',
        }}>
          {filtered.map((a) => (
            <Link
              key={a.id}
              to={`/auctions/${a.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid rgba(200,134,10,0.18)',
                background: 'linear-gradient(145deg, rgba(28,21,16,0.9), rgba(18,14,10,0.9))',
                borderRadius: 16,
                padding: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(800px 180px at 0% 0%, ${rarityColor(a.rarity)}22, transparent 55%)`,
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.75rem', alignItems: 'baseline' }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.08em',
                    color: rarityColor(a.rarity),
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    opacity: 0.95,
                  }}>
                    {a.rarity}
                  </div>
                  <span className={`nbv-badge nbv-badge-${statusTone(a.status)}`}>
                    {statusLabel(a.status)}
                  </span>
                </div>

                <div style={{
                  marginTop: '.55rem',
                  fontFamily: 'var(--font-title)',
                  color: 'var(--gold)',
                  fontSize: '1.05rem',
                  lineHeight: 1.2,
                }}>
                  {a.itemName}
                </div>

                <div style={{ marginTop: '.6rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '.6rem' }}>
                  <div style={{
                    border: '1px solid rgba(200,134,10,0.12)',
                    background: 'rgba(0,0,0,0.18)',
                    borderRadius: 14,
                    padding: '.6rem .75rem',
                  }}>
                    <div style={{ fontSize: '.7rem', letterSpacing: '.18em', opacity: .75 }}>PRECIO</div>
                    <div style={{ fontWeight: 900, color: 'var(--parchment)' }}>
                      ✦ {a.currentPrice.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    border: '1px solid rgba(200,134,10,0.12)',
                    background: 'rgba(0,0,0,0.18)',
                    borderRadius: 14,
                    padding: '.6rem .75rem',
                  }}>
                    <div style={{ fontSize: '.7rem', letterSpacing: '.18em', opacity: .75 }}>CIERRA</div>
                    <div style={{ fontSize: '.82rem', color: 'var(--parchment)' }}>
                      {formatEnds(a.endsAt)}
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '.75rem',
                  fontSize: '.82rem',
                  color: 'var(--parchment-dim)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  opacity: 0.95,
                }}>
                  <span>Pujas: {a.bids?.length ?? 0}</span>
                  <span style={{ color: 'var(--gold)' }}>Ver detalles →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '.5rem',
        marginTop: '1.25rem',
      }}>
        <button
          className="nbv-btn nbv-btn-ghost"
          style={{ clipPath: 'none', borderRadius: 12, padding: '0.5rem 1rem', fontSize: '0.65rem' }}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Anterior
        </button>
        <div style={{ alignSelf: 'center', color: 'var(--parchment-dim)', fontSize: '.85rem' }}>
          Página {page}
        </div>
        <button
          className="nbv-btn nbv-btn-ghost"
          style={{ clipPath: 'none', borderRadius: 12, padding: '0.5rem 1rem', fontSize: '0.65rem' }}
          onClick={() => setPage(p => p + 1)}
          disabled={items.length < PAGE_SIZE && !error}
          title={items.length < PAGE_SIZE && !error ? 'No hay más resultados' : 'Siguiente'}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
