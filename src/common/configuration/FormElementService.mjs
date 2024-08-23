/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class FormElementService {
    // Draw elements
    static appendElements(parentFormElem, configurationObj, configurationTemplate, callback, keys) {
        const keyset = keys ?? Object.keys(configurationTemplate);

        // Iterate over the keys in the configuration
        for(let thisKey of keyset) {
            if(thisKey.startsWith('_label') == true) {
                FormElementService.appendGroupLabel(parentFormElem, configurationTemplate[thisKey]);
                continue;
            };

            const thisConfigTemplate = configurationTemplate[thisKey];
            if(thisConfigTemplate != null && thisConfigTemplate.datatype != null) {
                FormElementService.appendFormElement(parentFormElem, configurationObj, thisKey, thisConfigTemplate, callback);
            }
            else {
                FormElementService.appendElements(parentFormElem, configurationObj[thisKey], thisConfigTemplate);
            }
        }
    }

    // Draw label
    static appendGroupLabel(parentFormElem, labelText) {
        const groupLabelElem = document.createElement('div');
        groupLabelElem.classList.add('group-label');
        groupLabelElem.innerHTML = labelText;
        parentFormElem.appendChild(groupLabelElem);            
    }

    // Draw form element
    static appendFormElement(parentFormElem, configurationObj, configMemberKey, configTemplate, callback) {
        const formElem = document.createElement('div');
        formElem.classList.add('form-element');
        parentFormElem.appendChild(formElem);

        // Choose UI element based on type
        if(configTemplate.enumeration != null && configTemplate.radio == true) {
            FormElementService.appendEnumerationRadioForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
        else if(configTemplate.enumeration != null) {
            FormElementService.appendEnumerationSelectForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
        else if(configTemplate.datatype == 'boolean') {
            FormElementService.appendCheckboxForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
        else if(configTemplate.datatype == 'color') {
            FormElementService.appendColorForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
        else if(configTemplate.datatype == 'string' && configTemplate.multiline == true) {
            FormElementService.appendTextAreaForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
        else {
            FormElementService.appendInputForm(formElem, configurationObj, configMemberKey, configTemplate, callback);
        }
    }

    // Draw enumeration form
    static appendEnumerationSelectForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Select
        formElem.classList.add('select');

        const inputContainerElem = document.createElement('div');
        inputContainerElem.classList.add('input-container');
        formElem.appendChild(inputContainerElem);

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label ?? '';
        inputContainerElem.appendChild(formLabelElem);

        const selectElem = document.createElement('select');
        selectElem.classList.add('interactive');
        inputContainerElem.appendChild(selectElem);

        if(configTemplate.nullOption == true) {
            const optionElem = document.createElement('option');
            optionElem.innerHTML = '';
            optionElem.value = null;
            selectElem.appendChild(optionElem);
        }

        for(let thisEnumItem of configTemplate.enumeration) {
            const isObject = typeof thisEnumItem === 'object';
            const optionElem = document.createElement('option');
            optionElem.innerHTML = isObject ? thisEnumItem.label : thisEnumItem;
            optionElem.value = isObject ? thisEnumItem.value : thisEnumItem;
            selectElem.appendChild(optionElem);

            if(configurationObj[configMemberKey] == optionElem.value) {
                optionElem.setAttribute('selected', true);
            }  
        }

        // Change listener to push new value to config object
        selectElem.addEventListener('click', e => e.stopPropagation());
        selectElem.addEventListener('mousedown', e => e.stopPropagation());
        selectElem.addEventListener('input', function(e) {
            e.stopPropagation();
            const targetVal = FormElementService.#parseTargetVal(e.target.value, configTemplate.datatype);
            configurationObj[configMemberKey] = targetVal;
            if(callback != null) callback({key: configMemberKey, value: targetVal});
        });
    }

    // Draw radio button set form
    static appendEnumerationRadioForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Input
        formElem.classList.add('input');

        const inputContainerElem = document.createElement('div');
        inputContainerElem.classList.add('input-container');
        formElem.appendChild(inputContainerElem);

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label ?? '';
        inputContainerElem.appendChild(formLabelElem);

        const radioGroupElem = document.createElement('div');
        radioGroupElem.classList.add('radio-group');
        inputContainerElem.appendChild(radioGroupElem);

        for(let thisEnumItem of configTemplate.enumeration) {
            const isObject = typeof thisEnumItem === 'object';
            const optionElem = document.createElement('input');
            optionElem.classList.add('interactive');
            optionElem.setAttribute('type', 'radio');
            optionElem.setAttribute('name', configMemberKey);
            optionElem.value = isObject ? thisEnumItem.value : thisEnumItem;
            radioGroupElem.appendChild(optionElem);

            const radioLabelElem = document.createElement('div');
            radioLabelElem.classList.add('label');
            radioLabelElem.innerHTML = isObject ? thisEnumItem.label : thisEnumItem
            radioGroupElem.appendChild(radioLabelElem);

            if(configurationObj[configMemberKey] == optionElem.value) {
                optionElem.setAttribute('checked', true);
            } 
            
            // Change listener to push new value to config object
            optionElem.addEventListener('click', function(e) {
                e.stopPropagation();
                let targetVal = optionElem.value;
                if(targetVal == null || targetVal.length == 0)
                    targetVal = null;
                else if(configTemplate.datatype == 'int')
                    targetVal = parseInt(targetVal);
                else if(configTemplate.datatype == 'double')
                    targetVal = parseFloat(targetVal);
                
                configurationObj[configMemberKey] = targetVal;
                if(callback != null) callback({key: configMemberKey, value: targetVal});
            });
            
        }
    }

    // Draw boolean form
    static appendCheckboxForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Checkbox
        formElem.classList.add('checkbox');

        const checkboxElem = document.createElement('input');
        checkboxElem.classList.add('interactive');
        checkboxElem.setAttribute('type', 'checkbox');
        formElem.appendChild(checkboxElem);
        checkboxElem.checked = configurationObj[configMemberKey];
        
        // Change listener to push new value to config object
        checkboxElem.addEventListener('change', function(e) {
            e.stopPropagation();
            let targetVal = checkboxElem.checked;
            if(targetVal == false) targetVal = null;
            configurationObj[configMemberKey] = targetVal;
            if(callback != null) callback({key: configMemberKey, value: targetVal});
        });

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label ?? '';
        formElem.appendChild(formLabelElem);        
    }

    // Draw input form
    static appendInputForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Input
        formElem.classList.add('input');

        const inputContainerElem = document.createElement('div');
        inputContainerElem.classList.add('input-container');
        formElem.appendChild(inputContainerElem);

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label ?? '';
        inputContainerElem.appendChild(formLabelElem);

        const inputElem = document.createElement('input');
        inputElem.classList.add('interactive');
        inputContainerElem.appendChild(inputElem);
        inputElem.value = configurationObj[configMemberKey] ?? '';

        // If numeric apply restriction
        if(configTemplate.datatype == 'int' || configTemplate.datatype == 'double') {
            inputElem.setAttribute('type', 'number');
        }

        // Callback for input
        const inputData = function(e) {
            e.stopPropagation();
            const targetVal = FormElementService.#parseTargetVal(e.target.value, configTemplate.datatype);
            configurationObj[configMemberKey] = targetVal;
            if(callback != null) callback({key: configMemberKey, value: targetVal});
        }

        // Debounce function
        const debounce = (callback, waitTime) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    callback(...args);
                }, waitTime);
            };
        }

        // Change listener to push new value to config object
        const debounceHandler = debounce(inputData, 500);
        inputElem.addEventListener('input', debounceHandler);
    }

    // Draw textarea form
    static appendTextAreaForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Input
        formElem.classList.add('textarea');

        const inputContainerElem = document.createElement('div');
        inputContainerElem.classList.add('input-container');
        formElem.appendChild(inputContainerElem);

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label;
        inputContainerElem.appendChild(formLabelElem);

        const textareaElem = document.createElement('textarea');
        textareaElem.classList.add('interactive');
        inputContainerElem.appendChild(textareaElem);
        textareaElem.value = configurationObj[configMemberKey] ?? '';

        // Callback for input
        const inputData = function(e) {
            e.stopPropagation();
            const targetVal = FormElementService.#parseTargetVal(e.target.value, configTemplate.datatype);
            configurationObj[configMemberKey] = targetVal;
            if(callback != null) callback({key: configMemberKey, value: targetVal});
        }

        // Debounce function
        const debounce = (callback, waitTime) => {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    callback(...args);
                }, waitTime);
            };
        }

        // Change listener to push new value to config object
        const debounceHandler = debounce(inputData, 500);
        textareaElem.addEventListener('input', debounceHandler);
    }


    // Draw color form
    static appendColorForm(formElem, configurationObj, configMemberKey, configTemplate, callback) {
        // Input
        formElem.classList.add('color');

        if(configTemplate.classes != null) {
            for(let thisClass of configTemplate.classes)
                formElem.classList.add(thisClass);
        }

        const inputContainerElem = document.createElement('div');
        inputContainerElem.classList.add('input-container');
        formElem.appendChild(inputContainerElem);

        const formLabelElem = document.createElement('div');
        formLabelElem.classList.add('label');
        formLabelElem.innerHTML = configTemplate.label ?? '';
        inputContainerElem.appendChild(formLabelElem);

        const inputElem = document.createElement('input');
        inputElem.classList.add('interactive');

        inputElem.setAttribute('type', 'text');
        inputElem.setAttribute('value', configurationObj[configMemberKey] ?? '');
        inputElem.setAttribute('data-coloris', '');    
        inputContainerElem.appendChild(inputElem);
        Coloris.wrap(inputElem);

        // Change listener to push new value to config object
        inputElem.addEventListener('input', function(e) {
            let targetVal = inputElem.value;
            if(targetVal == null || targetVal.length == 0)
                delete configurationObj[configMemberKey];
            else
                configurationObj[configMemberKey] = targetVal;
            if(callback != null) callback({key: configMemberKey, value: targetVal});
        });
    }

    static #parseTargetVal(targetVal, datatype) {
        if(targetVal == null || targetVal.length == 0 || targetVal == 'null')
            targetVal = null;
        else if(datatype == 'int')
            targetVal = parseInt(targetVal);
        else if(datatype == 'double')
            targetVal = parseFloat(targetVal);
        return targetVal;
    }

}