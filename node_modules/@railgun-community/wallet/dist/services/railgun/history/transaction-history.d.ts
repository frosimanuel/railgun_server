import { Chain } from '@railgun-community/engine';
import { TransactionHistoryItem, TransactionHistoryItemCategory } from '@railgun-community/shared-models';
export declare const categoryForTransactionHistoryItem: (historyItem: TransactionHistoryItem) => TransactionHistoryItemCategory;
export declare const getWalletTransactionHistory: (chain: Chain, railgunWalletID: string, startingBlock: Optional<number>) => Promise<TransactionHistoryItem[]>;
