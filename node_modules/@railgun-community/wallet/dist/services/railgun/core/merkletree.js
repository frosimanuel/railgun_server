"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMerkleProofForERC721 = exports.getSpendableUTXOsForToken = exports.getTXIDMerkletreeForNetwork = exports.getUTXOMerkletreeForNetwork = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const engine_1 = require("@railgun-community/engine");
const engine_2 = require("./engine");
const wallets_1 = require("../wallets/wallets");
const getUTXOMerkletreeForNetwork = (txidVersion, networkName) => {
    const network = shared_models_1.NETWORK_CONFIG[networkName];
    const { chain } = network;
    const utxoMerkletree = (0, engine_2.getEngine)().getUTXOMerkletree(txidVersion, chain);
    if (!(0, shared_models_1.isDefined)(utxoMerkletree)) {
        throw new Error(`MerkleTree not yet loaded for network ${network.publicName}`);
    }
    return utxoMerkletree;
};
exports.getUTXOMerkletreeForNetwork = getUTXOMerkletreeForNetwork;
const getTXIDMerkletreeForNetwork = (txidVersion, networkName) => {
    const network = shared_models_1.NETWORK_CONFIG[networkName];
    const { chain } = network;
    const txidMerkletree = (0, engine_2.getEngine)().getTXIDMerkletree(txidVersion, chain);
    if (!(0, shared_models_1.isDefined)(txidMerkletree)) {
        throw new Error(`MerkleTree not yet loaded for network ${network.publicName}`);
    }
    return txidMerkletree;
};
exports.getTXIDMerkletreeForNetwork = getTXIDMerkletreeForNetwork;
const getSpendableUTXOsForToken = async (txidVersion, networkName, walletID, tokenData) => {
    const wallet = (0, wallets_1.walletForID)(walletID);
    const chain = shared_models_1.NETWORK_CONFIG[networkName].chain;
    const onlySpendable = true;
    const balances = await wallet.getTokenBalances(txidVersion, chain, onlySpendable);
    const tokenHash = (0, engine_1.getTokenDataHash)(tokenData);
    return balances[tokenHash]?.utxos;
};
exports.getSpendableUTXOsForToken = getSpendableUTXOsForToken;
const getMerkleProofForERC721 = async (txidVersion, networkName, walletID, nftTokenData) => {
    const utxos = await (0, exports.getSpendableUTXOsForToken)(txidVersion, networkName, walletID, nftTokenData);
    if (!utxos || !utxos.length) {
        throw new Error('No spendable UTXOs found for NFT');
    }
    if (utxos.length !== 1) {
        throw new Error('Expected 1 UTXO for NFT');
    }
    const { tree, position } = utxos[0];
    const utxoMerkletree = (0, exports.getUTXOMerkletreeForNetwork)(txidVersion, networkName);
    return utxoMerkletree.getMerkleProof(tree, position);
};
exports.getMerkleProofForERC721 = getMerkleProofForERC721;
//# sourceMappingURL=merkletree.js.map