/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationEvents from "./ConfigurationEvents.mjs";
import DataUtility from "../util/DataUtility.mjs";
import EventHandler from "../../events/EventHandler.mjs";

export default class ConfigurationModel extends EventHandler{

    // Declare properties
    #mod;                   // Mod object reference
    #configProperty;        // Configuration property
    #defaultConfigObj;      // Default configuration object

    #configuration;         // Configuration object
    #active;                // Active flag if configuration panel is displayed

    constructor(mod, configProperty, defaultConfigObj) {
        super([ConfigurationEvents.CONFIG_CHANGE_EVENT]);

        this.#mod = mod;
        this.#configProperty = configProperty;
        this.#defaultConfigObj = defaultConfigObj;
        
        this.#active = false;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* INITIALIZATION */

    // Initialize the model
    async initialize() {
        const mod = this.#mod;
        const configProperty = this.#configProperty;
        const defaultConfigObj = this.#defaultConfigObj;

        // Read initial configuration from the mod
        let configStr = (await mod.property(configProperty)).value();

        // If config string is null or empty then it's a new mod, so need to create the default
        if(configStr == null || configStr.length == 0) {
            this.setConfiguration(DataUtility.clone(defaultConfigObj));
            this.storeConfiguration();
            this.notifyListeners(ConfigurationEvents.CONFIG_CHANGE_EVENT, this.getConfiguration());
        }
        // Otherwise just set the string to the model, no need to save
        else {
            this.setConfiguration(JSON.parse(configStr));
        }
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS */

    // Sets the configuration from an object
    setConfiguration(configuration) {
        this.#configuration = configuration;
    }

    // Gets the configuration object
    getConfiguration() {
        return this.#configuration;
    }

    // Gets the default configuration as a new object
    getDefaultConfiguration() {
        return DataUtility.clone(this.#defaultConfigObj);
    }

    // Sets the active flag
    setActive(flag) {
        this.#active = flag;
    }

    // Returns the active flag
    isActive() {
        return this.#active;
    }

    // Returns the is editing flag
    isEditing() {
        return this.#mod.getRenderContext().isEditing;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS */

    // Saves the configuration in the mod configuration property
    storeConfiguration() {
        const mod = this.#mod;
        const configProperty = this.#configProperty;
        const configuration = this.getConfiguration();

        // Save the configuration to the mod configuration
        mod.property(configProperty).set(JSON.stringify(configuration));
    }
}