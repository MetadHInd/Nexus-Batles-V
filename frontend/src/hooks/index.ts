import { useState, useEffect, useCallback } from 'react';
import { auctionsApi } from '@/api/auctions';
import { missionsApi } from '@/api/missions';
import { playersApi } from '@/api/players';
import { inventoryApi } from '@/api/inventory';
import { Auction, Mission, InventoryItem, PublicPlayer, Item, Filters } from '@/types';

// ── Generic fetch hook
function useFetch<T>(fetcher: () => Promise<{ data: { data: T } }>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher();
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── Hooks existentes
export const useAuctions = () => useFetch<Auction[]>(() => auctionsApi.getAll());
export const useAuction = (id: string) => useFetch<Auction>(() => auctionsApi.getById(id));
export const useActiveMissions = () => useFetch<Mission[]>(() => missionsApi.getActive());
export const useMyInventory = () => useFetch<InventoryItem[]>(() => playersApi.getMyInventory());
export const useRankings = () => useFetch<PublicPlayer[]>(() => playersApi.getRankings());
export const useMyProfile = () => useFetch<PublicPlayer>(() => playersApi.getMe());

// ── HOOKS PARA INVENTARIO

/**
 * Hook para obtener inventario paginado con filtros
 */
export const useInventory = (initialPage = 1, initialFilters: Filters = {}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await inventoryApi.getItems({
        ...filters,
        page: currentPage,
        limit: 16
      });
      setItems(response.items);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    filters,
    setFilters,
    refetch: fetchInventory
  };
};

/**
 * Hook para buscar items
 */
export const useSearch = () => {
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 4 && searchQuery.length > 0) {
      setError('Mínimo 4 caracteres');
      return;
    }

    setQuery(searchQuery);
    
    if (searchQuery.length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await inventoryApi.searchItems(searchQuery);
      setResults(response.results);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    query,
    search,
    clearSearch
  };
};

/**
 * Hook para obtener un item específico por ID
 */
export const useItem = (id: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await inventoryApi.getItemById(id);
      setItem(response.item);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al cargar el item');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const deleteItem = useCallback(async () => {
    try {
      await inventoryApi.deleteItem(id);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al eliminar');
      return false;
    }
  }, [id]);

  return { item, loading, error, refetch: fetchItem, deleteItem };
};

/**
 * Hook personalizado para paginación
 */
export const usePagination = (initialPage = 1, totalPages = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  return {
    currentPage,
    nextPage,
    prevPage,
    goToPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

/**
 * Hook para manejar filtros
 */
export const useFilters = (initialFilters: Filters = {}) => {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const setTipo = useCallback((tipo: string) => {
    setFilters(prev => ({ ...prev, tipo: tipo === 'Todos' ? '' : tipo }));
  }, []);

  const setRareza = useCallback((rareza: string) => {
    setFilters(prev => ({ ...prev, rareza: rareza === 'Todas' ? '' : rareza }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    setTipo,
    setRareza,
    clearFilters,
    hasFilters: Object.keys(filters).length > 0
  };
};