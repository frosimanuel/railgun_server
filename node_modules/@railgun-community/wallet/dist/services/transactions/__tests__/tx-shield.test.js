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
const tx_shield_1 = require("../tx-shield");
const wallets_1 = require("../../railgun/wallets/wallets");
const railgun_1 = require("../../railgun");
const ethers_1 = require("ethers");
const helper_test_1 = require("../../../tests/helper.test");
const txGasDetailsModule = __importStar(require("../tx-gas-details"));
let getGasEstimateStub;
let gasEstimateStub;
let sendTxStub;
const txidVersion = (0, helper_test_1.getTestTXIDVersion)();
const shieldPrivateKey = (0, railgun_1.getRandomBytes)(32);
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const gasDetails = {
    evmGasType: shared_models_1.EVMGasType.Type2,
    gasEstimate: BigInt('0x10'),
    maxFeePerGas: BigInt('0x1000'),
    maxPriorityFeePerGas: BigInt('0x100'),
};
const MOCK_TOKEN_AMOUNT_RECIPIENTS = [
    {
        tokenAddress: mocks_test_1.MOCK_TOKEN_ADDRESS,
        amount: BigInt(0x100),
        recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
    },
    {
        tokenAddress: mocks_test_1.MOCK_TOKEN_ADDRESS_2,
        amount: BigInt(0x200),
        recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
    },
];
const MOCK_TOKEN_AMOUNT_RECIPIENTS_INVALID = [
    {
        tokenAddress: mocks_test_1.MOCK_TOKEN_ADDRESS,
        amount: BigInt(0x100),
        recipientAddress: '0x1234',
    },
    {
        tokenAddress: mocks_test_1.MOCK_TOKEN_ADDRESS_2,
        amount: BigInt(0x200),
        recipientAddress: '0x1234',
    },
];
const stubSuccess = () => {
    gasEstimateStub = sinon_1.default.stub(ethers_1.FallbackProvider.prototype, 'estimateGas').resolves(200n);
};
const stubFailure = () => {
    gasEstimateStub = sinon_1.default.stub(ethers_1.FallbackProvider.prototype, 'estimateGas').rejects(new Error('test rejection - gas estimate'));
};
const stubGetGasEstimate = () => {
    getGasEstimateStub = sinon_1.default.stub(txGasDetailsModule, 'getGasEstimate').resolves(200n);
};
const stubGetGasEstimateFailure = () => {
    getGasEstimateStub = sinon_1.default.stub(txGasDetailsModule, 'getGasEstimate').rejects(new Error('test rejection - gas estimate'));
};
describe('tx-shield', () => {
    before(async function run() {
        this.timeout(60000);
        await (0, setup_test_1.initTestEngine)();
        await (0, setup_test_1.initTestEngineNetworks)();
        await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC, undefined);
    });
    afterEach(() => {
        gasEstimateStub?.restore();
        sendTxStub?.restore();
        getGasEstimateStub?.restore();
    });
    after(async () => {
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should get expected signature message for shieldPrivateKey', () => {
        expect((0, tx_shield_1.getShieldPrivateKeySignatureMessage)()).to.equal('RAILGUN_SHIELD');
    });
    it('Should get gas estimate for valid shield', async () => {
        stubGetGasEstimate();
        const rsp = await (0, tx_shield_1.gasEstimateForShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_ETH_WALLET_ADDRESS);
        expect(rsp.gasEstimate).to.equal(200n);
    });
    it('Should error on gas estimates for invalid shield', async () => {
        stubGetGasEstimate();
        await expect((0, tx_shield_1.gasEstimateForShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS_INVALID, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_ETH_WALLET_ADDRESS)).rejectedWith('Invalid RAILGUN address.');
    });
    it('Should error for ethers rejections', async () => {
        stubGetGasEstimateFailure();
        await expect((0, tx_shield_1.gasEstimateForShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_ETH_WALLET_ADDRESS)).rejectedWith('test rejection - gas estimate');
    });
    it('Should send tx for valid shield - no gas details', async () => {
        stubGetGasEstimate();
        const { transaction } = await (0, tx_shield_1.populateShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, undefined);
        expect(transaction).to.be.an('object');
        expect(transaction.data).to.be.a('string');
        expect(transaction.to).to.equal('0x19b620929f97b7b990801496c3b361ca5def8c71');
        expect(transaction.gasPrice).to.be.undefined;
        expect(transaction.gasLimit).to.be.undefined;
        expect(transaction.maxFeePerGas).to.be.undefined;
        expect(transaction.maxPriorityFeePerGas).to.be.undefined;
    });
    it('Should send tx for valid shield - gas details', async () => {
        stubGetGasEstimate();
        const { transaction } = await (0, tx_shield_1.populateShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, gasDetails);
        expect(transaction).to.be.an('object');
        expect(transaction.data).to.be.a('string');
        expect(transaction.to).to.equal('0x19b620929f97b7b990801496c3b361ca5def8c71');
        expect(transaction.gasPrice).to.be.undefined;
        expect(transaction.gasLimit).to.equal(BigInt('0x13'));
        expect(transaction.maxFeePerGas).to.equal(BigInt('0x1000'));
        expect(transaction.maxPriorityFeePerGas).to.equal(BigInt('0x0100'));
    });
    it('Should error on send tx for invalid shield', async () => {
        stubGetGasEstimate();
        await expect((0, tx_shield_1.populateShield)(txidVersion, shared_models_1.NetworkName.Polygon, shieldPrivateKey, MOCK_TOKEN_AMOUNT_RECIPIENTS_INVALID, mocks_test_1.MOCK_NFT_AMOUNT_RECIPIENTS, gasDetails)).rejectedWith('Invalid RAILGUN address.');
    });
});
//# sourceMappingURL=tx-shield.test.js.map