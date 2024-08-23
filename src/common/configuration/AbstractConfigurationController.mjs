/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationEvents from "./ConfigurationEvents.mjs";
import EventHandler from "../../events/EventHandler.mjs";

export default class AbstractConfigurationController extends EventHandler{
    // Declare properties
    #model;                 // Model object
    #view;                  // View object

    constructor(model, view) {
        super([ConfigurationEvents.CONFIG_CHANGE_EVENT, ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT]);

        this.#model = model;
        this.#view = view;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* INITIALIZATION */

    // Initialize the configuration
    async initialize() {
        const model = this.#model;
        const view = this.#view;

        // Add model event listeners
        this.#addModelListeners()

        // Add view listeners
        this.#addViewListeners();

        // Initialize the model
        await model.initialize();

        // Draw the view if not in editing mode
        if(model.isEditing() == true) {
            view.draw();
        }
    }

    // Add model listeners
    #addModelListeners() {
        const self = this;
        const model = this._getModel();

        // Configuration change
        model.addEventListener(ConfigurationEvents.CONFIG_CHANGE_EVENT, function(c) {
            self.notifyListeners(ConfigurationEvents.CONFIG_CHANGE_EVENT, c);
        });
    }

    // Add view listeners
    #addViewListeners() {
        const self = this;
        const model = this._getModel();
        const view = this._getView();

        // Display configuration
        view.addEventListener(ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT, function() {
            self.notifyListeners(ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT);
        });

        // Hide configuration
        view.addEventListener(ConfigurationEvents.HIDE_CONFIGURATION_EVENT, function() {
            model.setActive(false);
        });

        // Save configuration
        view.addEventListener(ConfigurationEvents.SAVE_CONFIGURATION_EVENT, function(c) {
            if(c != null) model.setConfiguration(c);
            model.storeConfiguration();
            self.notifyListeners(ConfigurationEvents.CONFIG_CHANGE_EVENT, model.getConfiguration());
        });
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS -- Protected */
    
    // Return the model
    _getModel() {
        return this.#model;
    }

    // Return the view
    _getView() {
        return this.#view;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS */

    // Returns the configuration object
    getConfiguration() {
        return this.#model.getConfiguration();
    }

    // Returns the active flag
    isActive() {
        return this.#model.isActive();
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS */

    // Forces a save of the configuration without notify
    save() {
        this.version = this.version == null ? 1 : this.version + 1;
        const model = this.#model;
        model.storeConfiguration();
    }
}

