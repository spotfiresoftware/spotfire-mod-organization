/*
 * Copyright © 2024. Cloud Software Group, Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

export default class ColorUtility {
    static hexToRgb(hexColorStr) {
        const r = parseInt(hexColorStr.slice(1, 3), 16);
        const g = parseInt(hexColorStr.slice(3, 5), 16);
        const b = parseInt(hexColorStr.slice(5, 7), 16);
     
        return {r: r, g: g, b: b};
    }

    static rgbToHex(r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
          }
          
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
    
        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        return {h: h, s: s, l: l};
    }

    static hslToRgb(h, s, l) {
        let r, g, b;

        function hueToRgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if (s === 0) {
          r = g = b = l; // achromatic
        } 
        else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hueToRgb(p, q, h + 1/3);
          g = hueToRgb(p, q, h);
          b = hueToRgb(p, q, h - 1/3);
        }
      
        return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
    }

    static hexIsLight(hexColorStr) {
        const rgb = this.hexToRgb(hexColorStr);
        return this.rgbIsLight(rgb.r, rgb.g, rgb.b);
    }

    static rgbIsLight(r, g, b) {
        let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
        return luma > 160;
    }

    static addHexTransparency(hexColorStr, transparencyStr) {
        // Validate its hex
        if(hexColorStr.substring(0,1) != '#') return hexColorStr;

        // Validate length
        let hexColor = hexColorStr;
        let transparency = null;
        if(hexColor.length == 9) {
            hexColor = hexColorStr.substring(0,7);
            transparency = hexColorStr.substring(7);
        }

        if(transparency == null) {
            return hexColorStr + transparencyStr;
        }

        const ratio = parseInt(transparencyStr, 16) / parseInt('FF', 16);
        
        transparency = Math.round(parseInt(transparency, 16) * ratio).toString(16);
        transparency = (transparency.length == 1 ? '0' : '') + transparency;
        return hexColor + transparency;
    }
}

