/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

/* This object is used to populate the default configuration on mod creation into the mod properties. */
export const defaultConfiguration = {
    "data": {
        "rowLimit": 2000,
    },
    "appearance": {
        "enableNodeCollapse": true,
        "nodeHeight": 60,
        "nodeWidth": 150,
        "nodePaddingAncestor": 40,
        "nodePaddingSibling": 10,
        "nodeSiblingLinkOffset": 0.5,
        "nodeDirection": "top-to-bottom",
        "nodeAlignment": "center",
        "setNodeColor": true,
        "nodeElementContent": "<div class=\"border flex-row start-center\">\n  <img src=\"${image}\"/>\n  <div class=\"fill\">${contentStr}</div>\n</div>",
    },
    "tooltip": {
        "showTooltip": true,
    },
    "trellis": {
        "trellisDirection": "columns",
        "maxTrellisCount": 10,
    },
}
