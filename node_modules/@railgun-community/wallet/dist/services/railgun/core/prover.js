"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProver = void 0;
const engine_1 = require("./engine");
const shared_models_1 = require("@railgun-community/shared-models");
const getProver = () => {
    const engine = (0, engine_1.getEngine)();
    if (!(0, shared_models_1.isDefined)(engine)) {
        throw new Error('RAILGUN Engine not yet init. Please reload your app or try again.');
    }
    return engine.prover;
};
exports.getProver = getProver;
//# sourceMappingURL=prover.js.map