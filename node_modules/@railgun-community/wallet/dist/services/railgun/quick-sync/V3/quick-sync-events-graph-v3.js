"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickSyncEventsGraphV3 = void 0;
const engine_1 = require("@railgun-community/engine");
const graph_query_1 = require("../graph-query");
const shared_models_1 = require("@railgun-community/shared-models");
const runtime_1 = require("@graphql-mesh/runtime");
const graph_util_1 = require("../../util/graph-util");
const graphql_1 = require("./graphql");
const graph_type_formatters_v3_1 = require("./graph-type-formatters-v3");
const meshes = {};
// 1.5 full trees of commitments
// TODO: This will have to change when we have more than 100k commitments.
const MAX_QUERY_RESULTS = 100000;
const sourceNameForNetwork = (networkName) => {
    switch (networkName) {
        case shared_models_1.NetworkName.Ethereum:
        case shared_models_1.NetworkName.EthereumSepolia:
        case shared_models_1.NetworkName.BNBChain:
        case shared_models_1.NetworkName.Polygon:
        case shared_models_1.NetworkName.Arbitrum:
        case shared_models_1.NetworkName.PolygonAmoy:
        case shared_models_1.NetworkName.ArbitrumGoerli_DEPRECATED:
        case shared_models_1.NetworkName.EthereumGoerli_DEPRECATED:
        case shared_models_1.NetworkName.EthereumRopsten_DEPRECATED:
        case shared_models_1.NetworkName.PolygonMumbai_DEPRECATED:
        case shared_models_1.NetworkName.Hardhat:
        default:
            throw new Error('No Graph API hosted service for this network on RAILGUN V3');
    }
};
const isSupportedByNetwork = (networkName) => {
    try {
        sourceNameForNetwork(networkName);
        return true;
    }
    catch {
        return false;
    }
};
const quickSyncEventsGraphV3 = async (chain, startingBlock) => {
    const network = (0, shared_models_1.networkForChain)(chain);
    if (!network || !isSupportedByNetwork(network.name)) {
        // Return empty logs, Engine will default to full scan.
        return graph_query_1.EMPTY_EVENTS;
    }
    const sdk = getBuiltGraphSDK(network.name);
    const [nullifiers, unshields, commitments, railgunTransactions] = await Promise.all([
        (0, graph_query_1.autoPaginatingQuery)(async (blockNumber) => (await sdk.Nullifiers({
            blockNumber,
        })).nullifiers, startingBlock.toString(), MAX_QUERY_RESULTS),
        (0, graph_query_1.autoPaginatingQuery)(async (blockNumber) => (await sdk.Unshields({
            blockNumber,
        })).unshields, startingBlock.toString(), MAX_QUERY_RESULTS),
        (0, graph_query_1.autoPaginatingQuery)(async (blockNumber) => (await sdk.Commitments({
            blockNumber,
        })).commitments, startingBlock.toString(), MAX_QUERY_RESULTS),
        (0, graph_query_1.autoPaginatingQuery)(async (blockNumber) => (await sdk.RailgunTransactions({
            blockNumber,
        })).railgunTransactions, startingBlock.toString(), MAX_QUERY_RESULTS),
    ]);
    const filteredRailgunTransactions = (0, graph_util_1.removeDuplicatesByID)(railgunTransactions);
    const filteredNullifiers = (0, graph_util_1.removeDuplicatesByID)(nullifiers);
    const filteredUnshields = (0, graph_util_1.removeDuplicatesByID)(unshields);
    const filteredCommitments = (0, graph_util_1.removeDuplicatesByID)(commitments);
    const railgunTransactionEvents = (0, graph_type_formatters_v3_1.formatGraphRailgunTransactionEventsV3)(filteredRailgunTransactions);
    const railgunTxidMap = {};
    for (const railgunTransaction of filteredRailgunTransactions) {
        const railgunTxid = (0, engine_1.getRailgunTransactionIDHex)(railgunTransaction);
        railgunTxidMap[railgunTxid] = railgunTransaction.commitments;
    }
    const nullifierEvents = (0, graph_type_formatters_v3_1.formatGraphNullifierEventsV3)(filteredNullifiers);
    const unshieldEvents = (0, graph_type_formatters_v3_1.formatGraphUnshieldEventsV3)(filteredUnshields, railgunTxidMap);
    const commitmentEvents = (0, graph_type_formatters_v3_1.formatGraphCommitmentEventsV3)(filteredCommitments, railgunTxidMap);
    return {
        nullifierEvents,
        unshieldEvents,
        commitmentEvents,
        railgunTransactionEvents,
    };
};
exports.quickSyncEventsGraphV3 = quickSyncEventsGraphV3;
const getBuiltGraphClient = async (networkName) => {
    const meshForNetwork = meshes[networkName];
    if ((0, shared_models_1.isDefined)(meshForNetwork)) {
        return meshForNetwork;
    }
    const sourceName = sourceNameForNetwork(networkName);
    const meshOptions = await (0, graphql_1.getMeshOptions)();
    const filteredSources = meshOptions.sources.filter(source => {
        return source.name === sourceName;
    });
    if (filteredSources.length !== 1) {
        throw new Error(`Expected exactly one source for network ${networkName}, found ${filteredSources.length}`);
    }
    meshOptions.sources = [filteredSources[0]];
    const mesh = await (0, runtime_1.getMesh)(meshOptions);
    meshes[networkName] = mesh;
    const id = mesh.pubsub.subscribe('destroy', () => {
        meshes[networkName] = undefined;
        mesh.pubsub.unsubscribe(id);
    });
    return mesh;
};
const getBuiltGraphSDK = (networkName, globalContext) => {
    const sdkRequester$ = getBuiltGraphClient(networkName).then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
    return (0, graphql_1.getSdk)((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
};
//# sourceMappingURL=quick-sync-events-graph-v3.js.map