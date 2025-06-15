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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const ed = __importStar(require("@noble/ed25519"));
const crypto_1 = require("../crypto");
const bytes_1 = require("../bytes");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('crypto-util', () => {
    it('Should verify signature', async () => {
        const privateKey = ed.utils.randomPrivateKey();
        const data = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
        const publicKey = await ed.getPublicKey(privateKey);
        const signature = await ed.sign(data, privateKey);
        const isValidBytes = await (0, crypto_1.verifyBroadcasterSignature)(signature, data, publicKey);
        expect(isValidBytes).to.be.true;
        const isValidHex = await (0, crypto_1.verifyBroadcasterSignature)((0, bytes_1.bytesToHex)(signature), (0, bytes_1.bytesToHex)(data), publicKey);
        expect(isValidHex).to.be.true;
    });
    it('Should encrypt and decrypt data with shareable random pubkey', async () => {
        const privateKey = ed.utils.randomPrivateKey();
        const externalPubKey = await ed.getPublicKey(privateKey);
        const data = { test: '123', value: 678 };
        const { encryptedData, randomPubKey } = await (0, crypto_1.encryptDataWithSharedKey)(data, externalPubKey);
        expect(randomPubKey.length).to.equal(64);
        const sharedKey = await ed.getSharedSecret(privateKey, randomPubKey);
        const decrypted = (0, crypto_1.decryptAESGCM256)(encryptedData, sharedKey);
        expect(decrypted).to.deep.equal(data);
    });
    it('Should calculate PBKDF2 hash', async () => {
        const hash = await (0, crypto_1.pbkdf2)('secret', '0c6c732c2b03dfb6cf5f5893', 1000000);
        expect(hash).to.equal('ac0323bc154cc4b7ac0440eee6414356801faa198bb635d0b60441e3a043a706');
    });
});
//# sourceMappingURL=crypto-util.test.js.map