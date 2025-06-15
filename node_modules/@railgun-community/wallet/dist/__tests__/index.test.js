"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = __importDefault(require("../index"));
describe('index', () => {
    it('Should load main for test', async () => {
        (0, chai_1.expect)(index_1.default).to.deep.equal({});
    });
});
//# sourceMappingURL=index.test.js.map