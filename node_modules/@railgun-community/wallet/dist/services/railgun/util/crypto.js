"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicViewingKey = exports.tryDecryptJSONDataWithSharedKey = exports.encryptJSONDataWithSharedKey = exports.pbkdf2 = exports.encryptAESGCM256 = exports.decryptAESGCM256 = exports.encryptDataWithSharedKey = exports.verifyBroadcasterSignature = void 0;
const ed = __importStar(require("@noble/ed25519"));
const engine_1 = require("@railgun-community/engine");
Object.defineProperty(exports, "encryptJSONDataWithSharedKey", { enumerable: true, get: function () { return engine_1.encryptJSONDataWithSharedKey; } });
Object.defineProperty(exports, "tryDecryptJSONDataWithSharedKey", { enumerable: true, get: function () { return engine_1.tryDecryptJSONDataWithSharedKey; } });
Object.defineProperty(exports, "getPublicViewingKey", { enumerable: true, get: function () { return engine_1.getPublicViewingKey; } });
const bytes_1 = require("./bytes");
const util_1 = require("util");
const crypto_1 = require("crypto");
const pbkdf2_1 = require("ethereum-cryptography/pbkdf2");
const runtime_1 = require("./runtime");
const verifyBroadcasterSignature = (signature, data, signingKey) => {
    return (0, engine_1.verifyED25519)(data, signature, signingKey);
};
exports.verifyBroadcasterSignature = verifyBroadcasterSignature;
const encryptDataWithSharedKey = async (data, externalPubKey) => {
    const randomPrivKey = engine_1.ByteUtils.hexStringToBytes((0, bytes_1.getRandomBytes)(32));
    const randomPubKeyUint8Array = await (0, engine_1.getPublicViewingKey)(randomPrivKey);
    const randomPubKey = engine_1.ByteUtils.hexlify(randomPubKeyUint8Array);
    const sharedKey = await ed.getSharedSecret(randomPrivKey, externalPubKey);
    const encryptedData = (0, engine_1.encryptJSONDataWithSharedKey)(data, sharedKey);
    return { encryptedData, randomPubKey, sharedKey };
};
exports.encryptDataWithSharedKey = encryptDataWithSharedKey;
const decryptAESGCM256 = (encryptedData, sharedKey) => {
    return (0, engine_1.tryDecryptJSONDataWithSharedKey)(encryptedData, sharedKey);
};
exports.decryptAESGCM256 = decryptAESGCM256;
const encryptAESGCM256 = (data, sharedKey) => {
    return (0, engine_1.encryptJSONDataWithSharedKey)(data, sharedKey);
};
exports.encryptAESGCM256 = encryptAESGCM256;
/**
 * Calculates PBKDF2 hash
 * @param secret - input
 * @param salt - salt
 * @param iterations - rounds
 */
const pbkdf2 = async (secret, salt, iterations) => {
    const secretBuffer = Buffer.from(secret, 'utf-8');
    const secretFormatted = new Uint8Array(engine_1.ByteUtils.arrayify(secretBuffer));
    const saltFormatted = new Uint8Array(engine_1.ByteUtils.arrayify(salt));
    const keyLength = 32; // Bytes
    const digest = 'sha256';
    let key;
    if (runtime_1.isReactNative) {
        key = await (0, pbkdf2_1.pbkdf2)(secretFormatted, saltFormatted, iterations, keyLength, digest);
    }
    else {
        key = await (0, util_1.promisify)(crypto_1.pbkdf2)(secretFormatted, saltFormatted, iterations, keyLength, digest);
    }
    return engine_1.ByteUtils.hexlify(key);
};
exports.pbkdf2 = pbkdf2;
//# sourceMappingURL=crypto.js.map