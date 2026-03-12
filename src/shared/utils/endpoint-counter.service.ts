import { Injectable } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';

export interface EndpointInfo {
  controller: string;
  method: string;
  path: string;
  httpMethod: string;
  fullPath: string;
}

export interface EndpointStats {
  totalEndpoints: number;
  endpointsByController: Record<string, number>;
  endpointsByHttpMethod: Record<string, number>;
  endpointsByModule: Record<string, number>;
  allEndpoints: EndpointInfo[];
  lastUpdated: string;
}

@Injectable()
export class EndpointCounterService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Cuenta todos los endpoints de la aplicación
   */
  countEndpoints(): EndpointStats {
    const endpoints: EndpointInfo[] = [];
    const controllerCounts: Record<string, number> = {};
    const httpMethodCounts: Record<string, number> = {};
    const moduleCounts: Record<string, number> = {};

    // Iterar sobre todos los módulos
    for (const [moduleName, moduleRef] of this.modulesContainer.entries()) {
      const controllers = moduleRef.controllers;

      // Iterar sobre todos los controladores del módulo
      for (const [, controllerWrapper] of controllers.entries()) {
        if (!controllerWrapper.metatype) continue;

        const controllerInstance = controllerWrapper.instance;
        if (!controllerInstance) continue;

        const controllerPath =
          this.reflector.get(PATH_METADATA, controllerWrapper.metatype) || '';
        const controllerDisplayName = controllerWrapper.metatype.name;

        // Contar endpoints por módulo
        const moduleDisplayName = this.getModuleDisplayName(moduleName);
        moduleCounts[moduleDisplayName] = moduleCounts[moduleDisplayName] || 0;

        // Obtener todos los métodos del controlador
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const prototype = Object.getPrototypeOf(controllerInstance);
        const methodNames = Object.getOwnPropertyNames(prototype).filter(
          (name) =>
            name !== 'constructor' &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            typeof prototype[name] === 'function',
        );

        for (const methodName of methodNames) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const httpMethod = this.reflector.get(
            METHOD_METADATA,
            prototype[methodName],
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const methodPath = this.reflector.get(
            PATH_METADATA,
            prototype[methodName],
          );

          if (httpMethod && methodPath !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const fullPath = this.buildFullPath(controllerPath, methodPath);

            // Manejar el caso donde httpMethod puede ser un array o string
            let httpMethodString: string;
            if (Array.isArray(httpMethod)) {
              httpMethodString =
                this.mapHttpMethodToString(httpMethod[0]) || 'UNKNOWN';
            } else if (typeof httpMethod === 'string') {
              httpMethodString = httpMethod.toUpperCase();
            } else {
              httpMethodString = this.mapHttpMethodToString(httpMethod);
            }

            const endpointInfo: EndpointInfo = {
              controller: controllerDisplayName,
              method: methodName,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              path: methodPath,
              httpMethod: httpMethodString,
              fullPath: fullPath,
            };

            endpoints.push(endpointInfo);

            // Contar por controlador
            controllerCounts[controllerDisplayName] =
              (controllerCounts[controllerDisplayName] || 0) + 1;

            // Contar por método HTTP
            httpMethodCounts[httpMethodString] =
              (httpMethodCounts[httpMethodString] || 0) + 1;

            // Incrementar contador del módulo
            moduleCounts[moduleDisplayName]++;
          }
        }
      }
    }

    return {
      totalEndpoints: endpoints.length,
      endpointsByController: controllerCounts,
      endpointsByHttpMethod: httpMethodCounts,
      endpointsByModule: moduleCounts,
      allEndpoints: endpoints.sort((a, b) =>
        a.controller.localeCompare(b.controller),
      ),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Obtiene estadísticas resumidas
   */
  getEndpointSummary(): {
    total: number;
    byHttpMethod: Record<string, number>;
    topControllers: Array<{ name: string; count: number }>;
    lastUpdated: string;
  } {
    const stats = this.countEndpoints();

    // Top 10 controladores con más endpoints
    const topControllers = Object.entries(stats.endpointsByController)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      total: stats.totalEndpoints,
      byHttpMethod: stats.endpointsByHttpMethod,
      topControllers,
      lastUpdated: stats.lastUpdated,
    };
  }

  /**
   * Construye la ruta completa del endpoint
   */
  private buildFullPath(controllerPath: string, methodPath: string): string {
    const basePath = controllerPath.startsWith('/')
      ? controllerPath
      : `/${controllerPath}`;

    if (!methodPath || methodPath === '') {
      return basePath;
    }

    const cleanMethodPath = methodPath.startsWith('/')
      ? methodPath
      : `/${methodPath}`;
    return `${basePath}${cleanMethodPath}`.replace(/\/+/g, '/');
  }

  /**
   * Obtiene un nombre legible para el módulo
   */
  private getModuleDisplayName(moduleName: string): string {
    // Limpiar el nombre del módulo para hacerlo más legible
    if (moduleName.includes('Module')) {
      return moduleName
        .replace('Module', '')
        .replace(/([A-Z])/g, ' $1')
        .trim();
    }
    return moduleName;
  }

  /**
   * Busca endpoints por término
   */
  searchEndpoints(searchTerm: string): EndpointInfo[] {
    const stats = this.countEndpoints();
    const term = searchTerm.toLowerCase();

    return stats.allEndpoints.filter(
      (endpoint) =>
        endpoint.controller.toLowerCase().includes(term) ||
        endpoint.method.toLowerCase().includes(term) ||
        endpoint.fullPath.toLowerCase().includes(term) ||
        endpoint.httpMethod.toLowerCase().includes(term),
    );
  }

  /**
   * Mapea números de métodos HTTP a strings
   */
  private mapHttpMethodToString(httpMethod: any): string {
    // NestJS usa constantes numéricas para los métodos HTTP
    const methodMap: Record<number, string> = {
      0: 'GET',
      1: 'POST',
      2: 'PUT',
      3: 'DELETE',
      4: 'PATCH',
      5: 'ALL',
      6: 'OPTIONS',
      7: 'HEAD',
    };

    if (typeof httpMethod === 'number') {
      return methodMap[httpMethod] || 'UNKNOWN';
    }

    if (typeof httpMethod === 'string') {
      return httpMethod.toUpperCase();
    }

    return 'UNKNOWN';
  }
}
