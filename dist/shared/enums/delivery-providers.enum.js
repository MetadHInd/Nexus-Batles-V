"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDeliveryProvider = exports.getDeliveryProviderName = exports.DeliveryProviderNames = exports.DeliveryProviders = exports.ExternalProviderNames = exports.ExternalProviders = void 0;
exports.getExternalProviderName = getExternalProviderName;
exports.isValidExternalProvider = isValidExternalProvider;
var ExternalProviders;
(function (ExternalProviders) {
    ExternalProviders[ExternalProviders["PROVIDER_1"] = 1] = "PROVIDER_1";
    ExternalProviders[ExternalProviders["PROVIDER_2"] = 2] = "PROVIDER_2";
    ExternalProviders[ExternalProviders["PROVIDER_3"] = 3] = "PROVIDER_3";
    ExternalProviders[ExternalProviders["PROVIDER_4"] = 4] = "PROVIDER_4";
    ExternalProviders[ExternalProviders["PROVIDER_5"] = 5] = "PROVIDER_5";
    ExternalProviders[ExternalProviders["PROVIDER_6"] = 6] = "PROVIDER_6";
})(ExternalProviders || (exports.ExternalProviders = ExternalProviders = {}));
exports.ExternalProviderNames = {
    [ExternalProviders.PROVIDER_1]: 'Provider 1',
    [ExternalProviders.PROVIDER_2]: 'Provider 2',
    [ExternalProviders.PROVIDER_3]: 'Provider 3',
    [ExternalProviders.PROVIDER_4]: 'Provider 4',
    [ExternalProviders.PROVIDER_5]: 'Provider 5',
    [ExternalProviders.PROVIDER_6]: 'Provider 6',
};
function getExternalProviderName(providerId) {
    return exports.ExternalProviderNames[providerId] || 'Unknown Provider';
}
function isValidExternalProvider(providerId) {
    return Object.values(ExternalProviders).includes(providerId);
}
exports.DeliveryProviders = ExternalProviders;
exports.DeliveryProviderNames = exports.ExternalProviderNames;
exports.getDeliveryProviderName = getExternalProviderName;
exports.isValidDeliveryProvider = isValidExternalProvider;
//# sourceMappingURL=delivery-providers.enum.js.map