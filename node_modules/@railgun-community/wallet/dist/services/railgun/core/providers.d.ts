import { NetworkName } from '@railgun-community/shared-models';
import { PollingJsonRpcProvider } from '@railgun-community/engine';
import { FallbackProvider } from 'ethers';
export declare const fallbackProviderMap: MapType<FallbackProvider>;
export declare const pollingProviderMap: MapType<PollingJsonRpcProvider>;
export declare const getFallbackProviderForNetwork: (networkName: NetworkName) => FallbackProvider;
export declare const getPollingProviderForNetwork: (networkName: NetworkName) => PollingJsonRpcProvider;
export declare const setFallbackProviderForNetwork: (networkName: NetworkName, provider: FallbackProvider) => void;
export declare const setPollingProviderForNetwork: (networkName: NetworkName, provider: PollingJsonRpcProvider) => void;
