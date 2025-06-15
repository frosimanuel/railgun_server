"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("@railgun-community/engine");
const shared_models_1 = require("@railgun-community/shared-models");
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const quick_sync_events_1 = require("../../quick-sync-events");
const helper_test_1 = require("../../../../../tests/helper.test");
chai_1.default.use(chai_as_promised_1.default);
const { expect } = chai_1.default;
const txidVersion = engine_1.TXIDVersion.V3_PoseidonMerkle;
const POLYGON_MUMBAI_CHAIN = shared_models_1.NETWORK_CONFIG[shared_models_1.NetworkName.PolygonMumbai_DEPRECATED].chain;
const EXPECTED_COMMITMENT_GROUP_EVENTS_POLYGON_MUMBAI = 1;
const EXPECTED_NULLIFIER_EVENTS_POLYGON_MUMBAI = 1;
const EXPECTED_UNSHIELD_EVENTS_POLYGON_MUMBAI = 1;
const EXPECTED_RAILGUN_TRANSACTION_EVENTS_POLYGON_MUMBAI = 1;
const assertContiguousCommitmentEvents = (commitmentEvents, shouldThrow) => {
    let nextTreeNumber = commitmentEvents[0].treeNumber;
    let nextStartPosition = commitmentEvents[0].startPosition;
    for (const event of commitmentEvents) {
        if (event.treeNumber !== nextTreeNumber ||
            event.startPosition !== nextStartPosition) {
            if (shouldThrow) {
                throw new Error(`Could not find treeNumber ${nextTreeNumber}, startPosition ${nextStartPosition}`);
            }
            else {
                // eslint-disable-next-line no-console
                console.log(`Could not find treeNumber ${nextTreeNumber}, startPosition ${nextStartPosition}`);
                nextStartPosition = event.startPosition + event.commitments.length;
            }
        }
        else {
            nextStartPosition += event.commitments.length;
        }
        // TODO: This logic may need an update if the tree is less than 65536 commitments.
        if (nextStartPosition >= 65536) {
            // Roll over to next tree.
            nextTreeNumber += 1;
            nextStartPosition = 0;
        }
    }
};
describe('quick-sync-events-graph-v3', () => {
    it('[V3] Should make sure Graph V3 query has no data gaps in commitments - Polygon Mumbai', async function run() {
        if ((0, helper_test_1.isV2Test)()) {
            this.skip();
            return;
        }
        const eventLog = await (0, quick_sync_events_1.quickSyncEventsGraph)(txidVersion, POLYGON_MUMBAI_CHAIN, 0);
        expect(eventLog).to.be.an('object');
        expect(eventLog.commitmentEvents).to.be.an('array');
        expect(eventLog.commitmentEvents.length).to.be.at.least(EXPECTED_COMMITMENT_GROUP_EVENTS_POLYGON_MUMBAI);
        expect(eventLog.nullifierEvents.length).to.be.at.least(EXPECTED_NULLIFIER_EVENTS_POLYGON_MUMBAI);
        expect(eventLog.unshieldEvents.length).to.be.at.least(EXPECTED_UNSHIELD_EVENTS_POLYGON_MUMBAI);
        expect(eventLog.railgunTransactionEvents?.length).to.be.at.least(EXPECTED_UNSHIELD_EVENTS_POLYGON_MUMBAI);
        const shouldThrow = true;
        assertContiguousCommitmentEvents(eventLog.commitmentEvents, shouldThrow);
    }).timeout(45000);
});
//# sourceMappingURL=quick-sync-events-graph-v3.test.js.map