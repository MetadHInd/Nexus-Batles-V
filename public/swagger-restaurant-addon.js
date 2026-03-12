// Swagger UI customization to add tenant_sub header automatically
(function() {
  'use strict';

  let userTenants = [];
  let currentToken = null;

  // Function to get tenant UUID from session storage or cookies
  function getSelectedTenantSub() {
    // Try session storage first
    let tenantSub = sessionStorage.getItem('selectedTenant');
    
    // If not in session storage, try cookies
    if (!restaurantUuid) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'restaurantSub') {
          restaurantUuid = value;
          break;
        }
      }
    }
    
    return restaurantUuid;
  }

  // Function to get current auth token
  function getCurrentToken() {
    if (currentToken) return currentToken;
    
    // Try session storage
    currentToken = sessionStorage.getItem('token');
    
    if (!currentToken) {
      // Try cookies
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') {
          currentToken = value;
          break;
        }
      }
    }
    
    return currentToken;
  }

  // Function to load available restaurants from API
  async function loadAvailableRestaurants() {
    try {
      const token = getCurrentToken();
      if (!token) {
        console.warn('🚨 No auth token found for restaurant loading');
        return [];
      }

      const response = await fetch('/api/sysUser/restaurants', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('🏪 Loaded restaurants:', data);
      
      // Handle wrapped response structure
      const restaurantsData = data.data || data;
      userRestaurants = restaurantsData.restaurants || [];
      
      console.log(`✅ Found ${userRestaurants.length} available restaurants`);
      return userRestaurants;
    } catch (error) {
      console.error('❌ Error loading restaurants:', error);
      return [];
    }
  }

  // Function to select a restaurant
  async function selectRestaurant(restaurantUuid) {
    try {
      const token = getCurrentToken();
      if (!token) {
        alert('❌ Token de autenticación no encontrado');
        return false;
      }

      console.log('🔄 Selecting restaurant:', restaurantUuid);

      const response = await fetch('/api/sysUser/select-restaurant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          restaurantUuid: restaurantUuid
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Restaurant selected:', data);

      // Update storage
      sessionStorage.setItem('selectedRestaurantUuid', restaurantUuid);
      
      // Set cookie
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      document.cookie = `restaurantSub=${restaurantUuid};path=/;expires=${expiry.toUTCString()}`;

      // Update UI
      updateRestaurantSelector();
      
      // Show success notification
      showNotification('✅ Restaurante cambiado exitosamente', 'success');
      
      return true;
    } catch (error) {
      console.error('❌ Error selecting restaurant:', error);
      showNotification('❌ Error al cambiar restaurante', 'error');
      return false;
    }
  }

  // Function to show notifications
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.getElementById('restaurant-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'restaurant-notification';
    
    const colors = {
      success: {
        bg: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        border: '#28a745'
      },
      error: {
        bg: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
        border: '#dc3545'
      },
      info: {
        bg: 'linear-gradient(135deg, #17a2b8 0%, #007bff 100%)',
        border: '#17a2b8'
      }
    };
    
    const colorSet = colors[type] || colors.info;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 14px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      background: ${colorSet.bg};
      border-left: 4px solid ${colorSet.border};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 350px;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 3000);
  }

  // Function to update the restaurant selector UI
  function updateRestaurantSelector() {
    const selector = document.getElementById('restaurant-selector');
    if (!selector) return;

    const restaurantUuid = getSelectedRestaurantUuid();
    const currentRestaurant = userRestaurants.find(r => r.uuid === restaurantUuid);
    
    const currentRestaurantSpan = document.getElementById('current-restaurant');
    if (currentRestaurantSpan) {
      if (currentRestaurant) {
        currentRestaurantSpan.innerHTML = `<strong>${currentRestaurant.name}</strong> <span style="color: #666; font-size: 11px;">(${currentRestaurant.uuid.substring(0, 8)}...)</span>`;
      } else {
        currentRestaurantSpan.textContent = restaurantUuid ? 
          `${restaurantUuid.substring(0, 8)}...` : 
          'No seleccionado';
      }
    }
  }

  // Function to create restaurant dropdown
  function createRestaurantDropdown() {
    if (userRestaurants.length <= 1) {
      return ''; // No dropdown needed for single restaurant
    }

    const currentUuid = getSelectedRestaurantUuid();
    
    let dropdownHtml = `
      <select id="restaurant-dropdown" style="
        margin-left: 0; 
        padding: 6px 12px; 
        font-size: 13px; 
        border: 1px solid #ced4da; 
        border-radius: 5px; 
        background: white;
        cursor: pointer;
        max-width: 200px;
        min-width: 150px;
        font-family: inherit;
        color: #495057;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      " 
      onfocus="this.style.borderColor='#007bff'; this.style.boxShadow='0 0 0 2px rgba(0,123,255,0.1)'"
      onblur="this.style.borderColor='#ced4da'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
        <option value="" style="color: #6c757d;">Cambiar a...</option>
    `;

    userRestaurants.forEach(restaurant => {
      const selected = restaurant.uuid === currentUuid ? 'selected' : '';
      const isOwner = restaurant.is_owner;
      dropdownHtml += `
        <option value="${restaurant.uuid}" ${selected} style="padding: 8px;">
          ${isOwner ? '👑 ' : ''}${restaurant.name}
        </option>
      `;
    });

    dropdownHtml += '</select>';
    return dropdownHtml;
  }

  // Function to add restaurant selection UI to Swagger
  async function addRestaurantSelector() {
    // Check if we're in Swagger
    const swaggerContainer = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
    if (!swaggerContainer) {
      console.log('📍 Not in Swagger UI, skipping restaurant selector');
      return;
    }

    console.log('🔍 Swagger container found:', swaggerContainer);

    // Try different locations for the topbar or info section
    let topbar = document.querySelector('.topbar-wrapper') || 
                document.querySelector('.topbar') || 
                document.querySelector('.info');

    console.log('🔍 Found existing topbar/info:', !!topbar);

    if (!topbar) {
      // Create our own container at the very top of Swagger
      const customTopbar = document.createElement('div');
      customTopbar.className = 'custom-restaurant-topbar';
      customTopbar.style.cssText = `
        padding: 0;
        background: #ffffff;
        border-bottom: 1px solid #e9ecef;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        position: sticky;
        top: 0;
        z-index: 1000;
      `;
      
      // Insert at the very beginning of swagger container
      swaggerContainer.insertBefore(customTopbar, swaggerContainer.firstChild);
      topbar = customTopbar;
      console.log('✅ Created custom topbar');
    }
    
    if (topbar && !document.getElementById('restaurant-selector')) {
      console.log('🏪 Adding restaurant selector to Swagger');
      console.log('🔧 Topbar element:', topbar);
      
      // Load restaurants first
      await loadAvailableRestaurants();
      
      const restaurantUuid = getSelectedRestaurantUuid();
      const currentRestaurant = userRestaurants.find(r => r.uuid === restaurantUuid);
      
      console.log('🏪 Current restaurant UUID:', restaurantUuid);
      console.log('🏪 Current restaurant object:', currentRestaurant);
      console.log('🏪 Available restaurants:', userRestaurants.length);
      
      const selectorHtml = `
        <div id="restaurant-selector" style="
          display: flex; 
          align-items: center;
          justify-content: space-between;
          margin: 0;
          padding: 12px 20px; 
          background: transparent; 
          border-radius: 0;
          font-size: 14px;
          border: none;
          box-shadow: none;
          max-width: 100%;
          flex-wrap: wrap;
          gap: 15px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        ">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="
                background: transparent;
                color: #007bff;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.5px;
              ">🏪 RESTAURANT</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="current-restaurant" style="
                color: #495057; 
                font-weight: 600; 
                background: #e9ecef; 
                padding: 6px 12px; 
                border-radius: 6px;
                border: 1px solid #dee2e6;
                font-size: 13px;
              ">
                ${currentRestaurant ? 
                  `<span style="color: #007bff;">${currentRestaurant.name}</span> <span style="color: #6c757d; font-size: 11px; margin-left: 4px;">${currentRestaurant.uuid.substring(0, 8)}...</span>` : 
                  (restaurantUuid ? `<span style="color: #dc3545;">${restaurantUuid.substring(0, 8)}...</span>` : '<span style="color: #6c757d;">No seleccionado</span>')
                }
              </span>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px;">
            ${userRestaurants.length > 1 ? `
              <div style="display: flex; align-items: center; gap: 8px;">
                ${createRestaurantDropdown()}
                <button onclick="refreshRestaurants()" style="
                  padding: 6px 10px; 
                  font-size: 11px;  
                  color: white; 
                  border-radius: 5px; 
                  border:none;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  font-weight: 500;
                  min-width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient();
                " 
                
                title="Actualizar lista de restaurantes">🔄</button>
              </div>
            ` : ''}
            
            <button onclick="openRestaurantSelection()" style="
              padding: 6px 14px; 
              font-size: 12px; 
              border: 1px solid #89bf04; 
              background: linear-gradient(135deg, #89bf04 0%, #89bf04 100%); 
              color: white; 
              border-radius: 6px; 
              cursor: pointer;
              font-weight: 500;
              transition: all 0.2s ease;
              
            " 
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(111, 66, 193, 0.3)'" 
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(111, 66, 193, 0.2)'">⚙️ Administrar</button>
          </div>
        </div>
      `;
      
      // Clear any existing content and insert at the top
      topbar.innerHTML = selectorHtml + topbar.innerHTML;
      
      // Add event listener for dropdown
      const dropdown = document.getElementById('restaurant-dropdown');
      if (dropdown) {
        dropdown.addEventListener('change', async (e) => {
          const selectedUuid = e.target.value;
          console.log('🔄 Dropdown changed to:', selectedUuid);
          if (selectedUuid) {
            const success = await selectRestaurant(selectedUuid);
            if (!success) {
              // Revert dropdown to previous value
              dropdown.value = getSelectedRestaurantUuid() || '';
            }
          }
        });
      }
      
      console.log('✅ Restaurant selector successfully added to Swagger');
      showNotification('🏪 Selector de restaurantes cargado', 'success');
    } else if (!topbar) {
      console.log('❌ Could not find suitable location for restaurant selector');
    } else {
      console.log('ℹ️ Restaurant selector already exists');
    }
  }

  // Global functions for button actions
  window.openTenantSelection = function() {
    window.open('/tenant-selection.html', '_blank', 'width=800,height=600,scrollbars=yes');
  };

  window.refreshTenants = async function() {
    console.log('🔄 Refreshing tenants...');
    showNotification('🔄 Actualizando tenants...', 'info');
    
    userTenants = [];
    await loadAvailableTenants();
    
    // Remove existing selector and recreate
    const existingSelector = document.getElementById('tenant-selector');
    if (existingSelector) {
      existingSelector.remove();
    }
    
    await addTenantSelector();
    showNotification('✅ Lista de tenants actualizada', 'success');
  };

  // Override fetch to add restaurantSub header
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    const restaurantUuid = getSelectedRestaurantUuid();
    
    // Only add header for API calls
    if (typeof url === 'string' && url.includes('/api/')) {
      options.headers = options.headers || {};
      
      // Add restaurantSub header if we have a selected restaurant
      if (restaurantUuid) {
        options.headers['restaurantSub'] = restaurantUuid;
        console.log('🏪 Added restaurantSub header:', restaurantUuid);
      }
    }
    
    return originalFetch.call(this, url, options);
  };

  // Override XMLHttpRequest for older implementations
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._url = url;
    return originalOpen.call(this, method, url, async, user, password);
  };
  
  XMLHttpRequest.prototype.send = function(data) {
    const restaurantUuid = getSelectedRestaurantUuid();
    
    // Only add header for API calls
    if (this._url && typeof this._url === 'string' && this._url.includes('/api/') && restaurantUuid) {
      this.setRequestHeader('restaurantSub', restaurantUuid);
      console.log('🏪 Added restaurantSub header via XHR:', restaurantUuid);
    }
    
    return originalSend.call(this, data);
  };

  // Initialize when DOM is ready
  function initializeRestaurantSelector() {
    console.log('🚀 Initializing restaurant selector...');
    console.log('📍 Current URL:', window.location.href);
    console.log('📍 Document ready state:', document.readyState);
    
    let attempts = 0;
    const maxAttempts = 20; // Try for up to 10 seconds
    
    // Wait for Swagger UI to be fully loaded
    const checkSwaggerReady = () => {
      attempts++;
      console.log(`🔍 Attempt ${attempts}/${maxAttempts} - Checking for Swagger UI...`);
      
      const swaggerContainer = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
      const hasContent = swaggerContainer && swaggerContainer.children.length > 0;
      const hasInfo = document.querySelector('.info');
      
      console.log('📊 Swagger container found:', !!swaggerContainer);
      console.log('📊 Container has content:', hasContent);
      console.log('📊 Info section found:', !!hasInfo);
      
      if (swaggerContainer && (hasContent || hasInfo)) {
        console.log('🎉 Swagger UI detected and ready!');
        setTimeout(() => {
          addRestaurantSelector();
        }, 500); // Small delay to ensure everything is rendered
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Swagger not ready yet, retrying in 500ms...`);
        setTimeout(checkSwaggerReady, 500);
      } else {
        console.log('❌ Max attempts reached, Swagger UI might not be available');
        // Try one more time to add directly to body as fallback
        if (window.location.pathname.includes('api-docs')) {
          console.log('🔧 Adding fallback selector to body...');
          addFallbackSelector();
        }
      }
    };

    checkSwaggerReady();
  }

  // Fallback function to add selector directly to body if Swagger structure is not detected
  function addFallbackSelector() {
    if (document.getElementById('restaurant-selector')) return;
    
    const fallbackContainer = document.createElement('div');
    fallbackContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #007bff;
      color: white;
      padding: 10px 20px;
      text-align: center;
      font-family: sans-serif;
    `;
    
    fallbackContainer.innerHTML = `
      <div style="display: inline-block;">
        🏪 <strong>Restaurante:</strong> ${getSelectedRestaurantUuid()?.substring(0, 8) || 'No seleccionado'}...
        <button onclick="openRestaurantSelection()" style="margin-left: 10px; padding: 5px 10px; background: white; color: #007bff; border: none; border-radius: 3px; cursor: pointer;">
          Cambiar Restaurante
        </button>
      </div>
    `;
    
    document.body.appendChild(fallbackContainer);
    console.log('✅ Fallback selector added');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRestaurantSelector);
  } else {
    initializeRestaurantSelector();
  }

  // Also try to add selector when page visibility changes (in case of navigation)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(addRestaurantSelector, 1000);
    }
  });

  // Listen for storage changes (when restaurant is changed in another tab)
  window.addEventListener('storage', function(e) {
    if (e.key === 'selectedRestaurantUuid') {
      console.log('🔄 Restaurant changed in another tab, updating UI...');
      updateRestaurantSelector();
    }
  });

  console.log('🚀 Enhanced restaurant selector script loaded');
  console.log('📍 Script location: /swagger-restaurant-addon.js');
  console.log('📍 Current URL:', window.location.href);
  
  // Add a global flag to indicate the script is loaded
  window.RESTAURANT_SELECTOR_LOADED = true;
  
  // Add simple test function
  window.testRestaurantSelector = function() {
    console.log('🧪 Testing restaurant selector...');
    console.log('- Script loaded:', !!window.RESTAURANT_SELECTOR_LOADED);
    console.log('- Current restaurant:', getSelectedRestaurantUuid());
    console.log('- Available restaurants:', userRestaurants.length);
    console.log('- Selector exists:', !!document.getElementById('restaurant-selector'));
    
    if (!document.getElementById('restaurant-selector')) {
      console.log('🔧 Attempting to add selector manually...');
      addRestaurantSelector();
    }
  };
})();