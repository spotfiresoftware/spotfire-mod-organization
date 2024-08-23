/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import TrellisItem from "./TrellisItem.mjs";

export default class TrellisItemMap {
    #trellisMap = {};           // Trellis item map

    constructor() {
    }

    // --------------------------------------------------------------------------------
    // ACCESSORS

    // Returns the trellis item for the specified name
    // The trellis will be created if not found
    getTrellis(trellisName) {
        let thisTrellisItem = this.#trellisMap[trellisName]; // let because it might be reassigned
        if(thisTrellisItem == null) {
            thisTrellisItem = new TrellisItem(trellisName);
            this.#trellisMap[trellisName] = thisTrellisItem;
        }

        return thisTrellisItem;
    }

    // Returns true if the trellis panel exists
    hasTrellis(trellisName) {
        return this.#trellisMap[trellisName] != null;
    }

    // Returns the count of trellis items
    getCount() {
        return Object.keys(this.#trellisMap).length
    }

    // Iterates over all items in the collection and invokes the callback function
    iterateTrellisItems(callback) {
        const trellisItemIndices = Object.keys(this.#trellisMap).sort();
        for(let trellisItemIdx = 0; trellisItemIdx < trellisItemIndices.length; trellisItemIdx++) {
            const thisTrellisItemName = trellisItemIndices[trellisItemIdx];
            const thisTrellisItem = this.#trellisMap[thisTrellisItemName];
            callback(thisTrellisItem, trellisItemIdx);
        }
    }

    // --------------------------------------------------------------------------------
    // DATA FUNCTIONS

    // Adds an object to the specified trellis name and group name
    // If the trellis is not found, it will be created
    // If the group is not found, it will be created
    addObjectToTrellisAndGroup(trellisName, dataGroupName, data, indexProp) {
        const thisTrellisItem = this.getTrellis(trellisName);
        const thisDataGroup = thisTrellisItem.getDataGroup(dataGroupName);
        thisDataGroup.addData(data, indexProp);
    }

    // Sort the data
    sortData(callback) {
        this.iterateTrellisItems(function(thisTrellisItem) {
            thisTrellisItem.sortData(callback);
        });
    }
}
