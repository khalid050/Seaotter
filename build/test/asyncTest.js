"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const utils_1 = require("./utils");
const tag = '#Regression';
otter.explore `This is my first Describe ${tag}`(() => {
    otter.test `first test`(async () => {
        // console.log('A');
        await (0, utils_1.simulateDelay)('B', 150);
        await (0, utils_1.simulateDelay)('C', 300);
    });
    otter.test `second test`(async () => {
        // console.log('D');
        await (0, utils_1.simulateDelay)('E', 450);
        await (0, utils_1.simulateDelay)('F', 100);
    });
    otter.explore `nested describe`(() => {
        test `nested test`(() => {
            // console.log('logging nested test');
        });
    });
    const a = 10;
    const b = 20;
    expect `${a} toNotEqual ${b}`;
    (0, utils_1.runThisTest)({ a: 2, b: 3 });
    // otter.when(a < b, () => {
    //   test`Log the output diff`(() => {
    //     // console.log({ a, b });
    //   });
    // });
});
