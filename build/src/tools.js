"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLORS = exports.highlight = void 0;
const COLORS = {
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    cyan: '\x1b[36m%s\x1b[0m',
    green: '\x1b[32m',
    gray: '\x1b[90m',
    white: '\u001b[371m',
};
exports.COLORS = COLORS;
const highlight = (text, color) => {
    return `${COLORS[color]}${text}${COLORS.reset}`;
};
exports.highlight = highlight;
