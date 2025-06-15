"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFullTXIDMerkletreesV2 = exports.rescanFullUTXOMerkletreesAndWallets = exports.refreshBalances = void 0;
const error_1 = require("../../../utils/error");
const engine_1 = require("../core/engine");
const refreshBalances = async (chain, walletIdFilter) => {
    try {
        // Wallet will trigger .emit('scanned', {chain}) event when finished,
        // which calls `onBalancesUpdate` (balance-update.ts).
        // Kick off a background merkletree scan.
        // This will call wallet.scanBalances when it's done, but may take some time.
        const engine = (0, engine_1.getEngine)();
        await engine.scanContractHistory(chain, walletIdFilter);
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.refreshBalances.name, err);
    }
};
exports.refreshBalances = refreshBalances;
const rescanFullUTXOMerkletreesAndWallets = async (chain, walletIdFilter) => {
    try {
        const engine = (0, engine_1.getEngine)();
        await engine.fullRescanUTXOMerkletreesAndWallets(chain, walletIdFilter);
        // Wallet will trigger .emit('scanned', {chain}) event when finished,
        // which calls `onBalancesUpdate` (balance-update.ts).
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.rescanFullUTXOMerkletreesAndWallets.name, err);
    }
};
exports.rescanFullUTXOMerkletreesAndWallets = rescanFullUTXOMerkletreesAndWallets;
const resetFullTXIDMerkletreesV2 = async (chain) => {
    try {
        const engine = (0, engine_1.getEngine)();
        await engine.fullResetTXIDMerkletreesV2(chain);
    }
    catch (err) {
        throw (0, error_1.reportAndSanitizeError)(exports.resetFullTXIDMerkletreesV2.name, err);
    }
};
exports.resetFullTXIDMerkletreesV2 = resetFullTXIDMerkletreesV2;
//# sourceMappingURL=balances.js.map