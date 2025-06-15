"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFirstNoteERC20AmountMapFromTransactionRequest = void 0;
const engine_1 = require("@railgun-community/engine");
const wallets_1 = require("../wallets/wallets");
const extractFirstNoteERC20AmountMapFromTransactionRequest = (railgunWalletID, txidVersion, network, transactionRequest, useRelayAdapt) => {
    const chain = network.chain;
    let contractAddress;
    if (useRelayAdapt) {
        contractAddress = engine_1.RailgunVersionedSmartContracts.getRelayAdaptContract(txidVersion, chain).address;
    }
    else {
        contractAddress = engine_1.RailgunVersionedSmartContracts.getVerifier(txidVersion, chain).address;
    }
    const wallet = (0, wallets_1.walletForID)(railgunWalletID);
    return wallet.extractFirstNoteERC20AmountMap(txidVersion, chain, transactionRequest, useRelayAdapt, contractAddress);
};
exports.extractFirstNoteERC20AmountMapFromTransactionRequest = extractFirstNoteERC20AmountMapFromTransactionRequest;
//# sourceMappingURL=extract-transaction-data.js.map