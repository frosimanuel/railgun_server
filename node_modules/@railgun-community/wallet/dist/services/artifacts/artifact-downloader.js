"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactDownloader = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const axios_1 = __importDefault(require("axios"));
const artifact_util_1 = require("./artifact-util");
const error_1 = require("../../utils/error");
const logger_1 = require("../../utils/logger");
const artifact_hash_1 = require("./artifact-hash");
class ArtifactDownloader {
    artifactStore;
    useNativeArtifacts;
    constructor(artifactStore, useNativeArtifacts) {
        this.artifactStore = artifactStore;
        this.useNativeArtifacts = useNativeArtifacts;
    }
    downloadArtifacts = async (artifactVariantString) => {
        (0, logger_1.sendMessage)(`Downloading artifacts: ${artifactVariantString}`);
        const [vkeyPath, zkeyPath, wasmOrDatPath] = await (0, shared_models_1.promiseTimeout)(Promise.all([
            this.downloadArtifact(shared_models_1.ArtifactName.VKEY, artifactVariantString),
            this.downloadArtifact(shared_models_1.ArtifactName.ZKEY, artifactVariantString),
            this.downloadArtifact(this.useNativeArtifacts ? shared_models_1.ArtifactName.DAT : shared_models_1.ArtifactName.WASM, artifactVariantString),
        ]), 45000, new Error(`Timed out downloading artifact files for ${artifactVariantString} circuit. Please try again.`));
        if (!(0, shared_models_1.isDefined)(vkeyPath)) {
            throw new Error('Could not download vkey artifact.');
        }
        if (!(0, shared_models_1.isDefined)(zkeyPath)) {
            throw new Error('Could not download zkey artifact.');
        }
        if (!(0, shared_models_1.isDefined)(wasmOrDatPath)) {
            throw new Error(this.useNativeArtifacts
                ? 'Could not download dat artifact.'
                : 'Could not download wasm artifact.');
        }
    };
    downloadArtifact = async (artifactName, artifactVariantString) => {
        const path = (0, artifact_util_1.artifactDownloadsPath)(artifactName, artifactVariantString);
        if (await this.artifactStore.exists(path)) {
            return path;
        }
        try {
            const url = (0, artifact_util_1.getArtifactUrl)(artifactName, artifactVariantString);
            const { data } = await axios_1.default.get(url, {
                method: 'GET',
                responseType: ArtifactDownloader.artifactResponseType(artifactName),
            });
            // NodeJS downloads as Buffer.
            // Browser downloads as ArrayBuffer.
            // Both will validate with the same hash.
            let dataFormatted;
            if (data instanceof ArrayBuffer || data instanceof Buffer) {
                dataFormatted = data;
            }
            else if (typeof data === 'object') {
                dataFormatted = JSON.stringify(data);
            }
            else if (typeof data === 'string') {
                dataFormatted = JSON.stringify(JSON.parse(data));
            }
            else {
                throw new Error('Unexpected response data type');
            }
            const decompressedData = ArtifactDownloader.getArtifactData(dataFormatted, artifactName);
            const isValid = await (0, artifact_hash_1.validateArtifactDownload)(decompressedData, artifactName, artifactVariantString);
            if (isValid) {
                await this.artifactStore.store((0, artifact_util_1.artifactDownloadsDir)(artifactVariantString), path, decompressedData);
            }
            else {
                throw new Error(`Invalid hash for artifact download: ${artifactName} for ${artifactVariantString}.`);
            }
            return path;
        }
        catch (err) {
            throw (0, error_1.reportAndSanitizeError)(this.downloadArtifact.name, err);
        }
    };
    static getArtifactData = (data, artifactName) => {
        switch (artifactName) {
            case shared_models_1.ArtifactName.VKEY:
                return data;
            case shared_models_1.ArtifactName.ZKEY:
            case shared_models_1.ArtifactName.DAT:
            case shared_models_1.ArtifactName.WASM:
                return (0, artifact_util_1.decompressArtifact)(data);
        }
    };
    static artifactResponseType = (artifactName) => {
        switch (artifactName) {
            case shared_models_1.ArtifactName.VKEY:
                return 'text';
            case shared_models_1.ArtifactName.ZKEY:
            case shared_models_1.ArtifactName.DAT:
            case shared_models_1.ArtifactName.WASM:
                return 'arraybuffer';
        }
    };
    getDownloadedArtifact = async (path) => {
        try {
            const storedItem = await this.artifactStore.get(path);
            return storedItem;
        }
        catch (err) {
            return null;
        }
    };
    getDownloadedArtifacts = async (artifactVariantString) => {
        const artifactDownloadsPaths = (0, artifact_util_1.getArtifactDownloadsPaths)(artifactVariantString);
        const [vkeyString, zkeyBuffer, datBuffer, wasmBuffer] = await Promise.all([
            this.getDownloadedArtifact(artifactDownloadsPaths[shared_models_1.ArtifactName.VKEY]),
            this.getDownloadedArtifact(artifactDownloadsPaths[shared_models_1.ArtifactName.ZKEY]),
            this.useNativeArtifacts
                ? this.getDownloadedArtifact(artifactDownloadsPaths[shared_models_1.ArtifactName.DAT])
                : Promise.resolve(undefined),
            !this.useNativeArtifacts
                ? this.getDownloadedArtifact(artifactDownloadsPaths[shared_models_1.ArtifactName.WASM])
                : Promise.resolve(undefined),
        ]);
        if (vkeyString == null) {
            throw new Error('Could not retrieve vkey artifact.');
        }
        if (zkeyBuffer == null) {
            throw new Error('Could not retrieve zkey artifact.');
        }
        if (this.useNativeArtifacts && datBuffer == null) {
            throw new Error('Could not retrieve dat artifact.');
        }
        if (!this.useNativeArtifacts && wasmBuffer == null) {
            throw new Error('Could not retrieve wasm artifact.');
        }
        return {
            vkey: JSON.parse(vkeyString),
            zkey: zkeyBuffer,
            wasm: wasmBuffer,
            dat: datBuffer,
        };
    };
}
exports.ArtifactDownloader = ArtifactDownloader;
//# sourceMappingURL=artifact-downloader.js.map