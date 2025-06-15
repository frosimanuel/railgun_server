"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactStore = void 0;
class ArtifactStore {
    get;
    store;
    exists;
    constructor(get, store, exists) {
        this.get = get;
        this.store = store;
        this.exists = exists;
    }
}
exports.ArtifactStore = ArtifactStore;
//# sourceMappingURL=artifact-store.js.map