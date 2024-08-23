/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationBasicView from "./ConfigurationBasicView.mjs";
import ConfigurationController from "./ConfigurationController.mjs";
import ConfigurationFormView from "./ConfigurationFormView.mjs";
import ConfigurationModel from "./ConfigurationModel.mjs";

import { defaultConfiguration } from "../../config/ConfigurationDefault.mjs";
import { configurationTemplate, iconTemplate } from "../../config/ConfigurationTemplate.mjs";

export default class VizConfigurationFactory {

    static async createVizConfiguration(mod, modConfigProperty, mainElem) {
        const configurationObj = new ConfigurationController(new ConfigurationModel(mod, modConfigProperty, defaultConfiguration), 
        //    new ConfigurationBasicView(mainElem, iconTemplate, configurationTemplate));
            new ConfigurationFormView(mainElem, iconTemplate, configurationTemplate));
        await configurationObj.initialize();

        return configurationObj;
    }
}