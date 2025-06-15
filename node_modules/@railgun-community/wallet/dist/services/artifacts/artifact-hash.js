"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArtifactDownload = void 0;
const crypto_1 = require("crypto");
const shared_models_1 = require("@railgun-community/shared-models");
const sha256_js_1 = require("ethereum-cryptography/sha256.js");
const logger_1 = require("../../utils/logger");
const artifact_v2_hashes_json_1 = __importDefault(require("./json/artifact-v2-hashes.json"));
const engine_1 = require("@railgun-community/engine");
const runtime_1 = require("../railgun/util/runtime");
const getExpectedArtifactHash = (artifactName, artifactVariantString) => {
    const hashes = artifact_v2_hashes_json_1.default;
    const variantHashes = hashes[artifactVariantString];
    if (!(0, shared_models_1.isDefined)(variantHashes)) {
        throw new Error(`No hashes for variant ${artifactName}: ${artifactVariantString}`);
    }
    if (artifactName === shared_models_1.ArtifactName.VKEY) {
        throw new Error(`No artifact hashes for vkey.`);
    }
    const hash = variantHashes[artifactName];
    if (!hash) {
        throw new Error(`No hash for artifact ${artifactName}: ${artifactVariantString}`);
    }
    return hash;
};
const getDataBytes = (data) => {
    if (data instanceof Uint8Array) {
        return data;
    }
    if (Buffer.isBuffer(data)) {
        return data.buffer;
    }
    return engine_1.ByteUtils.hexStringToBytes(data);
};
const validateArtifactDownload = async (data, artifactName, artifactVariantString) => {
    if (artifactName === shared_models_1.ArtifactName.VKEY) {
        return true;
    }
    const dataBytes = getDataBytes(data);
    const hash = runtime_1.isReactNative
        ? engine_1.ByteUtils.hexlify((0, sha256_js_1.sha256)(dataBytes))
        : (0, crypto_1.createHash)('sha256').update(dataBytes).digest('hex');
    const expectedHash = getExpectedArtifactHash(artifactName, artifactVariantString);
    if (hash !== expectedHash) {
        (0, logger_1.sendErrorMessage)(`Validate artifact blob for ${artifactName}: ${artifactVariantString}. Got ${hash}, expected ${expectedHash}.`);
    }
    return hash === expectedHash;
};
exports.validateArtifactDownload = validateArtifactDownload;
//# sourceMappingURL=artifact-hash.js.map