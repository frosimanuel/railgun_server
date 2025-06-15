"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const utils_1 = require("../utils");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('utils', () => {
    it('Should test array comparisons', () => {
        expect((0, utils_1.compareStringArrays)(undefined, [])).to.be.false;
        expect((0, utils_1.compareStringArrays)([], undefined)).to.be.false;
        expect((0, utils_1.compareStringArrays)([], [])).to.be.true;
        expect((0, utils_1.compareStringArrays)([], ['1'])).to.be.false;
        expect((0, utils_1.compareStringArrays)(['1'], [])).to.be.false;
        expect((0, utils_1.compareStringArrays)(['1', '2'], ['2', '1'])).to.be.true;
    });
});
//# sourceMappingURL=utils.test.js.map