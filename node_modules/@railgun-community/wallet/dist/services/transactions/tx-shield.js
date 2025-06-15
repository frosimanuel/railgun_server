"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasEstimateForShield = exports.populateShield = exports.generateShieldTransaction = exports.getShieldPrivateKeySignatureMessage = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const engine_1 = require("@railgun-community/engine");
const tx_gas_details_1 = require("./tx-gas-details");
const blocked_address_1 = require("../../utils/blocked-address");
const tx_cross_contract_calls_1 = require("./tx-cross-contract-calls");
const error_1 = require("../../utils/error");
const wallets_1 = require("../railgun/wallets");
const getShieldPrivateKeySignatureMessage = () => {
    return engine_1.ShieldNote.getShieldPrivateKeySignatureMessage();
};
exports.getShieldPrivateKeySignatureMessage = getShieldPrivateKeySignatureMessage;
const generateERC20ShieldRequests = async (erc20AmountRecipient, random, shieldPrivateKey) => {
    const railgunAddress = erc20AmountRecipient.recipientAddress;
    (0, wallets_1.assertValidRailgunAddress)(railgunAddress);
    const { masterPublicKey, viewingPublicKey } = engine_1.RailgunEngine.decodeAddress(railgunAddress);
    const shield = new engine_1.ShieldNoteERC20(masterPublicKey, random, erc20AmountRecipient.amount, erc20AmountRecipient.tokenAddress);
    return shield.serialize(engine_1.ByteUtils.hexToBytes(shieldPrivateKey), viewingPublicKey);
};
const generateNFTShieldRequests = async (nftAmountRecipient, random, shieldPrivateKey) => {
    const railgunAddress = nftAmountRecipient.recipientAddress;
    (0, wallets_1.assertValidRailgunAddress)(railgunAddress);
    const { masterPublicKey, viewingPublicKey } = engine_1.RailgunEngine.decodeAddress(railgunAddress);
    const value = nftAmountRecipient.nftTokenType === shared_models_1.NFTTokenType.ERC721
        ? engine_1.ERC721_NOTE_VALUE
        : nftAmountRecipient.amount;
    const nftTokenData = (0, tx_cross_contract_calls_1.createNFTTokenDataFromRailgunNFTAmount)(nftAmountRecipient);
    const shield = new engine_1.ShieldNoteNFT(masterPublicKey, random, value, nftTokenData);
    return shield.serialize(engine_1.ByteUtils.hexToBytes(shieldPrivateKey), viewingPublicKey);
};
const generateShieldTransaction = async (txidVersion, networkName, shieldPrivateKey, erc20AmountRecipients, nftAmountRecipients) => {
    try {
        const random = engine_1.ByteUtils.randomHex(16);
        const shieldInputs = await Promise.all([
            ...erc20AmountRecipients.map(erc20AmountRecipient => generateERC20ShieldRequests(erc20AmountRecipient, random, shieldPrivateKey)),
            ...nftAmountRecipients.map(nftAmountRecipient => generateNFTShieldRequests(nftAmountRecipient, random, shieldPrivateKey)),
        ]);
        const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
        const transaction = await engine_1.RailgunVersionedSmartContracts.generateShield(txidVersion, chain, shieldInputs);
        return transaction;
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.generateShieldTransaction.name, err);
    }
};
exports.generateShieldTransaction = generateShieldTransaction;
const populateShield = async (txidVersion, networkName, shieldPrivateKey, erc20AmountRecipients, nftAmountRecipients, gasDetails) => {
    try {
        const transaction = await (0, exports.generateShieldTransaction)(txidVersion, networkName, shieldPrivateKey, erc20AmountRecipients, nftAmountRecipients);
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
        throw (0, error_1.reportAndSanitizeError)(exports.populateShield.name, err);
    }
};
exports.populateShield = populateShield;
const gasEstimateForShield = async (txidVersion, networkName, shieldPrivateKey, erc20AmountRecipients, nftAmountRecipients, fromWalletAddress) => {
    try {
        (0, blocked_address_1.assertNotBlockedAddress)(fromWalletAddress);
        const transaction = await (0, exports.generateShieldTransaction)(txidVersion, networkName, shieldPrivateKey, erc20AmountRecipients, nftAmountRecipients);
        const sendWithPublicWallet = true;
        const isGasEstimateWithDummyProof = false;
        return (0, tx_gas_details_1.gasEstimateResponse)(await (0, tx_gas_details_1.getGasEstimate)(txidVersion, networkName, transaction, fromWalletAddress, sendWithPublicWallet, false), undefined, // broadcasterFeeCommitment
        isGasEstimateWithDummyProof);
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.gasEstimateForShield.name, err);
    }
};
exports.gasEstimateForShield = gasEstimateForShield;
//# sourceMappingURL=tx-shield.js.map