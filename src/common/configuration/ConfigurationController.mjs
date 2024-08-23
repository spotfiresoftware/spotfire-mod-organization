/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import AbstractConfigurationController from "./AbstractConfigurationController.mjs";
import ConfigurationEvents from "./ConfigurationEvents.mjs";

export default class ConfigurationController extends AbstractConfigurationController{

    constructor(model, view) {
        super(model, view);
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* INITIALIZATION */

    // Initialize the configuration
    async initialize() {
        await super.initialize();

        // Add view listeners
        this.#addViewListeners();
    }

    // Add view listeners
    #addViewListeners() {
        const self = this;
        const model = this._getModel();
        const view = this._getView();

        // Hide, Save in superclass

        // Display configuration
        view.addEventListener(ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT, function() {
            model.setActive(true);
            view.update(model.getConfiguration());
        });

        // Reset configuration
        view.addEventListener(ConfigurationEvents.RESET_CONFIGURATION_EVENT, function() {
            model.setConfiguration(model.getDefaultConfiguration());
            model.storeConfiguration();
            self.notifyListeners(ConfigurationEvents.CONFIG_CHANGE_EVENT, model.getConfiguration());
            view.update(model.getDefaultConfiguration());
        });
    }

}

