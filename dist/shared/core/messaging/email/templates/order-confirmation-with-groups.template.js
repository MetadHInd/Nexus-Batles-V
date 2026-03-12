"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderConfirmationWithGroupsEmail = void 0;
const getOrderConfirmationWithGroupsEmail = (to, context) => {
    const { customerName, orderNumber, orderDate, orderTime, groups, subtotal, deliveryPrice, taxValue, tipAmount = 0, total, deliveryAddress, cityName, stateName, countryName, branchName, branchAddress, branchPhone, orderStatus, estimatedDeliveryTime, appName, supportEmail, currentYear, currentPaymentUrl, includePaymentButton = false, restaurantName, } = context;
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    const groupsHtml = groups
        .map((group) => `
        <div class="group-section">
          <div class="group-header">
            <h3 class="group-title">
              ${group.isGrouped ? '👥' : '🍽️'} ${group.groupName}
              ${group.variation ? ` - ${group.variation.name}` : ''}
            </h3>
            ${group.variation
        ? `
              <div class="variation-info">
                <span class="variation-detail">Serves: ${group.variation.serves}</span>
                <span class="variation-price">${formatCurrency(group.variation.price)}</span>
              </div>
            `
        : ''}
          </div>
          
          <div class="group-items">
            ${group.items
        .map((item) => `
                  <div class="group-item">
                    <div class="item-info">
                      <div class="item-name">${item.name}</div>
                      ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                      ${item.selections && item.selections.length > 0
        ? `
                        <div class="item-selections">
                          ${item.selections.map((selection) => `<span class="selection-tag">${selection}</span>`).join('')}
                        </div>
                      `
        : ''}
                    </div>
                    <div class="item-quantity">×${item.quantity}</div>
                    <div class="item-price">${formatCurrency(item.unitPrice)}</div>
                    <div class="item-total">${formatCurrency(item.totalValue)}</div>
                  </div>
                `)
        .join('')}
          </div>
          
          <div class="group-total">
            <strong>Group Total: ${formatCurrency(group.groupTotal)}</strong>
          </div>
        </div>
      `)
        .join('');
    const paymentButtonHtml = includePaymentButton && currentPaymentUrl
        ? `
    <div class="payment-section">
      <div class="payment-info">
        <h2>💳 Complete Your Payment</h2>
        <p>Click the button below to securely complete your payment:</p>
      </div>
      <div class="payment-button-container">
        <a href="${currentPaymentUrl}" class="payment-button" target="_blank">
          💳 Pay Now - ${formatCurrency(total)}
        </a>
      </div>
      <p class="payment-note">
        <small>You will be redirected to our secure payment processor to complete your transaction.</small>
      </p>
    </div>
  `
        : '';
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation - ${appName}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f0f2f5;
        color: #333;
      }
      .container {
        max-width: 700px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: visible;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        position: relative;
      }
      .header {
        background-color: #000000;
        padding: 20px;
        text-align: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .logo {
        max-width: 120px;
        height: auto;
      }
      .content {
        padding: 40px 30px 30px;
        line-height: 1.6;
      }
      .avatar-container {
        margin-top: -60px;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
        text-align: center;
      }
      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid #ffffff;
        background-color: #ffffff;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #239488;
        margin-top: 0;
        margin-bottom: 10px;
        text-align: center;
        font-size: 28px;
      }
      h2 {
        color: #239488;
        margin-top: 30px;
        margin-bottom: 15px;
        font-size: 20px;
        border-bottom: 2px solid #239488;
        padding-bottom: 5px;
      }
      .order-summary {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .order-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .order-info strong {
        color: #239488;
      }
      
      /* Estilos para grupos */
      .group-section {
        background: #ffffff;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin: 20px 0;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .group-header {
        background: #f8f9fa;
        padding: 15px 20px;
        border-bottom: 1px solid #e9ecef;
      }
      .group-title {
        margin: 0;
        color: #239488;
        font-size: 18px;
        font-weight: 600;
      }
      .variation-info {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 14px;
        color: #666;
      }
      .variation-price {
        font-weight: bold;
        color: #239488;
      }
      .group-items {
        padding: 0;
      }
      .group-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        border-bottom: 1px solid #f0f0f0;
      }
      .group-item:last-child {
        border-bottom: none;
      }
      .item-info {
        flex: 1;
      }
      .item-name {
        font-weight: 500;
        margin-bottom: 4px;
      }
      .item-description {
        font-size: 13px;
        color: #666;
        margin-bottom: 6px;
        font-style: italic;
      }
      .item-selections {
        margin-top: 4px;
      }
      .selection-tag {
        display: inline-block;
        background: #e3f2fd;
        color: #1976d2;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-right: 4px;
        margin-bottom: 2px;
      }
      .item-quantity {
        width: 60px;
        text-align: center;
        font-weight: 500;
      }
      .item-price {
        width: 80px;
        text-align: right;
        color: #666;
      }
      .item-total {
        width: 80px;
        text-align: right;
        font-weight: bold;
        color: #239488;
      }
      .group-total {
        background: #f8f9fa;
        padding: 15px 20px;
        text-align: right;
        border-top: 1px solid #e9ecef;
        color: #239488;
        font-size: 16px;
      }
      
      .totals-section {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 5px 0;
      }
      .total-row.final {
        border-top: 2px solid #239488;
        margin-top: 15px;
        padding-top: 15px;
        font-size: 18px;
        font-weight: bold;
        color: #239488;
      }
      
      /* Estilos para el botón de pago */
      .payment-section {
        background: #fff3cd;
        border: 2px solid #ffc107;
        border-radius: 8px;
        padding: 25px;
        margin: 25px 0;
        text-align: center;
      }
      .payment-info h2 {
        margin-top: 0;
        color: #856404;
        border: none;
        padding: 0;
      }
      .payment-button-container {
        margin: 20px 0;
      }
      .payment-button {
        display: inline-block;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 15px 30px;
        text-decoration: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        transition: all 0.3s ease;
      }
      .payment-button:hover {
        background: linear-gradient(135deg, #218838, #1ea085);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
      }
      .payment-note {
        color: #856404;
        margin-top: 15px;
      }
      
      .address-section {
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .status-badge {
        display: inline-block;
        background: #28a745;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
      }
      .branch-info {
        background: #e3f2fd;
        border: 1px solid #bbdefb;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .info-section {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
      }
      .info-section h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #239488;
        font-size: 18px;
      }
      .footer {
        background: #f5f5f5;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #888;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      .highlight {
        color: #239488;
        font-weight: bold;
      }
      @media (max-width: 600px) {
        .container {
          margin: 20px;
          max-width: none;
        }
        .content {
          padding: 20px 15px;
        }
        .order-info {
          flex-direction: column;
        }
        .total-row {
          flex-direction: column;
          text-align: center;
        }
        .group-item {
          flex-direction: column;
          align-items: flex-start;
        }
        .item-quantity, .item-price, .item-total {
          width: auto;
          text-align: left;
          margin-top: 4px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://galatealabs.ai/assets/galatea-logo.png"
          alt="${appName} Logo"
          class="logo"
        />
      </div>
      <div class="content">
        <div class="avatar-container">
          <img
            src="https://galatealabs.ai/assets/GALATEA_Profile_Pic.png"
            alt="GALATEA Avatar"
            class="avatar"
          />
        </div>
        
        <h1>🎉 Order Confirmed!</h1>
        
        <p style="text-align: center; font-size: 16px; margin-bottom: 30px;">
          Hello <strong>${customerName}</strong>, thank you for your order! We're preparing your delicious meal.
        </p>

        <div class="order-summary">
          <div class="order-info">
            <span><strong>Order Number:</strong></span>
            <span class="highlight">#${orderNumber}</span>
          </div>
          <div class="order-info">
            <span><strong>Order Date:</strong></span>
            <span>${orderDate}</span>
          </div>
          <div class="order-info">
            <span><strong>Status:</strong></span>
            <span class="status-badge">${orderStatus}</span>
          </div>
          <div class="order-info">
            <span><strong>Estimated Delivery:</strong></span>
            <span class="highlight">${estimatedDeliveryTime}</span>
          </div>
        </div>

        ${paymentButtonHtml}

        <h2>📋 Order Details</h2>
        ${groupsHtml}

        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          <div class="total-row">
            <span>Delivery Fee:</span>
            <span>${formatCurrency(deliveryPrice)}</span>
          </div>
          <div class="total-row">
            <span>Taxes:</span>
            <span>${formatCurrency(taxValue)}</span>
          </div>
          ${tipAmount > 0
        ? `
          <div class="total-row">
            <span>Tip:</span>
            <span>${formatCurrency(tipAmount)}</span>
          </div>
          `
        : ''}
          <div class="total-row final">
            <span>Total Amount:</span>
            <span>${formatCurrency(total)}</span>
          </div>
        </div>

        <h2>🚚 Delivery Information</h2>
        <div class="address-section">
          <p style="margin: 0; font-size: 16px;">
            <strong>Delivery Address:</strong><br>
            ${deliveryAddress}<br>
            ${cityName}, ${stateName}<br>
            ${countryName}
          </p>
        </div>

        <h2>🏪 Restaurant Information</h2>
        <div class="branch-info">
          <p style="margin: 0;">
            <strong>${branchName}</strong><br>
            📍 ${branchAddress}<br>
            📞 ${branchPhone}
          </p>
        </div>

        <div class="info-section">
          <h3>Important Notes</h3>
          <p>
            • Payment must be completed within 24 hours to secure your order<br>
            • Orders will be delivered at the specified time and address<br>
            • For questions, contact us at <a href="mailto:catering@pincho.com" style="color: #4DB6AC; text-decoration: none; font-weight: 600;">catering@pincho.com</a>
          </p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <p style="font-size: 18px; color: #4DB6AC; font-weight: 600;">
            <strong>Thank you for choosing Pincho Catering!</strong><br>
            We look forward to serving you. 🍽️
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p>© ${currentYear} GALATEA Catering. All rights reserved.</p>
        <p>
          <a href="https://galatealabs.ai">Powered by GALATEA Technology</a>
        </p>
      </div>
    </div>
  </body>
</html>
`;
    return {
        to,
        subject: `Order Confirmation #${orderNumber} - ${branchName} Catering`,
        html,
        from: restaurantName
            ? `"${restaurantName} Catering" <${process.env.SMTP_USER || 'notifications@galatealabs.ai'}>`
            : `"GALATEA Catering" <${process.env.SMTP_USER || 'notifications@galatealabs.ai'}>`,
    };
};
exports.getOrderConfirmationWithGroupsEmail = getOrderConfirmationWithGroupsEmail;
//# sourceMappingURL=order-confirmation-with-groups.template.js.map