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
    if (currentToken) return currentToken;
    
    // Try session storage
    currentToken = sessionStorage.getItem('token');
    
    if (!currentToken) {
      // Try cookies
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'authToken') {
          currentToken = decodeURIComponent(value);
          break;
        }
      }
    }
    
    return currentToken;
  }

  // Function to load available tenants from sessionStorage
  async function loadAvailableTenants() {
    try {
      console.log('🔍 Loading available tenants from sessionStorage...');
      
      // Cargar tenants desde sessionStorage (guardados en login)
      const storedTenants = sessionStorage.getItem('tenants');
      
      if (storedTenants) {
        userTenants = JSON.parse(storedTenants);
        console.log('✅ Tenants loaded from sessionStorage:', userTenants.length);
        console.log('📊 Available tenants:', userTenants);
      } else {
        console.warn('⚠️ No tenants found in sessionStorage');
        userTenants = [];
      }
      
      return userTenants;
    } catch (error) {
      console.error('❌ Error loading tenants:', error);
      showNotification('Error loading tenants', 'error');
      userTenants = [];
      return [];
    }
  }

  // Function to select a tenant
  async function selectTenant(tenantSub) {
    try {
      console.log('🏢 Selecting tenant:', tenantSub);
      
      // Store the selected tenant
      sessionStorage.setItem('selectedTenant', tenantSub);
      
      // Set cookie
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      document.cookie = `tenant_sub=${tenantSub};path=/;expires=${expiry.toUTCString()}`;
      
      // Store tenant info
      const selectedTenant = userTenants.find(t => t.tenant_sub === tenantSub);
      if (selectedTenant) {
        sessionStorage.setItem('tenant_slug', selectedTenant.slug);
        sessionStorage.setItem('tenant_name', selectedTenant.name);
      }
      
      showNotification('✅ Tenant selected successfully', 'success');
      updateTenantSelector();
      
      // Reload page to apply new tenant context
      setTimeout(() => window.location.reload(), 1000);
      
      return true;
    } catch (error) {
      console.error('❌ Error selecting tenant:', error);
      showNotification('Error selecting tenant', 'error');
      return false;
    }
  }

  // Function to show notifications
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.getElementById('tenant-notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'tenant-notification';
    
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

  // Function to update the tenant selector UI
  function updateTenantSelector() {
    const selector = document.getElementById('tenant-selector');
    if (!selector) return;

    const tenantSub = getSelectedTenantSub();
    const currentTenant = userTenants.find(t => t.tenant_sub === tenantSub);
    
    const currentTenantSpan = document.getElementById('current-tenant');
    if (currentTenantSpan) {
      if (currentTenant) {
        currentTenantSpan.innerHTML = `<strong>${currentTenant.name}</strong> <span style="color: #666; font-size: 11px;">(${currentTenant.tenant_sub.substring(0, 8)}...)</span>`;
      } else {
        currentTenantSpan.textContent = tenantSub ? 
          `${tenantSub.substring(0, 8)}...` : 
          'No seleccionado';
      }
    }
  }

  // Function to create tenant dropdown
  function createTenantDropdown() {
    if (userTenants.length <= 1) {
      return ''; // No dropdown needed for single tenant
    }

    const currentSub = getSelectedTenantSub();
    
    let dropdownHtml = `
      <select id="tenant-dropdown" style="
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

    userTenants.forEach(tenant => {
      const selected = tenant.tenant_sub === currentSub ? 'selected' : '';
      const badge = tenant.is_default ? ' (Default)' : '';
      dropdownHtml += `
        <option value="${tenant.tenant_sub}" ${selected} style="padding: 8px;">
          ${tenant.name}${badge}
        </option>
      `;
    });

    dropdownHtml += '</select>';
    return dropdownHtml;
  }

  // Function to add tenant selection UI to Swagger
  async function addTenantSelector() {
    // Check if we're in Swagger
    const swaggerContainer = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
    if (!swaggerContainer) {
      console.log('📍 Not in Swagger UI, skipping tenant selector');
      return false;
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
      customTopbar.className = 'custom-tenant-topbar';
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
    
    if (topbar && !document.getElementById('tenant-selector')) {
      console.log('🏢 Adding tenant selector to Swagger');
      console.log('🔧 Topbar element:', topbar);
      
      // Load tenants first
      await loadAvailableTenants();
      
      const tenantSub = getSelectedTenantSub();
      const currentTenant = userTenants.find(t => t.tenant_sub === tenantSub);
      
      console.log('🏢 Current tenant UUID:', tenantSub);
      console.log('🏢 Current tenant object:', currentTenant);
      console.log('🏢 Available tenants:', userTenants.length);
      
      const selectorHtml = `
        <div id="tenant-selector" style="
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
              ">🏢 TENANT</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="current-tenant" style="
                color: #495057; 
                font-weight: 600; 
                background: #e9ecef; 
                padding: 6px 12px; 
                border-radius: 6px;
                border: 1px solid #dee2e6;
                font-size: 13px;
              ">
                ${currentTenant ? 
                  `<span style="color: #007bff;">${currentTenant.name}</span> <span style="color: #6c757d; font-size: 11px; margin-left: 4px;">${currentTenant.tenant_sub.substring(0, 8)}...</span>` : 
                  (tenantSub ? `<span style="color: #dc3545;">${tenantSub.substring(0, 8)}...</span>` : '<span style="color: #6c757d;">No seleccionado</span>')
                }
              </span>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px;">
            ${userTenants.length > 1 ? `
              <div style="display: flex; align-items: center; gap: 8px;">
                ${createTenantDropdown()}
                <button onclick="refreshTenants()" style="
                  padding: 6px 10px; 
                  font-size: 11px;  
                  color: white; 
                  border-radius: 5px; 
                  border: none;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  font-weight: 500;
                  min-width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #28a745, #218838);
                  box-shadow: 0 2px 4px rgba(40,167,69,0.2);
                " 
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(40,167,69,0.3)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(40,167,69,0.2)'"
                title="Actualizar lista de tenants">🔄</button>
              </div>
            ` : ''}
            
            <button onclick="openTenantSelection()" style="
              padding: 6px 14px; 
              font-size: 12px; 
              border: 1px solid #89bf04; 
              background: linear-gradient(135deg, #89bf04 0%, #89bf04 100%); 
              color: white; 
              border-radius: 6px; 
              cursor: pointer;
              font-weight: 500;
              transition: all 0.2s ease;
              box-shadow: 0 2px 4px rgba(137, 191, 4, 0.2);
            " 
            onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(137, 191, 4, 0.3)'" 
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(137, 191, 4, 0.2)'">⚙️ Administrar</button>
          </div>
        </div>
      `;
      
      // Clear any existing content and insert at the top
      topbar.innerHTML = selectorHtml + topbar.innerHTML;
      
      // Add event listener for dropdown
      const dropdown = document.getElementById('tenant-dropdown');
      if (dropdown) {
        dropdown.addEventListener('change', async (e) => {
          const selectedSub = e.target.value;
          console.log('🔄 Dropdown changed to:', selectedSub);
          if (selectedSub) {
            const success = await selectTenant(selectedSub);
            if (!success) {
              // Revert dropdown to previous value
              dropdown.value = getSelectedTenantSub() || '';
            }
          }
        });
      }
      
      console.log('✅ Tenant selector successfully added to Swagger');
      showNotification('🏢 Selector de tenants cargado', 'success');
      return true;
    } else if (!topbar) {
      console.log('❌ Could not find suitable location for tenant selector');
      return false;
    } else {
      console.log('ℹ️ Tenant selector already exists');
      return true;
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

  // Override fetch to add tenant_sub header
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    const tenantSub = getSelectedTenantSub();
    
    // Only add header for API calls
    if (typeof url === 'string' && url.includes('/api/')) {
      options.headers = options.headers || {};
      
      // Add tenant_sub header if we have a selected tenant
      if (tenantSub) {
        options.headers['tenant_sub'] = tenantSub;
        console.log('🏢 Added tenant_sub header:', tenantSub);
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
    const tenantSub = getSelectedTenantSub();
    
    // Only add header for API calls
    if (this._url && typeof this._url === 'string' && this._url.includes('/api/') && tenantSub) {
      this.setRequestHeader('tenant_sub', tenantSub);
      console.log('🏢 Added tenant_sub header via XHR:', tenantSub);
    }
    
    return originalSend.call(this, data);
  };

  // Initialize when DOM is ready
  function initializeTenantSelector() {
    console.log('🚀 Initializing tenant selector...');
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
          addTenantSelector();
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
    if (document.getElementById('tenant-selector')) return;
    
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
        🏢 <strong>Tenant:</strong> ${getSelectedTenantSub()?.substring(0, 8) || 'No seleccionado'}...
        <button onclick="openTenantSelection()" style="margin-left: 10px; padding: 5px 10px; background: white; color: #007bff; border: none; border-radius: 3px; cursor: pointer;">
          Cambiar Tenant
        </button>
      </div>
    `;
    
    document.body.appendChild(fallbackContainer);
    console.log('✅ Fallback selector added');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTenantSelector);
  } else {
    initializeTenantSelector();
  }

  // Also try to add selector when page visibility changes (in case of navigation)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(addTenantSelector, 1000);
    }
  });

  // Listen for storage changes (when tenant is changed in another tab)
  window.addEventListener('storage', function(e) {
    if (e.key === 'selectedTenant' || e.key === 'tenant_sub') {
      console.log('🔄 Tenant changed in another tab, updating UI...');
      updateTenantSelector();
    }
  });

  console.log('🚀 Enhanced tenant selector script loaded');
  console.log('📍 Script location: /swagger-tenant-addon.js');
  console.log('📍 Current URL:', window.location.href);
  
  // Add a global flag to indicate the script is loaded
  window.TENANT_SELECTOR_LOADED = true;
  
  // Add simple test function
  window.testTenantSelector = function() {
    console.log('🧪 Testing tenant selector...');
    console.log('- Script loaded:', !!window.TENANT_SELECTOR_LOADED);
    console.log('- Current tenant:', getSelectedTenantSub());
    console.log('- Available tenants:', userTenants.length);
    console.log('- Selector exists:', !!document.getElementById('tenant-selector'));
    
    if (!document.getElementById('tenant-selector')) {
      console.log('🔧 Attempting to add selector manually...');
      addTenantSelector();
    }
  };
})();
