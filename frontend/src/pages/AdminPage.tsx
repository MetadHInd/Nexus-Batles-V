// src/pages/AdminPage.tsx - Versión completa con imágenes
import { useState, useEffect } from "react";
import "../styles/admin.css";

interface Hero {
  id: number;
  name: string;
  description: string;
  price: number;
  stars: number;
  type: string;
  image?: string;
}

export default function AdminPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stars: '3',
    type: '',
    image: ''
  });

  // Cargar héroes
  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/v1/heroes');
      const data = await response.json();
      
      if (data.success && data.heroes) {
        setHeroes(data.heroes);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Convertir imagen a base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Crear nuevo héroe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const heroData = {
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      stars: parseInt(formData.stars) || 3,
      type: formData.type,
      image: formData.image || ""
    };
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ ¡${formData.name} ha sido creado exitosamente!`);
        setFormData({ name: '', description: '', price: '', stars: '3', type: '', image: '' });
        setPreviewImage(null);
        setShowForm(false);
        fetchHeroes(); // Recargar lista
      } else {
        alert(`❌ Error: ${data.error || 'No se pudo crear el héroe'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión con el servidor');
    }
  };

  if (loading) {
    return <div className="admin-container"><div className="loading-state">Cargando héroes...</div></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">⚔️ PANEL DEL ADMINISTRADOR</h1>
          <p className="admin-subtitle">Control total sobre los héroes</p>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '← VOLVER A LISTA' : '+ AGREGAR NUEVO HÉROE'}
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚔️</div>
          <div className="stat-info">
            <span className="stat-value">{heroes.length}</span>
            <span className="stat-label">Héroes Registrados</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">
              {(heroes.reduce((acc, h) => acc + h.stars, 0) / heroes.length || 0).toFixed(1)}
            </span>
            <span className="stat-label">Promedio Estrellas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">
              {heroes.reduce((acc, h) => acc + h.price, 0).toLocaleString()}
            </span>
            <span className="stat-label">Valor Total (Oro)</span>
          </div>
        </div>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <div className="create-section">
          <h2 className="section-title">✨ CREAR NUEVO HÉROE</h2>
          <form onSubmit={handleSubmit} className="hero-form">
            <div className="form-grid">
              <div className="form-field">
                <label>NOMBRE DEL HÉROE *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Hechicero de Fuego"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>TIPO *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Guerrero">⚔️ Guerrero</option>
                  <option value="Mago">🔮 Mago</option>
                  <option value="Arquero">🏹 Arquero</option>
                  <option value="Tanque">🛡️ Tanque</option>
                  <option value="Asesino">🗡️ Asesino</option>
                </select>
              </div>

              <div className="form-field full-width">
                <label>DESCRIPCIÓN *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Historia y características del héroe..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-field">
                <label>PRECIO (ORO) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="form-field">
                <label>ESTRELLAS (1-5) *</label>
                <div className="stars-selector">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, stars: star.toString()})}
                      className={`star ${parseInt(formData.stars) >= star ? 'active' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field full-width">
                <label>IMAGEN DEL HÉROE</label>
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="hero-image"
                    className="image-input-hidden"
                  />
                  <label htmlFor="hero-image" className="image-upload-label">
                    📷 {formData.image ? 'Imagen seleccionada' : 'Seleccionar imagen'}
                  </label>
                  
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                      <button 
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setFormData({...formData, image: ''});
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
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                CANCELAR
              </button>
              <button type="submit" className="btn-submit">
                💾 GUARDAR HÉROE
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de héroes */}
      {!showForm && (
        <div className="list-section">
          <h2 className="section-title">📋 LISTA DE HÉROES ({heroes.length})</h2>
          
          <div className="heroes-table-wrapper">
            <table className="heroes-table">
              <thead>
                <tr>
                  <th>IMAGEN</th>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>PRECIO</th>
                  <th>ESTRELLAS</th>
                  <th>TIPO</th>
                </tr>
              </thead>
              <tbody>
                {heroes.map((hero) => (
                  <tr key={hero.id}>
                    <td className="image-cell">
                      {hero.image ? (
                        <img 
                          src={hero.image} 
                          alt={hero.name} 
                          className="hero-avatar" 
                        />
                      ) : (
                        <div className="hero-avatar-placeholder">⚔️</div>
                      )}
                    </td>
                    <td className="hero-name">{hero.name}</td>
                    <td className="hero-description">{hero.description?.substring(0, 60)}...</td>
                    <td className="price">{hero.price} 🪙</td>
                    <td className="stars">
                      {'★'.repeat(hero.stars)}{'☆'.repeat(5-hero.stars)}
                    </td>
                    <td>
                      <span className={`type-badge ${hero.type.toLowerCase()}`}>
                        {hero.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}