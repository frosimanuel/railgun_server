"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicatesByID = void 0;
const removeDuplicatesByID = (array) => {
    const seen = new Set();
    return array.filter((item) => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
    });
};
exports.removeDuplicatesByID = removeDuplicatesByID;
//# sourceMappingURL=graph-util.js.map