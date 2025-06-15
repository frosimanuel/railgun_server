"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportAndSanitizeError = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const logger_1 = require("./logger");
const reportAndSanitizeError = (func, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
err) => {
    (0, logger_1.sendErrorMessage)(`Caught error in RAILGUN Wallet SDK: ${func}`);
    if (err instanceof Error) {
        const error = (0, shared_models_1.sanitizeError)(err);
        (0, logger_1.sendErrorMessage)(error);
        return error;
    }
    const error = new Error('Unknown error.', { cause: err });
    (0, logger_1.sendErrorMessage)(error);
    return error;
};
exports.reportAndSanitizeError = reportAndSanitizeError;
//# sourceMappingURL=error.js.map