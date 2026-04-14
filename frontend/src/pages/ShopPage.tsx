// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';
import { paymentsApi } from '../api/payments';
import { ProductCard } from '../components/payments/ProductCard';
import { CheckoutModal } from '../components/payments/CheckoutModal';
import { OrderStatusBadge } from '../components/payments/OrderStatusBadge';
import type { ShopProduct, BuyerInfo } from '../api/payments';
import { useAuthStore } from '@/store/authStore';
import "../styles/shop.css";

interface Hero {
  id: number;
  name: string;
  description: string;
  price: number;
  stars: number;
  type: string;
  image?: string;
  stock?: number;
}

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  rarity: string;
  type: string;
  emoji: string;
  image?: string;
}

// Convertir héroe a formato ShopProduct
const convertHeroToShopProduct = (hero: Hero): ShopProduct => {
  let rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' = 'COMMON';
  if (hero.stars >= 4) rarity = 'RARE';
  if (hero.stars >= 4.5) rarity = 'EPIC';
  if (hero.stars >= 5) rarity = 'LEGENDARY';
  
  return {
    product_id: hero.id.toString(),
    name: hero.name,
    description: hero.description,
    price_cents: Math.round(hero.price * 100),
    currency: 'USD',
    rarity: rarity,
    type: hero.type,
    emoji: '⚔️',
    available_stock: hero.stock || 0,
    is_active: true,
    image: hero.image
  };
};

// Convertir producto a formato ShopProduct
const convertProductToShopProduct = (product: ApiProduct): ShopProduct => {
  let rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' = 'COMMON';
  if (product.rarity === 'RARE') rarity = 'RARE';
  if (product.rarity === 'EPIC') rarity = 'EPIC';
  if (product.rarity === 'LEGENDARY') rarity = 'LEGENDARY';
  
  return {
    product_id: product.id.toString(),
    name: product.name,
    description: product.description,
    price_cents: Math.round(product.price * 100),
    currency: 'USD',
    rarity: rarity,
    type: product.type,
    emoji: product.emoji || '📦',
    available_stock: product.stock,
    is_active: true,
    image: product.image
  };
};

type FilterType = 'ALL' | 'LEGENDARY' | 'EPIC' | 'RARE' | 'COMMON' | 'HEROES';

export default function ShopPage() {
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: '' });
  const { user } = useAuthStore();
  const { state: paymentState, startCheckout, reset } = usePayment();

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Cargar productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/products');
      const data = await response.json();
      if (data.success && data.products) {
        setApiProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Cargar héroes desde el backend
  const fetchHeroes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/heroes');
      const data = await response.json();
      if (data.success && data.heroes) {
        const heroesWithStock = data.heroes.map((hero: Hero) => ({
          ...hero,
          stock: Math.floor(Math.random() * 10) + 1
        }));
        setHeroes(heroesWithStock);
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchHeroes()]).finally(() => setLoading(false));
  }, []);

  // ✅ Función para comprar directamente (usando la pasarela de pago)
  const handleBuyNow = (item: any, type: 'hero' | 'product') => {
    let shopProduct: ShopProduct;
    
    if (type === 'hero') {
      shopProduct = convertHeroToShopProduct(item);
    } else {
      shopProduct = convertProductToShopProduct(item);
    }
    
    if (shopProduct.available_stock === 0) {
      showNotification('❌ Producto agotado', 'error');
      return;
    }
    
    reset();
    setSelectedProduct(shopProduct);
  };

  async function handleConfirm(buyerInfo: BuyerInfo, countryCode: string, promoCode?: string) {
    if (!selectedProduct) return;
    await startCheckout(selectedProduct, buyerInfo, countryCode, promoCode, 'mock');
    showNotification(`✅ Compra de ${selectedProduct.name} iniciada`, 'success');
  }

  function handleCloseModal() {
    if (paymentState.step === 'CREATING_ORDER' || paymentState.step === 'PROCESSING_PAYMENT') return;
    setSelectedProduct(null);
    reset();
  }

  const getFilteredItems = () => {
    if (filter === 'ALL') {
      return { products: apiProducts, heroes };
    }
    if (filter === 'HEROES') {
      return { products: [], heroes };
    }
    return {
      products: apiProducts.filter(p => p.rarity === filter),
      heroes: []
    };
  };

  const { products: filteredProducts, heroes: filteredHeroes } = getFilteredItems();

  const FILTERS: { key: FilterType; label: string; color?: string }[] = [
    { key: 'ALL', label: 'Todos' },
    { key: 'HEROES', label: '⚔️ Héroes', color: '#F5C842' },
    { key: 'LEGENDARY', label: 'Legendario', color: '#F5C842' },
    { key: 'EPIC', label: 'Épico', color: '#B06EFF' },
    { key: 'RARE', label: 'Raro', color: '#30B8E8' },
    { key: 'COMMON', label: 'Común', color: '#9E9E9E' },
  ];

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner">⚔️</div>
        <p>Cargando el mercado...</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Notificación */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}


      <div className="shop-content">
        {/* Header */}
        <div className="shop-header">
          <div className="torch-left"><div className="torch"></div></div>
          <div className="torch-right"><div className="torch"></div></div>
          <div className="shop-badge">✦ El Emporio del Nexus ✦</div>
          <h1 className="shop-title">Armería Legendaria</h1>
          <p className="shop-subtitle">Armas, reliquias, artefactos y héroes para dominar el Nexus</p>
        </div>

        {/* Filter row */}
        <div className="filter-row">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              style={filter === f.key ? { borderColor: f.color, color: f.color } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Productos (Armas, Armaduras, Pociones) */}
        {(filter === 'ALL' || filter !== 'HEROES') && filteredProducts.length > 0 && (
          <div className="products-section">
            <div className="section-divider">
              <span>🏆 ARTEFACTOS PODEROSOS 🏆</span>
            </div>
            <p className="section-subtitle">Armas, armaduras y objetos mágicos para tu aventura</p>
            
            <div className="products-grid">
              {filteredProducts.map(product => {
                const rarityClass = product.rarity.toLowerCase();
                return (
                  <div key={product.id} className="product-card">
                    <div className="card-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className="card-icon">{product.emoji || '📦'}</div>
                      )}
                      {product.stock < 5 && (
                        <div className="stock-badge low-stock">¡Últimas!</div>
                      )}
                    </div>
                    <div className="card-info">
                      <h3>{product.name}</h3>
                      <p>{product.description.substring(0, 80)}...</p>
                      <div className="product-meta">
                        <span className={`rarity-badge ${rarityClass}`}>{product.rarity}</span>
                        <span className="type-badge">{product.type}</span>
                      </div>
                      <div className="card-footer">
                        <div className="price">
                          <span className="price-value">${product.price} USD</span>
                          <span className="stock">Stock: {product.stock}</span>
                        </div>
                        <button 
                          className="buy-btn"
                          onClick={() => handleBuyNow(product, 'product')}
                          disabled={product.stock === 0}
                        >
                          {product.stock > 0 ? 'COMPRAR' : 'AGOTADO'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Héroes */}
        {(filter === 'ALL' || filter === 'HEROES') && filteredHeroes.length > 0 && (
          <div className="heroes-section">
            <div className="section-divider">
              <span>⚔️ HÉROES LEGENDARIOS ⚔️</span>
            </div>
            <p className="section-subtitle">Colecciona los guerreros más poderosos del Nexus</p>
            
            <div className="heroes-grid">
              {filteredHeroes.map(hero => (
                <div key={hero.id} className="hero-card">
                  <div className="card-image">
                    {hero.image ? (
                      <img src={hero.image} alt={hero.name} />
                    ) : (
                      <div className="card-icon">⚔️</div>
                    )}
                    {hero.stock && hero.stock < 5 && (
                      <div className="stock-badge low-stock">¡Últimas!</div>
                    )}
                    <div className="hero-type-badge">{hero.type}</div>
                  </div>
                  <div className="card-info">
                    <h3>{hero.name}</h3>
                    <p>{hero.description.substring(0, 80)}...</p>
                    <div className="hero-stars">
                      {'★'.repeat(hero.stars)}{'☆'.repeat(5 - hero.stars)}
                    </div>
                    <div className="card-footer">
                      <div className="price">
                        <span className="price-value">${hero.price} USD</span>
                        <span className="stock">Stock: {hero.stock}</span>
                      </div>
                      <button 
                        className="buy-btn"
                        onClick={() => handleBuyNow(hero, 'hero')}
                        disabled={hero.stock === 0}
                      >
                        {hero.stock > 0 ? 'COMPRAR' : 'AGOTADO'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay nada */}
        {filteredProducts.length === 0 && filteredHeroes.length === 0 && (
          <div className="empty-state">
            <p>No hay ítems en esta categoría por ahora</p>
          </div>
        )}

        {/* Recent orders section */}
        <div className="orders-section">
          <div className="section-divider">
            <span>Historial de Órdenes</span>
          </div>
          <div className="orders-placeholder">
            <span>
              <OrderStatusBadge status="PAID" size="sm" />
              <OrderStatusBadge status="PENDING" size="sm" />
              <OrderStatusBadge status="REFUNDED" size="sm" />
            </span>
            <div>Las órdenes completadas aparecerán aquí</div>
          </div>
        </div>
      </div>

      {/* Checkout Modal - Pasarela de pago */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          paymentState={paymentState}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}

      <style>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2000;
          padding: 12px 24px;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          animation: slideIn 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .notification.success {
          background: linear-gradient(135deg, #1A8C45, #0D5A28);
          color: white;
        }
        
        .notification.error {
          background: linear-gradient(135deg, #A81020, #7A0010);
          color: #FF8A8A;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .cart-floating {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #C8860A, #8B5E00);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          cursor: pointer;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}