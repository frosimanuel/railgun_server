import { Network, TXIDVersion } from '@railgun-community/shared-models';
import { ContractTransaction } from 'ethers';
export declare const extractFirstNoteERC20AmountMapFromTransactionRequest: (railgunWalletID: string, txidVersion: TXIDVersion, network: Network, transactionRequest: ContractTransaction, useRelayAdapt: boolean) => Promise<MapType<bigint>>;
