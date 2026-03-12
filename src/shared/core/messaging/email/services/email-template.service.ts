// src/shared/core/messaging/email/services/email-template.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Servicio para manejo de plantillas de correo electrónico
 */
@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);
  private readonly templateCache: Map<string, string> = new Map();
  private readonly templateDir: string;

  constructor() {
    // Determinar la ruta de las plantillas
    this.templateDir =
      process.env.EMAIL_TEMPLATES_DIR || path.resolve('templates/email');

    // Asegurar que el directorio existe
    try {
      if (!fs.existsSync(this.templateDir)) {
        fs.mkdirSync(this.templateDir, { recursive: true });
        this.logger.log(
          `Created email templates directory: ${this.templateDir}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Could not create email templates directory: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene una plantilla HTML y reemplaza las variables con los datos proporcionados
   * @param templateName Nombre de la plantilla (sin extensión)
   * @param data Datos para reemplazar variables en la plantilla
   * @returns HTML de la plantilla con las variables reemplazadas
   */
  async render(
    templateName: string,
    data: Record<string, any> = {},
  ): Promise<string> {
    try {
      // Log para depuración
      this.logger.debug(
        `Rendering template: ${templateName} with data: ${JSON.stringify(data)}`,
      );

      // Intentar obtener plantilla del caché
      let template = this.templateCache.get(templateName);

      // Si no está en caché, cargar del archivo
      if (!template) {
        this.logger.debug(`Template not in cache, loading from file`);
        template = await this.loadTemplate(templateName);
        this.templateCache.set(templateName, template);
      }

      // Reemplazar variables
      const result = this.replaceVariables(template, data);
      this.logger.debug(`Template rendered successfully`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error rendering template '${templateName}': ${error.message}`,
        error.stack,
      );

      // En vez de fallar, retornar una plantilla genérica de error
      return `
        <html>
          <body>
            <h1>Error al cargar la plantilla</h1>
            <p>No se pudo cargar la plantilla: ${templateName}</p>
            <p>Error: ${error.message}</p>
            <hr>
            <p>Los datos proporcionados fueron:</p>
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </body>
        </html>
      `;
    }
  }

  /**
   * Carga una plantilla HTML desde el sistema de archivos
   * @param templateName Nombre de la plantilla (sin extensión)
   * @returns Contenido de la plantilla
   */
  private async loadTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = path.join(this.templateDir, `${templateName}.html`);
      this.logger.debug(`Loading template from ${templatePath}`);

      const template = await fs.promises.readFile(templatePath, 'utf8');
      this.logger.debug(`Loaded template '${templateName}' successfully`);
      return template;
    } catch (error) {
      // Si no encuentra la plantilla, intentar usar una plantilla por defecto
      if (error.code === 'ENOENT') {
        this.logger.warn(
          `Template '${templateName}' not found, using default template`,
        );
        return this.getDefaultTemplate();
      }
      this.logger.error(
        `Error loading template '${templateName}': ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Reemplaza las variables en la plantilla con los datos proporcionados
   * @param template Plantilla HTML con variables en formato {{variable}}
   * @param data Datos para reemplazar las variables
   * @returns Plantilla con las variables reemplazadas
   */
  private replaceVariables(
    template: string,
    data: Record<string, any>,
  ): string {
    // Agregar algunas variables estándar si no existen
    const enhancedData = {
      currentYear: new Date().getFullYear(),
      appName: process.env.EMAIL_APP_NAME || 'Texel Sync',
      company: process.env.EMAIL_DEFAULT_COMPANY || 'Texel Bit SAS',
      supportEmail: process.env.EMAIL_SUPPORT_EMAIL || 'support@texelbit.com',
      companyAddress:
        process.env.EMAIL_COMPANY_ADDRESS || 'Texel Bit SAS, Colombia',
      ...data,
    };

    // Reemplazar las variables en formato {{variable}}
    return template.replace(/{{(\w+)}}/g, (match, key) => {
      return enhancedData[key] !== undefined
        ? String(enhancedData[key])
        : match;
    });
  }

  /**
   * Retorna una plantilla HTML por defecto
   * @returns Plantilla HTML básica
   */
  private getDefaultTemplate(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; }
        .header { text-align: center; padding: 10px; background: linear-gradient(90deg, #6125a7 0%, #000000 100%); color: white; }
        .content { padding: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; padding: 10px; background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            {{content}}
        </div>
        <div class="footer">
            <p>© {{currentYear}} {{company}}. Todos los derechos reservados.</p>
            <p>{{companyAddress}}<br>
            <a href="mailto:{{supportEmail}}">{{supportEmail}}</a></p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Limpia el caché de plantillas
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logger.debug('Template cache cleared');
  }

  /**
   * Guarda una plantilla en el sistema de archivos
   * @param templateName Nombre de la plantilla (sin extensión)
   * @param content Contenido HTML de la plantilla
   */
  async saveTemplate(templateName: string, content: string): Promise<void> {
    try {
      const templatePath = path.join(this.templateDir, `${templateName}.html`);
      await fs.promises.writeFile(templatePath, content, 'utf8');

      // Actualizar el caché
      this.templateCache.set(templateName, content);

      this.logger.log(
        `Template '${templateName}' saved successfully to ${templatePath}`,
      );
    } catch (error) {
      this.logger.error(
        `Error saving template '${templateName}': ${error.message}`,
      );
      throw new Error(`Failed to save email template: ${error.message}`);
    }
  }

  /**
   * Lista todas las plantillas disponibles
   * @returns Lista de nombres de plantillas (sin extensión)
   */
  async listTemplates(): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(this.templateDir);

      // Filtrar solo archivos HTML y quitar la extensión
      return files
        .filter((file) => file.endsWith('.html'))
        .map((file) => file.replace('.html', ''));
    } catch (error) {
      this.logger.error(`Error listing templates: ${error.message}`);
      return [];
    }
  }
}
