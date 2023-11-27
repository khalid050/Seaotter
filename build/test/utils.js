"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateDelay = void 0;
async function simulateDelay(output, delay) {
    await new Promise((resolve) => {
        setTimeout(() => {
            // console.log(output);
            resolve(true);
        }, delay);
    });
}
exports.simulateDelay = simulateDelay;
