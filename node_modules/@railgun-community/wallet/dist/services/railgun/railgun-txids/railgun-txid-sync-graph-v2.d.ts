import { Chain, RailgunTransaction, RailgunTransactionV2 } from '@railgun-community/engine';
export declare const getRailgunTxDataForUnshields: (chain: Chain, txid: string) => Promise<{
    railgunTransaction: RailgunTransactionV2;
    railgunTxid: string;
}[]>;
export declare const getRailgunTxidsForUnshields: (chain: Chain, txid: string) => Promise<string[]>;
export declare const getRailgunTransactionDataForUnshieldToAddress: (chain: Chain, unshieldToAddress: string) => Promise<{
    txid: string;
    transactionDatas: {
        railgunTransaction: RailgunTransactionV2;
        railgunTxid: string;
    }[];
}[]>;
export declare const getRailgunTransactionsForTxid: (chain: Chain, txid: string) => Promise<RailgunTransaction[]>;
export declare const quickSyncRailgunTransactionsV2: (chain: Chain, latestGraphID: Optional<string>) => Promise<RailgunTransactionV2[]>;
