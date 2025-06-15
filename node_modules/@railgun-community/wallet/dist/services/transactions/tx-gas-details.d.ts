import { RailgunTransactionGasEstimateResponse, NetworkName, CommitmentSummary, TransactionGasDetails, TXIDVersion } from '@railgun-community/shared-models';
import { ContractTransaction } from 'ethers';
export declare const getGasEstimate: (txidVersion: TXIDVersion, networkName: NetworkName, transaction: ContractTransaction, fromWalletAddress: string, sendWithPublicWallet: boolean, isCrossContractCall: boolean) => Promise<bigint>;
export declare const gasEstimateResponse: (gasEstimate: bigint, broadcasterFeeCommitment: Optional<CommitmentSummary>, isGasEstimateWithDummyProof: boolean) => RailgunTransactionGasEstimateResponse;
export declare const setGasDetailsForTransaction: (networkName: NetworkName, transaction: ContractTransaction, gasDetails: TransactionGasDetails, sendWithPublicWallet: boolean) => void;
