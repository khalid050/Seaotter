"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const otter_1 = require("./otter");
const config_1 = __importDefault(require("./config"));
const otter = new otter_1.Otter();
const { explore, test, expect } = otter;
global.otter = otter;
global.explore = explore;
global.test = test;
global.expect = expect;
(async function () {
    otter.wadeIn(config_1.default);
    otter.on('testFailure', (error) => {
        console.log({ error });
    });
    await otter.dive();
    // // second approach
    // for await (const test of otter.cruise()) {
    //   console.log({ test });
    // }
})();
