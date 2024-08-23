/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import TrellisPanel from "./TrellisPanel.mjs";

export default class TrellisCollection {
    // Declare static constants
    static #directions = ['columns', 'rows'];

    // Declare properties set in constructor
    #trellisCollectionElem;     // Trellis collection element
    #trellisPanelArr = [];      // Trellis panels as an array

    // Creates a new trellis collection and appends elements to the specified vizElem
    constructor(vizElem) {
        const trellisCollectionElem = document.createElement('div');
        trellisCollectionElem.classList.add('trellis-collection');
        vizElem.appendChild(trellisCollectionElem);

        this.#trellisCollectionElem = trellisCollectionElem;
    }

    // Draws the specified number of panels
    draw(panelCount) {
        const currentPanelCount = this.#trellisPanelArr.length;

        // If panel count matches, then it's good so just return
        if(panelCount == currentPanelCount) return;

        // Calculate the current panel count compared to the target
        const delta = panelCount - currentPanelCount;

        // If more panels required, make and append
        if(delta > 0) {
            for(let idx = 0; idx < delta; idx++) {
                const thisTrellisPanel = new TrellisPanel();
                this.#trellisPanelArr.push(thisTrellisPanel);
                this.#trellisCollectionElem.appendChild(thisTrellisPanel.getTrellisPanelElem());
            }
        }
        // If less panels required, remove and delete (will be gc)
        else if(delta < 0) {
            for(let idx = 0; idx < Math.abs(delta); idx++) {
                const thisTrellisPanel = this.#trellisPanelArr.pop();
                this.#trellisCollectionElem.removeChild(thisTrellisPanel.getTrellisPanelElem());
            }
        }
    }

    // Sets the trellised flag as a class on the collection
    // This is so the panels will not look like they are trellised (even though they are)
    setTrellised(trellised) {
        const className = 'trellised';
        if(trellised == true)
            this.#trellisCollectionElem.classList.add(className);
        else
            this.#trellisCollectionElem.classList.remove(className);
    }

    // Sets the orientation of the trellis panels
    setDirection(trellisDirection) {
        this.#trellisCollectionElem.classList.remove(...TrellisCollection.#directions);
        this.#trellisCollectionElem.classList.add(trellisDirection);
    }

    // Returns the panel at the specified index
    getPanel(index) {
        return this.#trellisPanelArr[index];
    }

    // Get all panels
    getPanels() {
        return this.#trellisPanelArr;
    }

    // Iterate over all panels
    iteratePanels(callback) {
        for(let idx = 0; idx < this.#trellisPanelArr.length; idx++) {
            callback(this.#trellisPanelArr[idx], idx);
        }
    }
}

