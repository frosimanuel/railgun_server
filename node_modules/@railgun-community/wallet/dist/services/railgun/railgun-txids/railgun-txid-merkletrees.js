"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRailgunTxidMerkleroot = exports.getLatestRailgunTxidData = exports.resetRailgunTxidsAfterTxidIndex = exports.fullResetTXIDMerkletreesV2 = exports.syncRailgunTransactionsV2 = exports.getGlobalUTXOTreePositionForRailgunTransactionCommitment = exports.validateRailgunTxidExists = exports.validateRailgunTxidOccurredBeforeBlockNumber = exports.validateRailgunTxidMerkleroot = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const core_1 = require("../core");
const validateRailgunTxidMerkleroot = async (txidVersion, networkName, tree, index, merkleroot) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    const engine = (0, core_1.getEngine)();
    const txidMerkletree = engine.getTXIDMerkletree(txidVersion, chain);
    const historicalMerkleroot = await txidMerkletree.getHistoricalMerkleroot(tree, index);
    return historicalMerkleroot === merkleroot;
};
exports.validateRailgunTxidMerkleroot = validateRailgunTxidMerkleroot;
const validateRailgunTxidOccurredBeforeBlockNumber = (txidVersion, networkName, tree, index, blockNumber) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    const engine = (0, core_1.getEngine)();
    const txidMerkletree = engine.getTXIDMerkletree(txidVersion, chain);
    return txidMerkletree.railgunTxidOccurredBeforeBlockNumber(tree, index, blockNumber);
};
exports.validateRailgunTxidOccurredBeforeBlockNumber = validateRailgunTxidOccurredBeforeBlockNumber;
const validateRailgunTxidExists = async (txidVersion, networkName, railgunTxid) => {
    const txidMerkletree = (0, core_1.getTXIDMerkletreeForNetwork)(txidVersion, networkName);
    const railgunTransaction = await txidMerkletree.getRailgunTransactionByTxid(railgunTxid);
    return (0, shared_models_1.isDefined)(railgunTransaction);
};
exports.validateRailgunTxidExists = validateRailgunTxidExists;
const getGlobalUTXOTreePositionForRailgunTransactionCommitment = (txidVersion, networkName, tree, index, commitmentHash) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    const engine = (0, core_1.getEngine)();
    const txidMerkletree = engine.getTXIDMerkletree(txidVersion, chain);
    return txidMerkletree.getGlobalUTXOTreePositionForRailgunTransactionCommitment(tree, index, commitmentHash);
};
exports.getGlobalUTXOTreePositionForRailgunTransactionCommitment = getGlobalUTXOTreePositionForRailgunTransactionCommitment;
const syncRailgunTransactionsV2 = async (networkName) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    return (0, core_1.getEngine)().syncRailgunTransactionsV2(chain, 'manual trigger');
};
exports.syncRailgunTransactionsV2 = syncRailgunTransactionsV2;
const fullResetTXIDMerkletreesV2 = async (networkName) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    return (0, core_1.getEngine)().fullResetTXIDMerkletreesV2(chain);
};
exports.fullResetTXIDMerkletreesV2 = fullResetTXIDMerkletreesV2;
const resetRailgunTxidsAfterTxidIndex = async (txidVersion, networkName, txidIndex) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    return (0, core_1.getEngine)().resetRailgunTxidsAfterTxidIndex(txidVersion, chain, txidIndex);
};
exports.resetRailgunTxidsAfterTxidIndex = resetRailgunTxidsAfterTxidIndex;
const getLatestRailgunTxidData = async (txidVersion, networkName) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    return (0, core_1.getEngine)().getLatestRailgunTxidData(txidVersion, chain);
};
exports.getLatestRailgunTxidData = getLatestRailgunTxidData;
const getRailgunTxidMerkleroot = async (txidVersion, networkName, tree, index) => {
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    const engine = (0, core_1.getEngine)();
    const txidMerkletree = engine.getTXIDMerkletree(txidVersion, chain);
    const historicalMerkleroot = await txidMerkletree.getHistoricalMerkleroot(tree, index);
    return historicalMerkleroot;
};
exports.getRailgunTxidMerkleroot = getRailgunTxidMerkleroot;
//# sourceMappingURL=railgun-txid-merkletrees.js.map