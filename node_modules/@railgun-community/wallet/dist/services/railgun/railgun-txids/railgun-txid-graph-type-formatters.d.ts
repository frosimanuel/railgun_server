import { RailgunTransactionV2 } from '@railgun-community/engine';
import { GetRailgunTransactionsAfterGraphIDQuery } from './graphql';
export type GraphRailgunTransactions = GetRailgunTransactionsAfterGraphIDQuery['transactions'];
export declare const formatRailgunTransactions: (txs: (Pick<import("./graphql").Transaction, "blockNumber" | "id" | "transactionHash" | "blockTimestamp" | "nullifiers" | "commitments" | "boundParamsHash" | "hasUnshield" | "utxoTreeIn" | "utxoTreeOut" | "utxoBatchStartPositionOut" | "unshieldToAddress" | "unshieldValue" | "verificationHash"> & {
    unshieldToken: Pick<import("./graphql").Token, "tokenType" | "tokenSubID" | "tokenAddress">;
})[]) => RailgunTransactionV2[];
