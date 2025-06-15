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
const sinon_1 = __importDefault(require("sinon"));
const shared_models_1 = require("@railgun-community/shared-models");
const setup_test_1 = require("../../../tests/setup.test");
const mocks_test_1 = require("../../../tests/mocks.test");
const tx_shield_base_token_1 = require("../tx-shield-base-token");
const txGasDetailsModule = __importStar(require("../tx-gas-details"));
const wallets_1 = require("../../railgun/wallets/wallets");
const engine_1 = require("@railgun-community/engine");
const helper_test_1 = require("../../../tests/helper.test");
let getGasEstimateStub;
let gasEstimateStub;
let sendTxStub;
let railgunAddress;
const txidVersion = (0, helper_test_1.getTestTXIDVersion)();
const shieldPrivateKey = engine_1.ByteUtils.randomHex(32);
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const gasDetails = {
    evmGasType: shared_models_1.EVMGasType.Type2,
    gasEstimate: 1000n,
    maxFeePerGas: BigInt('0x1000'),
    maxPriorityFeePerGas: BigInt('0x100'),
};
const stubGetGasEstimate = () => {
    getGasEstimateStub = sinon_1.default.stub(txGasDetailsModule, 'getGasEstimate').resolves(200n);
};
const stubGetGasEstimateFailure = () => {
    getGasEstimateStub = sinon_1.default.stub(txGasDetailsModule, 'getGasEstimate').rejects(new Error('test rejection - gas estimate'));
};
describe('tx-shield-base-token', () => {
    before(async function run() {
        this.timeout(60000);
        await (0, setup_test_1.initTestEngine)();
        await (0, setup_test_1.initTestEngineNetworks)();
        const railgunWalletInfo = await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC, undefined);
        railgunAddress = railgunWalletInfo.railgunAddress;
    });
    afterEach(() => {
        gasEstimateStub?.restore();
        sendTxStub?.restore();
        getGasEstimateStub?.restore();
    });
    after(async () => {
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should get gas estimate for valid shield base token', async () => {
        stubGetGasEstimate();
        const rsp = await (0, tx_shield_base_token_1.gasEstimateForShieldBaseToken)(txidVersion, shared_models_1.NetworkName.Polygon, railgunAddress, shieldPrivateKey, mocks_test_1.MOCK_TOKEN_AMOUNTS[0], mocks_test_1.MOCK_ETH_WALLET_ADDRESS);
        expect(rsp.gasEstimate).to.equal(200n);
    });
    it('Should error on gas estimates for invalid shield base token', async () => {
        stubGetGasEstimate();
        await expect((0, tx_shield_base_token_1.gasEstimateForShieldBaseToken)(txidVersion, shared_models_1.NetworkName.Polygon, '123456789', shieldPrivateKey, mocks_test_1.MOCK_TOKEN_AMOUNTS[0], mocks_test_1.MOCK_ETH_WALLET_ADDRESS)).rejectedWith('Invalid RAILGUN address.');
    });
    it('Should error for ethers rejections', async () => {
        stubGetGasEstimateFailure();
        await expect((0, tx_shield_base_token_1.gasEstimateForShieldBaseToken)(txidVersion, shared_models_1.NetworkName.Polygon, railgunAddress, shieldPrivateKey, mocks_test_1.MOCK_TOKEN_AMOUNTS[0], mocks_test_1.MOCK_ETH_WALLET_ADDRESS)).rejectedWith('test rejection - gas estimate');
    });
    it('Should send tx for valid shield base token', async () => {
        stubGetGasEstimate();
        const { transaction } = await (0, tx_shield_base_token_1.populateShieldBaseToken)(txidVersion, shared_models_1.NetworkName.Polygon, railgunAddress, shieldPrivateKey, mocks_test_1.MOCK_TOKEN_AMOUNTS[0], gasDetails);
        expect(transaction).to.be.an('object');
        expect(transaction.data).to.be.a('string');
        expect(transaction.to).to.be.a('string');
    });
    it('Should error on send tx for invalid shield base token', async () => {
        stubGetGasEstimate();
        await expect((0, tx_shield_base_token_1.populateShieldBaseToken)(txidVersion, shared_models_1.NetworkName.Polygon, '123456789', shieldPrivateKey, mocks_test_1.MOCK_TOKEN_AMOUNTS[0], gasDetails)).rejectedWith('Invalid RAILGUN address.');
    });
});
//# sourceMappingURL=tx-shield-base-token.test.js.map