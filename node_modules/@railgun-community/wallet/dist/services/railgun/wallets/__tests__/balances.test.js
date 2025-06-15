"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("@railgun-community/engine");
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const mocks_test_1 = require("../../../../tests/mocks.test");
const setup_test_1 = require("../../../../tests/setup.test");
const wallets_1 = require("../wallets");
const balances_1 = require("../balances");
const shared_models_1 = require("@railgun-community/shared-models");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
let walletScanStub;
let walletFullScanStub;
let engineScanStub;
let engineFullScanStub;
describe('balances', () => {
    before(async () => {
        await (0, setup_test_1.initTestEngine)();
        const railgunWalletInfo = await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC, undefined);
        if (!(0, shared_models_1.isDefined)(railgunWalletInfo)) {
            return;
        }
        walletScanStub = sinon_1.default.stub(engine_1.RailgunWallet.prototype, 'decryptBalances').resolves();
        engineScanStub = sinon_1.default.stub(engine_1.RailgunEngine.prototype, 'scanContractHistory').resolves();
        walletFullScanStub = sinon_1.default.stub(engine_1.RailgunWallet.prototype, 'fullRedecryptBalancesAllTXIDVersions').resolves();
        engineFullScanStub = sinon_1.default.stub(engine_1.RailgunEngine.prototype, 'fullRescanUTXOMerkletreesAndWallets').resolves();
    });
    afterEach(() => {
        walletScanStub.resetHistory();
        engineScanStub.resetHistory();
        walletFullScanStub.resetHistory();
        engineFullScanStub.resetHistory();
    });
    after(async () => {
        walletScanStub.restore();
        engineScanStub.restore();
        walletFullScanStub.restore();
        engineFullScanStub.restore();
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should scan for updates to merkletree and wallets', async () => {
        const chain = { type: shared_models_1.ChainType.EVM, id: 1 };
        const response = await (0, balances_1.refreshBalances)(chain, undefined);
        expect(response).to.be.undefined;
        expect(engineScanStub.calledOnce).to.be.true;
    });
    it('Should run full rescan of merkletree and wallets', async () => {
        const chain = { type: shared_models_1.ChainType.EVM, id: 1 };
        const response = await (0, balances_1.rescanFullUTXOMerkletreesAndWallets)(chain, undefined);
        expect(response).to.be.undefined;
        expect(engineFullScanStub.calledOnce).to.be.true;
    });
});
//# sourceMappingURL=balances.test.js.map