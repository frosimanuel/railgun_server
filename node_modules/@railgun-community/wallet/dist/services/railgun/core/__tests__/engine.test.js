"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const setup_test_1 = require("../../../../tests/setup.test");
const engine_1 = require("../engine");
const prover_1 = require("../prover");
const init_1 = require("../init");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('engine', () => {
    beforeEach(async () => {
        await (0, setup_test_1.initTestEngine)();
    });
    afterEach(async () => {
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should get active engine instance', () => {
        expect((0, engine_1.getEngine)()).to.not.be.undefined;
    });
    it('Should fail without active engine instance', async () => {
        await (0, init_1.stopRailgunEngine)();
        expect(() => (0, engine_1.getEngine)()).to.throw('RAILGUN Engine not yet initialized.');
        expect(() => (0, prover_1.getProver)()).to.throw('RAILGUN Engine not yet initialized.');
    });
});
//# sourceMappingURL=engine.test.js.map