"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSetOverallBatchMinGasPriceForNetwork = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
/**
 * L2s don't manage gas prices in the same way. tx.gasprice (contract) is not necessarily the same value as transactionRequest.gasPrice (ethers).
 * Since overallBatchMinGasPrice is an optional parameter, we simply remove it for L2s. This will skip validation on the contract side.
 */
const shouldSetOverallBatchMinGasPriceForNetwork = (sendWithPublicWallet, networkName) => {
    if (sendWithPublicWallet) {
        // Only Broadcaster transactions require overallBatchMinGasPrice.
        return false;
    }
    switch (networkName) {
        case shared_models_1.NetworkName.Arbitrum:
            // L2s should not set overallBatchMinGasPrice.
            return false;
        case shared_models_1.NetworkName.Ethereum:
        case shared_models_1.NetworkName.BNBChain:
        case shared_models_1.NetworkName.Polygon:
        case shared_models_1.NetworkName.PolygonAmoy:
        case shared_models_1.NetworkName.ArbitrumGoerli_DEPRECATED:
        case shared_models_1.NetworkName.EthereumRopsten_DEPRECATED:
        case shared_models_1.NetworkName.EthereumGoerli_DEPRECATED:
        case shared_models_1.NetworkName.PolygonMumbai_DEPRECATED:
        case shared_models_1.NetworkName.EthereumSepolia:
        case shared_models_1.NetworkName.Hardhat:
            return true;
        default:
            throw new Error('Undefined networkName');
    }
};
exports.shouldSetOverallBatchMinGasPriceForNetwork = shouldSetOverallBatchMinGasPriceForNetwork;
//# sourceMappingURL=gas-price.js.map