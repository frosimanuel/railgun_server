"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEngine = exports.hasEngine = exports.getEngine = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
let savedEngine;
const getEngine = () => {
    if (!savedEngine) {
        throw new Error('RAILGUN Engine not yet initialized.');
    }
    return savedEngine;
};
exports.getEngine = getEngine;
const hasEngine = () => {
    return (0, shared_models_1.isDefined)(savedEngine);
};
exports.hasEngine = hasEngine;
const setEngine = (engine) => {
    savedEngine = engine;
};
exports.setEngine = setEngine;
//# sourceMappingURL=engine.js.map