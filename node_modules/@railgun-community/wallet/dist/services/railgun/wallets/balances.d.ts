import { Chain } from '@railgun-community/engine';
export declare const refreshBalances: (chain: Chain, walletIdFilter: Optional<string[]>) => Promise<void>;
export declare const rescanFullUTXOMerkletreesAndWallets: (chain: Chain, walletIdFilter: Optional<string[]>) => Promise<void>;
export declare const resetFullTXIDMerkletreesV2: (chain: Chain) => Promise<void>;
