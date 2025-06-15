import { NetworkName } from '@railgun-community/shared-models';
/**
 * L2s don't manage gas prices in the same way. tx.gasprice (contract) is not necessarily the same value as transactionRequest.gasPrice (ethers).
 * Since overallBatchMinGasPrice is an optional parameter, we simply remove it for L2s. This will skip validation on the contract side.
 */
export declare const shouldSetOverallBatchMinGasPriceForNetwork: (sendWithPublicWallet: boolean, networkName: NetworkName) => boolean;
