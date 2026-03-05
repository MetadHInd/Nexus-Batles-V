// src/pages/InventoryPage.tsx - Versión con menos peticiones
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryApi, Item } from '@/api/inventory';
import { getErrorMessage } from '@/api/client';
import './InventoryPage.css';

export default function InventoryPage() {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedRareza, setSelectedRareza] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // 🔴 Fetch con delay forzado
  const fetchInventory = useCallback(async () => {
    if (!isMounted.current) return;
    
    // Forzar delay entre peticiones
    const now = Date.now();
    if (now - lastFetchTime < 3000) { // 3 segundos mínimo
      console.log('⏳ Esperando 3s entre peticiones...');
      return;
    }
    
    setLastFetchTime(now);
    setLoading(true);
    setRateLimited(false);
    
    try {
      const response = await inventoryApi.getItems({
        page: currentPage,
        limit: 16,
        tipo: selectedTipo || undefined,
        rareza: selectedRareza || undefined
      });
      
      if (isMounted.current) {
        setItems(response.items);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
        setRetryCount(0);
        setError(null);
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        setRateLimited(true);
        setRetryCount(prev => prev + 1);
        
        // Backoff exponencial
        const waitTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
        setTimeout(() => {
          if (isMounted.current) {
            fetchInventory();
          }
        }, waitTime);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [currentPage, selectedTipo, selectedRareza, lastFetchTime, retryCount]);

  // Búsqueda con más delay
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 4 && query.length > 0) return;
    if (query.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Delay de 1 segundo después de escribir
    setTimeout(async () => {
      try {
        const response = await inventoryApi.searchItems(query);
        if (isMounted.current) {
          setSearchResults(response.results);
          setIsSearching(true);
        }
      } catch (err) {
        console.error('Error en búsqueda:', err);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    let timeoutId: number;
    
    if (searchQuery) {
      timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 1000);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (!isSearching) {
      fetchInventory();
    }
  }, [fetchInventory, isSearching]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const displayItems = isSearching ? searchResults : items;

  return (
    <div className="inventory-page">
      <header className="page-header">
        <h1 className="page-title">🎒 MI INVENTARIO</h1>
        <p className="page-subtitle">
          {totalItems} items en tu colección
        </p>
      </header>

      {rateLimited && (
        <div className="rate-limit-warning">
          <span className="warning-icon">⏳</span>
          <span>
            Demasiadas solicitudes. Esperando {Math.min(5 * Math.pow(2, retryCount), 30)}s antes de reintentar...
          </span>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar ítems... (mínimo 4 caracteres)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={rateLimited}
          />
          {isSearching && (
            <button className="clear-search" onClick={clearSearch}>
              ✕ Limpiar búsqueda
            </button>
          )}
        </div>

        <select
          className="filter-select"
          value={selectedTipo}
          onChange={(e) => {
            setSelectedTipo(e.target.value);
            setCurrentPage(1);
          }}
          disabled={isSearching || rateLimited}
        >
          <option value="">TODOS LOS TIPOS</option>
          <option value="Héroe">HÉROE</option>
          <option value="Arma">ARMA</option>
          <option value="Armadura">ARMADURA</option>
          <option value="Habilidad">HABILIDAD</option>
          <option value="Ítem">ÍTEM</option>
          <option value="Épica">ÉPICA</option>
        </select>

        <select
          className="filter-select"
          value={selectedRareza}
          onChange={(e) => {
            setSelectedRareza(e.target.value);
            setCurrentPage(1);
          }}
          disabled={isSearching || rateLimited}
        >
          <option value="">TODAS LAS RAREZAS</option>
          <option value="Común">COMÚN</option>
          <option value="Rara">RARA</option>
          <option value="Épica">ÉPICA</option>
          <option value="Legendaria">LEGENDARIA</option>
        </select>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>CARGANDO INVENTARIO...</p>
        </div>
      )}

      {error && !rateLimited && (
        <div className="error-state">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {displayItems.length === 0 ? (
            <div className="empty-state">
              {isSearching
                ? `No se encontraron resultados para "${searchQuery}"`
                : 'Tu inventario está vacío'}
            </div>
          ) : (
            <div className="items-grid">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="item-card"
                  onClick={() => navigate(`/inventory/${item.id}`)}
                >
                  <div className="item-card__image">
                    {item.imagen || getTypeEmoji(item.tipo)}
                  </div>
                  <div className="item-card__rarity-badge" data-rarity={item.rareza}>
                    {item.rareza}
                  </div>
                  <h3 className="item-card__name">{item.nombre}</h3>
                  <p className="item-card__type">{item.tipo}</p>
                  <div className="item-card__stats">
                    <div className="stat">
                      <span className="stat-label">ATQ</span>
                      <span className="stat-value">{item.ataque}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">DEF</span>
                      <span className="stat-value">{item.defensa}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Función helper fuera del componente
function getTypeEmoji(tipo: string): string {
  const emojis: Record<string, string> = {
    'Arma': '⚔️',
    'Armadura': '🛡️',
    'Héroe': '🧙',
    'Habilidad': '🔮',
    'Ítem': '📜',
    'Épica': '👑'
  };
  return emojis[tipo] || '❓';
}