/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import AbstractConfigurationView from "./AbstractConfigurationView.mjs";

export default class ConfigurationBasicView extends AbstractConfigurationView {

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW -- Override from AbstractConfigurationView */

    // Draw the fixed view elements
    draw() {
        super.draw();
        this.#drawMain();
    }


    // Update the view with the specified configuration
    update(configuration) {
        const configElem = this._getConfigElem();
        const configTextArea = configElem.querySelector('textarea');
        configTextArea.value = JSON.stringify(configuration, null, 2);
        this.#resetDisplay();
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW */

    // Draw main one time components, add buttons and event listeners
    #drawMain() {
        const configElem = this._getConfigElem();

        const html = `
            <div class="title">Mod Configuration</div>  
            <div class="validation"></div>
            <div class="details">
                <textarea class="interactive"></textarea>
            </div>
            <div class="button">
                <button class="validate interactive">Validate</button>           
                <button class="cancel interactive">Cancel</button>           
                <button class="reset interactive">Reset</button>           
                <button class="save interactive" disabled>Save</button>           
            </div>
        `;

        configElem.innerHTML = html.trim();

        // Get config text area
        const configTextArea = configElem.querySelector('textarea');

        // Prepare event handlers
        const self = this;

        // Event handler on cancel button
        const cancelButton = configElem.querySelector("button.cancel");
        cancelButton.addEventListener('click', function() {
            self._hide();
        });
    
        // Event handler on save button
        const saveButton = configElem.querySelector("button.save");
        saveButton.disabled = true;
        saveButton.addEventListener('click', function() {
            self._hide();
            self._save(JSON.parse(configTextArea.value));
        });

        // Event handler on reset button
        const resetButton = configElem.querySelector("button.reset");
        resetButton.addEventListener('click', function() {
            self._reset();
        });

        // Event handler on validate button
        const validateButton = configElem.querySelector("button.validate");
        validateButton.addEventListener('click', function() {
            const validation = self.#validateConfiguration(configTextArea.value);
            saveButton.disabled = !validation.valid;

            const validationTextElem = configElem.querySelector('.validation');
            validationTextElem.innerHTML = validation.message;
        });
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS -- Override from AbstractConfigurationView */

    // Display the view
    _display() {
        super._display();        
        this.#resetDisplay();
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS*/

    // Validates the specified configuration for JSON adherence
    #validateConfiguration(configStr) {
        const configElem = this._getConfigElem();

        let thisConfig = configStr; // let because it may be reassigned
        if(thisConfig == null)
            thisConfig = '';
        
        try {
            JSON.parse(thisConfig);
            configElem.classList.remove('invalid');
            configElem.classList.add('valid');
            return {valid: true, message: 'OK'};
        }
        catch(err) {
            configElem.classList.remove('valid');
            configElem.classList.add('invalid');
            return {valid: false, message: err.message};
        }
    }

    // Resets the display state
    #resetDisplay() {
        const configElem = this._getConfigElem();
        configElem.classList.remove('invalid');
        configElem.classList.remove('valid');

        const validationTextElem = configElem.querySelector('.validation');
        validationTextElem.innerHTML = '';

        const saveButton = configElem.querySelector("button.save");
        saveButton.disabled = true;
    }

}