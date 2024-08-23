/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import DataGroup from "./DataGroup.mjs";

export default class TrellisItem {
    #name;                  // Trellis item name
    #dataGroupMap = {};     // Data groups as a map, indexed by name

    constructor(trellisName) {
        this.#name = trellisName;
    }

    // --------------------------------------------------------------------------------
    // ACCESSORS

    // Return the trellis item name
    getName() {
        return this.#name;
    }

    // Return the data group map
    getDataGroupMap() {
        return this.#dataGroupMap;
    }

    // Returns the data group by name, or creates it if it doesn't exist
    getDataGroup(dataGroupName) {
        let thisDataGroup = this.#dataGroupMap[dataGroupName]; // let because it might be re-assigned
        if(thisDataGroup == null) {
            thisDataGroup = new DataGroup(dataGroupName);
            this.#dataGroupMap[dataGroupName] = thisDataGroup;
        }

        return thisDataGroup;
    }

    // --------------------------------------------------------------------------------
    // DATA FUNCTIONS

    // Sorts data in all data groups
    sortData(callback) {
        for(let thisDataGroupName in this.#dataGroupMap) {
            const thisDataGroup = this.#dataGroupMap[thisDataGroupName];
            thisDataGroup.sortData(callback);
        }
    }
}

