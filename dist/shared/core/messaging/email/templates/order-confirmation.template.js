"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderConfirmationEmail = void 0;
const getOrderConfirmationEmail = (to, context) => {
    const { customerName, orderNumber, orderDate, orderTime, items, subtotal, deliveryPrice, taxValue, total, deliveryAddress, cityName, stateName, countryName, branchName, branchAddress, branchPhone, orderStatus, estimatedDeliveryTime, appName, supportEmail, currentYear, restaurantName, } = context;
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    const itemsHtml = items
        .map((item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: left;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            ${formatCurrency(item.price)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
            ${formatCurrency(item.totalValue)}
          </td>
        </tr>
      `)
        .join('');
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
        max-width: 650px;
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
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .items-table th {
        background: #239488;
        color: white;
        padding: 15px 12px;
        text-align: left;
        font-weight: 600;
      }
      .items-table th:nth-child(2),
      .items-table th:nth-child(3),
      .items-table th:nth-child(4) {
        text-align: center;
      }
      .items-table th:nth-child(3),
      .items-table th:nth-child(4) {
        text-align: right;
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

        <h2>📋 Order Details</h2>
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

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

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 16px; color: #239488;">
            <strong>Thank you for choosing ${appName}!</strong><br>
            We hope you enjoy your meal. 🍽️
          </p>
          <p style="font-size: 14px; color: #666;">
            If you have any questions about your order, please contact us at 
            <a href="mailto:${supportEmail}" style="color: #239488;">${supportEmail}</a>
          </p>
        </div>
      </div>
      <div class="footer">
        <p>© ${currentYear} ${appName}. All rights reserved.</p>
        <p>
          <a href="mailto:${supportEmail}" style="color: #239488">${supportEmail}</a>
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
exports.getOrderConfirmationEmail = getOrderConfirmationEmail;
//# sourceMappingURL=order-confirmation.template.js.map