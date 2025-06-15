"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasEstimateForShieldBaseToken = exports.populateShieldBaseToken = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const tx_gas_details_1 = require("./tx-gas-details");
const blocked_address_1 = require("../../utils/blocked-address");
const engine_1 = require("@railgun-community/engine");
const error_1 = require("../../utils/error");
const wallets_1 = require("../railgun/wallets/wallets");
const generateShieldBaseTokenTransaction = async (txidVersion, networkName, railgunAddress, shieldPrivateKey, wrappedERC20Amount) => {
    try {
        const { masterPublicKey, viewingPublicKey } = engine_1.RailgunEngine.decodeAddress(railgunAddress);
        const random = engine_1.ByteUtils.randomHex(16);
        const { amount, tokenAddress } = wrappedERC20Amount;
        const shield = new engine_1.ShieldNoteERC20(masterPublicKey, random, amount, tokenAddress);
        const shieldRequest = await shield.serialize(engine_1.ByteUtils.hexToBytes(shieldPrivateKey), viewingPublicKey);
        const { chain } = shared_models_1.NETWORK_CONFIG[networkName];
        const transaction = await engine_1.RelayAdaptVersionedSmartContracts.populateShieldBaseToken(txidVersion, chain, shieldRequest);
        return transaction;
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(generateShieldBaseTokenTransaction.name, err);
    }
};
const populateShieldBaseToken = async (txidVersion, networkName, railgunAddress, shieldPrivateKey, wrappedERC20Amount, gasDetails) => {
    try {
        (0, wallets_1.assertValidRailgunAddress)(railgunAddress);
        const transaction = await generateShieldBaseTokenTransaction(txidVersion, networkName, railgunAddress, shieldPrivateKey, wrappedERC20Amount);
        if (gasDetails) {
            const sendWithPublicWallet = true;
            (0, tx_gas_details_1.setGasDetailsForTransaction)(networkName, transaction, gasDetails, sendWithPublicWallet);
        }
        return {
            transaction,
            preTransactionPOIsPerTxidLeafPerList: {},
        };
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.populateShieldBaseToken.name, err);
    }
};
exports.populateShieldBaseToken = populateShieldBaseToken;
const gasEstimateForShieldBaseToken = async (txidVersion, networkName, railgunAddress, shieldPrivateKey, wrappedERC20Amount, fromWalletAddress) => {
    try {
        (0, wallets_1.assertValidRailgunAddress)(railgunAddress);
        (0, blocked_address_1.assertNotBlockedAddress)(fromWalletAddress);
        const transaction = await generateShieldBaseTokenTransaction(txidVersion, networkName, railgunAddress, shieldPrivateKey, wrappedERC20Amount);
        const sendWithPublicWallet = true;
        const isGasEstimateWithDummyProof = false;
        return (0, tx_gas_details_1.gasEstimateResponse)(await (0, tx_gas_details_1.getGasEstimate)(txidVersion, networkName, transaction, fromWalletAddress, sendWithPublicWallet, false), undefined, // broadcasterFeeCommitment
        isGasEstimateWithDummyProof);
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.gasEstimateForShieldBaseToken.name, err);
    }
};
exports.gasEstimateForShieldBaseToken = gasEstimateForShieldBaseToken;
//# sourceMappingURL=tx-shield-base-token.js.map