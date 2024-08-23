/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class RectMarking {
    // Declare static constants
    static MIN_SELECTION_SIZE = 2;

    // Event types
    static SELECTION_EVENT = 'selection';
    static CLICK_EVENT = 'click';

    // Declare properties set in constructor
    #containerElem;
    #selectionDiv;
    #selectionBgDiv;

    #enabled = false;
    #selectionPoint = { x: 0, y: 0 };
    #selectionMeta = { ctrlKey: false, altKey: false };

    #eventListeners = {};   // Event listeners

    constructor(containerElem) {
        this.#containerElem = containerElem;

        const selectionDiv = document.createElement("div");
        selectionDiv.className = "selection";
        this.#selectionDiv = selectionDiv;

        const selectionBgDiv = document.createElement("div");
        selectionBgDiv.className = "selection-bg";
        this.#selectionBgDiv = selectionBgDiv;

        // Append selection divs to container
        containerElem.appendChild(selectionBgDiv);
        containerElem.appendChild(selectionDiv); 
        
        // Add handlers
        this.#addHandlers();
    }

    // Determine position from value, min, and max
    clamp = (value, min, max) => Math.min(Math.max(min, value), max);

    // Adds handlers
    #addHandlers() {
        const self = this;
        const containerElem = this.#containerElem;
        const selectionDiv = this.#selectionDiv;
        const selectionBgDiv = this.#selectionBgDiv;

        let notifyOnClick = false;

        // On mouse down
        const mousedown = (e) => {
            if(self.#enabled != true) return;
            
            notifyOnClick = false;
            
            // Extract parameters from event
            const { ctrlKey, altKey } = e;

            // Extract selection x, y relative to upper left corner of container
            const selectionX = e.x - containerElem.offsetLeft;
            const selectionY = e.y - containerElem.offsetTop;

            // Set the selection and position
            self.#setSelection(selectionX, selectionY, ctrlKey, altKey);
            self.#position(selectionX, selectionY, 0, 0);

            // Add listeners for move and mouse up
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        };

        // On mouse move
        const mousemove = (e) => {
            if(this.isEnabled() != true) return;

            const containerElem = this.#containerElem;

            // Extract selected point position
            const selectionPoint = this.#getSelectionPoint();
            const selectionX = selectionPoint.x;
            const selectionY = selectionPoint.y;

            // Extract current position (let because it will be re-assigned)
            let positionX = e.x - containerElem.offsetLeft;
            let positionY = e.y - containerElem.offsetTop;

            // Min/max position based on extents
            positionX = this.clamp(positionX, 0, containerElem.clientWidth);
            positionY = this.clamp(positionY, 0, containerElem.clientHeight);
            
            // Calculate width and height
            const width = Math.abs(selectionX - positionX);
            const height = Math.abs(selectionY - positionY);

            // Position selection div
            selectionDiv.style.left = Math.min(selectionX, positionX) + "px";
            selectionDiv.style.top = Math.min(selectionY, positionY) + "px";
            selectionDiv.style.width = width + "px";
            selectionDiv.style.height = height + "px";
            selectionDiv.style.visibility = "visible";
            selectionBgDiv.style.visibility = "visible";
        };

        // On mouse up
        const mouseup = (e) => {
            if(this.isEnabled() != true) return;

            // Extract selected point position
            const selectionPoint = this.#getSelectionPoint();
            const selectionX = selectionPoint.x;
            const selectionY = selectionPoint.y;

            // Extract current position (let because it will be reassigned)
            let positionX = e.x - containerElem.offsetLeft;
            let positionY = e.y - containerElem.offsetTop;

            // Min/max position based on extents
            positionX = this.clamp(positionX, 0, containerElem.clientWidth);
            positionY = this.clamp(positionY, 0, containerElem.clientHeight);

            // Calculate width and height
            const width = Math.abs(selectionX - positionX);
            const height = Math.abs(selectionY - positionY);

            // Hide selection div
            selectionDiv.style.visibility = "hidden";
            selectionBgDiv.style.visibility = "hidden";

            const minSelectionSize = RectMarking.MIN_SELECTION_SIZE;

            // Only trigger if minSelection size is exceeded
            if (width > minSelectionSize && height > minSelectionSize) {
                const containerElem = this.#containerElem;
                const selection = {
                    x: Math.min(selectionX, positionX),
                    y: Math.min(selectionY, positionY),
                    width: width,
                    height: height,
                    offsetLeft: containerElem.offsetLeft,
                    offsetTop: containerElem.offsetTop,
                    //x: x < this.#selectionPoint.x ? x : this.#selectionPoint.x,
                    //y: y < this.#selectionPoint.y ? y : this.#selectionPoint.y,
                    //width,
                    //height,
                    //rect: this.#selectionDiv.getBoundingClientRect(),
                    dragSelectComplete: true,
                    ...this.#getSelectionMeta()
                };
                self.#notifySelectListeners(selection);
            } else {
                notifyOnClick = true;
            }

            document.removeEventListener('mousemove', mousemove);
            document.removeEventListener('mouseup', mouseup);
        };

        const click = (e) => {
            if(notifyOnClick == true) {
                self.#notifyClickListeners();
            }
        }

        // Add event listeners
        containerElem.addEventListener('mousedown', mousedown);
        containerElem.addEventListener('click', click);
    };

    // Sets the selection point and meta
    #setSelection(x, y, ctrlKey, altKey) {
        this.#selectionPoint.x = x;
        this.#selectionPoint.y = y;
        this.#selectionMeta.ctrlKey = ctrlKey;
        this.#selectionMeta.altKey = altKey;
    }

    // Gets the selection point
    #getSelectionPoint() {
        return this.#selectionPoint;
    }

    // Gets the selection meta
    #getSelectionMeta() {
        return this.#selectionMeta;
    }

    // Position the selection box
    #position(positionX, positionY, width, height) {
        const selectionDiv = this.#selectionDiv;

        selectionDiv.style.left = positionX + "px";
        selectionDiv.style.top =  positionY + "px";
        selectionDiv.style.width = width + "px";
        selectionDiv.style.height = height + "px";
    }

    // Sets the enabled flag to allow rectangular marking
    setEnabled(enabled) {
        this.#enabled = enabled;
    }

    // Returns the enabled flag
    isEnabled() {
        return this.#enabled;
    }

    // Register event listener
    addEventListener(eventName, callback) {
        const eventNames = [RectMarking.SELECTION_EVENT, RectMarking.CLICK_EVENT];
        if(eventNames.includes(eventName) == false) return;

        let eventListenerList = this.#eventListeners[eventName];
        if(eventListenerList == null) {
            eventListenerList = [];
            this.#eventListeners[eventName] = eventListenerList;
        }

        eventListenerList.push(callback);
    }

    // Notify click listeners
    #notifyClickListeners() {
        this.#notifyListeners(RectMarking.CLICK_EVENT);
    }

    // Notify select listeners
    #notifySelectListeners(selection) {
        this.#notifyListeners(RectMarking.SELECTION_EVENT, selection);
    }

    // Notify listeners
    #notifyListeners(eventName, payload) {
        const e = {
            name: eventName
        }

        const eventListenerList = this.#eventListeners[eventName];
        if(eventListenerList != null) {
            for(let thisEventListener of eventListenerList) {
                thisEventListener(e, payload);
            }
        }
    }
}
