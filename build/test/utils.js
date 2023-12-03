"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runThisTest = exports.runThisExplore = exports.simulateDelay = void 0;
async function simulateDelay(output, delay) {
    await new Promise((resolve) => {
        setTimeout(() => {
            // console.log(output);
            resolve(true);
        }, delay);
    });
}
exports.simulateDelay = simulateDelay;
function runThisExplore(heading, { a, b }) {
    explore `${heading}`(() => {
        test `THIS IS A TEST 1`(() => {
            console.log({ a });
        });
        test `THIS IS A TEST 2`(() => {
            console.log({ b });
        });
    });
}
exports.runThisExplore = runThisExplore;
function runThisTest({ a, b }) {
    otter.when(a < b, () => {
        test `running`(() => {
            // console.log('running');
        });
    });
}
exports.runThisTest = runThisTest;
