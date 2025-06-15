"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactNote = exports.compareNFTAmountRecipientArrays = exports.compareNFTAmountArrays = exports.compareERC20RecipientArrays = exports.compareERC20AmountRecipientArrays = exports.compareERC20AmountArrays = exports.compareERC20AmountRecipients = exports.nftNoteFromNFTAmountRecipient = exports.erc20NoteFromERC20AmountRecipient = void 0;
const engine_1 = require("@railgun-community/engine");
Object.defineProperty(exports, "TransactNote", { enumerable: true, get: function () { return engine_1.TransactNote; } });
const shared_models_1 = require("@railgun-community/shared-models");
const erc20NoteFromERC20AmountRecipient = (erc20AmountRecipient, railgunWallet, outputType, showSenderAddressToRecipient, memoText) => {
    const { amount, recipientAddress } = erc20AmountRecipient;
    const receiverAddressData = engine_1.RailgunEngine.decodeAddress(recipientAddress);
    const tokenData = (0, engine_1.getTokenDataERC20)(erc20AmountRecipient.tokenAddress);
    return engine_1.TransactNote.createTransfer(receiverAddressData, railgunWallet.addressKeys, amount, tokenData, showSenderAddressToRecipient, outputType, memoText);
};
exports.erc20NoteFromERC20AmountRecipient = erc20NoteFromERC20AmountRecipient;
const nftNoteFromNFTAmountRecipient = (nftAmountRecipient, railgunWallet, showSenderAddressToRecipient, memoText) => {
    const { recipientAddress, nftAddress, nftTokenType, tokenSubID, amount } = nftAmountRecipient;
    const receiverAddressData = engine_1.RailgunEngine.decodeAddress(recipientAddress);
    const tokenData = (0, engine_1.getTokenDataNFT)(nftAddress, nftTokenType, tokenSubID);
    switch (nftTokenType) {
        case shared_models_1.NFTTokenType.ERC721:
            return engine_1.TransactNote.createERC721Transfer(receiverAddressData, railgunWallet.addressKeys, tokenData, showSenderAddressToRecipient, memoText);
        case shared_models_1.NFTTokenType.ERC1155:
            return engine_1.TransactNote.createERC1155Transfer(receiverAddressData, railgunWallet.addressKeys, tokenData, BigInt(amount), showSenderAddressToRecipient, memoText);
    }
};
exports.nftNoteFromNFTAmountRecipient = nftNoteFromNFTAmountRecipient;
const compareERC20Amounts = (a, b) => {
    return a?.tokenAddress === b?.tokenAddress && a?.amount === b?.amount;
};
const compareERC20AmountRecipients = (a, b) => {
    return (compareERC20Amounts(a, b) && a?.recipientAddress === b?.recipientAddress);
};
exports.compareERC20AmountRecipients = compareERC20AmountRecipients;
const compareERC20AmountArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (const erc20Amount of a) {
        const found = b.find(ta => ta.tokenAddress === erc20Amount.tokenAddress);
        if (!found) {
            return false;
        }
        if (found.amount !== erc20Amount.amount) {
            return false;
        }
    }
    return true;
};
exports.compareERC20AmountArrays = compareERC20AmountArrays;
const compareERC20AmountRecipientArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (const erc20Amount of a) {
        const found = b.find(ta => ta.tokenAddress === erc20Amount.tokenAddress &&
            ta.recipientAddress === erc20Amount.recipientAddress);
        if (!found) {
            return false;
        }
        if (found.amount !== erc20Amount.amount) {
            return false;
        }
    }
    return true;
};
exports.compareERC20AmountRecipientArrays = compareERC20AmountRecipientArrays;
const compareERC20RecipientArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (const erc20Recipient of a) {
        const found = b.find(ta => ta.tokenAddress === erc20Recipient.tokenAddress &&
            ta.recipientAddress === erc20Recipient.recipientAddress) != null;
        if (!found) {
            return false;
        }
    }
    return true;
};
exports.compareERC20RecipientArrays = compareERC20RecipientArrays;
const compareNFTAmountArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (const nftAmountRecipient of a) {
        const found = b.find(ta => ta.nftAddress === nftAmountRecipient.nftAddress &&
            ta.tokenSubID === nftAmountRecipient.tokenSubID);
        if (!found) {
            return false;
        }
        if (found.nftTokenType !== nftAmountRecipient.nftTokenType) {
            return false;
        }
        if (found.amount !== nftAmountRecipient.amount) {
            return false;
        }
    }
    return true;
};
exports.compareNFTAmountArrays = compareNFTAmountArrays;
const compareNFTAmountRecipientArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (const nftAmountRecipient of a) {
        const found = b.find(ta => ta.nftAddress === nftAmountRecipient.nftAddress &&
            ta.tokenSubID === nftAmountRecipient.tokenSubID);
        if (!found) {
            return false;
        }
        if (found.nftTokenType !== nftAmountRecipient.nftTokenType) {
            return false;
        }
        if (found.recipientAddress !== nftAmountRecipient.recipientAddress) {
            return false;
        }
        if (found.amount !== nftAmountRecipient.amount) {
            return false;
        }
    }
    return true;
};
exports.compareNFTAmountRecipientArrays = compareNFTAmountRecipientArrays;
//# sourceMappingURL=tx-notes.js.map