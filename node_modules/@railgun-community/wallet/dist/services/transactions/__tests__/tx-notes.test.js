"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("@railgun-community/engine");
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const mocks_test_1 = require("../../../tests/mocks.test");
const setup_test_1 = require("../../../tests/setup.test");
const wallets_1 = require("../../railgun/wallets/wallets");
const tx_notes_1 = require("../tx-notes");
const MOCK_TOKEN = '0x236c614a38362644deb15c9789779faf508bc6fe';
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const padTo32BytesUnHex = (str) => {
    return engine_1.ByteUtils.padToLength(engine_1.ByteUtils.strip0x(str), engine_1.ByteLength.UINT_256);
};
const formatAmountString = (erc20Amount) => {
    return BigInt(erc20Amount.amount);
};
let railgunWalletID;
describe('tx-notes', () => {
    before(async function run() {
        this.timeout(60000);
        await (0, setup_test_1.initTestEngine)();
        await (0, setup_test_1.initTestEngineNetworks)();
        const railgunWalletInfo = await (0, wallets_1.createRailgunWallet)(mocks_test_1.MOCK_DB_ENCRYPTION_KEY, mocks_test_1.MOCK_MNEMONIC, undefined);
        railgunWalletID = railgunWalletInfo.id;
    });
    after(async () => {
        await (0, setup_test_1.closeTestEngine)();
    });
    it('Should test erc20 note creation', () => {
        const erc20AmountRecipient = {
            tokenAddress: MOCK_TOKEN,
            amount: BigInt(0x100),
            recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
        };
        const railgunWallet = (0, wallets_1.fullWalletForID)(railgunWalletID);
        const note = (0, tx_notes_1.erc20NoteFromERC20AmountRecipient)(erc20AmountRecipient, railgunWallet, engine_1.OutputType.Transfer, true, // showSenderAddressToRecipient
        mocks_test_1.MOCK_MEMO);
        const addressData = engine_1.RailgunEngine.decodeAddress(mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS);
        expect(note.value).to.equal(formatAmountString(erc20AmountRecipient));
        expect(note.receiverAddressData.masterPublicKey).to.equal(addressData.masterPublicKey);
        expect(note.tokenHash).to.equal(padTo32BytesUnHex(MOCK_TOKEN));
    });
    it('Should test NFT note creation', () => {
        const erc20AmountRecipient = {
            tokenAddress: MOCK_TOKEN,
            amount: BigInt(0x100),
            recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
        };
        const railgunWallet = (0, wallets_1.fullWalletForID)(railgunWalletID);
        const note = (0, tx_notes_1.erc20NoteFromERC20AmountRecipient)(erc20AmountRecipient, railgunWallet, engine_1.OutputType.Transfer, true, // showSenderAddressToRecipient
        mocks_test_1.MOCK_MEMO);
        const addressData = engine_1.RailgunEngine.decodeAddress(mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS);
        expect(note.value).to.equal(formatAmountString(erc20AmountRecipient));
        expect(note.receiverAddressData.masterPublicKey).to.equal(addressData.masterPublicKey);
        expect(note.tokenHash).to.equal(padTo32BytesUnHex(MOCK_TOKEN));
    });
    it('Should test token array comparisons', () => {
        const erc20AmountRecipients1 = [
            {
                tokenAddress: '1',
                amount: 100n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '2',
                amount: BigInt(200),
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '3',
                amount: 300n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
        ];
        // Same same
        const erc20AmountRecipients2 = [
            {
                tokenAddress: '1',
                amount: 100n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '2',
                amount: BigInt(200),
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '3',
                amount: 300n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
        ];
        // Different addresses
        const erc20AmountRecipients3 = [
            {
                tokenAddress: '1',
                amount: 100n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '3',
                amount: BigInt(200),
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '5',
                amount: 300n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
        ];
        // Different amounts
        const erc20AmountRecipients4 = [
            {
                tokenAddress: '1',
                amount: 100n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '2',
                amount: 300n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '3',
                amount: BigInt(200),
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
        ];
        // Different recipients
        const erc20AmountRecipients5 = [
            {
                tokenAddress: '1',
                amount: 100n,
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '2',
                amount: BigInt(200),
                recipientAddress: mocks_test_1.MOCK_RAILGUN_WALLET_ADDRESS,
            },
            {
                tokenAddress: '3',
                amount: 300n,
                recipientAddress: mocks_test_1.MOCK_ETH_WALLET_ADDRESS,
            },
        ];
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(erc20AmountRecipients1, erc20AmountRecipients2)).to.be.true;
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(erc20AmountRecipients1, erc20AmountRecipients3)).to.be.false;
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(erc20AmountRecipients1, erc20AmountRecipients4)).to.be.false;
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(erc20AmountRecipients1, erc20AmountRecipients5)).to.be.false;
    });
    it('Should compare erc20 amount recipients', () => {
        const sameA = [
            {
                tokenAddress: '0x1234',
                amount: 100n,
                recipientAddress: 'hello',
            },
            {
                tokenAddress: '0x1234',
                amount: BigInt(200),
                recipientAddress: 'hello2',
            },
        ];
        const sameB = [
            {
                tokenAddress: '0x1234',
                amount: BigInt(200),
                recipientAddress: 'hello2',
            },
            {
                tokenAddress: '0x1234',
                amount: 100n,
                recipientAddress: 'hello',
            },
        ];
        const differentC = [
            {
                tokenAddress: '0x1234',
                amount: 100n,
                recipientAddress: 'hello',
            },
        ];
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(sameA, sameB)).to.be.true;
        expect((0, tx_notes_1.compareERC20AmountRecipientArrays)(sameA, differentC)).to.be.false;
    });
});
//# sourceMappingURL=tx-notes.test.js.map