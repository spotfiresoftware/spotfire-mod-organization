/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationView from "./AbstractConfigurationView.mjs";
import FormElementService from "./FormElementService.mjs";

export default class ConfigurationFormView extends ConfigurationView {
    
    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW -- Override from AbstractConfigurationView */

    // Draw the fixed view elements
    draw() {
        super.draw();
        this.#drawMain();
    }

    // Update the view with the specified configuration
    update(configuration) {
        this.#drawForm(configuration);
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW */

    // Draw main one time components, add buttons and event listeners
    #drawMain() {
        const configElem = this._getConfigElem();

        const html = `
            <div class="form interactive"></div>  
            <div class="button">
                <button class="close interactive">Close</button>           
                <button class="reset interactive">Reset</button>           
            </div>`;

        configElem.innerHTML = html.trim();

        // Prepare event handlers
        const self = this;

        // Event handler on close button
        const closeButton = configElem.querySelector("button.close");
        closeButton.addEventListener('click', function() {
            self._hide();
            self._save();
        });

        // Event handler on reset button
        const resetButton = configElem.querySelector("button.reset");
        resetButton.addEventListener('click', function() {
            self._reset();
            self._save();
        });
    }

    // Draw the form
    #drawForm(configuration) {
        const configElem = this._getConfigElem();
        const configFormElem = configElem.querySelector('.form');
        configFormElem.innerHTML = '';

        // Append form elements
        FormElementService.appendElements(configFormElem, configuration, this._getTemplate());
    }
}