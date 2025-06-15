"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mnemonicTo0xPKey = void 0;
const engine_1 = require("@railgun-community/engine");
const mnemonicTo0xPKey = (mnemonic, derivationIndex) => {
    return `0x${engine_1.Mnemonic.to0xPrivateKey(mnemonic, derivationIndex)}`;
};
exports.mnemonicTo0xPKey = mnemonicTo0xPKey;
//# sourceMappingURL=ethers-util.js.map