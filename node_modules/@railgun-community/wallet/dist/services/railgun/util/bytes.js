"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.toUTF8String = exports.fromUTF8String = exports.ByteUtils = exports.ByteLength = exports.bytesToHex = exports.getRandomBytes = exports.parseRailgunTokenAddress = void 0;
const engine_1 = require("@railgun-community/engine");
Object.defineProperty(exports, "ByteLength", { enumerable: true, get: function () { return engine_1.ByteLength; } });
Object.defineProperty(exports, "ByteUtils", { enumerable: true, get: function () { return engine_1.ByteUtils; } });
Object.defineProperty(exports, "fromUTF8String", { enumerable: true, get: function () { return engine_1.fromUTF8String; } });
Object.defineProperty(exports, "toUTF8String", { enumerable: true, get: function () { return engine_1.toUTF8String; } });
Object.defineProperty(exports, "Database", { enumerable: true, get: function () { return engine_1.Database; } });
const parseRailgunTokenAddress = (tokenAddress) => {
    return engine_1.ByteUtils.formatToByteLength(tokenAddress, engine_1.ByteLength.Address, true);
};
exports.parseRailgunTokenAddress = parseRailgunTokenAddress;
const getRandomBytes = (length) => {
    return engine_1.ByteUtils.randomHex(length);
};
exports.getRandomBytes = getRandomBytes;
const bytesToHex = (bytes) => {
    return Buffer.from(bytes).toString('hex');
};
exports.bytesToHex = bytesToHex;
//# sourceMappingURL=bytes.js.map