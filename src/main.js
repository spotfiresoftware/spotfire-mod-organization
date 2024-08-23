/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ConfigurationEvents from "./common/configuration/ConfigurationEvents.mjs";
import DataUtility from "./common/util/DataUtility.mjs";
import OrganizationChart from "./chart/OrganizationChart.mjs";
import RectMarking from "./common/marking/RectMarking.mjs";
import TrellisCollection from "./common/trellis/TrellisCollection.mjs";
import TrellisItemMap from "./common/trellis/TrellisItemMap.mjs";
import VizConfigurationFactory from "./common/configuration/VizConfigurationFactory.mjs";

Spotfire.initialize(async (mod) => {
    // Constants for mod properties
    const MOD_CONFIG_PROPERTY = 'mod-config';
    const SCROLL_TOP_PROPERTY = 'scroll-top';
    const SCROLL_LEFT_PROPERTY = 'scroll-left';
    const OPEN_NODES_PROPERTY = 'open-nodes';

    // Get the main element
    const mainElem = document.querySelector('.main'); // Main target

    // Create content element
    const contentElem = document.createElement('div');
    contentElem.classList.add('content');
    mainElem.appendChild(contentElem);

    // Create content inner element
    // Added in zoom handler if commented out
    const contentInnerElem = document.createElement('div');
    contentInnerElem.classList.add('content-inner');
    contentElem.appendChild(contentInnerElem);

    // Create visualization target
    const vizElem = document.createElement('div');
    vizElem.classList.add('visualization');
    contentInnerElem.appendChild(vizElem); // will be added in zoom handler if commented out

    // Get the render context
    const context = mod.getRenderContext();

    // --------------------------------------------------------------------------------
    // SPOTFIRE DEFINITIONS

    // These are all let because they may be reassigned later
    let axes = {};
    let colorAxisType = null;
    let marking = null;
    let modDataView = null;
    let rows = null;   
    let dark = false;
    let scrollTop = 0;
    let scrollLeft = 0;
    let openNodes = null;

    // --------------------------------------------------------------------------------
    // DATA FUNCTIONS

    // Validate axes have required expressions
    const validateAxes = function() {
        let valid = true; // let because it will be modified
        valid = valid && DataUtility.validateAxisHasExpression(axes, "Node ID", displayError);
        valid = valid && DataUtility.validateAxisHasExpression(axes, "Parent Node ID", displayError);
        
        return valid;
    };

    // Converts a row to an object
    const rowToObject = function(row) {
        const object = {};

        object.color = DataUtility.axisHasExpression(axes, "Color") ? row.color().hexCode : null;
        object.colorValue = DataUtility.axisHasExpression(axes, "Color") ? DataUtility.getColorValue(colorAxisType, row, "Color") : null;
        object.trellisBy = DataUtility.axisHasExpression(axes, "Trellis By") ? row.categorical("Trellis By").formattedValue() : null;
        object.nodeId = row.categorical("Node ID").formattedValue();
        object.parentNodeId = row.categorical("Parent Node ID").value()[0].key == null ? null : row.categorical("Parent Node ID").formattedValue();

        // Image axis may have multiple values, ignore anything but the first
        object.image = DataUtility.axisHasExpression(axes, "Image") ? row.categorical("Image").value()[0].value() : null;

        // If content is specified then populate string, object, and array
        if(DataUtility.axisHasExpression(axes, "Content")) {
            const contentAxis = axes["Content"];
            if(row.categorical("Content").value().length == 1) {
                const name = contentAxis.parts[0].displayName;
                const value = row.categorical("Content").value()[0].key;
                object.contentStr = value ?? '';
                object.contentObj = {};
                object.contentObj[name] = value ?? '';
                object.contentArr = [value ?? ''];
            }
            else {
                object.contentObj = {};
                object.contentArr = [];
                const rowContent = row.categorical("Content").value();
                for(let idx = 0; idx < contentAxis.parts.length; idx++) {
                    const name = contentAxis.parts[idx].displayName;
                    const value = rowContent[idx].key;
                    object.contentObj[name] = value ?? '';
                    if(value != null)
                        object.contentArr.push(value ?? '');
                }
                object.contentStr = object.contentArr.map(d => d + '<br/>').join('');
            }
        }
        else {
            object.contentStr = '';
            object.contentObj = '';
            object.contentArr = [];
        }

        object.row = row;

        return object;
    }

    // --------------------------------------------------------------------------------
    // VIZ FUNCTIONS

    // Converts data rows into objects
    const processRows = async function() {
        if(rows == null) return false;

        // Get mod configuration
        const vizConfig = vizConfiguration.getConfiguration();
        if(vizConfig == null) return false;
        
        // Test for row count
        const rowLimit = vizConfig.data.rowLimit ?? 500; // coalesce
        const rowCount = rows.length;
        if(rowCount > rowLimit) {
            const message = `
                Cannot render - too many rows (count: ${rowCount}, limit: ${rowLimit}). <br/><br/>
                Filter to a smaller subset of values. Or cautiously increase the Row Limit in mod configuration, bearing in mind this may cause Spotfire to become unresponsive.
            `;
            displayError(message);
            return;
        }

        // Validate axes have required expressions
        const valid = validateAxes();
        if(valid == false) return;

        // Create new trellis items map
        const trellisItemMap = new TrellisItemMap();

        // Iterate over rows, convert to objects, then apply to group data
        rows.forEach(function(row) {
            // Convert the row to an object and add to the trellis map
            const object = rowToObject(row);
            trellisItemMap.addObjectToTrellisAndGroup(object.trellisBy, 'group', object, 'nodeId');
        });

        // Check trellis count doesn't exceed max
        const trellisLimit = vizConfig.trellis.maxTrellisCount ?? 5; // coalesce
        const trellisCount = trellisItemMap.getCount();
        if(trellisCount > trellisLimit) {
            const message = `
                Cannot render - too many trellis panels (trellisCount: ${trellisCount}, limit: ${trellisLimit}). <br/><br/>
                Set Trellis By axis to a column with fewer values or filter to a smaller subset of values.
            `;
            displayError(message);
            return;
        }

        // Draw the viz with the specified trellis data
        drawViz(trellisItemMap);
    };

    // Draws the visualization
    const drawViz = async function(trellisItemMap) {  
        if(vizConfiguration.isActive()) return;

        // Set trellis direction and trellised flag
        trellisCollection.setDirection(vizConfiguration.getConfiguration().trellis.trellisDirection);
        trellisCollection.setTrellised(DataUtility.axisHasExpression(axes, "Trellis By"));

        // Draw trellis panels (if required)
        trellisCollection.draw(trellisItemMap.getCount());

        // Create a configuration object to pass to the diagram
        const modConfig = {
            marking: marking,
            dark: dark,
            backgroundColor: context.styling.general.backgroundColor
        };

        // Create an actions object for callback functions
        const actions = {
            showTooltip: showTooltip,
            hideTooltip: hideTooltip,
            markRows: markRows,
            clearAllMarking: clearAllMarking,
            setScrollTop: setScrollTop,
            setScrollLeft: setScrollLeft,
            setOpenNodes: setOpenNodes,
            showContextMenu: showContextMenu,
        };

        // Validate the open nodes configuration first
        validateOpenNodes(trellisItemMap);

        trellisItemMap.iterateTrellisItems(function(thisTrellisItem, thisTrellisItemIndex) {
            // Get panel and set the title
            const thisTrellisName = thisTrellisItem.getName(); 
            const thisTrellisPanel = trellisCollection.getPanel(thisTrellisItemIndex);
            thisTrellisPanel.setTitle(thisTrellisName);

            // Get the canvas and data group map
            const canvasElem = thisTrellisPanel.getCanvasElem();

            // Create a diagram
            const diagram = new OrganizationChart(canvasElem, actions, rectMarking);
            thisTrellisPanel.setDiagram(diagram);
            diagram.draw();

            // Set open nodes (happens before update so that nodes are drawn as open/closed)
            diagram.setOpenNodes(thisTrellisName, openNodes[thisTrellisName]);

            // Update the diagram with current data
            const dataGroupMap = thisTrellisItem.getDataGroupMap();
            diagram.update(dataGroupMap, modConfig, vizConfiguration);

            // Set the scroll position (happens after update to position properly)
            diagram.setScrollTop(scrollTop);
            diagram.setScrollLeft(scrollLeft);
        });
    };

    // --------------------------------------------------------------------------------
    // DATA

    // Validate the open nodes object for trellis
    const validateOpenNodes = function(trellisItemMap) {
        // Initialize a flag for updating
        let updateOpenNodes = false;

        // Iterate over the keys  in the openNodes and validate there is a trellis 
        //   panel with that name. If not, it should be removed from openNodes.
        for(let thisTrellisName in openNodes) {
            if(trellisItemMap.hasTrellis(thisTrellisName) == false) {
                delete openNodes[thisTrellisName];
                updateOpenNodes = true;
            }
        }

        // Iterate over the trellis panels and validate that there is an 
        //   openNodes entry for that name. If not, it should be created.
        trellisItemMap.iterateTrellisItems(function(thisTrellisItem, thisTrellisItemIndex) {
            const thisTrellisName = thisTrellisItem.getName();
            let thisOpenNodes = openNodes[thisTrellisName];
            if(thisOpenNodes == null) {
                thisOpenNodes = [];
                openNodes[thisTrellisName] = thisOpenNodes;
                updateOpenNodes = true;
            }
        });

        // If update flag is true, set it to the property
        if(updateOpenNodes == true) {
            mod.property(OPEN_NODES_PROPERTY).set(JSON.stringify(openNodes));
        }
    }

    // --------------------------------------------------------------------------------
    // ERRORS

    // Displays an error overlay
    const displayError = function(message) {
        // Get the inner content element and hide
        let contentInnerElem = contentElem.querySelector('.content-inner');
        contentInnerElem.style.display = 'none';

        // Get the error element (let because it might be changed)
        let errorElem = contentElem.querySelector('.error-detail');

        // If not found, create one and append
        if(errorElem == null) {
            errorElem = document.createElement('div');
            errorElem.classList.add('error-detail');
            contentElem.appendChild(errorElem);
        }

        // Set error element text
        errorElem.innerHTML = message;
    };

    // Clears the error overlay
    const clearError = function() {
        // Get the error element
        const errorElem = contentElem.querySelector('.error-detail');

        // If found, remove it
        if(errorElem != null) {
            contentElem.removeChild(errorElem);
        }

        // Get the inner content element and show
        const contentInnerElem = contentElem.querySelector('.content-inner');
        if(contentInnerElem != null)
            contentInnerElem.style.display = 'flex';
    };

    // --------------------------------------------------------------------------------
    // ACTIONS

    // Display a new tooltip
    const showTooltip = function(object) {
        if(vizConfiguration.isActive() == true) return;
        const vizConfig = vizConfiguration.getConfiguration();
        if(vizConfig.tooltip.showTooltip == true)
            mod.controls.tooltip.show(object);
    }

    // Hide any visible tooltip
    const hideTooltip = function() {
        mod.controls.tooltip.hide();
    }

    // Marks all specified rows
    const markRows = function(ctrlKey, rows) {
        if(marking == null) return;

        if(rows.length == 0)
            clearAllMarking();
        else if(ctrlKey == true)
            modDataView.mark(rows, 'Toggle');
        else
            modDataView.mark(rows, 'Replace');
    }

    // Sets the scroll top
    const setScrollTop = function(thisScrollTop) {
        scrollTop = thisScrollTop;
        mod.property(SCROLL_TOP_PROPERTY).set(scrollTop);
    }
    
    // Sets the scroll left
    const setScrollLeft = function(thisScrollLeft) {
        scrollLeft = thisScrollLeft;
        mod.property(SCROLL_LEFT_PROPERTY).set(scrollLeft);
    }
    
    // Sets the open nodes
    const setOpenNodes = function(trellisName, thisOpenNodes) {
        openNodes[trellisName] = thisOpenNodes;
        mod.property(OPEN_NODES_PROPERTY).set(JSON.stringify(openNodes));
    }

    // Show context menu
    const showContextMenu = async function(x, y, items) {
        return mod.controls.contextMenu.show(x, y, items);
    }

    // --------------------------------------------------------------------------------
    // RECT MARKING

    // Selection handler for rectangular marking
    const rectangularMarking = function(event, selection) {
        // If marking is disabled, then do nothing
        if(marking == null) return;

        // If configuration is visible, then do nothing
        if(vizConfiguration.isActive() == true) return;
        
        // Its a selection
        if(event.name == 'selection' && selection.dragSelectComplete == true) {
            // Initialize selected rows array
            let selectedRows = [];

            // Get selected rows from each trellis panel
            for(let thisTrellisPanel of trellisCollection.getPanels()) {
                if(thisTrellisPanel.getDiagram() != null) {
                    let thisSelectedRows = thisTrellisPanel.getDiagram().rectangleSelection(selection);
                    selectedRows.push(thisSelectedRows);
                }
            }

            // Flatten the array of arrays
            selectedRows = selectedRows.flat();
            markRows(selection.ctrlKey, selectedRows);
        }
    }

    // Selection handler to clear all marking
    const clearAllMarking = function(event) {
        // If marking is disabled, then do nothing
        if(marking == null) return;

        // Marked rows
        const markedRows = rows.filter((d) => d.isMarked());

        // Remove all rows from marking
        modDataView.mark(markedRows, 'Subtract');
    }

    // --------------------------------------------------------------------------------
    // SETUP UTILITY OBJECTS

    // Rectangular marking, disabled by default
    const rectMarking = new RectMarking(vizElem);
    rectMarking.addEventListener('selection', rectangularMarking);
    rectMarking.addEventListener('click', clearAllMarking);

    // Trellis collection to hold trellis panels
    const trellisCollection = new TrellisCollection(vizElem);

    // Add viz config and event handler
    const vizConfiguration = await VizConfigurationFactory.createVizConfiguration(mod, MOD_CONFIG_PROPERTY, mainElem);
    vizConfiguration.addEventListener(ConfigurationEvents.DISPLAY_CONFIGURATION_EVENT, hideTooltip);
    vizConfiguration.addEventListener(ConfigurationEvents.CONFIG_CHANGE_EVENT, function(vizConfig) {
        clearError();
        processRows();
        context.signalRenderComplete();
    });

    // Read initial scroll top and left
    scrollTop = (await mod.property(SCROLL_TOP_PROPERTY)).value();
    scrollLeft = (await mod.property(SCROLL_LEFT_PROPERTY)).value();

    // Read initial open nodes
    openNodes = JSON.parse((await mod.property(OPEN_NODES_PROPERTY)).value());

    // --------------------------------------------------------------------------------
    // MAIN DATA EVENT HANDLER

    // Create a read function for axis, data, and windowSize changes
    // Subscribe to the reader function
    const reader = mod.createReader(
        mod.visualization.axis("Color"),
        mod.visualization.axis("Trellis By"),
        mod.visualization.axis("Node ID"),
        mod.visualization.axis("Parent Node ID"),
        mod.visualization.axis("Content"),
        mod.visualization.axis("Image"),
        mod.visualization.data(), 
        mod.windowSize()
    );
    reader.subscribe(render);

    // Render function for axis, data, and windowSize changes
    async function render(colorView, trellisByView, nodeIdView, parentNodeIdView, contentView, imageView,
            dataView, windowSize) {

        // Check for errors, display and return if present
        const errors = await dataView.getErrors();
        if(errors.length > 0) {
            displayError(errors);
            return;
        }

        // Otherwise clear the error
        clearError();

        // Copy the axes over
        axes = {};
        const axesArr = [colorView, trellisByView, nodeIdView, parentNodeIdView, contentView, imageView];
        for(let thisAxis of axesArr) {
            axes[thisAxis.name] = thisAxis;
        }

        // Set marking flag based on the marking configuration, and enabled or disable rectMarking
        marking = await dataView.marking();
        if(rectMarking != null) {
            rectMarking.setEnabled(marking != null);
        }

        // Determine color axis type based on axis configuration in the dataView
        //   There seems to be a race condition with axis view, this is more accurate
        colorAxisType = await DataUtility.getColorAxisType(dataView, "Color");

        // Determine if it's a dark canvas
        dark = DataUtility.isDarkCanvas(context.styling.general.backgroundColor);
        if(dark == true)
            mainElem.classList.add('dark');
        else
            mainElem.classList.remove('dark');

        // Get all rows and process
        modDataView = dataView;
        rows = await dataView.allRows();

        // Process rows to objects and draw viz
        await processRows();


        // Signal render complete
        context.signalRenderComplete();
    }

});
