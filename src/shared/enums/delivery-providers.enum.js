"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDeliveryProvider = exports.getDeliveryProviderName = exports.DeliveryProviderNames = exports.DeliveryProviders = exports.ExternalProviderNames = exports.ExternalProviders = void 0;
exports.getExternalProviderName = getExternalProviderName;
exports.isValidExternalProvider = isValidExternalProvider;
/**
 * Enum para los proveedores externos disponibles
 * Puede representar cualquier tipo de proveedor de servicios externos
 */
var ExternalProviders;
(function (ExternalProviders) {
    ExternalProviders[ExternalProviders["PROVIDER_1"] = 1] = "PROVIDER_1";
    ExternalProviders[ExternalProviders["PROVIDER_2"] = 2] = "PROVIDER_2";
    ExternalProviders[ExternalProviders["PROVIDER_3"] = 3] = "PROVIDER_3";
    ExternalProviders[ExternalProviders["PROVIDER_4"] = 4] = "PROVIDER_4";
    ExternalProviders[ExternalProviders["PROVIDER_5"] = 5] = "PROVIDER_5";
    ExternalProviders[ExternalProviders["PROVIDER_6"] = 6] = "PROVIDER_6";
})(ExternalProviders || (exports.ExternalProviders = ExternalProviders = {}));
/**
 * Mapeo de nombres de proveedores para display
 * Configura según los proveedores de tu aplicación
 */
exports.ExternalProviderNames = (_a = {},
    _a[ExternalProviders.PROVIDER_1] = 'Provider 1',
    _a[ExternalProviders.PROVIDER_2] = 'Provider 2',
    _a[ExternalProviders.PROVIDER_3] = 'Provider 3',
    _a[ExternalProviders.PROVIDER_4] = 'Provider 4',
    _a[ExternalProviders.PROVIDER_5] = 'Provider 5',
    _a[ExternalProviders.PROVIDER_6] = 'Provider 6',
    _a);
/**
 * Función helper para obtener el nombre del proveedor
 */
function getExternalProviderName(providerId) {
    return exports.ExternalProviderNames[providerId] || 'Unknown Provider';
}
/**
 * Función helper para validar si un ID es un proveedor válido
 */
function isValidExternalProvider(providerId) {
    return Object.values(ExternalProviders).includes(providerId);
}
// Backward compatibility aliases (opcional - remover si no es necesario)
exports.DeliveryProviders = ExternalProviders;
exports.DeliveryProviderNames = exports.ExternalProviderNames;
exports.getDeliveryProviderName = getExternalProviderName;
exports.isValidDeliveryProvider = isValidExternalProvider;
