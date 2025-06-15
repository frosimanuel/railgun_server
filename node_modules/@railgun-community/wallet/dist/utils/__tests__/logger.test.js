"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const logger_1 = require("../logger");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
describe('logger', () => {
    after(() => {
        (0, logger_1.setLoggers)(undefined, undefined);
    });
    it('Should test out logger setters', () => {
        const messageSpy = sinon_1.default.spy();
        const errorSpy = sinon_1.default.spy();
        (0, logger_1.setLoggers)(messageSpy, errorSpy);
        expect(messageSpy.notCalled).to.be.true;
        expect(errorSpy.notCalled).to.be.true;
        (0, logger_1.sendMessage)('msg');
        expect(messageSpy.calledOnce).to.be.true;
        (0, logger_1.sendErrorMessage)('err');
        expect(errorSpy.calledOnce).to.be.true;
    });
});
//# sourceMappingURL=logger.test.js.map