/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationEvents from "./ConfigurationEvents.mjs";
import EventHandler from "../../events/EventHandler.mjs";

export default class AbstractConfigurationView extends EventHandler{
    // Declare properties
    #mainElem;              // Main element
    #templateConfigObj;     // Template configuration obj
    #iconTemplate;          // Icon template

    #contentElem;           // Content element
    #configElem;            // Configuration element
    #configIconGroupElem;   // Configuration icon group element

    constructor(mainElem, iconTemplate, templateConfigObj) {
        super([ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT, ConfigurationEvents.HIDE_CONFIGURATION_EVENT, 
            ConfigurationEvents.RESET_CONFIGURATION_EVENT, ConfigurationEvents.SAVE_CONFIGURATION_EVENT]);

        this.#mainElem = mainElem;
        this.#iconTemplate = iconTemplate;
        this.#templateConfigObj = templateConfigObj;

        // Get the content element
        this.#contentElem = mainElem.querySelector('.content');
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW -- Abstract */
    
    // Draw the fixed view elements
    draw() {
        this.#drawIcon();
        this.#drawConfigElem();
    }

    // Update the view with the specified configuration
    update(configuration) {
        throw new Error('Abtract method not implemented in subclass');
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS -- Protected */

    // Returns the configuration element
    _getConfigElem() {
        return this.#configElem;
    }

    // Returns the configuration template
    _getTemplate() {
        return this.#templateConfigObj;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW */

    // Draw the icon to display the configuration panel
    #drawIcon() {
        const self = this;
        const template = this.#iconTemplate;

        const configIconElem = document.createElement('div');
        configIconElem.classList.add('configuration-icon');
        configIconElem.classList.add('interactive');
        configIconElem.innerHTML = template.trim();        

        let configIconGroupElem = this.#mainElem.querySelector('div.configuration-icon-group');
        if(configIconGroupElem == null) {
            configIconGroupElem = document.createElement('div');
            configIconGroupElem.classList.add('configuration-icon-group');
            this.#mainElem.appendChild(configIconGroupElem);
        }

        configIconGroupElem.appendChild(configIconElem);
        this.#configIconGroupElem = configIconGroupElem;

        configIconElem.addEventListener('click', function(event) {
            event.stopPropagation();
            self._display();
            configIconGroupElem.style.display = 'none';
        });
    }

    // Draw the configuration element
    #drawConfigElem() {
        const configElem = document.createElement('div');
        configElem.classList.add('configuration');
        configElem.classList.add('interactive');
        this.#mainElem.appendChild(configElem);
        this.#configElem = configElem;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS -- Protected */

    // Display the configuration panel
    _display() {
        this.#contentElem.style.display = 'none';
        this.#configElem.style.display = 'flex';
        this.#configIconGroupElem.style.display = 'none';
        
        this.notifyListeners(ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT);
    }

    // Hides the configuration panel
    _hide() {
        this.#contentElem.style.display = 'flex';
        this.#configElem.style.display = 'none';
        this.#configIconGroupElem.style.display = 'block';
        
        this.notifyListeners(ConfigurationEvents.HIDE_CONFIGURATION_EVENT);
    }

    // Reset the configuration back to default
    _reset() {
        this.notifyListeners(ConfigurationEvents.RESET_CONFIGURATION_EVENT);
    }

    // Saves the configuration
    _save(c) {
        this.notifyListeners(ConfigurationEvents.SAVE_CONFIGURATION_EVENT, c);
    }

}