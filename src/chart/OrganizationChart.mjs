/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import ColorUtility from "../common/util/ColorUtility.mjs";
import DataUtility from "../common/util/DataUtility.mjs";
import OrganizationNode from "./OrganizationNode.mjs";
import TidyTree from "../d3-extend/TidyTree.mjs";

export default class OrganizationChart {
    static ORIENTATION_VERTICAL = 'vertical';
    static ORIENTATION_HORIZONTAL = 'horizontal';

    static DIRECTION_TOP_TO_BOTTOM = 'top-to-bottom';
    static DIRECTION_BOTTOM_TO_TOP = 'bottom-to-top';
    static DIRECTION_LEFT_TO_RIGHT = 'left-to-right';
    static DIRECTION_RIGHT_TO_LEFT = 'right-to-left';

    static CHILD_TOGGLE_SIZE = 12;

    static SHOW_CHILD_TOGGLE_ICON = '<path d="M 6.0001506 0 C 5.1697951 0 4.3927558 0.15749318 3.6695435 0.48214111 C 2.9463309 0.80358066 2.3035622 1.2321359 1.7678507 1.7678507 C 1.2321359 2.3035622 0.80357008 2.9463309 0.48214111 3.6695435 C 0.16070157 4.3927558 7.8332324e-17 5.169795 0 6.0001506 C 0 6.8305059 0.15749318 7.6070284 0.48214111 8.3302409 C 0.80358066 9.0534535 1.2321359 9.6962221 1.7678507 10.231934 C 2.3035622 10.767648 2.9463309 11.196216 3.6695435 11.517643 C 4.3927558 11.839084 5.1697951 11.999784 6.0001506 11.999784 C 6.830506 11.999784 7.6070284 11.842292 8.3302409 11.517643 C 9.0534535 11.196205 9.6962221 10.767648 10.231934 10.231934 C 10.767648 9.6962221 11.196216 9.0534535 11.517643 8.3302409 C 11.839084 7.6070284 11.999784 6.8305059 11.999784 6.0001506 C 11.999784 5.169795 11.842292 4.3927558 11.517643 3.6695435 C 11.196205 2.9463309 10.767648 2.3035622 10.231934 1.7678507 C 9.6962221 1.2321359 9.0534535 0.80357008 8.3302409 0.48214111 C 7.6070284 0.16070157 6.830506 7.8332324e-17 6.0001506 0 z M 6.0001506 1.2056112 C 7.3394361 1.2056112 8.4640455 1.6607926 9.3854736 2.598291 C 10.322972 3.5357895 10.77867 4.660919 10.77867 5.9841309 C 10.77867 7.3234164 10.322972 8.4480257 9.3854736 9.3694539 C 8.4479752 10.306952 7.3233623 10.762651 6.0001506 10.762651 C 4.6608685 10.762651 3.535739 10.306952 2.6143107 9.3694539 C 1.6768121 8.4319555 1.2216309 7.3073426 1.2216309 5.9841309 C 1.2216309 4.6448487 1.6768121 3.5197158 2.6143107 2.598291 C 3.5518093 1.6607926 4.6769387 1.2056112 6.0001506 1.2056112 z M 5.3950195 2.9450399 L 5.3950195 5.365564 L 2.9744954 5.365564 L 2.9744954 6.5753092 L 5.3950195 6.5753092 L 5.3950195 8.9958333 L 6.6052816 8.9958333 L 6.6052816 6.5753092 L 9.0252889 6.5753092 L 9.0252889 5.365564 L 6.6052816 5.365564 L 6.6052816 2.9450399 L 5.3950195 2.9450399 z "/>'
    static HIDE_CHILD_TOGGLE_ICON = '<path d="M 3.0160694,5.3678572 H 8.9812511 V 6.5732138 H 3.0160694 Z M 5.9999982,0 C 5.1696411,0 4.3928572,0.15749406 3.6696433,0.48214265 2.9464293,0.80358284 2.3035701,1.2321416 1.7678576,1.7678576 1.2321416,2.3035701 0.80357226,2.9464293 0.48214265,3.6696433 0.16070247,4.3928572 0,5.1696446 0,6.0000018 0,6.8303589 0.15749406,7.6071428 0.48214265,8.3303567 0.80358284,9.0535707 1.2321416,9.6964299 1.7678576,10.232142 2.3035701,10.767858 2.9464293,11.196428 3.6696433,11.517857 4.3928572,11.839298 5.1696411,12 5.9999982,12 6.8303554,12 7.6071428,11.842506 8.3303567,11.517857 9.0535707,11.196417 9.6964299,10.767858 10.232142,10.232142 10.767858,9.6964299 11.196428,9.0535707 11.517857,8.3303567 11.839298,7.6071428 12,6.8303589 12,6.0000018 12,5.1696446 11.842506,4.3928572 11.517857,3.6696433 11.196417,2.9464293 10.767858,2.3035701 10.232142,1.7678576 9.6964299,1.2321416 9.0535707,0.80357226 8.3303567,0.48214265 7.6071428,0.16070247 6.8303554,0 5.9999982,0 Z m 0,1.2053566 c 1.3392883,0 2.4642867,0.4553578 3.3857168,1.3928582 0.9375,0.9375003 1.392855,2.0624987 1.392855,3.3857132 0,1.3392883 -0.455355,2.4642866 -1.392855,3.3857168 C 8.4482146,10.307145 7.3232127,10.762499 5.9999982,10.762499 4.6607135,10.762499 3.5357151,10.307145 2.614285,9.3696448 1.6767846,8.4321444 1.2214269,7.3071425 1.2214269,5.983928 1.2214269,4.6446432 1.6767846,3.5196414 2.614285,2.5982148 3.5517854,1.6607144 4.6767837,1.2053566 5.9999982,1.2053566 Z" />'

    // Declare properties set in constructor
    #canvasElem;            // Canvas element
    #actions;               // Actions object for callback functions
    #rectMarking;           // Rectangular marking object

    #scrollTop;             // Scroll top
    #scrollLeft;            // Scroll left
    #trellisName;           // Trellis name for open nodes
    #openNodes;             // List of open nodes

    // Declare properties set during draw phase
    #dataGroupMap;          // Data group map
    #modConfig;             // Mod configuration
    #vizConfiguration;      // Viz configuration object
    #hierarchy;             // Data as a hierarchy

    #plotAreaElem;          // Plot area element    


    constructor(canvasElem, actions, rectMarking) {
        // Declare properties and set parameters
        this.#canvasElem = canvasElem;
        this.#actions = actions;
        this.#rectMarking = rectMarking;

        // Initialize properties
        this.#scrollTop = 0;
        this.#scrollLeft = 0;
        this.#openNodes = [];

        // Clear canvas
        canvasElem.innerHTML = '';
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* DRAW */

    // Draw fixed elements
    draw() {
        const self = this;
        const canvasElem = this.#canvasElem;

        // Create diagram element and append
        const diagramElem = document.createElement('div');
        diagramElem.classList.add('organization-chart');
        canvasElem.appendChild(diagramElem);

        // Create plot area element and append
        const plotAreaElem = document.createElement('div');
        plotAreaElem.classList.add('plot-area');
        plotAreaElem.classList.add('interactive');
        diagramElem.appendChild(plotAreaElem);

        // Set property for plot area element
        this.#plotAreaElem = plotAreaElem;

        // Add event handlers for scrolling
        plotAreaElem.addEventListener('scroll', function(e) {
            self.#scrollTop = e.target.scrollTop;
            self.#scrollLeft = e.target.scrollLeft;
            self.#actions.setScrollTop(self.#scrollTop, self);
            self.#actions.setScrollLeft(self.#scrollLeft, self);
        });
    }

    // Update the visualization with new data
    update(dataGroupMap, modConfig, vizConfiguration) {
        if(dataGroupMap != null)
            this.#dataGroupMap = dataGroupMap;
        if(modConfig != null)
            this.#modConfig = modConfig;
        if(vizConfiguration != null)
            this.#vizConfiguration = vizConfiguration;

        // Generate the node hierarchy
        const hierarchy = this.#generateNodeHierarchy(dataGroupMap);
        this.#hierarchy = hierarchy;

        // Update the diagram
        this.#update();
    }

    // Update the visualization with stored data
    #update(centerOnNodeId) {
        const self = this;

        const modConfig = this.#modConfig;
        const vizConfig = this.#vizConfiguration.getConfiguration();
        const plotAreaElem = this.#plotAreaElem;
        const hierarchy = this.#hierarchy;

        // If no top level nodes just return
        if(hierarchy.topLevelNodes.length == 0) return;

        // Setup configuration
        const nodeWidth = vizConfig.appearance.nodeWidth;
        const nodeHeight = vizConfig.appearance.nodeHeight;
        const nodePaddingSibling = vizConfig.appearance.nodePaddingSibling;
        const nodePaddingAncestor = vizConfig.appearance.nodePaddingAncestor;
        const direction = vizConfig.appearance.nodeDirection;
        const alignment = vizConfig.appearance.nodeAlignment;

        // Set orientation from configured direction
        let orientation;
        if(direction == OrganizationChart.DIRECTION_TOP_TO_BOTTOM || direction == OrganizationChart.DIRECTION_BOTTOM_TO_TOP) 
            orientation = OrganizationChart.ORIENTATION_VERTICAL;
        else if(direction == OrganizationChart.DIRECTION_LEFT_TO_RIGHT || direction == OrganizationChart.DIRECTION_RIGHT_TO_LEFT) 
            orientation = OrganizationChart.ORIENTATION_HORIZONTAL;


        // Clear the plot area
        plotAreaElem.innerHTML = '';

        // Set markable
        if(modConfig.marking != null)
            plotAreaElem.classList.add('markable');
        else
            plotAreaElem.classList.remove('markable');

        // Setup margins
        const margin = {
            top: 50,
            right: 50, 
            bottom: 50, 
            left: 50
        };

        // Create diagram element and append
        const diagramElem = document.createElement('div');
        diagramElem.classList.add('diagram');
        plotAreaElem.appendChild(diagramElem);

        // Append orientation class and set nodeSize
        let nodeSize;
        if(orientation == OrganizationChart.ORIENTATION_VERTICAL) {
            diagramElem.classList.add('vertical');
            nodeSize = [nodeWidth + nodePaddingSibling, nodeHeight + nodePaddingAncestor];
        }
        else if(orientation == OrganizationChart.ORIENTATION_HORIZONTAL) {
            diagramElem.classList.add('horizontal');
            nodeSize = [nodeHeight + nodePaddingSibling, nodeWidth + nodePaddingAncestor];
        }

        // Create a treemap layout with a fixed node size
        
        // This is base D3 code
        // const treemap = d3.tree().nodeSize(nodeSize);

        // This is mod extention to D3 tree to add alignment
        const treemap = TidyTree.tree().nodeSize(nodeSize).alignment(alignment);

        // Generate the nodes
        const nodes = treemap(d3.hierarchy(hierarchy.topLevelNodes[0], d => d != null && d.isOpen() == true ? d.getChildren() : []));
        
        // Create an empty array for links
        const links = [];

        // Calculate node and link positions
        this.#calculateNodePositions(nodes, links, nodeHeight, nodeWidth, direction);

        // Create svg, sizing will happen at the end
        const svg = d3.select(diagramElem).append('svg').attr('width', 1).attr('height', 1);

        // TODO debug rect
        //svg.append('rect').attr('x', 0).attr('y', 0).attr('width', '100%').attr('height', '100%').attr('fill', 'linen');

        // Create a group which will be transformed later to position all the elements
        const svgG = svg.append('g');

        // Update nodes and links
        this.#drawLinks(svgG, links);
        this.#drawNodes(svgG, nodes, nodeWidth, nodeHeight);

        // Calculate dimensions and translations
        const svgBBox = svg.node().getBBox();
        let translateX, translateY;
        let width, height;
        if(orientation == OrganizationChart.ORIENTATION_VERTICAL) {
            width = Math.max(svgBBox.width + margin.left + margin.right, plotAreaElem.clientWidth - 20);
            height = svgBBox.height + margin.top;
            translateX = width / 2 - svgBBox.width / 2 + -1 * svgBBox.x;
            translateY = -1 * svgBBox.y + margin.top;            
        }
        else if(orientation == OrganizationChart.ORIENTATION_HORIZONTAL) {
            width = svgBBox.width + margin.left + margin.right;
            height = Math.max(svgBBox.height + margin.top + margin.bottom, plotAreaElem.clientHeight - 20);
            translateX = -1 * svgBBox.x + margin.left;
            translateY = height / 2 - svgBBox.height / 2 + -1 * svgBBox.y;           
        }

        // Resize svg
        svg.attr('width', width).attr('height', height);
        
        // Translate contents
        svgG.attr("transform", "translate(" + translateX + "," + translateY + ")");

        // Position scroll bars
        if(centerOnNodeId != null) {
            const nodeElem = svg.select('.node-element[node-id="' + centerOnNodeId + '"]');
            const nodeElemRect = nodeElem.node().getBoundingClientRect();

            const centerViewX = plotAreaElem.offsetWidth / 2;
            const nodeElemCenterX = nodeElemRect.x + nodeElemRect.width / 2;            
            const deltaX = nodeElemCenterX - centerViewX;
            plotAreaElem.scrollLeft = deltaX;

            const centerViewY = plotAreaElem.offsetHeight / 2;
            const nodeElemCenterY = nodeElemRect.y + nodeElemRect.height / 2;            
            const deltaY = nodeElemCenterY - centerViewY;
            plotAreaElem.scrollTop = deltaY;
        }
    }

    // Updates the SVG diagram with links
    #drawLinks(svgG, links) {
        // Calculate link lines, this creates a squared off link line
        function calculateLink(d) {
            let template = '';
            for(let thisLinkElem of d) {
                template += `${thisLinkElem.x},${thisLinkElem.y} `
            }
            return template.trim();
        }

        // Add links between nodes
        // This is before adding the actual nodes so nodes and toggle icons are layered
        // over top of the link lines
        svgG.selectAll('.link')
            .data(links)
            .enter()
                .append('polyline')
                    .attr('class', 'link')
                    .attr("points", calculateLink);
        
    }

    // Updates the SVG diagram with nodes
    #drawNodes(svgG, nodes, nodeWidth, nodeHeight) {
        const self = this;

        const openNodes = this.#openNodes;
        const vizConfig = this.#vizConfiguration.getConfiguration();
        const actions = this.#actions;

        // Add a group for each node
        const node = svgG.selectAll(".node")
            .data(nodes.descendants())
            .enter()
                .append("g")
                    .attr('node-id', d => d.data != null ? d.data.getNodeId() : null)
                    .attr("transform", d => `translate(${d._center.x},${d._center.y})`);

        // Prevents click events from clearing marking on this element
        function click(e) {
            e.stopPropagation();
        }

        // Mouse events to detect clicks and override rect marking
        let drag = false;
        let startEvent = null;
        let startData = null;

        function mousedown(e, d) {
            drag = false;
            startEvent = e;
            startData = d;
            document.addEventListener('mouseup', mouseup);
            document.addEventListener('mousemove', mousemove);
        }

        // Record as a drag
        function mousemove(e) {
            if(startEvent == null) return;
            if(Math.abs(startEvent.x - e.x) > 2 || Math.abs(startEvent.y - e.y) > 2)
                drag = true;
        }

        // If not a drag, mark the row
        function mouseup(e) {
            if(drag == false) {
                actions.markRows(e.ctrlKey, [startData.data.getObject().row]);
                e.stopPropagation();
            }
            document.removeEventListener('mouseup', mouseup);
            document.removeEventListener('mousemove', mousemove);
            startEvent = null;
            startData = null;
        }

        // Show tooltip on mouseover
        function mouseover(e, d) {            
            const object = d.data.getObject();
            actions.showTooltip(object.row);
        }

        // Hide tooltip on mouseout
        function mouseout(e, d) {
            actions.hideTooltip();
        }

        // Append node content as a foreign object so the content can be a div
        node.append('foreignObject')
            .attr('node-id', d => d.data != null ? d.data.getNodeId() : null)
            .attr('class', 'node-element')
            .attr('x', -1 * nodeWidth / 2)
            .attr('y', -1 * nodeHeight / 2)
            .attr('width', nodeWidth)
            .attr('height', nodeHeight)
            .on('click', click)
            .on('mousedown', mousedown)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .append(d => self.#drawNodeContent(d));

        // Add children toggle buttons if enabled
        if(vizConfig.appearance.enableNodeCollapse == true) {
            const childToggle = node.filter(d => d.data.hasChildren() == true)
                .append('g')
                    .attr('class', 'child-action interactive')
                    .attr("transform", d => `translate(${d._childToggle.x},${d._childToggle.y})`)
                    .html((d) => d.data.isOpen() ? OrganizationChart.HIDE_CHILD_TOGGLE_ICON : OrganizationChart.SHOW_CHILD_TOGGLE_ICON);
        
            // Function to toggle node open state
            function toggle(node, open, recursive) {
                if(open == true) {
                    node.open();
                    if(openNodes.indexOf(node.getNodeId()) == -1) 
                        openNodes.push(node.getNodeId());
                }
                else {
                    node.close();
                    if(openNodes.indexOf(node.getNodeId()) != -1)
                        openNodes.splice(openNodes.indexOf(node.getNodeId()), 1);
                }

                if(recursive == true) {
                    for(let thisChildNode of node.getChildren()) {
                        toggle(thisChildNode, open, recursive);
                    }
                }
            }

            // Add event handler for child toggles
            childToggle.on('click', function(e, d) {
                // Stop propagation to prevent unmarking
                e.stopPropagation();

                // Toggle node state
                const node = d.data;
                toggle(node, !node.isOpen());

                // Update open nodes and call update and center on this node
                self.#actions.setOpenNodes(openNodes);
                self.#update(node.getNodeId());
            });

            childToggle.on('contextmenu', async function(e, d) {
                // Stop propagation to prevent Spotfire context menu from displaying
                e.stopPropagation();

                // Compose menu items
                const items = [];
                if(d.data.isOpen()) {
                    items.push({enabled:true, text: 'Close', open: false, children: false});
                    items.push({enabled:true, text: 'Close all descendants', open: false, recursive: true});
                }
                else {
                    items.push({enabled:true, text: 'Open', open: true, children: false});
                    items.push({enabled:true, text: 'Open all descendants', open: true, recursive: true});
                }

                const action = await self.#actions.showContextMenu(e.clientX, e.clientY, items);
                
                if(action != null) {
                    // Toggle node state
                    const node = d.data;
                    toggle(node, action.open, action.recursive);
                    
                    // Update open nodes and call update and center on this node
                    self.#actions.setOpenNodes(openNodes);
                    self.#update(node.getNodeId());
                }
            });
        }
    }

    // Draw the node content
    #drawNodeContent(d) {
        const vizConfig = this.#vizConfiguration.getConfiguration();

        const nodeContentElem = document.createElement('div');
        nodeContentElem.classList.add('node-content');
        nodeContentElem.classList.add('interactive');

        const imagePrefix = 'data:image/png;base64,';
        
        // Get the object
        const object = d.data.getObject();

        // Extract fields for use in template
        const context = {
            nodeId: d.data.getNodeId(),
            parentNodeId: d.data.getParentNodeId() ?? '',
            contentStr: object.contentStr ?? '',
            contentObj: object.contentObj ?? '',
            contentArr: object.contentArr ?? [],
            image: object.image == null ? '' : imagePrefix + object.image,
            color: object.color,
        };
        
        // Convert the template string into a function, then execute
        //const templateFunction = DataUtility.compileTemplateString(vizConfig.appearance.nodeElementContent);
        //const template = templateFunction(context);
        const template = DataUtility.parseTemplate(vizConfig.appearance.nodeElementContent, context);

        // Append the template to the element
        nodeContentElem.innerHTML = template.trim();

        // Set background color and append darkcolor class if its dark
        if(vizConfig.appearance.setNodeColor == true) {
            nodeContentElem.style.backgroundColor = object.color;
            if(object.color != null && ColorUtility.hexIsLight(object.color) == false) {
                nodeContentElem.classList.add('darkcolor');
            }
        }

        return nodeContentElem;
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* CALCULATIONS */

    // Generates a node hierarchy 
    #generateNodeHierarchy(dataGroupMap) {
        const openNodes = this.#openNodes;
        const vizConfig = this.#vizConfiguration.getConfiguration();

        // Only a single data group named 'group'
        const dataGroup = dataGroupMap['group'];
        
        // First validate that the nodes in the openNodes list exist
        const removeNodeId = [];
        for(let thisOpenNode of openNodes) {
            const object = dataGroup.getDataMap()[thisOpenNode];
            if(object == null) 
                removeNodeId.push(thisOpenNode);
        }

        // Remove the nodes that no longer exist in the tree
        if(removeNodeId.length > 0) {
            for(let thisRemoveNode of removeNodeId) {
                const index = openNodes.indexOf(thisRemoveNode);
                openNodes.splice(index, 1);
            }
            this.#actions.setOpenNodes(openNodes);
        }

        // Create a node map with node id as key
        const nodeMap = {};

        // Create an array of top level nodes (i.e. have no parent node id)
        const topLevelNodes = [];

        // Create an array to hold all node objects
        const nodeList = [];

        dataGroup.iterateData(function(thisData, thisDataIndex) {
            const nodeId = thisData.nodeId;

            // Retrieve the node from the node map, if not found, create it
            let node = nodeMap[nodeId];
            if(node == null) {
                node = new OrganizationNode(nodeId);
                nodeList.push(node);
                nodeMap[nodeId] = node;
            }

            // Always set the object and open state
            node.setObject(thisData);
            node.setOpen(vizConfig.appearance.enableNodeCollapse != true || openNodes.indexOf(nodeId) > -1);

            const parentNodeId = thisData.parentNodeId;
            
            // If no parent node id then it's a top level node
            if(parentNodeId == null) {
                topLevelNodes.push(node);
            }
            else {
                // Retrieve the parent node from the node map
                // If not found, make a placeholder and append                
                let parentNode = nodeMap[parentNodeId];
                if(parentNode == null) {
                    parentNode = new OrganizationNode(parentNodeId);
                    nodeList.push(parentNode);
                    nodeMap[parentNodeId] = parentNode;
                }

                // Add this node as a child node
                parentNode.addChildNode(node);
            }
        });

        return {
            topLevelNodes: topLevelNodes,
            nodeList: nodeList
        };
    }

    // Calculate node positions
    #calculateNodePositions(nodes, links, nodeHeight, nodeWidth, direction) {
        const vizConfig = this.#vizConfiguration.getConfiguration();
        const childToggleSize = vizConfig.appearance.enableNodeCollapse == true ? OrganizationChart.CHILD_TOGGLE_SIZE : 0;
        const offsetFactor = vizConfig.appearance.nodeSiblingLinkOffset;

        function topToBottom(d) {
            d._center = {x: d.x, y: d.y};
            d._childToggle = {x: -1 * childToggleSize / 2, y: nodeHeight / 2 + 1};
            if(d.parent != null) {
                const parentAttach = {x: d.parent._center.x, y: d.parent._center.y + nodeHeight / 2 + childToggleSize};
                const childAttach = {x: d._center.x, y: d._center.y - nodeHeight / 2};
                const midpoint = {y: parentAttach.y + Math.abs(childAttach.y - parentAttach.y) * offsetFactor};

                links.push([
                    parentAttach,
                    {x: parentAttach.x, y: midpoint.y},
                    {x: childAttach.x, y: midpoint.y},
                    childAttach
                ]);
            }
        }

        function bottomToTop(d) {
            const maxY = d3.max(nodes, d => d.y);
            d._center = {x: d.x, y: (maxY - d.y)};
            d._childToggle = {x: -1 * childToggleSize / 2, y: -1 * (nodeHeight / 2 + childToggleSize)};
            if(d.parent != null) {
                const parentAttach = {x: d.parent._center.x, y: d.parent._center.y - nodeHeight / 2 - childToggleSize};
                const childAttach = {x: d._center.x, y: d._center.y + nodeHeight / 2};
                const midpoint = {y: childAttach.y + Math.abs(childAttach.y - parentAttach.y) * (1 - offsetFactor)};

                links.push([
                    parentAttach,
                    {x: parentAttach.x, y: midpoint.y},
                    {x: childAttach.x, y: midpoint.y},
                    childAttach
                ]);
            }
        }

        function leftToRight(d) {
            d._center = {x: d.y, y: d.x};
            d._childToggle = {x: nodeWidth / 2, y: -1 * childToggleSize / 2};
            if(d.parent != null) {
                const parentAttach = {x: d.parent._center.x + nodeWidth / 2 + childToggleSize, y: d.parent._center.y};
                const childAttach = {x: d._center.x - nodeWidth / 2, y: d._center.y};
                const midpoint = {x: parentAttach.x + Math.abs(childAttach.x - parentAttach.x) * offsetFactor};

                links.push([
                    parentAttach,
                    {x: midpoint.x, y: parentAttach.y},
                    {x: midpoint.x, y: childAttach.y},
                    childAttach
                ]);
            }
        }

        function rightToLeft(d) {
            const maxY = d3.max(nodes, d => d.y);
            d._center = {x: (maxY - d.y), y: d.x};
            d._childToggle = {x: -1 * (nodeWidth / 2 + childToggleSize), y: -1 * childToggleSize / 2};
            if(d.parent != null) {
                const parentAttach = {x: d.parent._center.x - nodeWidth / 2 - childToggleSize, y: d.parent._center.y};
                const childAttach = {x: d._center.x + nodeWidth / 2, y: d._center.y};
                const midpoint = {x: childAttach.x + Math.abs(childAttach.x - parentAttach.x) * (1 - offsetFactor)};

                links.push([
                    parentAttach,
                    {x: midpoint.x, y: parentAttach.y},
                    {x: midpoint.x, y: childAttach.y},
                    childAttach
                ]);
            }
        }

        // Iterate over all nodes and process based on direction
        nodes.each(function(d) {
            if(direction == OrganizationChart.DIRECTION_TOP_TO_BOTTOM)
                topToBottom(d);
            else if(direction == OrganizationChart.DIRECTION_BOTTOM_TO_TOP)
                bottomToTop(d);
            else if(direction == OrganizationChart.DIRECTION_LEFT_TO_RIGHT)
                leftToRight(d);
            else if(direction == OrganizationChart.DIRECTION_RIGHT_TO_LEFT)
                rightToLeft(d);
            else
                console.log(`Unknown direction ${direction}`);
        });
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACTIONS */

    // Rectangular selection
    rectangleSelection(selection) {
        const plotAreaElem = this.#plotAreaElem;
        const matchingRows = [];

        // Convert the selection rectangle coordinates
        const selectionBox = {
            left: selection.x,
            right: selection.x + selection.width,
            top: selection.y,
            bottom: selection.y + selection.height
        };

        function intersect(a, b) {
            return (a.left <= b.right &&
                    b.left <= a.right &&
                    a.top <= b.bottom &&
                    b.top <= a.bottom)
        };

        function testNode(d) {
            const nodeRect = this.getBoundingClientRect();
            const nodeBox = {
                left: nodeRect.x,
                right: nodeRect.x + nodeRect.width,
                top: nodeRect.y,
                bottom: nodeRect.y + nodeRect.height
            };
            if(intersect(selectionBox, nodeBox) == true)
                matchingRows.push(d.data.getObject().row);
        }

        // Select all node contents
        d3.select(plotAreaElem).selectAll('.node-element').each(testNode);

        return matchingRows;
    }

    // Position the vertical scroll bar
    #positionScrollVertical() {
        const plotAreaElem = this.#plotAreaElem;
        if(plotAreaElem != null) {
            plotAreaElem.scrollTop = this.#scrollTop;
        }
    }

    // Position the horizontal scroll bar
    #positionScrollHorizontal() {
        const plotAreaElem = this.#plotAreaElem;
        if(plotAreaElem != null) {
            plotAreaElem.scrollLeft = this.#scrollLeft;
        }
    }

    /* ---------------------------------------------------------------------------------------------------- */
    /* ACCESSORS */

    // Sets scroll top from external call
    setScrollTop(scrollTop) {
        this.#scrollTop = scrollTop;
        this.#positionScrollVertical();
    }

    // Sets scroll left from external call
    setScrollLeft(scrollLeft) {
        this.#scrollLeft = scrollLeft;
        this.#positionScrollHorizontal();
    }

    // Sets open nodes from external call
    setOpenNodes(trellisName, openNodes) {
        this.#trellisName = trellisName;
        this.#openNodes = openNodes;
    }
}