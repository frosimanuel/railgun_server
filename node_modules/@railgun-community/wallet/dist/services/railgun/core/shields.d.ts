import { NetworkName, TXIDVersion } from '@railgun-community/shared-models';
export type ShieldData = {
    txid: string;
    commitmentHash: string;
    npk: string;
    timestamp: Optional<number>;
    blockNumber: number;
    utxoTree: number;
    utxoIndex: number;
};
export declare const getAllShields: (networkName: NetworkName, startingBlock: number) => Promise<ShieldData[]>;
export declare const getShieldsForTXIDVersion: (txidVersion: TXIDVersion, networkName: NetworkName, startingBlock: number) => Promise<ShieldData[]>;
