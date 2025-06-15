"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPollingProviderForNetwork = exports.setFallbackProviderForNetwork = exports.getPollingProviderForNetwork = exports.getFallbackProviderForNetwork = exports.pollingProviderMap = exports.fallbackProviderMap = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
exports.fallbackProviderMap = {};
exports.pollingProviderMap = {};
const getFallbackProviderForNetwork = (networkName) => {
    const provider = exports.fallbackProviderMap[networkName];
    if (!(0, shared_models_1.isDefined)(provider)) {
        throw new Error(`Provider not yet loaded for network ${networkName}`);
    }
    return provider;
};
exports.getFallbackProviderForNetwork = getFallbackProviderForNetwork;
const getPollingProviderForNetwork = (networkName) => {
    const provider = exports.pollingProviderMap[networkName];
    if (!(0, shared_models_1.isDefined)(provider)) {
        throw new Error(`Polling provider not yet loaded for network ${networkName}`);
    }
    return provider;
};
exports.getPollingProviderForNetwork = getPollingProviderForNetwork;
const setFallbackProviderForNetwork = (networkName, provider) => {
    exports.fallbackProviderMap[networkName] = provider;
};
exports.setFallbackProviderForNetwork = setFallbackProviderForNetwork;
const setPollingProviderForNetwork = (networkName, provider) => {
    exports.pollingProviderMap[networkName] = provider;
};
exports.setPollingProviderForNetwork = setPollingProviderForNetwork;
//# sourceMappingURL=providers.js.map