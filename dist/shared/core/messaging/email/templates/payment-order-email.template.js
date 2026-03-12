"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentOrderEmail = void 0;
const getPaymentOrderEmail = (to, context) => {
    const { customerName, orderNumber, orderDate, orderTime, guestNumber, groups, subtotal, deliveryPrice, taxValue, tipAmount = 0, total, deliveryAddress, cityName, stateName, countryName, branchName, branchAddress, branchPhone, orderStatus, estimatedDeliveryTime, appName, supportEmail, currentYear, currentPaymentUrl, includePaymentButton = true, restaurantName, discount, calculateDiscountAfterTaxes, isRefundEmail = false, refundAmount, originalTotal, isExtraQuoteEmail = false } = context;
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    let specialInfoBanner = '';
    if (isRefundEmail && refundAmount && originalTotal) {
        specialInfoBanner = `
      <div style="background-color: #E8F5E9; border: 3px solid #4CAF50; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
        <h2 style="color: #2E7D32; margin: 0 0 15px; font-size: 24px; font-weight: 800;">💰 Refund Processed</h2>
        <p style="color: #1B5E20; font-size: 16px; margin: 0 0 15px; line-height: 1.6;">
          A refund of <strong style="font-size: 20px; color: #2E7D32;">${formatCurrency(refundAmount)}</strong> has been processed for your order.
        </p>
        <div style="background-color: #F1F8E9; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #558B2F; font-weight: 600;">Original Total:</span>
            <span style="color: #558B2F; font-weight: 700;">${formatCurrency(originalTotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #2E7D32; font-weight: 600;">Refund Amount:</span>
            <span style="color: #2E7D32; font-weight: 700;">-${formatCurrency(refundAmount)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #4CAF50; padding-top: 10px; margin-top: 10px;">
            <span style="color: #1B5E20; font-weight: 800; font-size: 18px;">New Total:</span>
            <span style="color: #1B5E20; font-weight: 800; font-size: 18px;">${formatCurrency(total)}</span>
          </div>
        </div>
        <p style="color: #33691E; font-size: 14px; margin: 15px 0 0; font-style: italic;">
          The refund will be credited to your original payment method within 5-10 business days.
        </p>
      </div>
    `;
    }
    else if (isExtraQuoteEmail) {
        specialInfoBanner = `
      <div style="background-color: #FFF3E0; border: 3px solid #FF9800; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
        <h2 style="color: #E65100; margin: 0 0 15px; font-size: 24px; font-weight: 800;">💳 Additional Payment Required</h2>
        <p style="color: #BF360C; font-size: 16px; margin: 0 0 15px; line-height: 1.6;">
          Your order has been updated and requires an additional payment to complete.
        </p>
        <p style="color: #D84315; font-size: 14px; margin: 0; font-style: italic;">
          Please review the updated order details below and complete the payment to confirm your reservation.
        </p>
      </div>
    `;
    }
    const groupsHtml = groups
        .map((group) => `
        <div class="group-section">
          <div class="group-header">
            <h3 class="group-title">
              ${group.isGrouped ? '👥' : '🍽️'} ${group.groupName}
            </h3>
            <p class="group-subtitle">${group.isGrouped ? 'Group selection' : 'Individual items selection'}</p>
            ${group.variation
        ? `
              <div class="variation-info">
                <span class="variation-detail">Serves: ${group.variation.serves} people</span>
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
            Group Total: ${formatCurrency(group.groupTotal * (group.quantity || 1))}
          </div>
        </div>
      `)
        .join('');
    const paymentButtonHtml = includePaymentButton && currentPaymentUrl
        ? `
    <div class="payment-alert">
      <h3>Complete Your Payment</h3>
      <p>Click the button below to securely pay for your order and confirm your reservation.</p>
      <a href="${currentPaymentUrl}" class="payment-button" target="_blank" style="display: inline-block; background: #26A69A; color: white !important; padding: 15px 40px; text-decoration: none !important; border-radius: 8px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-left: 40px; border: 2px solid #1E8E80;">
        Pay Now - ${formatCurrency(total)}
      </a>
    </div>
  `
        : '';
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Order - ${appName}</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 700px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid #e0e0e0;
        position: relative;
      }
      .header {
        background: #26A69A;
        padding: 30px 20px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.15)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.15)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.4;
        animation: float 20s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      .logo {
        max-width: 140px;
        height: auto;
        position: relative;
        z-index: 2;
        filter: brightness(0) invert(1);
      }
      .header-title {
        color: white;
        font-size: 24px;
        font-weight: 700;
        margin: 15px 0 5px;
        position: relative;
        z-index: 2;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      .header-subtitle {
        color: rgba(255,255,255,0.95);
        font-size: 14px;
        margin: 0;
        position: relative;
        z-index: 2;
      }
      .content {
        padding: 60px 30px;
      }
      .avatar-container {
        margin-top: -80px;
        margin-bottom: 30px;
        position: relative;
        z-index: 3;
        text-align: center;
      }
      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 6px solid #ffffff;
        background: #26A69A;
        object-fit: cover;
        box-shadow: 0 8px 24px rgba(38, 166, 154, 0.3);
        transition: transform 0.3s ease;
      }
      .avatar:hover {
        transform: scale(1.05);
      }
      .main-title {
        color: #26A69A;
        margin: 0 0 10px;
        text-align: center;
        font-size: 32px;
        font-weight: 800;
      }
      .subtitle {
        text-align: center;
        font-size: 16px;
        color: #555;
        margin-bottom: 30px;
      }
      .payment-alert {
        background-color: #FFF8E1;
        border: 2px solid #FFC107;
        border-radius: 12px;
        padding: 20px;
        margin: 25px 0;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .payment-alert::before {
        content: '💳';
        font-size: 24px;
        position: absolute;
        top: 15px;
        left: 20px;
      }
      .payment-alert h3 {
        margin: 0 0 10px 40px;
        color: #E65100;
        font-size: 18px;
        font-weight: 700;
      }
      .payment-alert p {
        margin: 0 0 15px 40px;
        color: #BF360C;
        font-size: 14px;
      }
      .payment-button {
        display: inline-block;
        background: #26A69A !important;
        color: white !important;
        padding: 15px 40px;
        text-decoration: none !important;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(38, 166, 154, 0.3);
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-left: 40px;
        border: 2px solid #1E8E80;
      }
      .payment-button:hover {
        background: #1E8E80 !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(38, 166, 154, 0.4);
      }
      .payment-button:visited {
        color: white !important;
      }
      .payment-button:active {
        color: white !important;
      }
      .payment-button:link {
        color: white !important;
      }
      .order-summary {
        background-color: #FAFAFA;
        border: 2px solid #E0E0E0;
        border-radius: 12px;
        padding: 25px;
        margin: 25px 0;
        position: relative;
      }
      .order-summary::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #26A69A;
        border-radius: 12px 12px 0 0;
      }
      .order-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #E8E8E8;
      }
      .order-info:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      .order-info strong {
        color: #26A69A;
        font-weight: 600;
      }
      .order-info .value {
        color: #333;
        font-weight: 500;
      }
      .section-title {
        color: #26A69A;
        margin: 35px 0 20px;
        font-size: 22px;
        font-weight: 700;
        border-bottom: 3px solid #26A69A;
        padding-bottom: 8px;
        position: relative;
      }
      .section-title::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 60px;
        height: 3px;
        background: #1E8E80;
      }
      .group-section {
        background: #ffffff;
        border: 2px solid #E0F2F1;
        border-radius: 12px;
        margin: 20px 0;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: transform 0.2s ease;
      }
      .group-section:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      }
      .group-header {
        background: #26A69A;
        padding: 20px 25px;
        color: white;
        position: relative;
      }
      .group-title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
      .group-subtitle {
        margin: 5px 0 0;
        font-size: 14px;
        opacity: 0.95;
      }
      .variation-info {
        background: rgba(255,255,255,0.2);
        margin: 15px 0 0;
        padding: 12px 15px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(255,255,255,0.3);
      }
      .variation-detail {
        font-size: 14px;
        font-weight: 500;
      }
      .variation-price {
        font-size: 16px;
        font-weight: 700;
        background: rgba(255,255,255,0.3);
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.4);
      }
      .group-items {
        padding: 0;
      }
      .group-item {
        display: flex;
        align-items: center;
        padding: 18px 25px;
        border-bottom: 1px solid #F0F0F0;
        transition: background-color 0.2s ease;
      }
      .group-item:hover {
        background-color: #F8F9FA;
      }
      .group-item:last-child {
        border-bottom: none;
      }
      .item-info {
        flex: 1;
      }
      .item-name {
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
        text-transform: capitalize;
        letter-spacing: 0.2px;
      }
      .item-description {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
        font-style: italic;
      }
      .item-selections {
        margin-top: 8px;
      }
      .selection-tag {
        display: inline-block;
        background-color: #E0F2F1;
        color: #00695C;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        margin-right: 6px;
        margin-bottom: 4px;
        border: 1px solid #B2DFDB;
      }
      .item-quantity {
        width: 80px;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        color: #26A69A;
        background: #F0F8F7;
        padding: 8px;
        border-radius: 8px;
        margin: 0 15px;
        border: 1px solid #B2DFDB;
      }
      .item-price {
        width: 100px;
        text-align: right;
        color: #666;
        font-size: 14px;
        font-weight: 500;
      }
      .item-total {
        width: 100px;
        text-align: right;
        font-weight: 700;
        color: #26A69A;
        font-size: 16px;
      }
      .group-total {
        background-color: #F0F8F7;
        padding: 20px 25px;
        text-align: right;
        border-top: 2px solid #26A69A;
        color: #26A69A;
        font-size: 18px;
        font-weight: 700;
      }
      .totals-section {
        background-color: #F0F8F7;
        border: 2px solid #26A69A;
        border-radius: 12px;
        padding: 25px;
        margin: 25px 0;
      }
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px 0;
        font-size: 16px;
        color: #333;
      }
      .total-row.final {
        border-top: 3px solid #26A69A;
        margin-top: 20px;
        padding-top: 20px;
        font-size: 20px;
        font-weight: 800;
        color: #26A69A;
      }
      .info-section {
        background-color: #FFF8E1;
        border: 2px solid #FFC107;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      }
      .info-section h3 {
        margin: 0 0 15px;
        color: #E65100;
        font-size: 18px;
        font-weight: 700;
      }
      .info-section p {
        margin: 0;
        color: #BF360C;
        font-size: 14px;
        line-height: 1.5;
      }
      .branch-info {
        background-color: #E0F2F1;
        border: 2px solid #26A69A;
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
      }
      .branch-info h3 {
        margin: 0 0 15px;
        color: #00695C;
        font-size: 18px;
        font-weight: 700;
      }
      .branch-info p {
        margin: 0;
        color: #004D40;
        font-size: 14px;
        line-height: 1.5;
      }
      .footer {
        background-color: #37474F;
        padding: 30px 20px;
        text-align: center;
        color: white;
      }
      .footer p {
        margin: 5px 0;
        font-size: 12px;
        opacity: 0.9;
      }
      .footer a {
        color: #4DB6AC;
        text-decoration: none;
        font-weight: 600;
      }
      .status-badge {
        display: inline-block;
        background: #FFC107;
        color: #333;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
        border: 1px solid #FFB300;
      }
      .discount-row {
        background-color: #E8F5E8;
        border-radius: 8px;
        padding: 12px 15px;
        margin: 8px 0;
        border-left: 4px solid #4CAF50;
      }
      .discount-amount {
        color: #2E7D32;
        font-weight: 700;
      }
      .discount-timing {
        font-size: 12px;
        color: #666;
        font-weight: 400;
        font-style: italic;
        background-color: #F0F0F0;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 5px;
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
          text-align: center;
        }
        .total-row {
          flex-direction: column;
          text-align: center;
        }
        .group-item {
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .item-quantity, .item-price, .item-total {
          width: auto;
          text-align: left;
          margin: 5px 0;
        }
        .payment-button {
          margin-left: 0;
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="https://i0.wp.com/pincho.com/wp-content/uploads/2023/01/pincho-logo-site.png"
          alt="${appName} Logo"
          class="logo"
        />
        <h1 class="header-title">Payment Order</h1>
        <p class="header-subtitle">Complete your payment to confirm your order</p>
      </div>
      
      <div class="content">
        <div class="avatar-container">
          <img
            src="https://galatealabs.ai/assets/GALATEA_Profile_Pic.png"
            alt="GALATEA Avatar"
            class="avatar"
          />
        </div>
        
        <h1 class="main-title">${isRefundEmail ? '💰 Refund Processed' : isExtraQuoteEmail ? '💳 Additional Payment Required' : '💳 Payment Required'}</h1>
        <p class="subtitle">
          Hello <strong>${customerName}</strong>, ${isRefundEmail ? 'a refund has been processed for your order.' : isExtraQuoteEmail ? 'your order has been updated and requires additional payment.' : 'your order is ready for payment!'}
        </p>

        ${specialInfoBanner}

        ${paymentButtonHtml}

        <div class="order-summary">
          <div class="order-info">
            <span><strong>Order Number:</strong></span>
            <span class="value">#${orderNumber}</span>
          </div>
          <div class="order-info">
            <span><strong>Order Date:</strong></span>
            <span class="value">${orderDate}</span>
          </div>
          <div class="order-info">
            <span><strong>Status:</strong></span>
            <span class="status-badge">${orderStatus}</span>
          </div>
          <div class="order-info">
            <span><strong>Guests:</strong></span>
            <span class="value">${guestNumber} people</span>
          </div>
          <div class="order-info">
            <span><strong>Delivery Time:</strong></span>
            <span class="value">${estimatedDeliveryTime}</span>
          </div>
        </div>

        <h2 class="section-title">📋 Order Details</h2>
        ${groupsHtml}

        ${subtotal > 0 || deliveryPrice > 0 || taxValue > 0 || tipAmount > 0
        ? `
        <div class="totals-section">
          ${subtotal > 0
            ? `
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          `
            : ''}
          ${deliveryPrice > 0
            ? `
          <div class="total-row">
            <span>Delivery Fee:</span>
            <span>${formatCurrency(deliveryPrice)}</span>
          </div>
          `
            : ''}
          ${discount && discount > 0 && !calculateDiscountAfterTaxes
            ? `
          <div class="total-row discount-row">
            <span>Discount:</span>
            <span class="discount-amount">-${formatCurrency(discount)}</span>
          </div>
          `
            : ''}
          ${taxValue > 0
            ? `
          <div class="total-row">
            <span>Taxes:</span>
            <span>${formatCurrency(taxValue)}</span>
          </div>
          `
            : ''}
          ${discount && discount > 0 && calculateDiscountAfterTaxes
            ? `
          <div class="total-row discount-row">
            <span>Discount :</span>
            <span class="discount-amount">-${formatCurrency(discount)}</span>
          </div>
          `
            : ''}
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
        `
        : ''}

        ${deliveryAddress && deliveryAddress.trim()
        ? `
        <h2 class="section-title">🚚 Delivery Information</h2>
        <div class="info-section">
          <h3>Delivery Address</h3>
          <p>
            ${deliveryAddress}<br>
            ${cityName}, ${stateName}<br>
            ${countryName}
          </p>
        </div>
        `
        : ''}

        ${branchName && branchName.trim()
        ? `
        <h2 class="section-title">🏪 Restaurant Information</h2>
        <div class="branch-info">
          <h3>${branchName}</h3>
          <p>
            📍 ${branchAddress}<br>
            📞 ${branchPhone}
          </p>
        </div>
        `
        : ''}

        <div class="info-section">
          <h3>Important Notes</h3>
          <p>
            • Payment must be completed within 24 hours to secure your order<br>
            • Orders will be delivered at the specified time and address<br>
            • For questions, contact us at <a href="mailto:${supportEmail}" style="color: #26A69A; text-decoration: none; font-weight: 600;">${supportEmail}</a>
          </p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <p style="font-size: 18px; color: #26A69A; font-weight: 600;">
            <strong>Thank you for choosing ${appName}!</strong><br>
            We look forward to serving you. 🍽️
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p>© ${currentYear} ${appName}. All rights reserved.</p>
        <p>
          <a href="mailto:${supportEmail}">${supportEmail}</a>
        </p>
      </div>
    </div>
  </body>
</html>
`;
    let emailSubject = `Payment Order #${orderNumber} - ${branchName} Catering`;
    if (isRefundEmail) {
        emailSubject = `💰 Refund Processed - Order #${orderNumber}`;
    }
    else if (isExtraQuoteEmail) {
        emailSubject = `💳 Additional Payment Required - Order #${orderNumber}`;
    }
    return {
        to,
        subject: emailSubject,
        html,
        from: restaurantName
            ? `"${restaurantName} Catering" <${process.env.SMTP_USER || 'notifications@galatealabs.ai'}>`
            : `"GALATEA Catering" <${process.env.SMTP_USER || 'notifications@galatealabs.ai'}>`,
    };
};
exports.getPaymentOrderEmail = getPaymentOrderEmail;
//# sourceMappingURL=payment-order-email.template.js.map