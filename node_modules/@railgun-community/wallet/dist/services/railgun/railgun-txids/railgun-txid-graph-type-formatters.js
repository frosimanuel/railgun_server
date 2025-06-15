"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRailgunTransactions = void 0;
const engine_1 = require("@railgun-community/engine");
const ethers_1 = require("ethers");
const shared_formatters_1 = require("../quick-sync/shared-formatters");
const formatRailgunTransactions = (txs) => {
    return txs.map(tx => {
        const unshield = tx.hasUnshield
            ? {
                tokenData: {
                    tokenType: (0, shared_formatters_1.graphTokenTypeToEngineTokenType)(tx.unshieldToken.tokenType),
                    tokenAddress: (0, ethers_1.getAddress)(tx.unshieldToken.tokenAddress),
                    tokenSubID: tx.unshieldToken.tokenSubID,
                },
                toAddress: tx.unshieldToAddress,
                value: tx.unshieldValue,
            }
            : undefined;
        const railgunTransaction = {
            version: engine_1.RailgunTransactionVersion.V2,
            graphID: tx.id,
            commitments: tx.commitments.map(commitment => engine_1.ByteUtils.formatToByteLength(commitment, engine_1.ByteLength.UINT_256, true)),
            nullifiers: tx.nullifiers.map(nullifier => engine_1.ByteUtils.formatToByteLength(nullifier, engine_1.ByteLength.UINT_256, true)),
            boundParamsHash: engine_1.ByteUtils.formatToByteLength(tx.boundParamsHash, engine_1.ByteLength.UINT_256, true),
            blockNumber: Number(tx.blockNumber),
            timestamp: Number(tx.blockTimestamp),
            utxoTreeIn: Number(tx.utxoTreeIn),
            utxoTreeOut: Number(tx.utxoTreeOut),
            utxoBatchStartPositionOut: Number(tx.utxoBatchStartPositionOut),
            txid: engine_1.ByteUtils.formatToByteLength(tx.transactionHash, engine_1.ByteLength.UINT_256, false),
            unshield,
            verificationHash: engine_1.ByteUtils.formatToByteLength(tx.verificationHash, engine_1.ByteLength.UINT_256, true),
        };
        return railgunTransaction;
    });
};
exports.formatRailgunTransactions = formatRailgunTransactions;
//# sourceMappingURL=railgun-txid-graph-type-formatters.js.map