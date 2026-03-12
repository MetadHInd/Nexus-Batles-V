import { Injectable, Logger } from '@nestjs/common';
import * as htmlPdf from 'html-pdf-node';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export interface OrderPdfData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  guestNumber: number;
  comment?: string;
  dietaryRestrictions?: string[];
  groups: OrderGroupPdf[];
  subtotal: number;
  deliveryPrice: number;
  discount?: number; // 🆕 Monto del descuento
  discountAppliedAfterTax?: boolean; // 🆕 Si el descuento se aplicó después de impuestos
  taxValue: number;
  tipAmount?: number;
  total: number;
  deliveryAddress: string;
  cityName: string;
  stateName: string;
  countryName: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  orderStatus: string;
  estimatedDeliveryTime: string;
  appName: string;
  restaurantName?: string;
  restaurantImageUrl?: string;
  deliveryType?: string; // Optional field for delivery type
}

export interface OrderGroupPdf {
  groupName: string;
  isGrouped: boolean;
  groupTotal: number;
  variationId?: number;
  quantity?: number; // Add quantity field for groups
  variation?: {
    id: number;
    name: string;
    price: number;
    serves: number;
  };
  items: OrderItemPdf[];
}

export interface OrderItemPdf {
  name: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  description?: string;
  selections?: string[];
  customComment?: string; // 🆕 Comentario personalizado del item
}

// 🧾 INTERFACES FOR US INVOICE PDF
export interface CustomerInvoicePdfData {
  // Company Information
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  companyLogo?: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;

  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  billingAddress: string;
  cityName: string;
  stateName: string;
  zipCode?: string;
  countryName: string;

  // Order Information
  orderNumber: string;
  orderDate: string;
  orderTime: string;

  // Grouped Items (like order groups)
  itemGroups?: InvoiceItemGroup[];
  // Legacy line items (fallback)
  lineItems: InvoiceLineItem[];

  // Totals
  subtotal: number;
  deliveryFee?: number;
  discount?: number; // 🆕 Monto del descuento
  discountAppliedAfterTax?: boolean; // 🆕 Si el descuento se aplicó después de impuestos
  taxRate?: number;
  taxAmount: number;
  tipAmount?: number;
  total: number;

  // Payment Information
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;

  // Additional Information
  notes?: string;
  deliveryType?: string;
}

export interface InvoiceItemGroup {
  groupName: string;
  groupPrice: number;
  quantity: number;
  variation?: {
    name: string;
    serves: number;
  };
  categories: InvoiceCategory[];
}

export interface InvoiceCategory {
  categoryName: string;
  items: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customComment?: string; // 🆕 Comentario personalizado del item
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly debugMode = process.env.PDF_DEBUG_MODE === 'true';
  private readonly debugPath = path.join(process.cwd(), 'debug-pdfs');
  private readonly gmailPdfsPath = path.join(process.cwd(), 'gmail-pdfs');

  constructor() {
    // Crear directorios de debug si no existen
    if (this.debugMode) {
      if (!fs.existsSync(this.debugPath)) {
        fs.mkdirSync(this.debugPath, { recursive: true });
      }
      if (!fs.existsSync(this.gmailPdfsPath)) {
        fs.mkdirSync(this.gmailPdfsPath, { recursive: true });
      }
    }
  }

  /**
   * Get Puppeteer launch options that work across all environments
   * - Local: Uses downloaded Chromium
   * - Docker/Production: Uses system Chromium via PUPPETEER_EXECUTABLE_PATH
   * - Dev server: Uses system Chromium if available
   */
  private getPuppeteerArgs(): string[] {
    return [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ];
  }

  /**
   * 🌐 Convierte una URL a PDF usando Puppeteer (específico para Gmail Receiver)
   * Evita detección de Cloudflare y otros anti-bot
   * 
   * @param url URL de la orden a convertir
   * @param orderId ID de la orden (opcional)
   * @returns Buffer del PDF generado
   */
  async convertUrlToPdfForGmail(url: string, orderId?: string): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;

    try {
      this.logger.log(`🌐 Iniciando conversión de URL a PDF: ${url}`);

      // Configuración de Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: this.getPuppeteerArgs(),
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      });

      const page = await browser.newPage();

      // Configurar User Agent realista
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Configurar headers adicionales
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      });

      // Configurar viewport AMPLIO para capturar todo el contenido
      await page.setViewport({
        width: 1200, // Ancho similar a A4 (8.27 pulgadas * 96 DPI ≈ 794px, pero usamos 1200 para mejor calidad)
        height: 1600, // Altura inicial
        deviceScaleFactor: 1,
      });

      // Navegar a la URL
      this.logger.log(`📡 Navegando a: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Esperar a que se cargue el contenido real (no el challenge de Cloudflare)
      await this.waitForRealContentGmail(page, url);

      // Volver al inicio para la captura del PDF
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      // Esperar estabilización
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Inyectar CSS para forzar que todo el contenido sea visible en PDF
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.textContent = `
          @media print {
            * {
              overflow: visible !important;
              max-height: none !important;
              height: auto !important;
            }
            body, html {
              overflow: visible !important;
              height: auto !important;
            }
            /* Forzar que contenedores fixed/absolute se comporten como static para PDF */
            div[class*="fixed"], div[class*="absolute"] {
              position: relative !important;
            }
          }
        `;
        document.head.appendChild(style);
      });

      // Generar PDF capturando toda la página con paginación automática
      this.logger.log('📄 Generando PDF con paginación automática...');
      
      const pdfBuffer = await page.pdf({
        format: 'Letter', // Formato US Letter (más común en USA que A4)
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        scale: 1,
        preferCSSPageSize: false,
        pageRanges: '', // Todas las páginas
      });

      this.logger.log(`✅ PDF generado exitosamente (${pdfBuffer.length} bytes)`);

      const buffer = Buffer.from(pdfBuffer);

      // Guardar PDF en modo debug
      if (this.debugMode && orderId) {
        await this.savePdfForDebugGmail(buffer, orderId, url);
      }

      return buffer;
    } catch (error) {
      this.logger.error(
        `❌ Error convirtiendo URL a PDF: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Espera a que se cargue el contenido real de la página
   * Detecta y espera a que pase el challenge de Cloudflare
   */
  private async waitForRealContentGmail(
    page: puppeteer.Page,
    url: string,
  ): Promise<void> {
    try {
      // Verificar si hay un challenge de Cloudflare
      const hasChallenge = await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return (
          text.includes('cloudflare') ||
          text.includes('verificar') ||
          text.includes('checking your browser') ||
          text.includes('verify you are human')
        );
      });

      if (hasChallenge) {
        this.logger.warn('⚠️ Cloudflare challenge detectado, esperando...');
        
        // Esperar hasta 30 segundos a que desaparezca el challenge
        const maxWaitTime = 30000;
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          const stillHasChallenge = await page.evaluate(() => {
            const text = document.body.innerText.toLowerCase();
            return (
              text.includes('cloudflare') ||
              text.includes('verificar') ||
              text.includes('checking your browser')
            );
          });
          
          if (!stillHasChallenge) {
            this.logger.log('✅ Challenge superado');
            break;
          }
        }
      }

      // Para ezcater específicamente, esperar elementos clave
      if (url.includes('ezcater.com')) {
        this.logger.log('🍽️ Esperando contenido de ezcater...');
        
        try {
          // Esperar por cualquiera de estos selectores que indican contenido real
          await Promise.race([
            page.waitForSelector('.order-details', { timeout: 15000 }),
            page.waitForSelector('[class*="Order"]', { timeout: 15000 }),
            page.waitForSelector('table', { timeout: 15000 }),
            page.waitForFunction(
              () => document.body.innerText.length > 500,
              { timeout: 15000 }
            ),
          ]);
          
          this.logger.log('✅ Contenido de orden detectado');
        } catch (error) {
          this.logger.warn('⚠️ No se detectaron selectores específicos, continuando...');
        }
      }

      // Esperar adicional para contenido dinámico
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Scroll progresivo para cargar todo el contenido lazy-load
      this.logger.log('📜 Realizando scroll progresivo para cargar todo el contenido...');
      
      await page.evaluate(async () => {
        // Función para hacer scroll suave y progresivo
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 300; // Pixels a scrollear cada vez
          const delay = 100; // Delay entre scrolls (ms)
          
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            // Si llegamos al final, esperar un poco más y terminar
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              // Esperar a que cargue cualquier contenido adicional
              setTimeout(resolve, 1000);
            }
          }, delay);
        });
      });
      
      this.logger.log('✅ Scroll completado - Todo el contenido cargado');
      
      this.logger.log('✅ Página lista para generar PDF');
    } catch (error) {
      this.logger.warn(`⚠️ Advertencia esperando contenido: ${error.message}`);
    }
  }

  /**
   * Calcula las dimensiones reales del contenido de la página
   * IMPORTANTE: Esta función debe llamarse MIENTRAS la página está scrolleada
   * para poder calcular correctamente window.scrollY
   */
  private async getPageDimensions(page: puppeteer.Page): Promise<{ width: number; height: number }> {
    const dimensions = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      
      // PASO 1: Hacer scroll hasta el final para obtener scrollY máximo
      window.scrollTo(0, document.body.scrollHeight);
      
      // PASO 2: Calcular altura máxima de todos los elementos
      let maxBottom = 0;
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        // Ignorar elementos ocultos o con display:none
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          return;
        }
        
        // Calcular posición absoluta en el documento
        const absoluteBottom = rect.bottom + window.scrollY;
        
        if (absoluteBottom > maxBottom) {
          maxBottom = absoluteBottom;
        }
      });
      
      // También considerar el scrollHeight del body y html
      const scrollBasedHeight = Math.max(
        html.scrollHeight,
        html.offsetHeight,
        html.clientHeight,
        body.scrollHeight,
        body.offsetHeight,
        body.clientHeight
      );
      
      return {
        width: Math.max(
          html.scrollWidth,
          html.offsetWidth,
          html.clientWidth,
          body.scrollWidth,
          body.offsetWidth,
          body.clientWidth,
          1920
        ),
        // Usar el mayor valor entre scrollHeight y la posición del elemento más bajo
        // Agregar 200px extra de margen para asegurar que no se corte nada
        height: Math.max(maxBottom, scrollBasedHeight) + 200
      };
    });

    this.logger.log(`📐 Dimensiones de la página: ${dimensions.width}x${dimensions.height}px`);
    return dimensions;
  }

  /**
   * Guarda el PDF en disco para debugging (Gmail specific)
   */
  private async savePdfForDebugGmail(
    pdfBuffer: Buffer,
    orderId: string,
    url?: string,
  ): Promise<void> {
    try {
      const filename = `order-debug-${orderId}-${new Date().toISOString().split('T')[0]}.pdf`;
      const filepath = path.join(this.debugPath, filename);

      fs.writeFileSync(filepath, pdfBuffer);

      this.logger.log(`🐛 PDF guardado para debug: ${filepath}`);
      this.logger.log(`📄 Tamaño: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
      if (url) {
        this.logger.log(`🔗 URL origen: ${url}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error guardando PDF para debug: ${error.message}`);
    }
  }

  async generateOrderPdf(orderData: OrderPdfData): Promise<Buffer> {
    try {
      console.log('=== PDF SERVICE DEBUG ===');
      console.log('Order number:', orderData.orderNumber);
      console.log(
        'PUPPETEER_EXECUTABLE_PATH:',
        process.env.PUPPETEER_EXECUTABLE_PATH || 'not set (using bundled)',
      );
      console.log('========================');

      const html = this.generateOrderHtml(orderData);

      const options = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        },
        args: this.getPuppeteerArgs(),
      };

      const file = { content: html };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const pdfBuffer = await (htmlPdf as any).generatePdf(file, options);

      this.logger.log(
        `PDF generated successfully for order #${orderData.orderNumber}`,
      );
      return pdfBuffer as Buffer;
    } catch (error: unknown) {
      this.logger.error(
        `Error generating PDF for order #${orderData.orderNumber}:`,
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate PDF: ${errorMessage}`);
    }
  }

  /**
   * 🧾 Generate US-style customer invoice PDF
   */
  async generateCustomerInvoicePdf(
    invoiceData: CustomerInvoicePdfData,
  ): Promise<Buffer> {
    try {
      this.logger.log(
        `🧾 Generating customer invoice PDF for order #${invoiceData.orderNumber}`,
      );
      console.log('=== INVOICE PDF SERVICE DEBUG ===');
      console.log('Invoice number:', invoiceData.invoiceNumber);
      console.log('Invoice data keys:', Object.keys(invoiceData));
      console.log('Item groups count:', invoiceData.itemGroups?.length || 0);
      console.log('Line items count:', invoiceData.lineItems?.length || 0);
      console.log(
        'PUPPETEER_EXECUTABLE_PATH:',
        process.env.PUPPETEER_EXECUTABLE_PATH || 'not set (using bundled)',
      );
      console.log('=================================');

      const html = this.generateInvoiceHtml(invoiceData);
      console.log('✅ Invoice HTML generated, length:', html.length);

      const options = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15px',
          bottom: '15px',
          left: '20px',
          right: '20px',
        },
        args: this.getPuppeteerArgs(),
      };

      console.log('📄 Calling html-pdf-node with options...');
      const file = { content: html };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const pdfBuffer = await (htmlPdf as any).generatePdf(file, options);

      this.logger.log(
        `🧾 Customer invoice PDF generated successfully for order #${invoiceData.orderNumber}`,
      );
      return pdfBuffer as Buffer;
    } catch (error: unknown) {
      this.logger.error(
        `❌ Error generating customer invoice PDF for order #${invoiceData.orderNumber}:`,
        error,
      );
      console.error('❌ Full error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to generate customer invoice PDF: ${errorMessage}`,
      );
    }
  }

  private generateOrderHtml(data: OrderPdfData): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const capitalizeFirst = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const safeDeliveryType = data.deliveryType || 'delivery';
    const formatPhone = (phone: string) => {
      // Remove all non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      // Format as (xxx) xxx-xxxx
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      // Return original if not 10 digits
      return phone;
    };

    // Generar HTML para cada grupo con checkboxes
    const groupsHtml = data.groups
      .map(
        (group) => `
          <div class="group-section">
            <div class="group-header">
              ${
                group.quantity && group.quantity > 1
                  ? `
                <div class="group-title-only">
                  <label class="group-title">
                    ${group.isGrouped ? '👥' : '🍽️'} ${group.groupName} (x${group.quantity})
                    ${group.variation ? ` - ${group.variation.name}` : ''}
                  </label>
                </div>
                <div class="multiple-checkboxes">
                  ${Array.from(
                    { length: group.quantity },
                    (_, i) => `
                    <div class="checkbox-item">
                      <input type="checkbox" class="group-checkbox" />
                    </div>
                  `,
                  ).join('')}
                </div>
              `
                  : `
                <div class="checkbox-container">
                  <input type="checkbox" class="group-checkbox" />
                  <label class="group-title">
                    ${group.isGrouped ? '👥' : '🍽️'} ${group.groupName}
                    ${group.variation ? ` - ${group.variation.name}` : ''}
                  </label>
                </div>
              `
              }
              ${
                group.variation
                  ? `
                <div class="variation-info">
                  <span class="variation-detail">Serves: ${group.variation.serves} people</span>
                  <span class="variation-price">${formatCurrency(group.variation.price)}</span>
                </div>
              `
                  : ''
              }
            </div>
            
            <div class="group-items">
              ${group.items
                .map(
                  (item) => `
                    <div class="group-item">
                      <div class="item-checkbox-container">
                        <input type="checkbox" class="item-checkbox" />
                        <div class="item-info">
                          <div class="item-name">${item.name}</div>
                          ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                          ${
                            item.selections && item.selections.length > 0
                              ? `
                            <div class="item-selections">
                              ${item.selections.map((selection) => `<span class="selection-tag">${selection}</span>`).join('')}
                            </div>
                          `
                              : ''
                          }
                          ${item.customComment ? `<div class="item-description" style="color: #26A69A; font-style: normal; font-weight: bold; margin-top: 4px;">📝 ${item.customComment}</div>` : ''}
                        </div>
                      </div>
                      <div class="item-quantity">×${item.quantity}</div>
                      <div class="item-price">${formatCurrency(item.unitPrice)}</div>
                      <div class="item-total">${formatCurrency(item.totalValue)}</div>
                    </div>
                  `,
                )
                .join('')}
            </div>
            
            <div class="group-total">
              Group Total: ${formatCurrency(group.groupTotal * (group.quantity || 1))}
            </div>
          </div>
        `,
      )
      .join('');

    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Checklist #${data.orderNumber}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background: white;
      }
      
      .container {
        max-width: 100%;
        margin: 0;
        padding: 20px;
      }
      
      .header {
        margin-bottom: 30px;
        border-bottom: 2px solid #26A69A;
        padding-bottom: 20px;
      }
      
      .header-logos {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      
      .logo-left, .logo-right {
        flex: 0 0 120px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .header-content {
        flex: 1;
        text-align: center;
        padding: 0 20px;
      }
      
      .logo-img {
        max-width: 100px;
        max-height: 60px;
        object-fit: contain;
      }
      
      .logo-placeholder {
        width: 100px;
        height: 60px;
        border: 2px dashed #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #999;
        text-align: center;
      }
      
      .header h1 {
        color: #26A69A;
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .header h2 {
        color: #666;
        font-size: 16px;
        font-weight: normal;
      }
      
      .order-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 30px;
      }
      
      .info-section {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }
      
      .info-section h3 {
        color: #26A69A;
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: bold;
        border-bottom: 1px solid #26A69A;
        padding-bottom: 5px;
      }
      
      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      
      .info-row strong {
        color: #26A69A;
        font-weight: bold;
      }
      
      .status-badge {
        background: #28a745;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .section-title {
        color: #26A69A;
        font-size: 16px;
        font-weight: bold;
        margin: 25px 0 15px;
        border-bottom: 2px solid #26A69A;
        padding-bottom: 5px;
      }
      
      .group-section {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
        page-break-inside: avoid;
      }
      
      .group-header {
        background: #f8f9fa;
        padding: 15px;
        border-bottom: 1px solid #e9ecef;
      }
      
      .checkbox-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .group-checkbox {
        width: 16px;
        height: 16px;
        margin-right: 10px;
        accent-color: #26A69A;
      }
      
      .group-title {
        font-size: 14px;
        font-weight: bold;
        color: #26A69A;
        cursor: pointer;
      }

      .group-title-only {
        margin-bottom: 10px;
      }

      .multiple-checkboxes {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 8px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        background: #f8f9fa;
        padding: 6px 10px;
        border-radius: 4px;
        border: 1px solid #e9ecef;
      }

      
      .variation-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #e3f2fd;
        padding: 8px 12px;
        border-radius: 4px;
        margin-top: 8px;
      }
      
      .variation-detail {
        font-size: 12px;
        color: #666;
      }
      
      .variation-price {
        font-weight: bold;
        color: #26A69A;
      }
      
      .group-items {
        padding: 0;
      }
      
      .group-item {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        border-bottom: 1px solid #f0f0f0;
      }
      
      .group-item:last-child {
        border-bottom: none;
      }
      
      .item-checkbox-container {
        display: flex;
        align-items: flex-start;
        flex: 1;
      }
      
      .item-checkbox {
        width: 14px;
        height: 14px;
        margin-right: 10px;
        margin-top: 2px;
        accent-color: #26A69A;
      }
      
      .item-info {
        flex: 1;
      }
      
      .item-name {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 4px;
      }
      
      .item-description {
        font-size: 10px;
        color: #666;
        font-style: italic;
        margin-bottom: 4px;
      }
      
      .item-selections {
        margin-top: 4px;
      }
      
      .selection-tag {
        display: inline-block;
        background: #e3f2fd;
        color: #1976d2;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 9px;
        margin-right: 4px;
        margin-bottom: 2px;
      }
      
      .item-quantity {
        width: 60px;
        text-align: center;
        font-weight: bold;
        color: #26A69A;
        background: #f0f8f7;
        padding: 4px;
        border-radius: 4px;
        margin: 0 10px;
      }
      
      .item-price {
        width: 70px;
        text-align: right;
        color: #666;
        font-size: 11px;
      }
      
      .item-total {
        width: 70px;
        text-align: right;
        font-weight: bold;
        color: #26A69A;
      }
      
      .group-total {
        background: #f0f8f7;
        padding: 12px 15px;
        text-align: right;
        border-top: 1px solid #26A69A;
        color: #26A69A;
        font-weight: bold;
      }
      
      .totals-section {
        background: #f0f8f7;
        border: 2px solid #26A69A;
        border-radius: 8px;
        padding: 20px;
        margin: 25px 0;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
      }
      
      .total-row.final {
        border-top: 2px solid #26A69A;
        margin-top: 15px;
        padding-top: 15px;
        font-size: 16px;
        font-weight: bold;
        color: #26A69A;
      }
      
      .delivery-type-highlight {
        background: linear-gradient(135deg, #26A69A, #4DB6AC);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 25px;
        box-shadow: 0 4px 8px rgba(38, 166, 154, 0.3);
        position: relative;
        overflow: hidden;
      }
      
      .delivery-type-highlight::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        animation: shimmer 3s ease-in-out infinite;
      }
      
      @keyframes shimmer {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(180deg); }
      }
      
      .delivery-type-highlight h2 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: relative;
        z-index: 1;
      }
      
      .delivery-type-badge {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.5);
        padding: 8px 20px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 1;
      }

      .footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
        text-align: center;
        font-size: 10px;
        color: #666;
      }
      
      .signature-section {
        margin-top: 40px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
      }
      
      .signature-box {
        border: 1px solid #ccc;
        padding: 20px;
        text-align: center;
        border-radius: 4px;
      }
      
      .signature-box h4 {
        margin-bottom: 30px;
        color: #26A69A;
      }
      
      .signature-line {
        border-bottom: 1px solid #333;
        margin-bottom: 10px;
        height: 40px;
      }
      
      @media print {
        .container {
          padding: 10px;
        }
        
        .group-section {
          page-break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="header-logos">
          <div class="logo-left">
            <img src="https://galatealabs.ai/assets/galatea-logo.png" alt="GALATEA Logo" class="logo-img" />
          </div>
          <div class="header-content">
            <h1>📋 ORDER CHECKLIST</h1>
            <h2>Order #${data.orderNumber} - ${data.restaurantName || 'GALATEA'} Catering</h2>
          </div>
          <div class="logo-right">
            ${
              data.restaurantImageUrl
                ? `<img src="${data.restaurantImageUrl}" alt="Restaurant Logo" class="logo-img" />`
                : '<div class="logo-placeholder">Restaurant Logo</div>'
            }
          </div>
        </div>
      </div>
      
      <!-- Delivery Type Highlight Section -->
      <div class="delivery-type-highlight">
        <h2>🚀 ${capitalizeFirst(safeDeliveryType)} Order</h2>
        <div class="delivery-type-badge">${capitalizeFirst(safeDeliveryType)}</div>
      </div>
      
      <div class="order-info-grid">
        <div class="info-section">
          <h3>📋 Order Information</h3>
          <div class="info-row">
            <span><strong>Order Number:</strong></span>
            <span>#${data.orderNumber}</span>
          </div>
          <div class="info-row">
            <span><strong>Order Date:</strong></span>
            <span>${data.orderDate}</span>
          </div>
          <div class="info-row">
            <span><strong>Status:</strong></span>
            <span class="status-badge">${data.orderStatus}</span>
          </div>
          <div class="info-row">
            <span><strong>Guests:</strong></span>
            <span>${data.guestNumber} people</span>
          </div>
          <div class="info-row">
            <span><strong>${capitalizeFirst(safeDeliveryType)} Time:</strong></span>
            <span>${data.estimatedDeliveryTime}</span>
          </div>
        </div>
        
        <div class="info-section">
          <h3>👤 Customer Information</h3>
          <div class="info-row">
            <span><strong>Name:</strong></span>
            <span>${data.customerName}</span>
          </div>
          <div class="info-row">
            <span><strong>Email:</strong></span>
            <span>${data.customerEmail}</span>
          </div>
          ${
            data.customerPhone
              ? `
          <div class="info-row">
            <span><strong>Phone:</strong></span>
            <span>${formatPhone(data.customerPhone)}</span>
          </div>
          `
              : ''
          }
        </div>
      </div>
      
      ${
        data.deliveryType === 'delivery'
          ? `
      <div class="info-section">
        <h3>🚚 Delivery Information</h3>
        <div class="info-row">
          <span><strong>Address:</strong></span>
          <span>${data.deliveryAddress}</span>
        </div>
        <div class="info-row">
          <span><strong>City:</strong></span>
          <span>${data.cityName}, ${data.stateName}</span>
        </div>
        <div class="info-row">
          <span><strong>Country:</strong></span>
          <span>${data.countryName}</span>
        </div>
      </div>
      `
          : ''
      }
      
      ${
        (data.comment && data.comment.trim()) ||
        (data.dietaryRestrictions && data.dietaryRestrictions.length > 0)
          ? `
      <div class="info-section" style="margin-top: 25px;">
        <h3>📝 Special Instructions</h3>
        ${
          data.comment && data.comment.trim()
            ? `
        <div class="info-row">
          <span><strong>Comments:</strong></span>
          <span><strong>${data.comment}</strong></span>
        </div>
        `
            : ''
        }
        ${
          data.dietaryRestrictions && data.dietaryRestrictions.length > 0
            ? `
        <div class="info-row">
          <span><strong>Dietary Restrictions:</strong></span>
          <span><strong>${data.dietaryRestrictions.join(', ')}</strong></span>
        </div>
        `
            : ''
        }
      </div>
      `
          : ''
      }
      
      <h2 class="section-title">📋 Order Items Checklist</h2>
      ${groupsHtml}
      
      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(data.subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Delivery Fee:</span>
          <span>${formatCurrency(data.deliveryPrice)}</span>
        </div>
        ${
          !data.discountAppliedAfterTax && data.discount && data.discount > 0
            ? `
        <div class="total-row" style="color: #28a745; font-weight: bold;">
          <span>Discount (applied before tax):</span>
          <span>-${formatCurrency(data.discount)}</span>
        </div>
        `
            : ''
        }
        <div class="total-row">
          <span>Taxes:</span>
          <span>${formatCurrency(data.taxValue)}</span>
        </div>
        ${
          data.discountAppliedAfterTax && data.discount && data.discount > 0
            ? `
        <div class="total-row" style="color: #28a745; font-weight: bold;">
          <span>Discount (applied after tax):</span>
          <span>-${formatCurrency(data.discount)}</span>
        </div>
        `
            : ''
        }
        ${
          data.tipAmount && data.tipAmount > 0
            ? `
        <div class="total-row">
          <span>Tip:</span>
          <span>${formatCurrency(data.tipAmount)}</span>
        </div>
        `
            : ''
        }
        <div class="total-row final">
          <span>Total Amount:</span>
          <span>${formatCurrency(data.total)}</span>
        </div>
      </div>
      
      <div class="signature-section">
        <div class="signature-box">
          <h4>Prepared By</h4>
          <div class="signature-line"></div>
          <p>Signature & Date</p>
        </div>
        <div class="signature-box">
          <h4>Quality Check</h4>
          <div class="signature-line"></div>
          <p>Signature & Date</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>${data.branchName}</strong></p>
        <p>📍 ${data.branchAddress} | 📞 ${data.branchPhone}</p>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  </body>
</html>
    `;
  }

  /**
   * 🧾 Generate grouped items HTML for invoice
   */
  private generateGroupedItemsHtml(
    itemGroups: InvoiceItemGroup[],
    formatCurrency: (amount: number) => string,
  ): string {
    if (!itemGroups || itemGroups.length === 0) {
      return this.generateLineItemsHtml([], formatCurrency);
    }

    return `
      <div class="grouped-items-container">
        ${itemGroups
          .map(
            (group) => `
          <div class="invoice-group-section">
            <div class="invoice-group-header">
              <h3 class="invoice-group-title">
                🍽️ ${group.groupName}
                ${group.quantity > 1 ? ` (x${group.quantity})` : ''}
                ${group.variation ? ` - ${group.variation.name}` : ''}
              </h3>
              <div class="invoice-group-price">${formatCurrency(group.groupPrice)}</div>
            </div>
            
            ${group.categories
              .map(
                (category) => `
              <div class="invoice-category-section">
                <table class="category-items-table">
                  <thead>
                    <tr>
                      <th class="description">Item</th>
                      <th class="quantity">Qty</th>
                      <th class="unit-price">Price</th>
                      <th class="line-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${category.items
                      .map(
                        (item) => `
                      <tr class="line-item">
                        <td class="description">
                          ${item.description}
                          ${item.customComment ? `<br><small style="color: #666; font-style: italic;">📝 ${item.customComment}</small>` : ''}
                        </td>
                        <td class="quantity">${item.quantity}</td>
                        <td class="unit-price">${formatCurrency(item.unitPrice)}</td>
                        <td class="line-total">${formatCurrency(item.total)}</td>
                      </tr>
                    `,
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `,
              )
              .join('')}
            
            <div class="invoice-group-total">
              <strong>Group Total: ${formatCurrency(group.groupPrice * group.quantity)}</strong>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  /**
   * 🧾 Generate fallback line items HTML for invoice
   */
  private generateLineItemsHtml(
    lineItems: InvoiceLineItem[],
    formatCurrency: (amount: number) => string,
  ): string {
    const itemsHtml = lineItems
      .map(
        (item) => `
        <tr class="line-item">
          <td class="description">
            ${item.description}
            ${item.customComment ? `<br><small style="color: #666; font-style: italic;">📝 ${item.customComment}</small>` : ''}
          </td>
          <td class="quantity">${item.quantity}</td>
          <td class="unit-price">${formatCurrency(item.unitPrice)}</td>
          <td class="line-total">${formatCurrency(item.total)}</td>
        </tr>
      `,
      )
      .join('');

    return `
      <table class="line-items-table">
        <thead>
          <tr>
            <th class="description">Description</th>
            <th class="quantity">Qty</th>
            <th class="unit-price">Unit Price</th>
            <th class="line-total">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    `;
  }

  /**
   * 🧾 Generate US-style invoice HTML
   */
  private generateInvoiceHtml(data: CustomerInvoicePdfData): string {
    const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
    const formatPhone = (phone: string) => {
      // Remove all non-digit characters
      const cleaned = phone.replace(/\D/g, '');
      // Format as (xxx) xxx-xxxx
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      // Return original if not 10 digits
      return phone;
    };

    // Generate HTML for grouped items (preferred) or fallback to line items
    const itemsHtml =
      data.itemGroups && data.itemGroups.length > 0
        ? this.generateGroupedItemsHtml(data.itemGroups, formatCurrency)
        : this.generateLineItemsHtml(data.lineItems, formatCurrency);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${data.invoiceNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background-color: #fff;
        }
        
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 20px;
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 10px;
        }
        
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .company-details {
            font-size: 11px;
            color: #666;
            line-height: 1.3;
        }
        
        .invoice-title {
            text-align: right;
            flex: 0 0 auto;
        }
        
        .invoice-title h1 {
            font-size: 36px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .invoice-meta {
            font-size: 11px;
            color: #666;
        }
        
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        
        .bill-to, .invoice-info {
            flex: 1;
        }
        
        .invoice-info {
            text-align: right;
            margin-left: 40px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .detail-row {
            margin-bottom: 4px;
            font-size: 11px;
        }
        
        .detail-label {
            font-weight: bold;
            color: #555;
        }
        
        .line-items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .line-items-table th {
            background-color: #2c3e50;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .line-items-table th.quantity,
        .line-items-table th.unit-price,
        .line-items-table th.line-total {
            text-align: right;
            width: 80px;
        }
        
        .line-items-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 11px;
        }
        
        .line-items-table td.quantity,
        .line-items-table td.unit-price,
        .line-items-table td.line-total {
            text-align: right;
        }
        
        .line-item:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .totals-table {
            width: 300px;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 12px;
        }
        
        .total-row.subtotal {
            border-top: 1px solid #ddd;
        }
        
        .total-row.final {
            border-top: 2px solid #2c3e50;
            border-bottom: 3px double #2c3e50;
            font-weight: bold;
            font-size: 14px;
            color: #2c3e50;
            margin-top: 5px;
            padding: 12px 0;
        }
        
        .payment-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .payment-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .payment-status.paid {
            background-color: #d4edda;
            color: #155724;
        }
        
        .payment-status.pending {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .grouped-items-container {
            margin-bottom: 20px;
        }
        
        .invoice-group-section {
            margin-bottom: 25px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .invoice-group-header {
            background-color: #f8f9fa;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
        }
        
        .invoice-group-title {
            font-size: 14px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
        }
        
        .invoice-group-price {
            font-size: 14px;
            font-weight: bold;
            color: #27ae60;
        }
        
        .invoice-category-section {
            padding: 10px 15px;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .invoice-category-section:last-child {
            border-bottom: none;
        }
        
        .invoice-category-title {
            font-size: 12px;
            font-weight: bold;
            color: #666;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .category-items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }
        
        .category-items-table th {
            background-color: #f8f9fa;
            padding: 6px 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            color: #555;
            border: 1px solid #dee2e6;
        }
        
        .category-items-table th.quantity,
        .category-items-table th.unit-price,
        .category-items-table th.line-total {
            text-align: right;
            width: 60px;
        }
        
        .category-items-table td {
            padding: 6px 8px;
            border: 1px solid #dee2e6;
        }
        
        .category-items-table td.quantity,
        .category-items-table td.unit-price,
        .category-items-table td.line-total {
            text-align: right;
        }
        
        .invoice-group-total {
            background-color: #e8f5e8;
            padding: 10px 15px;
            text-align: right;
            color: #27ae60;
            font-size: 12px;
        }
        
        .notes-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
        
        @media print {
            body { margin: 0; }
            .invoice-container { max-width: none; margin: 0; padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-info">
                ${data.companyLogo ? `<img src="${data.companyLogo}" alt="${data.companyName} Logo" class="company-logo">` : ''}
                <div class="company-name">${data.companyName}</div>
                <div class="company-details">
                    ${data.companyAddress}<br>
                    Phone: ${formatPhone(data.companyPhone)}<br>
                    ${data.companyEmail ? `Email: ${data.companyEmail}` : ''}
                </div>
            </div>
            <div class="invoice-title">
                <div style="margin-top: 15px; text-align: center;">
                    <img src="https://galatealabs.ai/assets/galatea-logo.png" alt="GALATEA Logo" style="max-width: 80px; height: auto; margin-bottom: 5px;" />
                    <div style="font-size: 10px; color: #666;">Invoice Generated by GALATEA Technology</div>
                </div>
            </div>
        </div>
        
        <!-- Invoice Details -->
        <div class="invoice-details">
            <div class="bill-to">
                <div class="section-title">Bill To:</div>
                <div class="detail-row"><strong>${data.customerName}</strong></div>
                <div class="detail-row">${data.billingAddress}</div>
                <div class="detail-row">${data.cityName}, ${data.stateName} ${data.zipCode || ''}</div>
                <div class="detail-row">${data.countryName}</div>
                <div class="detail-row">Email: ${data.customerEmail}</div>
                ${data.customerPhone ? `<div class="detail-row">Phone: ${formatPhone(data.customerPhone)}</div>` : ''}
            </div>
            <div class="invoice-info">
                <div class="section-title">Order Information:</div>
                <div class="detail-row"><span class="detail-label">Order #:</span> ${data.orderNumber}</div>
                <div class="detail-row"><span class="detail-label">Order Date:</span> ${data.orderDate}</div>
                <div class="detail-row"><span class="detail-label">Order Time:</span> ${data.orderTime}</div>
                ${data.deliveryType ? `<div class="detail-row"><span class="detail-label">Service Type:</span> ${data.deliveryType}</div>` : ''}
            </div>
        </div>
        
        <!-- Line Items -->
        ${itemsHtml}
        
        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-table">
                <div class="total-row subtotal">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(data.subtotal)}</span>
                </div>
                ${
                  data.deliveryFee && data.deliveryFee > 0
                    ? `
                <div class="total-row">
                    <span>Delivery Fee:</span>
                    <span>${formatCurrency(data.deliveryFee)}</span>
                </div>
                `
                    : ''
                }
                ${
                  data.discount && data.discount > 0
                    ? `
                <div class="total-row">
                    <span>Discount${data.discountAppliedAfterTax ? ' (Applied After Tax)' : ' (Applied Before Tax)'}:</span>
                    <span>-${formatCurrency(data.discount)}</span>
                </div>
                `
                    : ''
                }
                ${
                  data.taxAmount > 0
                    ? `
                <div class="total-row">
                    <span>Tax${data.taxRate ? ` (${data.taxRate}%)` : ''}:</span>
                    <span>${formatCurrency(data.taxAmount)}</span>
                </div>
                `
                    : ''
                }
                ${
                  data.tipAmount && data.tipAmount > 0
                    ? `
                <div class="total-row">
                    <span>Tip:</span>
                    <span>${formatCurrency(data.tipAmount)}</span>
                </div>
                `
                    : ''
                }
                <div class="total-row final">
                    <span>Total Amount:</span>
                    <span>${formatCurrency(data.total)}</span>
                </div>
            </div>
        </div>
        
        <!-- Payment Information -->
        <div class="payment-info">
            <div class="section-title">Payment Information:</div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span> ${data.paymentMethod}
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Status:</span> 
                <span class="payment-status ${data.paymentStatus.toLowerCase()}">${data.paymentStatus}</span>
            </div>
            ${
              data.transactionId
                ? `
            <div class="detail-row">
                <span class="detail-label">Transaction ID:</span> ${data.transactionId}
            </div>
            `
                : ''
            }
        </div>
        
        <!-- Notes -->
        ${
          data.notes
            ? `
        <div class="notes-section">
            <div class="section-title">Notes:</div>
            <div style="font-size: 11px; line-height: 1.4;">${data.notes}</div>
        </div>
        `
            : ''
        }
        
        <!-- Footer -->
        <div class="footer">
            <img src="https://galatealabs.ai/assets/galatea-logo.png" alt="GALATEA Logo" style="max-width: 40px; height: auto; margin-bottom: 5px;" />
            <p style="margin: 0; font-size: 9px; color: #888;">Powered by GALATEA Technology - Invoice generated on ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * 🧾 Transform v2 order details to invoice data structure
   */
  transformOrderDetailsV2ToInvoiceData(
    orderDetails: any,
    invoiceNumber: string,
    transactionId?: string,
    restaurantData?: any,
  ): CustomerInvoicePdfData {
    const orderInfo = orderDetails.get_order_details.OrderInfo;
    const paymentInfo = orderDetails.get_order_details.PaymentInfo;
    const customerInfo = orderDetails.get_order_details.CustomerInfo;
    const deliveryInfo = orderDetails.get_order_details.DeliveryInfo;

    // Process groups into structured format
    const itemGroups: InvoiceItemGroup[] = [];
    const fallbackLineItems: InvoiceLineItem[] = [];

    // Group items by category from the structured data
    const categoryMap = new Map<string, InvoiceLineItem[]>();

    if (orderInfo.groups) {
      for (const group of orderInfo.groups) {
        // Create invoice group
        const invoiceGroup: InvoiceItemGroup = {
          groupName: group.group_name,
          groupPrice: group.price || 0,
          quantity: group.quantity || 1,
          variation: group.variation_name
            ? {
                name: group.variation_name,
                serves: group.quantity || 1,
              }
            : undefined,
          categories: [],
        };

        // Process items in this group
        if (group.items) {
          for (const item of group.items) {
            const lineItem: InvoiceLineItem = {
              description: item.comment || 'Menu Item',
              quantity: item.quantity || 1,
              unitPrice: item.price || 0,
              total: item.total_value || 0,
              customComment: item.custom_item_comment || undefined, // 🆕 Custom comment del item
            };

            // Try to determine category (fallback to generic category)
            const categoryKey = `Category ${group.category_id || 'Unknown'}`;

            if (!categoryMap.has(categoryKey)) {
              categoryMap.set(categoryKey, []);
            }
            categoryMap.get(categoryKey)!.push(lineItem);

            // Also add to fallback
            fallbackLineItems.push(lineItem);
          }
        }

        // Convert category map to categories array
        invoiceGroup.categories = Array.from(categoryMap.entries()).map(
          ([categoryName, items]) => ({
            categoryName,
            items,
          }),
        );

        itemGroups.push(invoiceGroup);
        categoryMap.clear(); // Reset for next group
      }
    }

    // Add delivery fee as line item if exists
    const deliveryFee = deliveryInfo?.delivery_price || 0;
    if (deliveryFee > 0) {
      fallbackLineItems.push({
        description: 'Delivery Service',
        quantity: 1,
        unitPrice: deliveryFee,
        total: deliveryFee,
      });
    }

    return {
      // Company Information
      companyName: restaurantData?.restaurantName || 'Restaurant',
      companyAddress: orderInfo.branch_name || 'Restaurant Address',
      companyPhone: restaurantData?.phone || 'No phone',
      companyEmail: restaurantData?.email || undefined,
      companyLogo:
        restaurantData?.restaurantimageurl ||
        'https://galatealabs.ai/assets/galatea-logo.png',

      // Invoice Details
      invoiceNumber,
      invoiceDate: new Date().toLocaleDateString('en-US'),

      // Customer Information
      customerName: customerInfo.customer_name || 'Customer',
      customerEmail: customerInfo.customer_email || '',
      customerPhone: customerInfo.customer_phone,
      billingAddress: customerInfo.customer_address || 'No address',
      cityName: 'City', // Extract from customer_address if needed
      stateName: 'State', // Extract from customer_address if needed
      countryName: 'USA',

      // Order Information
      orderNumber: orderInfo.order_id_visible || orderInfo.order_id.toString(),
      orderDate: new Date(orderInfo.order_date).toLocaleDateString('en-US'),
      orderTime: orderInfo.order_time || '',

      // Structured items (preferred)
      itemGroups: itemGroups.length > 0 ? itemGroups : undefined,
      // Fallback line items
      lineItems: fallbackLineItems,

      // Totals (fix calculations)
      subtotal: paymentInfo.subtotal || 0,
      deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
      discount: paymentInfo.discount || undefined, // 🆕 Descuento
      discountAppliedAfterTax: paymentInfo.calculate_discount_after_taxes || false, // 🆕 Si el descuento es después de impuestos
      taxRate: paymentInfo.tax_percent,
      taxAmount: paymentInfo.tax_price || 0, // Fix: use tax_price instead of 0
      tipAmount: paymentInfo.tip || 0,
      total: paymentInfo.total || 0,

      // Payment Information
      paymentMethod: 'Credit Card (Stripe)',
      paymentStatus: paymentInfo.payment_status === 'Paid' ? 'PAID' : 'PENDING',
      transactionId,

      // Additional Information
      notes: orderInfo.comment
        ? `Order Notes: ${orderInfo.comment}`
        : undefined,
      deliveryType: deliveryInfo?.delivery_type || 'delivery',
    };
  }
}



