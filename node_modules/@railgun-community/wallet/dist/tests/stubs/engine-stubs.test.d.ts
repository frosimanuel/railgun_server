import { AddressData } from '@railgun-community/engine';
export declare const MOCK_SHIELD_TXID_FOR_BALANCES = "123";
export declare const MOCK_TOKEN_BALANCE: bigint;
export declare const createEngineWalletBalancesStub: (addressData: AddressData, tokenAddress: string, tree: number) => Promise<void>;
export declare const createEngineWalletTreeBalancesStub: (addressData: AddressData, tokenAddress: string, tree: number) => Promise<void>;
export declare const createEngineVerifyProofStub: () => void;
export declare const restoreEngineStubs: () => void;
