import { Chain, RailgunTxidFromNullifiersResponse, TXIDVersion } from '@railgun-community/shared-models';
export declare const getCompletedTxidFromNullifiers: (txidVersion: TXIDVersion, chain: Chain, nullifiers: string[]) => Promise<RailgunTxidFromNullifiersResponse>;
