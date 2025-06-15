import { Nullifier, UnshieldStoredEvent, CommitmentEvent } from '@railgun-community/engine';
import { Nullifier as GraphNullifierV3, Unshield as GraphUnshieldV3, ShieldCommitment as GraphShieldCommitmentV3, TransactCommitment as GraphTransactCommitmentV3, RailgunTransaction as GraphRailgunTransactionV3 } from './graphql';
export type GraphCommitmentV3 = GraphShieldCommitmentV3 | GraphTransactCommitmentV3;
export type RailgunTxidMapV3 = MapType<string[]>;
export declare const formatGraphRailgunTransactionEventsV3: (railgunTransactions: GraphRailgunTransactionV3[]) => import("@railgun-community/engine").RailgunTransactionV3[];
export declare const formatGraphNullifierEventsV3: (nullifiers: GraphNullifierV3[]) => Nullifier[];
export declare const formatGraphUnshieldEventsV3: (unshields: GraphUnshieldV3[], railgunTxidMap: RailgunTxidMapV3) => UnshieldStoredEvent[];
export declare const formatGraphCommitmentEventsV3: (commitments: GraphCommitmentV3[], railgunTxidMap: RailgunTxidMapV3) => CommitmentEvent[];
