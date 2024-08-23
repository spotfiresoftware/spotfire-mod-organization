/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class TrellisPanel {
    // Declare properties set in constructor
    #trellisPanelElem;              // Trellis panel element
    #trellisPanelTitleElem;         // Trellis panel title element
    #canvasElem;                    // Canvas element
    
    // Declare properties set through accessors
    #diagram;                       // Diagram object

    // Creates a new trellis panel and initializes elements, but doesn't append here
    constructor() {
        const trellisPanelElem = document.createElement('div');
        trellisPanelElem.classList.add('trellis-panel');

        const trellisPanelTitleElem = document.createElement('div');
        trellisPanelTitleElem.classList.add('title');
        trellisPanelElem.appendChild(trellisPanelTitleElem);

        const canvasElem = document.createElement('div');
        canvasElem.classList.add('canvas');
        trellisPanelElem.appendChild(canvasElem);

        this.#trellisPanelElem = trellisPanelElem;
        this.#trellisPanelTitleElem = trellisPanelTitleElem;
        this.#canvasElem = canvasElem;
    }

    // Sets the title for the panel
    // For the case where it's a hidden trellis when non-trellised, this will
    // be set as a null and won't display the title
    setTitle(title) {
        this.#trellisPanelTitleElem.innerHTML = title;
    }

    // Returns the trellis panel element
    getTrellisPanelElem() {
        return this.#trellisPanelElem;
    }

    // Return the canvas elem
    getCanvasElem() {
        return this.#canvasElem;
    }

    // Set the diagram
    setDiagram(diagram) {
        this.#diagram = diagram;
    }

    // Return the diagram
    getDiagram() {
        return this.#diagram;
    }
}
