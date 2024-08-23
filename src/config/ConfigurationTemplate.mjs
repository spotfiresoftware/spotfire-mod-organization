/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export const configurationTemplate = {
    "data": {
        "_label_data": "Data",
        "rowLimit": {
            "label": "Row limit",
            "datatype": "int",
            "minVal": 0
        },
    },
    "appearance": {
        "_label_appearance": "Appearance",
        "enableNodeCollapse": {
            "label": "Enable collapsable hierarchy",
            "datatype": "boolean",
        },
        "nodeHeight": {
            "label": "Node height",
            "datatype": "int",
            "minVal": 0
        },
        "nodeWidth": {
            "label": "Node width",
            "datatype": "int",
            "minVal": 0
        },
        "nodePaddingAncestor": {
            "label": "Node padding ancestor",
            "datatype": "int",
            "minVal": 0
        },
        "nodePaddingSibling": {
            "label": "Node padding sibling minimum",
            "datatype": "int",
            "minVal": 0
        },
        "nodeSiblingLinkOffset": {
            "label": "Sibling link offset from ancestor",
            "datatype": "double",
            "minVal": 0,
            "maxVal": 1,
        },
        "nodeDirection": {
            "label": "Node direction",
            "datatype": "string",
            "enumeration": [
                {"label": "Top to Bottom", "value": "top-to-bottom"}, 
                {"label": "Bottom to Top", "value": "bottom-to-top"},
                {"label": "Left to Right", "value": "left-to-right"},
                {"label": "Right to Left", "value": "right-to-left"},
            ]
        },
        "nodeAlignment": {
            "label": "Node alignment",
            "datatype": "string",
            "enumeration": [
                {"label": "First Child", "value": "first-child"}, 
                {"label": "Center", "value": "center"},
                {"label": "Last Child", "value": "last-child"},
            ]
        },
        "setNodeColor": {
            "label": "Set node color",
            "datatype": "boolean",
        },
        "nodeElementContent": {
            "label": "Node element content",
            "datatype": "string",
            "multiline": true,
        },
    },
    "tooltip": {
        "_label_tooltip": "Tooltip",
        "showTooltip": {
            "label": "Show tooltips",
            "datatype": "boolean"
        },
    },
    "trellis": {
        "_label_trellis": "Trellis",
        "trellisDirection": {
            "label": "Trellis direction",
            "datatype": "string",
            "radio": true,
            "enumeration": [
                {"label": "Rows", "value": "rows"}, 
                {"label": "Columns", "value": "columns"}
            ]
        },
        "maxTrellisCount": {
            "label": "Max trellis panel count",
            "datatype": "int",
            "minVal": 0
        },
    }
}

export const iconTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24">
      <g>
        <path d="M0,0h24v24H0V0z" fill="none"></path>
        <path class="gear-icon" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path>
      </g>
    </svg>
`;

