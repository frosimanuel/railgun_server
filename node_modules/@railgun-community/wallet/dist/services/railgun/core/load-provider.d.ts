import { FallbackProviderJsonConfig, LoadProviderResponse, NetworkName } from '@railgun-community/shared-models';
/**
 * Note: The first provider listed in your fallback provider config is used as a polling provider
 * for new RAILGUN events (balance updates).
 */
export declare const loadProvider: (fallbackProviderJsonConfig: FallbackProviderJsonConfig, networkName: NetworkName, pollingInterval?: number) => Promise<LoadProviderResponse>;
export declare const unloadProvider: (networkName: NetworkName) => Promise<void>;
export declare const pauseAllPollingProviders: (excludeNetworkName?: NetworkName) => void;
export declare const resumeIsolatedPollingProviderForNetwork: (networkName: NetworkName) => void;
