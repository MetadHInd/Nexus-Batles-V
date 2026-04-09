import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(s => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      setAuth(res.data.data);
      navigate('/inventory');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-dungeon)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem 2rem',
        background: 'linear-gradient(145deg, var(--color-stone), var(--color-stone-dark))',
        border: '1px solid var(--color-gold-dark)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚜</div>
        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.3rem',
          color: 'var(--color-gold)',
          marginBottom: '0.3rem'
        }}>
          Entrar al Nexus
        </h1>
        <p style={{
          fontStyle: 'italic',
          color: 'var(--color-parchment-dim)',
          fontSize: '0.9rem',
          marginBottom: '1.8rem'
        }}>
          Identifícate, aventurero
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo..."
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              marginBottom: '0.6rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(200,134,10,0.25)',
              color: 'var(--color-parchment)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem'
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña secreta..."
            required
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              marginBottom: '0.6rem',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(200,134,10,0.25)',
              color: 'var(--color-parchment)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem'
            }}
          />

          {error && (
            <div style={{
              padding: '0.5rem',
              marginBottom: '0.6rem',
              background: 'rgba(168,16,32,0.1)',
              border: '1px solid var(--color-crimson)',
              color: 'var(--color-crimson-bright)',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.7rem 1.5rem',
              marginTop: '0.5rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-bright))',
              color: 'var(--color-abyss)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Entrando...' : '⚔ Entrar al Campo de Batalla'}
          </button>
        </form>

        <div style={{
          marginTop: '1rem',
          fontSize: '0.8rem',
          color: 'var(--color-rune-gray)',
          fontStyle: 'italic'
        }}>
          ¿Eres nuevo?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--color-gold)',
              textDecoration: 'none'
            }}
          >
            Forja tu leyenda aquí
          </Link>
        </div>
      </div>
    </div>
  );
}