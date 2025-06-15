"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletedTxidFromNullifiers = void 0;
const error_1 = require("../../utils/error");
const engine_1 = require("../railgun/core/engine");
const getCompletedTxidFromNullifiers = async (txidVersion, chain, nullifiers) => {
    try {
        const engine = (0, engine_1.getEngine)();
        const txid = await engine.getCompletedTxidFromNullifiers(txidVersion, chain, nullifiers);
        return { txid };
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.getCompletedTxidFromNullifiers.name, err);
    }
};
exports.getCompletedTxidFromNullifiers = getCompletedTxidFromNullifiers;
//# sourceMappingURL=tx-nullifiers.js.map