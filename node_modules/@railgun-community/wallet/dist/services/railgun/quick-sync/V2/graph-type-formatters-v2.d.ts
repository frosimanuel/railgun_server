import { Nullifier, UnshieldStoredEvent, CommitmentEvent } from '@railgun-community/engine';
import { Nullifier as GraphNullifierV2, Unshield as GraphUnshieldV2, LegacyGeneratedCommitment as GraphLegacyGeneratedCommitmentV2, LegacyEncryptedCommitment as GraphLegacyEncryptedCommitmentV2, ShieldCommitment as GraphShieldCommitmentV2, TransactCommitment as GraphTransactCommitmentV2 } from './graphql';
export type GraphCommitmentV2 = GraphLegacyEncryptedCommitmentV2 | GraphLegacyGeneratedCommitmentV2 | GraphShieldCommitmentV2 | GraphTransactCommitmentV2;
export type GraphCommitmentBatchV2 = {
    transactionHash: string;
    commitments: GraphCommitmentV2[];
    treeNumber: number;
    startPosition: number;
    blockNumber: number;
};
export declare const formatGraphNullifierEventsV2: (nullifiers: GraphNullifierV2[]) => Nullifier[];
export declare const formatGraphUnshieldEventsV2: (unshields: GraphUnshieldV2[]) => UnshieldStoredEvent[];
export declare const formatGraphCommitmentEventsV2: (graphCommitmentBatches: GraphCommitmentBatchV2[]) => CommitmentEvent[];
