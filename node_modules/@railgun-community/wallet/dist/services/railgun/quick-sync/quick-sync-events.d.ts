import { Chain, TXIDVersion } from '@railgun-community/engine';
export declare const quickSyncEventsGraph: (txidVersion: TXIDVersion, chain: Chain, startingBlock: number) => Promise<import("@railgun-community/engine").AccumulatedEvents>;
