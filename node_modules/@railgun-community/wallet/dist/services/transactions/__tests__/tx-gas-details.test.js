"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const shared_models_1 = require("@railgun-community/shared-models");
const mocks_test_1 = require("../../../tests/mocks.test");
const tx_gas_details_1 = require("../tx-gas-details");
const railgun_1 = require("../../railgun");
const ethers_1 = require("ethers");
const helper_test_1 = require("../../../tests/helper.test");
let gasEstimateStub;
const txidVersion = (0, helper_test_1.getTestTXIDVersion)();
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const stubGasEstimateSuccess = () => {
    gasEstimateStub = sinon_1.default.stub(ethers_1.FallbackProvider.prototype, 'estimateGas').resolves(BigInt('200'));
};
describe('tx-gas', () => {
    afterEach(() => {
        gasEstimateStub?.restore();
    });
    it('Should format gas estimate response', async () => {
        const transaction = {};
        const fallbackProvider = (0, shared_models_1.createFallbackProviderFromJsonConfig)(mocks_test_1.MOCK_FALLBACK_PROVIDER_JSON_CONFIG_POLYGON);
        (0, railgun_1.setFallbackProviderForNetwork)(shared_models_1.NetworkName.Polygon, fallbackProvider);
        const gasEstimate = await (0, tx_gas_details_1.getGasEstimate)(txidVersion, shared_models_1.NetworkName.Polygon, transaction, mocks_test_1.MOCK_ETH_WALLET_ADDRESS, true, // sendWithPublicWallet
        false);
        const isGasEstimateWithDummyProof = false;
        const rsp = (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, undefined, // broadcasterFeeCommitment
        isGasEstimateWithDummyProof);
        const expectedGas = 53000n; // This field may vary
        const variance = 0.05; // 5%
        const lowerBound = Number(expectedGas) * (1 - variance);
        const upperBound = Number(expectedGas) * (1 + variance);
        expect(Number(rsp.gasEstimate)).to.be.within(lowerBound, upperBound);
    }).timeout(6000);
    it('Should pull gas estimate for basic transaction - self-signed', async () => {
        stubGasEstimateSuccess();
        const fallbackProvider = (0, shared_models_1.createFallbackProviderFromJsonConfig)(mocks_test_1.MOCK_FALLBACK_PROVIDER_JSON_CONFIG_POLYGON);
        (0, railgun_1.setFallbackProviderForNetwork)(shared_models_1.NetworkName.Polygon, fallbackProvider);
        const tx = {
            chainId: 137n,
            to: mocks_test_1.MOCK_ETH_WALLET_ADDRESS,
            value: BigInt('100'),
            data: '0x',
        };
        const gasEstimate = await (0, tx_gas_details_1.getGasEstimate)(txidVersion, shared_models_1.NetworkName.Polygon, tx, mocks_test_1.MOCK_ETH_WALLET_ADDRESS, true, // sendWithPublicWallet
        false);
        const isGasEstimateWithDummyProof = true;
        const rsp = (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, undefined, // broadcasterFeeCommitment
        isGasEstimateWithDummyProof);
        expect(rsp.gasEstimate).to.not.be.undefined;
    }).timeout(60000);
    it('Should pull gas estimate for basic transaction - broadcaster', async () => {
        stubGasEstimateSuccess();
        const fallbackProvider = (0, shared_models_1.createFallbackProviderFromJsonConfig)(mocks_test_1.MOCK_FALLBACK_PROVIDER_JSON_CONFIG_POLYGON);
        (0, railgun_1.setFallbackProviderForNetwork)(shared_models_1.NetworkName.Polygon, fallbackProvider);
        const tx = {
            chainId: 137n,
            to: mocks_test_1.MOCK_ETH_WALLET_ADDRESS,
            value: BigInt('100'),
            data: '0x',
        };
        const gasEstimate = await (0, tx_gas_details_1.getGasEstimate)(txidVersion, shared_models_1.NetworkName.Polygon, tx, mocks_test_1.MOCK_ETH_WALLET_ADDRESS, false, // sendWithPublicWallet
        false);
        const isGasEstimateWithDummyProof = true;
        const rsp = (0, tx_gas_details_1.gasEstimateResponse)(gasEstimate, {}, isGasEstimateWithDummyProof);
        expect(rsp.gasEstimate).to.not.be.undefined;
    }).timeout(60000);
    it('Should set gas details for populated tx', () => {
        const transaction = {};
        const gasDetailsType0 = {
            evmGasType: shared_models_1.EVMGasType.Type0,
            gasEstimate: 100000n,
            gasPrice: 500n,
        };
        const gasDetailsType1 = {
            evmGasType: shared_models_1.EVMGasType.Type1,
            gasEstimate: 100000n,
            gasPrice: 500n,
        };
        const gasDetailsType2 = {
            evmGasType: shared_models_1.EVMGasType.Type2,
            gasEstimate: 120000n,
            maxFeePerGas: 10000n,
            maxPriorityFeePerGas: 500n,
        };
        // Polygon - self-sign
        (0, tx_gas_details_1.setGasDetailsForTransaction)(shared_models_1.NetworkName.Polygon, transaction, gasDetailsType2, true);
        expect(transaction.type).to.equal(2);
        expect(transaction.gasLimit).to.equal(144000n);
        expect(transaction.gasPrice).to.be.undefined;
        expect(transaction.maxFeePerGas).to.equal(10000n);
        expect(transaction.maxPriorityFeePerGas).to.equal(500n);
        // Polygon - Broadcaster
        (0, tx_gas_details_1.setGasDetailsForTransaction)(shared_models_1.NetworkName.Polygon, transaction, gasDetailsType1, false);
        // BNB - self-sign
        (0, tx_gas_details_1.setGasDetailsForTransaction)(shared_models_1.NetworkName.BNBChain, transaction, gasDetailsType0, true);
        // BNB - Broadcaster
        (0, tx_gas_details_1.setGasDetailsForTransaction)(shared_models_1.NetworkName.BNBChain, transaction, gasDetailsType0, false);
        expect(() => (0, tx_gas_details_1.setGasDetailsForTransaction)(shared_models_1.NetworkName.Polygon, transaction, gasDetailsType2, // mismatch
        true)).to.throw;
        expect(transaction.type).to.equal(0);
        expect(transaction.gasLimit).to.equal(120000n);
        expect(transaction.gasPrice).to.equal(500n);
    });
});
//# sourceMappingURL=tx-gas-details.test.js.map