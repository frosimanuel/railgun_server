"use strict";
/**
 * TO UPDATE:
 * 1. Find all places that are "MODIFIED", move them into the new built index.ts (in .graphclient)
 * 2. add these comments (including eslint disables)
 * 3. move the modified index file to quick-sync/graphql/
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable import/newline-after-import */
/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/no-unsafe-return */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdk = exports.RailgunTransactionsDocument = exports.CommitmentsDocument = exports.UnshieldsDocument = exports.NullifiersDocument = exports.getBuiltGraphSDK = exports.subscribe = exports.execute = exports.getBuiltGraphClient = exports.createBuiltMeshHTTPHandler = exports.getMeshOptions = exports.rawServeConfig = void 0;
const utils_1 = require("@graphql-mesh/utils");
const utils_2 = require("@graphql-mesh/utils");
const utils_3 = require("@graphql-mesh/utils");
const cache_localforage_1 = __importDefault(require("@graphql-mesh/cache-localforage"));
const fetch_1 = require("@whatwg-node/fetch");
const graphql_1 = __importDefault(require("@graphql-mesh/graphql"));
const merger_bare_1 = __importDefault(require("@graphql-mesh/merger-bare"));
const utils_4 = require("@graphql-mesh/utils");
const http_1 = require("@graphql-mesh/http");
const runtime_1 = require("@graphql-mesh/runtime");
const store_1 = require("@graphql-mesh/store");
const cross_helpers_1 = require("@graphql-mesh/cross-helpers");
const baseDir = cross_helpers_1.path.join(typeof __dirname === 'string' ? __dirname : '/', '..');
const importFn = (moduleId) => {
    const relativeModuleId = (cross_helpers_1.path.isAbsolute(moduleId)
        ? cross_helpers_1.path.relative(baseDir, moduleId)
        : moduleId)
        .split('\\')
        .join('/')
        .replace(baseDir + '/', '');
    switch (relativeModuleId) {
        case '.graphclient/sources/mumbai/introspectionSchema':
            return Promise.resolve().then(() => __importStar(require('./.graphclient/sources/mumbai/introspectionSchema')));
        default:
            return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
    }
};
const rootStore = new store_1.MeshStore('.graphclient', new store_1.FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: 'ts',
}), {
    readonly: true,
    validate: false,
});
exports.rawServeConfig = undefined;
async function getMeshOptions() {
    const pubsub = new utils_2.PubSub();
    const sourcesStore = rootStore.child('sources');
    const logger = new utils_3.DefaultLogger('GraphClient');
    const cache = new cache_localforage_1.default({
        ...{},
        importFn,
        store: rootStore.child('cache'),
        pubsub,
        logger,
    });
    const sources = [];
    const transforms = [];
    const additionalEnvelopPlugins = [];
    const mumbaiTransforms = [];
    const additionalTypeDefs = [];
    const mumbaiHandler = new graphql_1.default({
        name: 'mumbai',
        config: {
            endpoint: 'https://api.thegraph.com/subgraphs/name/railgun-community/railgun-v3-mumbai',
        },
        baseDir,
        cache,
        pubsub,
        store: sourcesStore.child('mumbai'),
        logger: logger.child('mumbai'),
        importFn,
    });
    sources[0] = {
        name: 'mumbai',
        handler: mumbaiHandler,
        transforms: mumbaiTransforms,
    };
    const additionalResolvers = [];
    const merger = new merger_bare_1.default({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger'),
    });
    return {
        sources,
        transforms,
        additionalTypeDefs,
        additionalResolvers,
        cache,
        pubsub,
        merger,
        logger,
        additionalEnvelopPlugins,
        get documents() {
            return [
                {
                    document: exports.NullifiersDocument,
                    get rawSDL() {
                        return (0, utils_4.printWithCache)(exports.NullifiersDocument);
                    },
                    location: 'NullifiersDocument.graphql',
                },
                {
                    document: exports.UnshieldsDocument,
                    get rawSDL() {
                        return (0, utils_4.printWithCache)(exports.UnshieldsDocument);
                    },
                    location: 'UnshieldsDocument.graphql',
                },
                {
                    document: exports.CommitmentsDocument,
                    get rawSDL() {
                        return (0, utils_4.printWithCache)(exports.CommitmentsDocument);
                    },
                    location: 'CommitmentsDocument.graphql',
                },
                {
                    document: exports.RailgunTransactionsDocument,
                    get rawSDL() {
                        return (0, utils_4.printWithCache)(exports.RailgunTransactionsDocument);
                    },
                    location: 'RailgunTransactionsDocument.graphql',
                },
            ];
        },
        fetchFn: fetch_1.fetch,
    };
}
exports.getMeshOptions = getMeshOptions;
function createBuiltMeshHTTPHandler() {
    return (0, http_1.createMeshHTTPHandler)({
        baseDir,
        getBuiltMesh: getBuiltGraphClient,
        rawServeConfig: undefined,
    });
}
exports.createBuiltMeshHTTPHandler = createBuiltMeshHTTPHandler;
let meshInstance$;
function getBuiltGraphClient() {
    if (meshInstance$ == null) {
        meshInstance$ = getMeshOptions()
            .then(meshOptions => (0, runtime_1.getMesh)(meshOptions))
            .then(mesh => {
            const id = mesh.pubsub.subscribe('destroy', () => {
                meshInstance$ = undefined;
                mesh.pubsub.unsubscribe(id);
            });
            return mesh;
        });
    }
    return meshInstance$;
}
exports.getBuiltGraphClient = getBuiltGraphClient;
const execute = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));
exports.execute = execute;
const subscribe = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
exports.subscribe = subscribe;
function getBuiltGraphSDK(globalContext) {
    const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
    return getSdk((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
exports.getBuiltGraphSDK = getBuiltGraphSDK;
exports.NullifiersDocument = (0, utils_1.gql) `
  query Nullifiers($blockNumber: BigInt = 0) {
    nullifiers(
      orderBy: blockNumber
      where: { blockNumber_gte: $blockNumber }
      first: 1000
    ) {
      id
      blockNumber
      blockTimestamp
      transactionHash
      treeNumber
      nullifier
    }
  }
`;
exports.UnshieldsDocument = (0, utils_1.gql) `
  query Unshields($blockNumber: BigInt = 0) {
    unshields(
      orderBy: blockNumber
      where: { blockNumber_gte: $blockNumber }
      first: 1000
    ) {
      id
      blockNumber
      blockTimestamp
      to
      transactionHash
      fee
      value
      transactIndex
      token {
        id
        tokenType
        tokenSubID
        tokenAddress
      }
    }
  }
`;
exports.CommitmentsDocument = (0, utils_1.gql) `
  query Commitments($blockNumber: BigInt = 0) {
    commitments(
      orderBy: blockNumber
      where: { blockNumber_gte: $blockNumber }
      first: 1000
    ) {
      id
      treeNumber
      blockNumber
      transactionHash
      blockTimestamp
      ... on ShieldCommitment {
        id
        blockNumber
        blockTimestamp
        transactionHash
        treeNumber
        treePosition
        commitmentType
        hashes
        shieldKey
        fee
        encryptedBundle
        from
        preimage {
          id
          npk
          value
          token {
            id
            tokenType
            tokenSubID
            tokenAddress
          }
        }
      }
      ... on TransactCommitment {
        id
        blockNumber
        blockTimestamp
        transactionHash
        treeNumber
        batchStartTreePosition
        transactIndex
        commitmentType
        senderCiphertext
        hashes
        commitmentCiphertexts {
          id
          ciphertext
          blindedSenderViewingKey
          blindedReceiverViewingKey
        }
      }
    }
  }
`;
exports.RailgunTransactionsDocument = (0, utils_1.gql) `
  query RailgunTransactions($blockNumber: BigInt = 0) {
    railgunTransactions(
      orderBy: blockNumber
      where: { blockNumber_gte: $blockNumber }
      first: 1000
    ) {
      id
      blockNumber
      blockTimestamp
      transactionHash
      blockNumber
      blockTimestamp
      nullifiers
      commitments
      boundParamsHash
      hasUnshield
      utxoTreeIn
      utxoTreeOut
      utxoBatchStartPositionOut
      unshieldToken {
        id
        tokenType
        tokenAddress
        tokenSubID
      }
      unshieldToAddress
      unshieldValue
      verificationHash
    }
  }
`;
function getSdk(requester) {
    return {
        Nullifiers(variables, options) {
            return requester(exports.NullifiersDocument, variables, options);
        },
        Unshields(variables, options) {
            return requester(exports.UnshieldsDocument, variables, options);
        },
        Commitments(variables, options) {
            return requester(exports.CommitmentsDocument, variables, options);
        },
        RailgunTransactions(variables, options) {
            return requester(exports.RailgunTransactionsDocument, variables, options);
        },
    };
}
exports.getSdk = getSdk;
//# sourceMappingURL=index.js.map