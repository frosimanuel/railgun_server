"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const bytes_1 = require("../bytes");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('bytes-util', () => {
    it('Should parse rail balance addresses', () => {
        expect((0, bytes_1.parseRailgunTokenAddress)('00')).to.equal('0x0000000000000000000000000000000000000000');
        expect((0, bytes_1.parseRailgunTokenAddress)('123456789012345678901234567890')).to.equal('0x0000000000123456789012345678901234567890');
    });
    it('Should return random bytes of length', () => {
        expect((0, bytes_1.getRandomBytes)(1).length).to.equal(2);
        expect((0, bytes_1.getRandomBytes)(16).length).to.equal(32);
        expect((0, bytes_1.getRandomBytes)(32).length).to.equal(64);
        expect((0, bytes_1.getRandomBytes)(80).length).to.equal(160);
    });
});
//# sourceMappingURL=bytes-util.test.js.map