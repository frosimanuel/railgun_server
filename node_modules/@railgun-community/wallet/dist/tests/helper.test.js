"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestTXIDVersion = exports.isV2Test = void 0;
const engine_1 = require("@railgun-community/engine");
const isV2Test = () => {
    return process.env.V2_TEST === '1';
};
exports.isV2Test = isV2Test;
const getTestTXIDVersion = () => {
    if ((0, exports.isV2Test)()) {
        return engine_1.TXIDVersion.V2_PoseidonMerkle;
    }
    return engine_1.TXIDVersion.V3_PoseidonMerkle;
};
exports.getTestTXIDVersion = getTestTXIDVersion;
//# sourceMappingURL=helper.test.js.map