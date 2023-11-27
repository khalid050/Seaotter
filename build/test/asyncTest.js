"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const Test_Types = {
    DISABLE: '#disable',
    REGRESSION: '#regression',
};
const { REGRESSION } = Test_Types;
otter.explore `This is my first Describe ${REGRESSION}`(() => {
    otter.test `first test`(async () => {
        await (0, utils_1.simulateDelay)('A', 150);
        await (0, utils_1.simulateDelay)('B', 300);
    });
    otter.test `second test`(async () => {
        await (0, utils_1.simulateDelay)('C', 450);
        await (0, utils_1.simulateDelay)('D', 100);
    });
    const a = 10;
    const b = 20;
    otter.expect `${a} toBeLessThan ${b}`;
    otter.expect `${b} toBeLessThan ${b}`;
});
