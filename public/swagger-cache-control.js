// Swagger UI Cache Control Panel - Visual Interface
(function() {
  'use strict';

  let cacheStats = null;
  let isModalOpen = false;
  let currentTenantSub = null;

  // Function to get current tenant_sub
  function getCurrentTenantSub() {
    // Try session storage first
    let tenantSub = sessionStorage.getItem('selectedTenant');
    
    // If not in session storage, try cookies
    if (!tenantSub) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'tenant_sub') {
          tenantSub = decodeURIComponent(value);
          break;
        }
      }
    }
    
    return tenantSub;
  }

  // Function to get current auth token
  function getCurrentToken() {
    let token = sessionStorage.getItem('token');
    
    if (!token) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') {
          token = value;
          break;
        }
      }
    }
    
    return token;
  }

  // Function to show notifications
  function showNotification(message, type = 'info') {
    const existing = document.getElementById('cache-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'cache-notification';
    
    const colors = {
      success: {
        bg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        border: '#28a745',
        icon: '✅'
      },
      error: {
        bg: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
        border: '#dc3545',
        icon: '❌'
      },
      warning: {
        bg: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        border: '#ffc107',
        icon: '⚠️'
      },
      info: {
        bg: 'linear-gradient(135deg, #17a2b8 0%, #007bff 100%)',
        border: '#17a2b8',
        icon: 'ℹ️'
      }
    };
    
    const colorSet = colors[type] || colors.info;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 10px;
      color: white;
      font-weight: 500;
      z-index: 99999;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      background: ${colorSet.bg};
      border-left: 5px solid ${colorSet.border};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 400px;
      transform: translateX(450px);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    notification.innerHTML = `
      <span style="font-size: 20px;">${colorSet.icon}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(450px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 4000);
  }

  // Function to load cache stats
  async function loadCacheStats() {
    try {
      const token = getCurrentToken();
      const tenantSub = getCurrentTenantSub();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (tenantSub) {
        headers['tenant_sub'] = tenantSub;
        console.log('🏢 Cache request with tenant_sub:', tenantSub);
      }

      const response = await fetch('/api/cache/dashboard', {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      cacheStats = data.data || data;
      
      console.log('📊 Cache stats loaded:', cacheStats);
      return cacheStats;
    } catch (error) {
      console.error('❌ Error loading cache stats:', error);
      return null;
    }
  }

  // Function to clear cache with options
  async function clearCache(options = {}) {
    try {
      const token = getCurrentToken();
      const tenantSub = getCurrentTenantSub();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (tenantSub) {
        headers['tenant_sub'] = tenantSub;
      }

      showNotification('🔄 Limpiando caché...', 'info');

      const response = await fetch('/api/cache/clear', {
        method: 'POST',
        headers,
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data.data || data;
      
      console.log('✅ Cache cleared:', result);
      
      showNotification(
        `✅ ${result.message} - ${result.keysDeleted} claves eliminadas`,
        'success'
      );
      
      // Reload stats
      await loadCacheStats();
      updateModalContent();
      
      return result;
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      showNotification('❌ Error al limpiar caché', 'error');
      return null;
    }
  }

  // Function to create the cache control modal
  function createCacheControlModal() {
    if (document.getElementById('cache-control-modal')) {
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'cache-control-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.id = 'cache-modal-content';
    modalContent.style.cssText = `
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
      max-width: 1400px;
      width: 95%;
      max-height: 92vh;
      overflow: hidden;
      animation: slideIn 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
    `;

    modalContent.innerHTML = `
      <div style="
        padding: 28px 32px;
        background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
        border-bottom: none;
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="
              background: rgba(255,255,255,0.25);
              padding: 14px;
              border-radius: 18px;
              backdrop-filter: blur(10px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            ">
              <span style="font-size: 36px;">⚡</span>
            </div>
            <div>
              <h2 style="margin: 0; font-size: 30px; color: white; font-weight: 800; text-shadow: 0 2px 8px rgba(0,0,0,0.2); letter-spacing: -0.5px;">🎛️ Panel de Control de Caché</h2>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.95); font-size: 15px; font-weight: 500;">Gestiona el caché Redis con sistema de tenants unificado</p>
            </div>
          </div>
          <button onclick="closeCacheModal()" style="
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 26px;
            color: white;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
          " 
          onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='rotate(90deg) scale(1.1)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='rotate(0) scale(1)'">×</button>
        </div>
      </div>

      <div id="cache-stats-content" style="padding: 32px; overflow-y: auto; flex: 1;">
        <div style="text-align: center; padding: 40px; color: #6c757d;">
          <div style="font-size: 48px; margin-bottom: 16px;">⏳</div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      #cache-modal-content::-webkit-scrollbar {
        width: 8px;
      }
      #cache-modal-content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      #cache-modal-content::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      #cache-modal-content::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
  }

  // Function to load detailed cache keys
  async function loadDetailedKeys(pattern = '*', limit = 50) {
    try {
      const token = getCurrentToken();
      const tenantSub = getCurrentTenantSub();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (tenantSub) {
        headers['tenant_sub'] = tenantSub;
      }

      const response = await fetch(`/api/cache/keys?pattern=${encodeURIComponent(pattern)}&limit=${limit}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('❌ Error loading detailed keys:', error);
      showNotification('❌ Error cargando claves detalladas', 'error');
      return null;
    }
  }

  // Function to view key value
  async function viewKeyValue(key) {
    try {
      const token = getCurrentToken();
      const tenantSub = getCurrentTenantSub();
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      if (tenantSub) {
        headers['tenant_sub'] = tenantSub;
      }

      showNotification('🔍 Cargando valor...', 'info');

      const response = await fetch(`/api/cache/get/${encodeURIComponent(key)}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data.data || data;

      if (!result.success) {
        showNotification(`❌ ${result.message}`, 'error');
        return;
      }

      // Create modal to show the value
      const valueModal = document.createElement('div');
      valueModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      `;

      valueModal.innerHTML = `
        <div style="
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="padding: 20px; border-bottom: 2px solid #e9ecef; position: sticky; top: 0; background: white; z-index: 1;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="flex: 1;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #212529;">🔍 Valor de Clave</h3>
                <code style="font-size: 12px; color: #6c757d; word-break: break-all; display: block;">${result.key}</code>
              </div>
              <button onclick="this.closest('[style*=\\'position: fixed\\']').remove()" style="
                background: #f8f9fa;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                color: #6c757d;
                margin-left: 12px;
              ">×</button>
            </div>
            <div style="display: flex; gap: 12px; margin-top: 12px; font-size: 13px;">
              <span style="background: #e7f3ff; color: #0066cc; padding: 4px 12px; border-radius: 12px;">
                TTL: ${result.ttl}
              </span>
              <span style="background: #f0f0f0; color: #666; padding: 4px 12px; border-radius: 12px;">
                Tamaño: ${(result.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
          <div style="padding: 20px;">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #495057;">📄 Valor (JSON Formateado)</h4>
            <pre style="
              background: #f8f9fa;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              font-size: 12px;
              margin: 0;
              border: 1px solid #e9ecef;
              max-height: 400px;
            ">${JSON.stringify(result.value, null, 2)}</pre>
          </div>
        </div>
      `;

      document.body.appendChild(valueModal);
      showNotification('✅ Valor cargado', 'success');
    } catch (error) {
      console.error('❌ Error viewing key value:', error);
      showNotification('❌ Error al ver el valor', 'error');
    }
  }

  // Function to delete a single key
  async function deleteSingleKey(key) {
    if (!confirm(`¿Eliminar la clave?\n\n${key}`)) {
      return;
    }

    try {
      await clearCache({ customPattern: key });
      showNotification('✅ Clave eliminada', 'success');
      
      // Refresh detailed view
      const detailsSection = document.getElementById('cache-details-section');
      if (detailsSection && detailsSection.style.display !== 'none') {
        const searchInput = document.getElementById('cache-search-pattern');
        const currentPattern = searchInput ? searchInput.value : '*';
        
        // Extract module name from pattern if exists
        const moduleMatch = currentPattern.match(/\*:([^:]+):\*/);
        const moduleName = moduleMatch ? moduleMatch[1] : null;
        
        await showDetailedKeys(currentPattern, moduleName);
      }
    } catch (error) {
      showNotification('❌ Error al eliminar clave', 'error');
    }
  }

  // Function to delete multiple selected keys
  window.deleteSelectedKeys = async function() {
    const checkboxes = document.querySelectorAll('.key-checkbox:checked');
    if (checkboxes.length === 0) {
      showNotification('⚠️ No hay claves seleccionadas', 'warning');
      return;
    }

    const keys = Array.from(checkboxes).map(cb => cb.value);
    
    if (!confirm(`¿Eliminar ${keys.length} clave${keys.length > 1 ? 's' : ''}?`)) {
      return;
    }

    showNotification(`🔄 Eliminando ${keys.length} claves...`, 'info');

    try {
      let deleted = 0;
      for (const key of keys) {
        const result = await clearCache({ customPattern: key });
        if (result) deleted++;
      }

      showNotification(`✅ ${deleted} clave${deleted > 1 ? 's' : ''} eliminada${deleted > 1 ? 's' : ''}`, 'success');
      
      // Refresh view
      const searchInput = document.getElementById('cache-search-pattern');
      const currentPattern = searchInput ? searchInput.value : '*';
      const moduleMatch = currentPattern.match(/\*:([^:]+):\*/);
      const moduleName = moduleMatch ? moduleMatch[1] : null;
      
      await showDetailedKeys(currentPattern, moduleName);
    } catch (error) {
      showNotification('❌ Error al eliminar claves', 'error');
    }
  };

  // Function to toggle all checkboxes
  window.toggleAllKeys = function(checked) {
    const checkboxes = document.querySelectorAll('.key-checkbox');
    checkboxes.forEach(cb => cb.checked = checked);
    updateSelectedCount();
  };

  // Function to update selected count
  window.updateSelectedCount = function() {
    const checkboxes = document.querySelectorAll('.key-checkbox:checked');
    const count = checkboxes.length;
    const badge = document.getElementById('selected-count-badge');
    const deleteBtn = document.getElementById('delete-selected-btn');
    
    if (badge) {
      badge.textContent = count > 0 ? `${count} seleccionada${count > 1 ? 's' : ''}` : '';
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
    
    if (deleteBtn) {
      deleteBtn.disabled = count === 0;
      deleteBtn.style.opacity = count === 0 ? '0.5' : '1';
      deleteBtn.style.cursor = count === 0 ? 'not-allowed' : 'pointer';
    }
  };

  // Function to show detailed keys view
  async function showDetailedKeys(pattern = '*', moduleName = null) {
    const detailsSection = document.getElementById('cache-details-section');
    if (!detailsSection) return;

    detailsSection.innerHTML = `
      <div style="text-align: center; padding: 60px; color: #6c757d;">
        <div style="font-size: 64px; margin-bottom: 20px; animation: spin 2s linear infinite;">⏳</div>
        <p style="font-size: 16px; font-weight: 500;">Cargando claves detalladas...</p>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;

    const data = await loadDetailedKeys(pattern, 100);
    
    if (!data || !data.success) {
      detailsSection.innerHTML = `
        <div style="text-align: center; padding: 60px; color: #dc3545;">
          <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
          <h3 style="margin: 0 0 8px 0; font-size: 20px;">Error al cargar las claves</h3>
          <p style="margin: 0; color: #6c757d;">Intenta nuevamente o verifica la conexión</p>
        </div>
      `;
      return;
    }

    const keys = data.keys || [];
    const moduleTitle = moduleName ? `${moduleName}` : 'Todas las Claves';
    const moduleIcon = moduleName?.includes('Tenant:') ? '🏢' : moduleName ? '📦' : '🔍';

    detailsSection.innerHTML = `
      <!-- Header -->
      <div style="
        margin: 28px 0 24px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 28px 32px;
        border-radius: 16px;
        color: white;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 28px;">${moduleIcon}</span>
              <span>${moduleTitle}</span>
            </h3>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 14px; opacity: 0.95; align-items: center;">
              <span>📊 ${data.returned} de ${data.total} claves</span>
              <span>•</span>
              <span id="filtered-count-display"></span>
              <span id="selected-count-badge" style="
                background: rgba(255,255,255,0.3);
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 600;
                backdrop-filter: blur(10px);
                display: none;
              "></span>
            </div>
          </div>
          <button onclick="toggleDetailedView()" style="
            padding: 12px 24px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s;
            white-space: nowrap;
          "
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
            ← Volver al Dashboard
          </button>
        </div>
        
        <!-- Bulk Actions -->
        <div style="
          background: rgba(255,255,255,0.15);
          padding: 16px 20px;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        ">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
            <input type="checkbox" id="select-all-checkbox" onchange="toggleAllKeys(this.checked)" style="
              width: 18px;
              height: 18px;
              cursor: pointer;
            " />
            Seleccionar todo
          </label>
          <button id="delete-selected-btn" onclick="deleteSelectedKeys()" disabled style="
            padding: 10px 22px;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: not-allowed;
            font-size: 14px;
            font-weight: 700;
            transition: all 0.2s;
            opacity: 0.5;
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
          "
          onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.5)'; }"
          onmouseout="if(!this.disabled) { this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(220, 53, 69, 0.3)'; }">
            🗑️ Eliminar Seleccionadas
          </button>
        </div>
      </div>

      ${keys.length === 0 ? `
        <div style="
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(to bottom, #f8f9fa, #ffffff);
          border-radius: 16px;
          border: 2px dashed #dee2e6;
        ">
          <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.5;">🔍</div>
          <h3 style="margin: 0 0 12px 0; color: #495057; font-size: 22px;">No se encontraron claves</h3>
          <p style="margin: 0; color: #6c757d; font-size: 15px;">Intenta con otro patrón de búsqueda o verifica el módulo/tenant</p>
        </div>
      ` : `
        <!-- Search and Filter Controls -->
        <div style="
          margin-bottom: 20px;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        ">
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: #495057;">
                🔍 Buscar en resultados
              </label>
              <input 
                type="text" 
                id="keys-filter-input"
                placeholder="Buscar por tenant, módulo, key o contenido..."
                oninput="filterKeysTable(this.value)"
                style="
                  width: 100%;
                  padding: 10px 14px;
                  border: 2px solid #e9ecef;
                  border-radius: 8px;
                  font-size: 14px;
                  transition: all 0.2s;
                "
                onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'"
                onblur="this.style.borderColor='#e9ecef'; this.style.boxShadow='none'"
              />
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-end;">
              <button onclick="document.getElementById('keys-filter-input').value=''; filterKeysTable(''); document.getElementById('filtered-count-display').textContent='';" style="
                padding: 10px 18px;
                background: #f8f9fa;
                color: #495057;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
                white-space: nowrap;
              "
              onmouseover="this.style.background='#e9ecef'"
              onmouseout="this.style.background='#f8f9fa'">
                🗑️ Limpiar
              </button>
              <button onclick="sortTable('size')" style="
                padding: 10px 18px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
                white-space: nowrap;
              "
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                ⬇️ Ordenar
              </button>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div style="
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          border: 1px solid #e9ecef;
        ">
          <div style="overflow-x: auto;">
            <table id="cache-keys-table" style="width: 100%; border-collapse: collapse; font-size: 13px; background: white;">
              <thead>
                <tr style="background: linear-gradient(to right, #f8f9fa, #e9ecef); border-bottom: 2px solid #dee2e6;">
                  <th style="
                    padding: 16px;
                    text-align: center;
                    font-weight: 700;
                    color: #495057;
                    width: 50px;
                  ">
                    <input type="checkbox" onchange="toggleAllKeys(this.checked)" style="width: 16px; height: 16px; cursor: pointer;" />
                  </th>
                  <th onclick="sortTable('tenant')" style="
                    padding: 16px;
                    text-align: left;
                    font-weight: 700;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  " 
                  onmouseover="this.style.background='#dee2e6'"
                  onmouseout="this.style.background='transparent'"
                  title="Clic para ordenar">
                    🏢 Tenant ⬍
                  </th>
                  <th onclick="sortTable('module')" style="
                    padding: 16px;
                    text-align: left;
                    font-weight: 700;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  "
                  onmouseover="this.style.background='#dee2e6'"
                  onmouseout="this.style.background='transparent'"
                  title="Clic para ordenar">
                    📦 Módulo ⬍
                  </th>
                  <th onclick="sortTable('key')" style="
                    padding: 16px;
                    text-align: left;
                    font-weight: 700;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  "
                  onmouseover="this.style.background='#dee2e6'"
                  onmouseout="this.style.background='transparent'"
                  title="Clic para ordenar">
                    🔑 Key ⬍
                  </th>
                  <th style="
                    padding: 16px;
                    text-align: left;
                    font-weight: 700;
                    color: #495057;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  ">
                    📄 Preview
                  </th>
                  <th onclick="sortTable('ttl')" style="
                    padding: 16px;
                    text-align: center;
                    font-weight: 700;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  "
                  onmouseover="this.style.background='#dee2e6'"
                  onmouseout="this.style.background='transparent'"
                  title="Clic para ordenar">
                    ⏱️ TTL ⬍
                  </th>
                  <th onclick="sortTable('size')" style="
                    padding: 16px;
                    text-align: center;
                    font-weight: 700;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  "
                  onmouseover="this.style.background='#dee2e6'"
                  onmouseout="this.style.background='transparent'"
                  title="Clic para ordenar">
                    💾 Tamaño ⬍
                  </th>
                  <th style="
                    padding: 16px;
                    text-align: center;
                    font-weight: 700;
                    color: #495057;
                    font-size: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                  ">
                    ⚙️ Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                ${keys.map((item, index) => `
                  <tr style="
                    border-bottom: 1px solid #f0f0f0;
                    background: ${index % 2 === 0 ? '#fafafa' : 'white'};
                    transition: all 0.2s;
                  "
                  data-tenant="${item.tenant}"
                  data-module="${item.module}"
                  data-key="${item.keyName}"
                  data-ttl="${item.ttl || 0}"
                  data-size="${item.size}"
                  onmouseover="this.style.background='#f0f7ff'; this.style.transform='scale(1.01)'"
                  onmouseout="this.style.background='${index % 2 === 0 ? '#fafafa' : 'white'}'; this.style.transform='scale(1)'">
                    <td style="padding: 14px 16px; text-align: center;">
                      <input type="checkbox" class="key-checkbox" value="${item.key.replace(/"/g, '&quot;')}" onchange="updateSelectedCount()" style="width: 16px; height: 16px; cursor: pointer;" />
                    </td>
                    <td style="padding: 14px 16px;">
                      <span style="
                        background: linear-gradient(135deg, #e7f3ff, #cfe7ff);
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 700;
                        color: #0056b3;
                        border: 1px solid #b3d9ff;
                      ">${item.tenant}</span>
                    </td>
                    <td style="padding: 14px 16px;">
                      <span style="
                        background: linear-gradient(135deg, #d4edda, #c3e6cb);
                        padding: 6px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 700;
                        color: #155724;
                        border: 1px solid #b1dfbb;
                      ">${item.module}</span>
                    </td>
                    <td style="padding: 14px 16px;">
                      <code style="
                        font-size: 12px;
                        color: #495057;
                        background: #f8f9fa;
                        padding: 4px 8px;
                        border-radius: 4px;
                        max-width: 250px;
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border: 1px solid #e9ecef;
                      " title="${item.keyName}">${item.keyName}</code>
                    </td>
                    <td style="padding: 14px 16px; max-width: 300px;">
                      <div style="
                        font-size: 12px;
                        color: #6c757d;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-family: 'Courier New', monospace;
                      " title="${item.preview || 'Sin preview'}">${item.preview || '<span style="color: #adb5bd;">N/A</span>'}</div>
                    </td>
                    <td style="padding: 14px 16px; text-align: center;">
                      <span style="
                        background: ${item.ttl ? '#fff3cd' : '#d1ecf1'};
                        color: ${item.ttl ? '#856404' : '#0c5460'};
                        padding: 4px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 700;
                        border: 1px solid ${item.ttl ? '#ffc107' : '#bee5eb'};
                      ">
                        ${item.ttl ? `${item.ttl}s` : '∞'}
                      </span>
                    </td>
                    <td style="padding: 14px 16px; text-align: center;">
                      <span style="
                        background: ${item.size > 10240 ? '#f8d7da' : '#d4edda'};
                        color: ${item.size > 10240 ? '#721c24' : '#155724'};
                        padding: 4px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 700;
                        border: 1px solid ${item.size > 10240 ? '#f5c6cb' : '#c3e6cb'};
                      ">
                        ${(item.size / 1024).toFixed(1)} KB
                      </span>
                    </td>
                    <td style="padding: 14px 16px; text-align: center;">
                      <div style="display: flex; gap: 6px; justify-content: center;">
                        <button onclick="viewKeyValue('${item.key.replace(/'/g, "\\'")}'); event.stopPropagation();" style="
                          background: linear-gradient(135deg, #007bff, #0056b3);
                          color: white;
                          border: none;
                          padding: 8px 12px;
                          border-radius: 6px;
                          cursor: pointer;
                          font-size: 14px;
                          transition: all 0.2s;
                          box-shadow: 0 2px 4px rgba(0,123,255,0.3);
                        " 
                        onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 8px rgba(0,123,255,0.4)'"
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 4px rgba(0,123,255,0.3)'"
                        title="Ver valor completo">👁️</button>
                        <button onclick="deleteSingleKey('${item.key.replace(/'/g, "\\'")}'); event.stopPropagation();" style="
                          background: linear-gradient(135deg, #dc3545, #c82333);
                          color: white;
                          border: none;
                          padding: 8px 12px;
                          border-radius: 6px;
                          cursor: pointer;
                          font-size: 14px;
                          transition: all 0.2s;
                          box-shadow: 0 2px 4px rgba(220,53,69,0.3);
                        "
                        onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 8px rgba(220,53,69,0.4)'"
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 4px rgba(220,53,69,0.3)'"
                        title="Eliminar clave">🗑️</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    `;
  }

  // Function to toggle between dashboard and detailed view
  window.toggleDetailedView = async function() {
    const statsContent = document.getElementById('cache-stats-content');
    const detailsSection = document.getElementById('cache-details-section');
    
    if (!statsContent || !detailsSection) return;

    if (detailsSection.style.display === 'none') {
      // Show detailed view
      statsContent.style.display = 'none';
      detailsSection.style.cssText = 'display: block; padding: 32px; overflow-y: auto; flex: 1;';
      
      const searchInput = document.getElementById('cache-search-pattern');
      await showDetailedKeys(searchInput ? searchInput.value : '*');
    } else {
      // Show dashboard
      statsContent.style.display = 'block';
      detailsSection.style.display = 'none';
    }
  };

  // Function to view keys of a specific module
  window.viewModuleKeys = async function(module) {
    const statsContent = document.getElementById('cache-stats-content');
    const detailsSection = document.getElementById('cache-details-section');
    
    if (!statsContent || !detailsSection) return;

    // Switch to detailed view
    statsContent.style.display = 'none';
    detailsSection.style.cssText = 'display: block; padding: 32px; overflow-y: auto; flex: 1;';

    // Update search input
    const searchInput = document.getElementById('cache-search-pattern');
    if (searchInput) {
      searchInput.value = `*:${module}:*`;
    }

    // Load keys for this module
    await showDetailedKeys(`*:${module}:*`, module);
  };

  // Function to view keys of a specific tenant
  window.viewTenantKeys = async function(tenant) {
    const statsContent = document.getElementById('cache-stats-content');
    const detailsSection = document.getElementById('cache-details-section');
    
    if (!statsContent || !detailsSection) return;

    // Switch to detailed view
    statsContent.style.display = 'none';
    detailsSection.style.display = 'block';

    // Update search input
    const searchInput = document.getElementById('cache-search-pattern');
    if (searchInput) {
      searchInput.value = `${tenant}:*`;
    }

    // Load keys for this tenant
    await showDetailedKeys(`${tenant}:*`, `Tenant: ${tenant}`);
  };

  // Function to clear cache for a specific tenant
  window.clearTenant = async function(tenant) {
    if (!confirm(`¿Estás seguro de que quieres eliminar TODAS las claves del tenant "${tenant}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      showNotification(`🔄 Limpiando caché del tenant "${tenant}"...`, 'info');
      
      await clearCache({
        tenantId: tenant
      });

      showNotification(`✅ Caché del tenant "${tenant}" limpiado exitosamente`, 'success');
      
      // Refresh stats
      await refreshStats();
    } catch (error) {
      console.error('Error clearing tenant cache:', error);
      showNotification(`❌ Error al limpiar caché del tenant "${tenant}"`, 'error');
    }
  };

  // Function to filter keys table in real-time
  window.filterKeysTable = function(searchTerm) {
    const table = document.getElementById('cache-keys-table');
    if (!table) return;

    const rows = table.getElementsByTagName('tbody')[0]?.getElementsByTagName('tr') || [];
    const lowerSearch = searchTerm.toLowerCase();
    let visibleCount = 0;

    Array.from(rows).forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(lowerSearch)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Update count display
    const countElement = document.getElementById('filtered-count-display');
    if (countElement) {
      if (searchTerm) {
        countElement.innerHTML = `<span style="background: rgba(255,255,255,0.3); padding: 4px 12px; border-radius: 12px; font-weight: 600;">🔍 ${visibleCount} resultados filtrados</span>`;
      } else {
        countElement.textContent = '';
      }
    }
  };

  // Function to sort table by column
  let sortDirection = {};
  window.sortTable = function(column) {
    const table = document.getElementById('cache-keys-table');
    if (!table) return;

    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.getElementsByTagName('tr'));

    // Toggle sort direction
    if (!sortDirection[column]) sortDirection[column] = 'asc';
    sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    const direction = sortDirection[column];

    rows.sort((a, b) => {
      let aVal, bVal;

      switch(column) {
        case 'tenant':
          aVal = a.dataset.tenant || '';
          bVal = b.dataset.tenant || '';
          return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        
        case 'module':
          aVal = a.dataset.module || '';
          bVal = b.dataset.module || '';
          return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        
        case 'key':
          aVal = a.dataset.key || '';
          bVal = b.dataset.key || '';
          return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        
        case 'ttl':
          aVal = parseInt(a.dataset.ttl) || 0;
          bVal = parseInt(b.dataset.ttl) || 0;
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        
        case 'size':
          aVal = parseInt(a.dataset.size) || 0;
          bVal = parseInt(b.dataset.size) || 0;
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        
        default:
          return 0;
      }
    });

    // Re-append sorted rows
    rows.forEach((row, index) => {
      tbody.appendChild(row);
      // Update zebra striping
      row.style.background = index % 2 === 0 ? '#fafafa' : 'white';
    });

    // Visual feedback
    showNotification(`📊 Tabla ordenada por ${column} (${direction === 'asc' ? 'ascendente' : 'descendente'})`, 'info');
  };

  // Export functions to window
  window.loadDetailedKeys = loadDetailedKeys;
  window.viewKeyValue = viewKeyValue;
  window.deleteSingleKey = deleteSingleKey;
  window.showDetailedKeys = showDetailedKeys;

  // Function to update modal content with stats
  function updateModalContent() {
    const statsContent = document.getElementById('cache-stats-content');
    if (!statsContent || !cacheStats) return;

    const stats = cacheStats.stats || cacheStats;
    const modules = cacheStats.modules || [];
    const tenants = cacheStats.tenants || [];

    statsContent.innerHTML = `
      <!-- Statistics Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 28px;">
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          transition: transform 0.2s;
          cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 10px; font-weight: 500; letter-spacing: 0.5px;">TOTAL DE CLAVES</div>
          <div style="font-size: 38px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${stats.totalKeys || 0}</div>
        </div>
        <div style="
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 24px;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(240, 147, 251, 0.3);
          transition: transform 0.2s;
          cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 10px; font-weight: 500; letter-spacing: 0.5px;">TENANT ACTUAL</div>
          <div style="font-size: 20px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${stats.currentTenant || 'N/A'}</div>
        </div>
        <div style="
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          padding: 24px;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(79, 172, 254, 0.3);
          transition: transform 0.2s;
          cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 10px; font-weight: 500; letter-spacing: 0.5px;">MÓDULOS ACTIVOS</div>
          <div style="font-size: 38px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${modules.length}</div>
        </div>
        <div style="
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          padding: 24px;
          border-radius: 16px;
          color: white;
          box-shadow: 0 8px 24px rgba(67, 233, 123, 0.3);
          transition: transform 0.2s;
          cursor: pointer;
        " onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          <div style="font-size: 13px; opacity: 0.9; margin-bottom: 10px; font-weight: 500; letter-spacing: 0.5px;">TENANTS</div>
          <div style="font-size: 38px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${tenants.length}</div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div style="margin-bottom: 28px;">
        <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #212529; display: flex; align-items: center; gap: 10px; font-weight: 700;">
          <span style="font-size: 24px;">⚡</span> Acciones Rápidas
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          ${createQuickActionButton('🧹 Limpiar Mi Tenant', 'clearCurrentTenant', '#007bff')}
          ${createQuickActionButton('📦 Limpiar "default"', 'clearDefault', '#28a745')}
          ${createQuickActionButton('🛒 Limpiar Órdenes', 'clearOrders', '#17a2b8')}
          ${createQuickActionButton('🍽️ Limpiar Menús', 'clearMenu', '#fd7e14')}
          ${createQuickActionButton('👥 Limpiar Clientes', 'clearCustomers', '#6f42c1')}
          ${createQuickActionButton('🔄 Refrescar Stats', 'refreshStats', '#6c757d')}
        </div>
      </div>

      <!-- Search and View Detailed Keys -->
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 28px;
        color: white;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
      ">
        <h3 style="margin: 0 0 14px 0; font-size: 20px; display: flex; align-items: center; gap: 10px; font-weight: 700;">
          <span style="font-size: 24px;">🔍</span> Ver Claves Detalladas
        </h3>
        <p style="margin: 0 0 18px 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">
          Busca y visualiza el contenido completo de las claves del caché con información detallada
        </p>
        <div style="display: flex; gap: 14px;">
          <input 
            type="text" 
            id="cache-search-pattern"
            placeholder="Patrón de búsqueda (ej: order:*, default:*, *)"
            value="*"
            style="
              flex: 1;
              padding: 12px 18px;
              border: 2px solid rgba(255,255,255,0.3);
              border-radius: 10px;
              font-size: 14px;
              background: rgba(255,255,255,0.95);
              color: #333;
              transition: all 0.2s;
            "
            onfocus="this.style.background='white'; this.style.borderColor='rgba(255,255,255,0.6)'"
            onblur="this.style.background='rgba(255,255,255,0.95)'; this.style.borderColor='rgba(255,255,255,0.3)'"
          />
          <button onclick="toggleDetailedView()" style="
            padding: 12px 28px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s;
            white-space: nowrap;
          " 
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
            🔎 Buscar Claves
          </button>
        </div>
      </div>

      <!-- Detailed Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 28px;">
        <!-- By Tenant -->
        <div style="
          background: linear-gradient(to bottom, #ffffff, #f8f9fa);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        ">
          <h4 style="margin: 0 0 18px 0; font-size: 18px; color: #212529; display: flex; align-items: center; gap: 10px; font-weight: 700;">
            <span style="font-size: 20px;">🏢</span> Por Tenant
          </h4>
          <div style="max-height: 240px; overflow-y: auto;">
            ${Object.entries(stats.byTenant || {})
              .sort((a, b) => b[1] - a[1])
              .map(([tenant, count]) => `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 10px 12px;
                  margin-bottom: 6px;
                  border-radius: 8px;
                  background: white;
                  border: 1px solid #e9ecef;
                  transition: all 0.2s;
                  cursor: pointer;
                "
                onclick="viewTenantKeys('${tenant}')"
                onmouseover="this.style.borderColor='#007bff'; this.style.boxShadow='0 2px 8px rgba(0,123,255,0.1)'; this.querySelector('span').style.textDecoration='underline'"
                onmouseout="this.style.borderColor='#e9ecef'; this.style.boxShadow='none'; this.querySelector('span').style.textDecoration='none'">
                  <span style="color: #495057; font-weight: 600;" title="Clic para ver las claves de ${tenant}">${tenant}</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">${count}</span>
                    <button onclick="viewTenantKeys('${tenant}'); event.stopPropagation();" style="
                      background: #007bff;
                      color: white;
                      border: none;
                      padding: 5px 10px;
                      border-radius: 8px;
                      cursor: pointer;
                      font-size: 11px;
                      font-weight: 600;
                      transition: all 0.2s;
                    " 
                    onmouseover="this.style.background='#0056b3'; this.style.transform='scale(1.05)'"
                    onmouseout="this.style.background='#007bff'; this.style.transform='scale(1)'"
                    title="Ver claves de ${tenant}">👁️</button>
                    <button onclick="clearTenant('${tenant}'); event.stopPropagation();" style="
                      background: #dc3545;
                      color: white;
                      border: none;
                      padding: 5px 10px;
                      border-radius: 8px;
                      cursor: pointer;
                      font-size: 11px;
                      font-weight: 600;
                      transition: all 0.2s;
                    "
                    onmouseover="this.style.background='#c82333'; this.style.transform='scale(1.05)'"
                    onmouseout="this.style.background='#dc3545'; this.style.transform='scale(1)'"
                    title="Limpiar todo ${tenant}">🗑️</button>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- By Module -->
        <div style="
          background: linear-gradient(to bottom, #ffffff, #f8f9fa);
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e9ecef;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        ">
          <h4 style="margin: 0 0 18px 0; font-size: 18px; color: #212529; display: flex; align-items: center; gap: 10px; font-weight: 700;">
            <span style="font-size: 20px;">📦</span> Por Módulo
          </h4>
          <div style="max-height: 240px; overflow-y: auto;">
            ${Object.entries(stats.byModule || {})
              .sort((a, b) => b[1] - a[1])
              .map(([module, count]) => `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 10px 12px;
                  margin-bottom: 6px;
                  border-radius: 8px;
                  background: white;
                  border: 1px solid #e9ecef;
                  transition: all 0.2s;
                  cursor: pointer;
                "
                onclick="viewModuleKeys('${module}')"
                onmouseover="this.style.borderColor='#28a745'; this.style.boxShadow='0 2px 8px rgba(40,167,69,0.1)'; this.querySelector('span').style.textDecoration='underline'"
                onmouseout="this.style.borderColor='#e9ecef'; this.style.boxShadow='none'; this.querySelector('span').style.textDecoration='none'">
                  <span style="color: #495057; font-weight: 600;">${module}</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 700;">${count}</span>
                    <button onclick="viewModuleKeys('${module}'); event.stopPropagation();" style="
                      background: #007bff;
                      color: white;
                      border: none;
                      padding: 5px 10px;
                      border-radius: 8px;
                      cursor: pointer;
                      font-size: 11px;
                      font-weight: 500;
                    " title="Ver claves de ${module}">👁️</button>
                    <button onclick="clearModule('${module}'); event.stopPropagation();" style="
                      background: #dc3545;
                      color: white;
                      border: none;
                      padding: 4px 8px;
                      border-radius: 6px;
                      cursor: pointer;
                      font-size: 11px;
                      font-weight: 500;
                    " title="Limpiar todo ${module}">🗑️</button>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div style="
        background: linear-gradient(135deg, #fff3cd 0%, #ffe5b4 100%);
        border: 3px solid #ffc107;
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 28px;
        box-shadow: 0 4px 16px rgba(255, 193, 7, 0.2);
      ">
        <h4 style="margin: 0 0 14px 0; font-size: 20px; color: #856404; display: flex; align-items: center; gap: 10px; font-weight: 700;">
          <span style="font-size: 24px;">⚠️</span> Zona de Peligro
        </h4>
        <p style="margin: 0 0 18px 0; color: #856404; font-size: 15px; line-height: 1.6;">
          Esta acción eliminará <strong>TODAS las ${stats.totalKeys} claves</strong> del sistema Redis. Esta operación es <strong>irreversible</strong> y afectará a todos los tenants. Úsala con extrema precaución.
        </p>
        <button onclick="clearAllCache()" style="
          background: linear-gradient(135deg, #dc3545 0%, #bd2130 100%);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        "
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)'"
        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.3)'">
          🚨 Limpiar TODO el Caché
        </button>
      </div>
    `;

    // Add detailed keys section (hidden by default)
    const detailsSection = document.getElementById('cache-details-section');
    if (!detailsSection) {
      const newDetailsSection = document.createElement('div');
      newDetailsSection.id = 'cache-details-section';
      newDetailsSection.style.cssText = 'display: none; padding: 32px; overflow-y: auto; flex: 1;';
      statsContent.parentNode.appendChild(newDetailsSection);
    }
  }

  // Helper function to create quick action buttons
  function createQuickActionButton(label, action, color) {
    return `
      <button onclick="${action}()" style="
        background: linear-gradient(135deg, ${color}, ${adjustColor(color, -20)});
        color: white;
        border: none;
        padding: 16px 22px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        transition: all 0.2s;
        box-shadow: 0 4px 12px ${color}33;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 2px solid transparent;
      "
      onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 6px 20px ${color}55'; this.style.borderColor='${color}'"
      onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 12px ${color}33'; this.style.borderColor='transparent'">
        ${label}
      </button>
    `;
  }

  // Helper function to darken colors
  function adjustColor(color, amount) {
    const num = parseInt(color.replace("#",""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Global functions for actions
  window.closeCacheModal = function() {
    const modal = document.getElementById('cache-control-modal');
    if (modal) {
      modal.style.display = 'none';
      isModalOpen = false;
      // Restore body scroll
      document.body.style.overflow = '';
    }
  };

  window.openCacheModal = async function() {
    createCacheControlModal();
    const modal = document.getElementById('cache-control-modal');
    if (modal) {
      modal.style.display = 'flex';
      isModalOpen = true;
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      await loadCacheStats();
      updateModalContent();
    }
  };

  window.clearCurrentTenant = async function() {
    if (confirm('¿Limpiar todo el caché de tu tenant actual?')) {
      await clearCache({});
    }
  };

  window.clearDefault = async function() {
    if (confirm('¿Limpiar el namespace "default"? Esto incluye la mayoría del caché de órdenes y otros datos.')) {
      await clearCache({ modules: ['default'] });
    }
  };

  window.clearOrders = async function() {
    if (confirm('¿Limpiar el caché de órdenes?')) {
      await clearCache({ modules: ['order', 'default'] });
    }
  };

  window.clearMenu = async function() {
    if (confirm('¿Limpiar el caché de menús e items?')) {
      await clearCache({ modules: ['menu', 'item', 'category-has-menu', 'menu-item-category-has-branch'] });
    }
  };

  window.clearCustomers = async function() {
    if (confirm('¿Limpiar el caché de clientes?')) {
      await clearCache({ modules: ['customer', 'customer-address'] });
    }
  };

  window.clearModule = async function(moduleName) {
    if (confirm(`¿Limpiar el módulo "${moduleName}"?`)) {
      await clearCache({ modules: [moduleName] });
    }
  };

  window.clearAllCache = async function() {
    const confirmation = prompt(
      '🚨 PELIGRO: Esta acción eliminará TODO el caché del sistema.\n\n' +
      'Escribe "CONFIRMAR" para continuar:'
    );
    
    if (confirmation === 'CONFIRMAR') {
      await clearCache({ clearAll: true });
    } else if (confirmation !== null) {
      showNotification('❌ Cancelado - texto incorrecto', 'error');
    }
  };

  window.refreshStats = async function() {
    showNotification('🔄 Actualizando estadísticas...', 'info');
    await loadCacheStats();
    updateModalContent();
    showNotification('✅ Estadísticas actualizadas', 'success');
  };

  // Function to add cache control button to Swagger
  function addCacheControlButton() {
    const swaggerContainer = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
    if (!swaggerContainer) {
      console.log('📍 Not in Swagger UI, skipping cache control button');
      return;
    }

    if (document.getElementById('cache-control-button')) {
      return;
    }

    // Try to find the tenant selector to add button next to it
    const tenantSelector = document.getElementById('tenant-selector');
    
    if (tenantSelector) {
      // Add button to tenant selector's action buttons div
      const actionsDiv = tenantSelector.querySelector('[style*="display: flex"][style*="gap: 10px"]');
      if (actionsDiv) {
        const buttonHtml = `
          <button onclick="openCacheModal()" id="cache-control-button" style="
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 600;
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            color: white;
            border: 1px solid #4CAF50;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
            display: flex;
            align-items: center;
            gap: 6px;
          "
          onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(76, 175, 80, 0.4)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(76, 175, 80, 0.3)'"
          title="Panel de Control de Caché">
            <span style="font-size: 16px;">⚡</span>
            <span>Caché</span>
          </button>
        `;
        actionsDiv.insertAdjacentHTML('beforeend', buttonHtml);
        console.log('✅ Cache control button added next to tenant selector');
        return;
      }
    }

    // Fallback: add to topbar if tenant selector not found
    let topbar = document.querySelector('.topbar-wrapper') || 
                document.querySelector('.topbar') ||
                document.querySelector('.custom-tenant-topbar');

    if (!topbar) {
      const customTopbar = document.createElement('div');
      customTopbar.className = 'custom-cache-topbar';
      customTopbar.style.cssText = `
        padding: 12px 20px;
        background: #ffffff;
        border-bottom: 1px solid #e9ecef;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        position: sticky;
        top: 0;
        z-index: 999;
      `;
      swaggerContainer.insertBefore(customTopbar, swaggerContainer.firstChild);
      topbar = customTopbar;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'cache-control-button';
    buttonContainer.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-left: 12px;
    `;

    buttonContainer.innerHTML = `
      <button onclick="openCacheModal()" style="
        padding: 8px 18px;
        font-size: 13px;
        font-weight: 600;
        background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
      "
      onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 14px rgba(76, 175, 80, 0.4)'"
      onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 8px rgba(76, 175, 80, 0.3)'">
        <span style="font-size: 18px;">⚡</span>
        <span>Control de Caché</span>
      </button>
    `;

    topbar.appendChild(buttonContainer);
    console.log('✅ Cache control button added to Swagger');
  }

  // Initialize
  function initialize() {
    console.log('🚀 Initializing cache control panel...');
    
    let attempts = 0;
    const maxAttempts = 20;
    
    const checkSwaggerReady = () => {
      attempts++;
      const swaggerContainer = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
      const hasContent = swaggerContainer && swaggerContainer.children.length > 0;
      
      if (swaggerContainer && hasContent) {
        console.log('🎉 Adding cache control to Swagger UI');
        setTimeout(addCacheControlButton, 1000);
      } else if (attempts < maxAttempts) {
        setTimeout(checkSwaggerReady, 500);
      }
    };

    checkSwaggerReady();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeCacheModal();
    }
  });

  // Close modal on background click
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('cache-control-modal');
    if (isModalOpen && e.target === modal) {
      closeCacheModal();
    }
  });

  // Listen for tenant changes
  window.addEventListener('storage', async function(e) {
    if (e.key === 'selectedTenant' || e.key === 'tenant_sub') {
      console.log('🔄 Tenant changed, updating cache panel...');
      const newTenantSub = getCurrentTenantSub();
      
      if (newTenantSub !== currentTenantSub) {
        currentTenantSub = newTenantSub;
        showNotification('🏢 Tenant cambiado, actualizando caché...', 'info');
        
        // If modal is open, refresh stats
        if (isModalOpen) {
          await loadCacheStats();
          updateModalContent();
          showNotification('✅ Panel de caché actualizado', 'success');
        }
      }
    }
  });

  // Also check for tenant changes when modal opens
  const originalOpenCacheModal = window.openCacheModal;
  window.openCacheModal = async function() {
    currentTenantSub = getCurrentTenantSub();
    if (originalOpenCacheModal) {
      await originalOpenCacheModal();
    }
  };

  console.log('🚀 Cache Control Panel script loaded');
  window.CACHE_CONTROL_LOADED = true;
})();
