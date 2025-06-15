"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const blocked_address_1 = require("../blocked-address");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('blocked-address', () => {
    it('Should recognize blocked addresses', async () => {
        expect((0, blocked_address_1.isBlockedAddress)('0x1356c899d8c9467c7f71c195612f8a395abf2f0a')).to.equal(true);
        expect((0, blocked_address_1.isBlockedAddress)('0x1356c899d8c9467c7f71c195612f8a395abf2f0a'.toUpperCase())).to.equal(true);
        expect((0, blocked_address_1.isBlockedAddress)('0x8356c899d8c9467c7f71c195612f8a395abf2f0a')).to.equal(false);
        expect((0, blocked_address_1.isBlockedAddress)(undefined)).to.equal(false);
    });
    it('Assert should throw on blocked address', async () => {
        expect(() => (0, blocked_address_1.assertNotBlockedAddress)('0x1356c899d8c9467c7f71c195612f8a395abf2f0a')).to.throw();
        expect(() => (0, blocked_address_1.assertNotBlockedAddress)('0x8356c899d8c9467c7f71c195612f8a395abf2f0a')).to.not.throw();
    });
});
//# sourceMappingURL=blocked-address.test.js.map