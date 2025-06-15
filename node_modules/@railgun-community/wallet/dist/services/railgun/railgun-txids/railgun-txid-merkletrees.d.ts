import { NetworkName, TXIDVersion } from '@railgun-community/shared-models';
export declare const validateRailgunTxidMerkleroot: (txidVersion: TXIDVersion, networkName: NetworkName, tree: number, index: number, merkleroot: string) => Promise<boolean>;
export declare const validateRailgunTxidOccurredBeforeBlockNumber: (txidVersion: TXIDVersion, networkName: NetworkName, tree: number, index: number, blockNumber: number) => Promise<boolean>;
export declare const validateRailgunTxidExists: (txidVersion: TXIDVersion, networkName: NetworkName, railgunTxid: string) => Promise<boolean>;
export declare const getGlobalUTXOTreePositionForRailgunTransactionCommitment: (txidVersion: TXIDVersion, networkName: NetworkName, tree: number, index: number, commitmentHash: string) => Promise<number>;
export declare const syncRailgunTransactionsV2: (networkName: NetworkName) => Promise<void>;
export declare const fullResetTXIDMerkletreesV2: (networkName: NetworkName) => Promise<void>;
export declare const resetRailgunTxidsAfterTxidIndex: (txidVersion: TXIDVersion, networkName: NetworkName, txidIndex: number) => Promise<void>;
export declare const getLatestRailgunTxidData: (txidVersion: TXIDVersion, networkName: NetworkName) => Promise<{
    txidIndex: number;
    merkleroot: string;
}>;
export declare const getRailgunTxidMerkleroot: (txidVersion: TXIDVersion, networkName: NetworkName, tree: number, index: number) => Promise<Optional<string>>;
