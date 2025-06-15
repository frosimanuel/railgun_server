"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickSyncEventsGraph = void 0;
const engine_1 = require("@railgun-community/engine");
const quick_sync_events_graph_v2_1 = require("./V2/quick-sync-events-graph-v2");
const quick_sync_events_graph_v3_1 = require("./V3/quick-sync-events-graph-v3");
const quickSyncEventsGraph = async (txidVersion, chain, startingBlock) => {
    switch (txidVersion) {
        case engine_1.TXIDVersion.V2_PoseidonMerkle:
            return (0, quick_sync_events_graph_v2_1.quickSyncEventsGraphV2)(chain, startingBlock);
        case engine_1.TXIDVersion.V3_PoseidonMerkle:
            return (0, quick_sync_events_graph_v3_1.quickSyncEventsGraphV3)(chain, startingBlock);
    }
};
exports.quickSyncEventsGraph = quickSyncEventsGraph;
//# sourceMappingURL=quick-sync-events.js.map