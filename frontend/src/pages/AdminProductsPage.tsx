// src/pages/AdminProductsPage.tsx
import { useState, useEffect } from "react";
import "../styles/admin.css";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  type: string;
  emoji: string;
  image?: string;
}

const RARITIES = [
  { value: 'COMMON', label: 'Común', color: '#9E9E9E' },
  { value: 'RARE', label: 'Raro', color: '#30B8E8' },
  { value: 'EPIC', label: 'Épico', color: '#B06EFF' },
  { value: 'LEGENDARY', label: 'Legendario', color: '#F5C842' }
];

const PRODUCT_TYPES = [
  { value: 'WEAPON', label: 'Arma' },
  { value: 'ARMOR', label: 'Armadura' },
  { value: 'POTION', label: 'Poción' },
  { value: 'ARTIFACT', label: 'Artefacto' },
  { value: 'SPELL', label: 'Hechizo' }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    rarity: 'EPIC',
    type: 'WEAPON',
    emoji: '📦',
    image: null as File | null
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/products');
      const data = await response.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      rarity: product.rarity,
      type: product.type,
      emoji: product.emoji,
      image: null
    });
    setPreviewImage(product.image || null);
    setActiveTab('create');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = editingProduct?.image || '';
    
    if (formData.image) {
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(formData.image);
      });
    }
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      rarity: formData.rarity,
      type: formData.type,
      emoji: formData.emoji,
      image: imageUrl
    };
    
    try {
      let url = 'http://localhost:3000/api/v1/products';
      let method = 'POST';
      
      if (editingProduct) {
        url = `http://localhost:3000/api/v1/products/${editingProduct.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        alert(editingProduct 
          ? `✅ ${formData.name} actualizado exitosamente` 
          : `✅ ${formData.name} creado exitosamente`);
        await fetchProducts();
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          rarity: 'EPIC',
          type: 'WEAPON',
          emoji: '📦',
          image: null
        });
        setPreviewImage(null);
        setEditingProduct(null);
        setActiveTab('list');
      } else {
        alert('❌ Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    }
  };

  const eliminarProducto = async (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await fetch(`http://localhost:3000/api/v1/products/${id}`, {
          method: 'DELETE'
        });
        alert('🗑️ Producto eliminado');
        await fetchProducts();
      } catch (error) {
        alert('❌ Error al eliminar');
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      rarity: 'EPIC',
      type: 'WEAPON',
      emoji: '📦',
      image: null
    });
    setPreviewImage(null);
    setActiveTab('list');
  };

  const getRarityInfo = (rarity: string) => {
    return RARITIES.find(r => r.value === rarity) || RARITIES[0];
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">🏆 PANEL DE PRODUCTOS</h1>
          <p className="admin-subtitle">Gestiona armas, armaduras, pociones y artefactos</p>
        </div>
        <button 
          className="create-btn"
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              rarity: 'EPIC',
              type: 'WEAPON',
              emoji: '📦',
              image: null
            });
            setPreviewImage(null);
            setActiveTab(activeTab === 'create' ? 'list' : 'create');
          }}
        >
          {activeTab === 'create' ? '← VOLVER A LISTA' : '+ NUEVO PRODUCTO'}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'create' ? (
          <div className="create-section">
            <h2 className="section-title">
              {editingProduct ? '✏️ EDITAR PRODUCTO' : '✨ CREAR NUEVO PRODUCTO'}
            </h2>
            <form onSubmit={handleSubmit} className="hero-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>NOMBRE DEL PRODUCTO *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Espada del Abismo"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>RAREZA</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({...formData, rarity: e.target.value as any})}
                  >
                    {RARITIES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>TIPO</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    {PRODUCT_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>EMOJI</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData({...formData, emoji: e.target.value})}
                    placeholder="📦 ⚔️ 🛡️ 🧪"
                    maxLength={2}
                  />
                </div>

                <div className="form-field full-width">
                  <label>DESCRIPCIÓN *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción del producto..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>PRECIO (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    min="0"
                    max="999"
                    placeholder="Ej: 49.99"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label>STOCK DISPONIBLE</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    min="0"
                    placeholder="Cantidad disponible"
                  />
                </div>

                <div className="form-field full-width">
                  <label>IMAGEN DEL PRODUCTO</label>
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="product-image"
                      className="image-input-hidden"
                    />
                    <label htmlFor="product-image" className="image-upload-label">
                      📷 {formData.image ? formData.image.name : (editingProduct ? 'Cambiar imagen' : 'Seleccionar imagen')}
                    </label>
                    
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                        <button 
                          type="button"
                          className="remove-image"
                          onClick={() => {
                            setFormData({...formData, image: null});
                            setPreviewImage(null);
                          }}
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={cancelEdit} className="btn-cancel">
                  CANCELAR
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? '💾 ACTUALIZAR PRODUCTO' : '💾 GUARDAR PRODUCTO'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="list-section">
            <h2 className="section-title">📋 LISTA DE PRODUCTOS</h2>
            
            <div className="heroes-table-wrapper">
              {loading ? (
                <div className="loading-state">Cargando productos...</div>
              ) : (
                <table className="heroes-table">
                  <thead>
                    <tr>
                      <th>IMAGEN</th>
                      <th>NOMBRE</th>
                      <th>DESCRIPCIÓN</th>
                      <th>RAREZA</th>
                      <th>TIPO</th>
                      <th>PRECIO</th>
                      <th>STOCK</th>
                      <th>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const rarityInfo = getRarityInfo(product.rarity);
                      return (
                        <tr key={product.id}>
                          <td className="image-cell">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="hero-avatar" />
                            ) : (
                              <div className="hero-avatar-placeholder">{product.emoji}</div>
                            )}
                          </td>
                          <td className="hero-name">{product.name}</td>
                          <td className="hero-description">{product.description?.substring(0, 50)}...</td>
                          <td>
                            <span style={{ color: rarityInfo.color, fontWeight: 'bold' }}>
                              {rarityInfo.label}
                            </span>
                          </td>
                          <td>{product.type}</td>
                          <td className="price">${product.price} USD</td>
                          <td>{product.stock}</td>
                          <td className="actions">
                            <button className="action-edit" onClick={() => handleEdit(product)}>✏️</button>
                            <button className="action-delete" onClick={() => eliminarProducto(product.id)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              {!loading && products.length === 0 && (
                <div className="empty-state">
                  <p>No hay productos creados aún</p>
                  <button onClick={() => setActiveTab('create')} className="btn-submit">
                    CREAR PRIMER PRODUCTO
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}