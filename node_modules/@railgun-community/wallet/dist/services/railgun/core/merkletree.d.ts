import { NetworkName, TXIDVersion } from '@railgun-community/shared-models';
import { NFTTokenData, TXO, TokenData } from '@railgun-community/engine';
export declare const getUTXOMerkletreeForNetwork: (txidVersion: TXIDVersion, networkName: NetworkName) => import("@railgun-community/engine/dist/merkletree/utxo-merkletree").UTXOMerkletree;
export declare const getTXIDMerkletreeForNetwork: (txidVersion: TXIDVersion, networkName: NetworkName) => import("@railgun-community/engine/dist/merkletree/txid-merkletree").TXIDMerkletree;
export declare const getSpendableUTXOsForToken: (txidVersion: TXIDVersion, networkName: NetworkName, walletID: string, tokenData: TokenData) => Promise<Optional<TXO[]>>;
export declare const getMerkleProofForERC721: (txidVersion: TXIDVersion, networkName: NetworkName, walletID: string, nftTokenData: NFTTokenData) => Promise<import("@railgun-community/engine").MerkleProof>;
