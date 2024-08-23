/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class DataGroup {
    #dataGroupName;         // Data group name
    #data = [];             // All data as an array
    #dataMap = {};          // All data as a map, indexed
    #markedCount = 0;       // Count of marked rows in the data group

    constructor(dataGroupName) {
        this.#dataGroupName = dataGroupName;
    }

    // --------------------------------------------------------------------------------
    // ACCESSORS

    // Returns the data
    getData() {
        return this.#data;
    }

    // Returns the data map
    getDataMap() {
        return this.#dataMap;
    }

    // Return the data group name
    getName() {
        return this.#dataGroupName;
    }

    // Returns the marked count
    getMarkedCount() {
        return this.#markedCount;
    }

    // --------------------------------------------------------------------------------
    // DATA FUNCTIONS

    // Adds the data, and indexes using the indexProp if specified
    addData(data, indexProp) {
        if(data.row.isMarked() == true) {
            this.#markedCount++;
        }

        this.#data.push(data);

        if(indexProp != null) {
            const val = data[indexProp];
            this.#dataMap[val] = data;
        }
    }

    // Sort the data
    sortData(callback) {
        this.#data.sort(callback);
    }

    // Iterate over data in the group
    iterateData(callback) {
        for(let idx = 0; idx < this.#data.length; idx++) {
            callback(this.#data[idx], idx);
        }
    }

}