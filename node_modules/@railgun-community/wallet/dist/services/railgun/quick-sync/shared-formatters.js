"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigIntStringToHex = exports.formatTo32Bytes = exports.formatTo16Bytes = exports.formatPreImage = exports.formatSerializedToken = exports.graphTokenTypeToEngineTokenType = void 0;
const engine_1 = require("@railgun-community/engine");
const graphTokenTypeToEngineTokenType = (graphTokenType) => {
    switch (graphTokenType) {
        case 'ERC20':
            return engine_1.TokenType.ERC20;
        case 'ERC721':
            return engine_1.TokenType.ERC721;
        case 'ERC1155':
            return engine_1.TokenType.ERC1155;
    }
};
exports.graphTokenTypeToEngineTokenType = graphTokenTypeToEngineTokenType;
const formatSerializedToken = (graphToken) => {
    return (0, engine_1.serializeTokenData)(graphToken.tokenAddress, (0, exports.graphTokenTypeToEngineTokenType)(graphToken.tokenType), graphToken.tokenSubID);
};
exports.formatSerializedToken = formatSerializedToken;
const formatPreImage = (graphPreImage) => {
    return (0, engine_1.serializePreImage)(graphPreImage.npk, (0, exports.formatSerializedToken)(graphPreImage.token), BigInt(graphPreImage.value));
};
exports.formatPreImage = formatPreImage;
const formatTo16Bytes = (value, prefix) => {
    return engine_1.ByteUtils.formatToByteLength(value, engine_1.ByteLength.UINT_128, prefix);
};
exports.formatTo16Bytes = formatTo16Bytes;
const formatTo32Bytes = (value, prefix) => {
    return engine_1.ByteUtils.formatToByteLength(value, engine_1.ByteLength.UINT_256, prefix);
};
exports.formatTo32Bytes = formatTo32Bytes;
const bigIntStringToHex = (bigintString) => {
    return `0x${BigInt(bigintString).toString(16)}`;
};
exports.bigIntStringToHex = bigIntStringToHex;
//# sourceMappingURL=shared-formatters.js.map