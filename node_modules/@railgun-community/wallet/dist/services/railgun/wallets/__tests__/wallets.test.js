"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const engine_1 = require("../../core/engine");
const wallets_1 = require("../wallets");
const mocks_test_1 = require("../../../../tests/mocks.test");
const setup_test_1 = require("../../../../tests/setup.test");
const shared_models_1 = require("@railgun-community/shared-models");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
let wallet;
describe('wallets', () => {
    before(async function run() {
        this.timeout(60000);
        await (0, setup_test_1.initTestEngine)();
        await (0, setup_test_1.initTestEngineNetworks)();
        const railgunWalletInfo = await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC_2, { [shared_models_1.NetworkName.Ethereum]: 0, [shared_models_1.NetworkName.Polygon]: 2 });
        if (!(0, shared_models_1.isDefined)(railgunWalletInfo)) {
            throw new Error(`Could not create wallet`);
        }
        wallet = (0, wallets_1.fullWalletForID)(railgunWalletInfo.id);
    });
    after(async () => {
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should create view only wallet', async () => {
        const railgunWalletInfo = await (0, wallets_1.createViewOnlyRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, wallet.generateShareableViewingKey(), undefined);
        if (!(0, shared_models_1.isDefined)(railgunWalletInfo)) {
            throw new Error('Could not create view-only wallet');
        }
        const viewOnlyWallet = (0, wallets_1.viewOnlyWalletForID)(railgunWalletInfo.id);
        expect(viewOnlyWallet).to.not.be.undefined;
        expect(railgunWalletInfo.railgunAddress).to.equal(wallet.getAddress());
    }).timeout(60000);
    it('Should get wallet address', () => {
        const addressAny = (0, wallets_1.getRailgunAddress)(wallet.id);
        expect(addressAny).to.equal('0zk1qykzjxctynyz4z43pukckpv43jyzhyvy0ehrd5wuc54l5enqf9qfrrv7j6fe3z53la7enqphqvxys9aqyp9xx0km95ehqslx8apmu8l7anc7emau4tvsultrkvd');
    });
    it('Should get wallet shareable viewing key', async () => {
        const shareableKey = await (0, wallets_1.getWalletShareableViewingKey)(wallet.id);
        expect(shareableKey).to.equal('82a57670726976d94032643030623234396632646337313236303565336263653364373665376631313931373933363436393365333931666566643963323764303161396262336433a473707562d94030633661376436386331663437303262613764666134613361353236323035303765386637366632393139326363666637653861366231303637393062316165');
    });
    it('Should get wallet mnemonic', async () => {
        const mnemonic = await (0, wallets_1.getWalletMnemonic)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, wallet.id);
        expect(mnemonic).to.equal(mocks_test_1.MOCK_MNEMONIC_2);
    });
    it('Should create and load wallet from valid mnemonic', async () => {
        const railgunWalletInfo = await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC_2, undefined);
        expect(railgunWalletInfo.railgunAddress).to.be.a('string');
        expect(railgunWalletInfo.id).to.equal(wallet.id);
        const loadWalletInfo = await (0, wallets_1.loadWalletByID)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, railgunWalletInfo.id, false);
        expect(loadWalletInfo.railgunAddress).to.be.a('string');
        expect(loadWalletInfo.id).to.equal(wallet.id);
    });
    it('Should load wallet from db after Engine wallet unload', async () => {
        expect(Object.keys((0, engine_1.getEngine)().wallets)).to.include(wallet.id);
        (0, wallets_1.unloadWalletByID)(wallet.id);
        expect(Object.keys((0, engine_1.getEngine)().wallets)).to.not.include(wallet.id);
        const railgunWalletInfo = await (0, wallets_1.loadWalletByID)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, wallet.id, false);
        expect(railgunWalletInfo.id).to.equal(wallet.id);
        expect(railgunWalletInfo.railgunAddress).to.equal(wallet.getAddress(undefined));
    });
    it('Should error for unknown load wallet', async () => {
        await expect((0, wallets_1.loadWalletByID)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, 'unknown', false)).rejectedWith('Could not load RAILGUN wallet');
    });
    it('Should validate RAILGUN addresses', async () => {
        expect((0, wallets_1.validateRailgunAddress)('0x9E9F988356f46744Ee0374A17a5Fa1a3A3cC3777'))
            .to.be.false;
        expect((0, wallets_1.validateRailgunAddress)('9E9F988356f46744Ee0374A17a5Fa1a3A3cC3777'))
            .to.be.false;
        expect((0, wallets_1.validateRailgunAddress)('rgtestropsten1qyglk9smgj240x2xmj2laj7p5hexw0a30vvdqnv9gk020nsd7yzgwkgce9x')).to.be.false;
        expect((0, wallets_1.validateRailgunAddress)('0zk1q8hxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kfrv7j6fe3z53llhxknrs97q8pjxaagwthzc0df99rzmhl2xnlxmgv9akv32sua0kg0zpzts')).to.be.true;
        expect((0, wallets_1.validateRailgunAddress)('0zk1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqunpd9kxwatwqyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhshkca')).to.be.true;
    });
});
//# sourceMappingURL=wallets.test.js.map