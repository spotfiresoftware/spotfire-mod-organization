/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class SVGUtility {
    // Converts svg coordinates into screen coordinates
    static svgToScreen(svg, svgX, svgY) {
        let p = svg.createSVGPoint()
        p.x = svgX;
        p.y = svgY;
        return p.matrixTransform(svg.getScreenCTM());
    }

    // Converts screen coordinates into svg coordinates
    static screenToSVG(svg, screenX, screenY) {
        let p = svg.createSVGPoint();
        p.x = screenX;
        p.y = screenY;
        return p.matrixTransform(svg.getScreenCTM().inverse());
    }
}
