import { MerkletreeScanUpdateEvent, NetworkName } from '@railgun-community/shared-models';
export declare const utxoMerkletreeHistoryScanCallback: (scanData: MerkletreeScanUpdateEvent) => void;
export declare const txidMerkletreeHistoryScanCallback: (scanData: MerkletreeScanUpdateEvent) => void;
export declare const clearAllMerkletreeScanStatus: () => void;
export declare const initTestEngine: (useNativeArtifacts?: boolean) => Promise<void>;
export declare const initTestEngineNetworks: (networkName?: NetworkName, mockConfig?: import("@railgun-community/shared-models").FallbackProviderJsonConfig) => Promise<void>;
export declare const closeTestEngine: () => Promise<void>;
export declare const pollUntilUTXOMerkletreeScanned: () => Promise<void>;
export declare const pollUntilTXIDMerkletreeScanned: () => Promise<void>;
