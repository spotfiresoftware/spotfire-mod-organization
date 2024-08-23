/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ColorUtility from "./ColorUtility.mjs";

export default class DataUtility {
    // Deep clones an object, kind of
    static clone(aObject) {
        if (!aObject) return aObject;

        // Let because these will be reassigned
        let v;
        let bObject = Array.isArray(aObject) ? [] : {};
        for (const k in aObject) {
            v = aObject[k];
            bObject[k] = (typeof v === "object") ? DataUtility.clone(v) : v;
        }

        return bObject;
    };

    // Determines if the specified axis name has an expression
    static axisHasExpression(axes, name) {
        const axis = axes[name];
        if(axis != null && axis.parts != null && axis.parts.length > 0)
            return true;
        return false;
    };

    // Validates if the specified axis has an expression. If not, display
    //   an error message
    static validateAxisHasExpression(axes, name, onerror) {
        const hasExpression = DataUtility.axisHasExpression(axes, name);
        if(hasExpression == false) {
            onerror(`Mandatory Axis ${name} requires an expression`);
        }
        return hasExpression;
    };

    // Returns the color axis type, categorical or continuous
    static async getColorAxisType(dataView, axisName) {
        let axis = null; // let because it will be re-assigned

        try {
            // Test categorical
            axis = await dataView.categoricalAxis(axisName);
            if(axis != null)
                return 'categorical';
        }
        catch(err) {
        }

        try {
            // Test continuous
            axis = await dataView.continuousAxis(axisName);
            if(axis != null) {
                return 'continuous';
            }
        }
        catch(err) {
        }

        return null;
    };

    // Return the color value for the row
    static getColorValue(colorAxisType, row, axisName) {
        if(colorAxisType == 'categorical') {
            return row.categorical(axisName).formattedValue();
        }
        else {
            return row.continuous(axisName).value();
        }
    }

    // Determines if the background color is dark
    static isDarkCanvas(backgroundColor) {
        return !ColorUtility.hexIsLight(backgroundColor);
    }

    // Mini-template engine
    // This doesn't support spaces inside expressions
    static compileTemplateString(template) {
        // Original regex doesn't support spaces inside expression
        //   /\$\{([\s]*[^;\s\{]+[\s]*)\}/g

        // Replace ${expressions} (etc) with ${map.expressions}.
        var sanitized = template
            .replace(/\$\{([\s]*[^;\{]+[\s]*)\}/g, function (_, match) {
                console.log('  ' + match);
                return `\$\{map.${match.trim()}\}`;
            })
            // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
            .replace(/(\$\{(?!map\.)[^}]+\})/g, '');

        return Function('map', `return \`${sanitized}\``);
    }

    // Mini template engine
    static parseTemplate(template, context) {
        return template.replace(/\$\{([^}]+)\}/g, (match, code) => {
            try {
                const func = new Function(...Object.keys(context), `return ${code.trim()};`);
                const out = func(...Object.values(context)) ?? '';
                return out;
            } catch (e) {
                console.error(`Error evaluating expression: ${code.trim()}`, e);
                return 'ERROR';
            }
        });
    }

    /*
        static compileTemplateString(template) {
            // Original regex doesn't support spaces inside expression
            //   /\$\{([\s]*[^;\s\{]+[\s]*)\}/g
    
            console.log('----');
            // Replace ${expressions} (etc) with ${map.expressions}.
            var sanitized = template
                .replace(/\$\{([\s]*[^;\{]+[\s]*)\}/g, function(_, match){
                    console.log('  ' + match);
                    return `\$\{map.${match.trim()}\}`;
                })
                // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
                .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
            console.log('----');
            
            return Function('map', `return \`${sanitized}\``);
        }
    */
}

