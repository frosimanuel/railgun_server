"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDecimalStr = exports.compareContractTransactionArrays = exports.compareStringArrays = void 0;
const logger_1 = require("./logger");
const compareStringArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    for (const el of a) {
        if (!b.includes(el)) {
            return false;
        }
    }
    return true;
};
exports.compareStringArrays = compareStringArrays;
const compareContractTransactionArrays = (a, b) => {
    if (!a && !b) {
        return true;
    }
    if (!a || !b || a.length !== b.length) {
        return false;
    }
    try {
        for (let i = 0; i < a.length; i += 1) {
            for (const key of Object.keys(a[i])) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (a[i][key] !== b[i][key]) {
                    return false;
                }
            }
        }
    }
    catch (err) {
        if (!(err instanceof Error)) {
            throw new Error('Non-error thrown in compareContractTransactionArrays', {
                cause: err,
            });
        }
        (0, logger_1.sendErrorMessage)(`Could not compare contract transaction arrays: ${err.message}`);
        return false;
    }
    return true;
};
exports.compareContractTransactionArrays = compareContractTransactionArrays;
const isDecimalStr = (str) => {
    const decimalPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)$/;
    return decimalPattern.test(str);
};
exports.isDecimalStr = isDecimalStr;
//# sourceMappingURL=utils.js.map