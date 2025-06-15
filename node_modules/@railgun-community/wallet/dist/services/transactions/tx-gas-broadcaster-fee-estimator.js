"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasEstimateResponseDummyProofIterativeBroadcasterFee = exports.calculateBroadcasterFeeERC20Amount = void 0;
const engine_1 = require("@railgun-community/engine");
const shared_models_1 = require("@railgun-community/shared-models");
const tx_generator_1 = require("./tx-generator");
const tx_gas_details_1 = require("./tx-gas-details");
const balance_update_1 = require("../railgun/wallets/balance-update");
const wallets_1 = require("../railgun/wallets/wallets");
const MAX_ITERATIONS_BROADCASTER_FEE_REESTIMATION = 5;
const calculateBroadcasterFeeERC20Amount = (feeTokenDetails, gasDetails) => {
    const tokenFeePerUnitGas = BigInt(feeTokenDetails.feePerUnitGas);
    const oneUnitGas = 10n ** 18n;
    const maximumGas = (0, shared_models_1.calculateMaximumGas)(gasDetails);
    const tokenFee = (tokenFeePerUnitGas * maximumGas) / oneUnitGas;
    return {
        tokenAddress: feeTokenDetails.tokenAddress,
        amount: tokenFee,
    };
};
exports.calculateBroadcasterFeeERC20Amount = calculateBroadcasterFeeERC20Amount;
const getBroadcasterFeeCommitment = (transactionStructs) => {
    const transactionIndex = 0;
    const broadcasterFeeCommitment = transactionStructs[transactionIndex];
    const broadcasterFeeCommitmentIndex = 0;
    return (0, engine_1.convertTransactionStructToCommitmentSummary)(broadcasterFeeCommitment, broadcasterFeeCommitmentIndex);
};
const gasEstimateResponseDummyProofIterativeBroadcasterFee = async (generateDummyTransactionStructsWithBroadcasterFee, generateTransaction, txidVersion, networkName, railgunWalletID, erc20AmountRecipients, originalGasDetails, feeTokenDetails, sendWithPublicWallet, isCrossContractCall) => {
    const wallet = (0, wallets_1.walletForID)(railgunWalletID);
    // Use dead address for private transaction gas estimate
    const fromWalletAddress = tx_generator_1.DUMMY_FROM_ADDRESS;
    const isGasEstimateWithDummyProof = true;
    const dummyBroadcasterFee = feeTokenDetails
        ? (0, tx_generator_1.createDummyBroadcasterFeeERC20Amount)(feeTokenDetails.tokenAddress)
        : undefined;
    let serializedTransactions = await generateDummyTransactionStructsWithBroadcasterFee(dummyBroadcasterFee);
    let transaction = await generateTransaction(serializedTransactions);
    let gasEstimate = await (0, tx_gas_details_1.getGasEstimate)(txidVersion, networkName, transaction, fromWalletAddress, sendWithPublicWallet, isCrossContractCall);
    if (sendWithPublicWallet) {
        return (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, undefined, // broadcasterFeeCommitment
        isGasEstimateWithDummyProof);
    }
    if (!feeTokenDetails) {
        throw new Error('Must have Broadcaster Fee details or sendWithPublicWallet field.');
    }
    // Find any erc20Amount in transfer that matches token of broadcaster fee, if exists.
    const broadcasterFeeMatchingSendingERC20Amount = erc20AmountRecipients.find(erc20AmountRecipient => erc20AmountRecipient.tokenAddress.toLowerCase() ===
        feeTokenDetails.tokenAddress.toLowerCase());
    // Get private balance of matching token.
    const balanceForBroadcasterFeeERC20 = await (0, balance_update_1.balanceForERC20Token)(txidVersion, wallet, networkName, feeTokenDetails.tokenAddress, true);
    let broadcasterFeeCommitment = getBroadcasterFeeCommitment(serializedTransactions);
    // Iteratively calculate new broadcaster fee and estimate new gas amount.
    // This change if the number of circuits changes because of the additional Broadcaster Fees.
    for (let i = 0; i < MAX_ITERATIONS_BROADCASTER_FEE_REESTIMATION; i += 1) {
        const updatedGasDetails = {
            ...originalGasDetails,
            gasEstimate,
        };
        const updatedBroadcasterFee = (0, exports.calculateBroadcasterFeeERC20Amount)(feeTokenDetails, updatedGasDetails);
        // If Broadcaster fee causes overflow with the token balance,
        // then use the MAX amount for Broadcaster Fee, which is BALANCE - SENDING AMOUNT.
        if (balanceForBroadcasterFeeERC20 > 0n &&
            broadcasterFeeMatchingSendingERC20Amount &&
            // eslint-disable-next-line no-await-in-loop
            (await broadcasterFeeWillOverflowBalance(balanceForBroadcasterFeeERC20, broadcasterFeeMatchingSendingERC20Amount, updatedBroadcasterFee))) {
            updatedBroadcasterFee.amount =
                balanceForBroadcasterFeeERC20 -
                    broadcasterFeeMatchingSendingERC20Amount.amount;
        }
        const newSerializedTransactions = 
        // eslint-disable-next-line no-await-in-loop
        await generateDummyTransactionStructsWithBroadcasterFee(updatedBroadcasterFee);
        broadcasterFeeCommitment = getBroadcasterFeeCommitment(newSerializedTransactions);
        if (compareCircuitSizesTransactionStructs(newSerializedTransactions, serializedTransactions)) {
            // Same circuit sizes, no need to run further gas estimates.
            return (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, broadcasterFeeCommitment, isGasEstimateWithDummyProof);
        }
        serializedTransactions = newSerializedTransactions;
        // eslint-disable-next-line no-await-in-loop
        transaction = await generateTransaction(serializedTransactions);
        // eslint-disable-next-line no-await-in-loop
        const newGasEstimate = await (0, tx_gas_details_1.getGasEstimate)(txidVersion, networkName, transaction, fromWalletAddress, sendWithPublicWallet, isCrossContractCall);
        if (newGasEstimate === gasEstimate) {
            return (0, tx_gas_details_1.gasEstimateResponse)(newGasEstimate, broadcasterFeeCommitment, isGasEstimateWithDummyProof);
        }
        gasEstimate = newGasEstimate;
    }
    return (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, broadcasterFeeCommitment, isGasEstimateWithDummyProof);
};
exports.gasEstimateResponseDummyProofIterativeBroadcasterFee = gasEstimateResponseDummyProofIterativeBroadcasterFee;
const compareCircuitSizesTransactionStructs = (serializedA, serializedB) => {
    if (serializedA.length !== serializedB.length) {
        return false;
    }
    for (let i = 0; i < serializedA.length; i += 1) {
        if (serializedA[i].commitments.length !== serializedB[i].commitments.length) {
            return false;
        }
        if (serializedA[i].nullifiers.length !== serializedB[i].nullifiers.length) {
            return false;
        }
    }
    return true;
};
const broadcasterFeeWillOverflowBalance = async (tokenBalance, sendingERC20Amount, broadcasterFeeERC20Amount) => {
    const sendingAmount = sendingERC20Amount.amount;
    const broadcasterFeeAmount = broadcasterFeeERC20Amount.amount;
    return sendingAmount + broadcasterFeeAmount > tokenBalance;
};
//# sourceMappingURL=tx-gas-broadcaster-fee-estimator.js.map