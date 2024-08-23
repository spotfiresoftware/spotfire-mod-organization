/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class EventHandler {
    // Declare properties
    #eventListeners;    // Event listeners
    #eventNames;        // List of valid event names

    constructor(eventNames) {
        this.#eventListeners = {};
        this.#eventNames = [];
        if(eventNames != null) {
            this.#eventNames.push(...eventNames);
        }
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS */

    // Sets valid event names on the listener
    setEventNames(eventNames) {
        this.#eventNames.push(...eventNames);
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* EVENT HANDLING */

    getEventListeners() {
        return this.#eventListeners;
    }

    // Register event listener
    addEventListener(eventName, callback) {
        const eventNames = this.#eventNames;

        // Validate the request event is configured on the handler
        if(eventNames.includes(eventName) == false) {
            throw new Error("Request receive to register unknown eventname " + eventName);
        }

        // Get the list for the specified name
        // If not found, create it
        let eventListenerList = this.#eventListeners[eventName];
        if(eventListenerList == null) {
            eventListenerList = [];
            this.#eventListeners[eventName] = eventListenerList;
        }

        // Add the listener to the list
        eventListenerList.push(callback);
    }

    // Notify listeners
    notifyListeners(eventName, e) {
        const eventNames = this.#eventNames;

        // Validate the notify event is configured on the handler
        if(eventNames.includes(eventName) == false) {
            throw new Error("Request received to notify unknown eventname " + eventName);
        }

        const eventListenerList = this.#eventListeners[eventName];
        if(eventListenerList != null) {
            for(let thisEventListener of eventListenerList) {
                thisEventListener(e);
            }
        }
    }

}