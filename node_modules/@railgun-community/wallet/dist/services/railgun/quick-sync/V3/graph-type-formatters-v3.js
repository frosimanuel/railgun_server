"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatGraphCommitmentEventsV3 = exports.formatGraphUnshieldEventsV3 = exports.formatGraphNullifierEventsV3 = exports.formatGraphRailgunTransactionEventsV3 = void 0;
const engine_1 = require("@railgun-community/engine");
const shared_formatters_1 = require("../shared-formatters");
const formatGraphRailgunTransactionEventsV3 = (railgunTransactions) => {
    return railgunTransactions.map(railgunTransaction => {
        return engine_1.V3Events.formatRailgunTransactionEvent(railgunTransaction.transactionHash, Number(railgunTransaction.blockNumber), railgunTransaction.commitments, railgunTransaction.nullifiers, {
            npk: railgunTransaction.unshieldToAddress,
            token: {
                tokenType: BigInt((0, shared_formatters_1.graphTokenTypeToEngineTokenType)(railgunTransaction.unshieldToken.tokenType)),
                tokenAddress: railgunTransaction.unshieldToken.tokenAddress,
                tokenSubID: BigInt(railgunTransaction.unshieldToken.tokenSubID),
            },
            value: BigInt(railgunTransaction.unshieldValue),
        }, railgunTransaction.boundParamsHash, Number(railgunTransaction.utxoTreeIn), Number(railgunTransaction.utxoTreeOut), Number(railgunTransaction.utxoBatchStartPositionOut), railgunTransaction.verificationHash);
    });
};
exports.formatGraphRailgunTransactionEventsV3 = formatGraphRailgunTransactionEventsV3;
const formatGraphNullifierEventsV3 = (nullifiers) => {
    return nullifiers.map(nullifier => {
        return {
            txid: (0, shared_formatters_1.formatTo32Bytes)(nullifier.transactionHash, false),
            nullifier: (0, shared_formatters_1.formatTo32Bytes)(nullifier.nullifier, false),
            treeNumber: nullifier.treeNumber,
            blockNumber: Number(nullifier.blockNumber),
            spentRailgunTxid: undefined,
        };
    });
};
exports.formatGraphNullifierEventsV3 = formatGraphNullifierEventsV3;
const getUnshieldCommitmentHash = (npk, tokenAddress, tokenType, tokenSubID, value) => {
    return (0, engine_1.getNoteHash)(npk, (0, engine_1.serializeTokenData)(tokenAddress, tokenType, tokenSubID.toString()), value);
};
const formatGraphUnshieldEventsV3 = (unshields, railgunTxidMap) => {
    return unshields.map(unshield => {
        const unshieldCommitmentHash = engine_1.ByteUtils.nToHex(getUnshieldCommitmentHash(unshield.to, unshield.token.tokenAddress, BigInt((0, shared_formatters_1.graphTokenTypeToEngineTokenType)(unshield.token.tokenType)), BigInt(unshield.token.tokenSubID), BigInt(unshield.value)), engine_1.ByteLength.UINT_256, true);
        const railgunTxid = getRailgunTxid(railgunTxidMap, [
            unshieldCommitmentHash,
        ]);
        return engine_1.V3Events.formatUnshieldEvent(unshield.transactionHash, Number(unshield.blockNumber), {
            npk: unshield.to,
            token: {
                tokenType: BigInt((0, shared_formatters_1.graphTokenTypeToEngineTokenType)(unshield.token.tokenType)),
                tokenAddress: unshield.token.tokenAddress,
                tokenSubID: BigInt(unshield.token.tokenSubID),
            },
            value: BigInt(unshield.value),
        }, Number(unshield.transactIndex), BigInt(unshield.fee), railgunTxid);
    });
};
exports.formatGraphUnshieldEventsV3 = formatGraphUnshieldEventsV3;
const formatGraphCommitmentEventsV3 = (commitments, railgunTxidMap) => {
    return commitments.map(commitment => {
        return formatGraphCommitmentEventV3(commitment, railgunTxidMap);
    });
};
exports.formatGraphCommitmentEventsV3 = formatGraphCommitmentEventsV3;
const formatGraphCommitmentEventV3 = (commitment, railgunTxidMap) => {
    switch (commitment.commitmentType) {
        case 'LegacyGeneratedCommitment':
        case 'LegacyEncryptedCommitment':
            throw new Error('Not possible in V3');
        case 'ShieldCommitment':
            return formatShieldCommitmentEvent(commitment);
        case 'TransactCommitment': {
            const railgunTxid = getRailgunTxid(railgunTxidMap, commitment.hashes);
            return formatTransactCommitmentEvent(commitment, railgunTxid);
        }
    }
};
const getRailgunTxid = (railgunTxidMap, commitments) => {
    const railgunTxids = Object.keys(railgunTxidMap);
    for (const railgunTxid of railgunTxids) {
        const railgunTxidCommitments = railgunTxidMap[railgunTxid];
        if (!railgunTxidCommitments) {
            continue;
        }
        const hasAllCommitments = commitments.every(commitment => railgunTxidCommitments.includes(commitment));
        if (hasAllCommitments) {
            return railgunTxid;
        }
    }
    throw new Error('railgunTxid not found including all transact commitments');
};
const formatShieldCommitmentEvent = (commitment) => {
    return engine_1.V3Events.formatShieldEvent(commitment.transactionHash, Number(commitment.blockNumber), commitment.from, {
        npk: commitment.preimage.npk,
        token: {
            tokenType: BigInt((0, shared_formatters_1.graphTokenTypeToEngineTokenType)(commitment.preimage.token.tokenType)),
            tokenAddress: commitment.preimage.token.tokenAddress,
            tokenSubID: BigInt(commitment.preimage.token.tokenSubID),
        },
        value: BigInt(commitment.preimage.value),
    }, {
        encryptedBundle: commitment.encryptedBundle,
        shieldKey: commitment.shieldKey,
    }, commitment.treeNumber, commitment.treePosition, BigInt(commitment.fee));
};
const formatTransactCommitmentEvent = (commitment, railgunTxid) => {
    return engine_1.V3Events.formatTransactEvent(commitment.transactionHash, Number(commitment.blockNumber), commitment.hashes, commitment.commitmentCiphertexts, commitment.treeNumber, commitment.batchStartTreePosition, commitment.transactIndex, commitment.senderCiphertext, railgunTxid);
};
//# sourceMappingURL=graph-type-formatters-v3.js.map