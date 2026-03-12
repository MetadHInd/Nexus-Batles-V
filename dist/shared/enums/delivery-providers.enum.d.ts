export declare enum ExternalProviders {
    PROVIDER_1 = 1,
    PROVIDER_2 = 2,
    PROVIDER_3 = 3,
    PROVIDER_4 = 4,
    PROVIDER_5 = 5,
    PROVIDER_6 = 6
}
export declare const ExternalProviderNames: {
    readonly 1: "Provider 1";
    readonly 2: "Provider 2";
    readonly 3: "Provider 3";
    readonly 4: "Provider 4";
    readonly 5: "Provider 5";
    readonly 6: "Provider 6";
};
export declare function getExternalProviderName(providerId: ExternalProviders): string;
export declare function isValidExternalProvider(providerId: number): providerId is ExternalProviders;
export declare const DeliveryProviders: typeof ExternalProviders;
export declare const DeliveryProviderNames: {
    readonly 1: "Provider 1";
    readonly 2: "Provider 2";
    readonly 3: "Provider 3";
    readonly 4: "Provider 4";
    readonly 5: "Provider 5";
    readonly 6: "Provider 6";
};
export declare const getDeliveryProviderName: typeof getExternalProviderName;
export declare const isValidDeliveryProvider: typeof isValidExternalProvider;
