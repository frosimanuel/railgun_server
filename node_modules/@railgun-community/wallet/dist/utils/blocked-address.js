"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNotBlockedAddress = exports.isBlockedAddress = void 0;
const shared_models_1 = require("@railgun-community/shared-models");
const isBlockedAddress = (address) => {
    if (!(0, shared_models_1.isDefined)(address)) {
        return false;
    }
    if (shared_models_1.OFAC_SANCTIONS_LIST_ADDRESSES.includes(address.toLowerCase())) {
        return true;
    }
    return false;
};
exports.isBlockedAddress = isBlockedAddress;
const assertNotBlockedAddress = (address) => {
    if ((0, exports.isBlockedAddress)(address)) {
        throw new Error('Blocked address');
    }
};
exports.assertNotBlockedAddress = assertNotBlockedAddress;
//# sourceMappingURL=blocked-address.js.map