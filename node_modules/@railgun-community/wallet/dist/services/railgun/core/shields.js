"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShieldsForTXIDVersion = exports.getAllShields = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const engine_1 = require("./engine");
const engine_2 = require("@railgun-community/engine");
const getAllShields = async (networkName, startingBlock) => {
    const shieldsForEachTxidVersion = await Promise.all(engine_2.ACTIVE_TXID_VERSIONS.map(async (txidVersion) => {
        const shields = await (0, exports.getShieldsForTXIDVersion)(txidVersion, networkName, startingBlock);
        return shields;
    }));
    return shieldsForEachTxidVersion.flat();
};
exports.getAllShields = getAllShields;
const getShieldsForTXIDVersion = async (txidVersion, networkName, startingBlock) => {
    const engine = (0, engine_1.getEngine)();
    const { chain } = shared_models_1.NETWORK_CONFIG[networkName];
    const shieldCommitments = await engine.getAllShieldCommitments(txidVersion, chain, startingBlock);
    return shieldCommitments.map(commitment => {
        const shieldData = {
            txid: `0x${commitment.txid}`,
            commitmentHash: `0x${commitment.hash}`,
            npk: `0x${commitment.preImage.npk}`,
            utxoTree: commitment.utxoTree,
            utxoIndex: commitment.utxoIndex,
            timestamp: commitment.timestamp,
            blockNumber: commitment.blockNumber,
        };
        return shieldData;
    });
};
exports.getShieldsForTXIDVersion = getShieldsForTXIDVersion;
//# sourceMappingURL=shields.js.map