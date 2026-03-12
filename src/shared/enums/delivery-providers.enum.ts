/**
 * Enum para los proveedores externos disponibles
 * Puede representar cualquier tipo de proveedor de servicios externos
 */
export enum ExternalProviders {
  PROVIDER_1 = 1,
  PROVIDER_2 = 2,
  PROVIDER_3 = 3,
  PROVIDER_4 = 4,
  PROVIDER_5 = 5,
  PROVIDER_6 = 6,
}

/**
 * Mapeo de nombres de proveedores para display
 * Configura según los proveedores de tu aplicación
 */
export const ExternalProviderNames = {
  [ExternalProviders.PROVIDER_1]: 'Provider 1',
  [ExternalProviders.PROVIDER_2]: 'Provider 2',
  [ExternalProviders.PROVIDER_3]: 'Provider 3',
  [ExternalProviders.PROVIDER_4]: 'Provider 4',
  [ExternalProviders.PROVIDER_5]: 'Provider 5',
  [ExternalProviders.PROVIDER_6]: 'Provider 6',
} as const;

/**
 * Función helper para obtener el nombre del proveedor
 */
export function getExternalProviderName(providerId: ExternalProviders): string {
  return ExternalProviderNames[providerId] || 'Unknown Provider';
}

/**
 * Función helper para validar si un ID es un proveedor válido
 */
export function isValidExternalProvider(
  providerId: number,
): providerId is ExternalProviders {
  return Object.values(ExternalProviders).includes(
    providerId as ExternalProviders,
  );
}

// Backward compatibility aliases (opcional - remover si no es necesario)
export const DeliveryProviders = ExternalProviders;
export const DeliveryProviderNames = ExternalProviderNames;
export const getDeliveryProviderName = getExternalProviderName;
export const isValidDeliveryProvider = isValidExternalProvider;
