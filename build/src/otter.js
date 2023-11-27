"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otter = void 0;
const path_1 = __importDefault(require("path"));
const library_1 = require("./library");
const tools_1 = require("./tools");
const tools_2 = require("./tools");
const errors_1 = require("./errors");
// import { TestError } from './errors';
const executeQueueSymbol = Symbol('executeQueue');
class Otter extends library_1.Library {
    constructor() {
        super();
        this.testFiles = [];
        this.settings = {};
        this.logMode = 'silent';
        this.testFiles = [];
        this.settings = {};
        this[executeQueueSymbol] = this[executeQueueSymbol].bind(this);
        this.info = {};
        this.print = this.logMode === 'verbose' ? this.verboseLog : this.quietLog;
    }
    wadeIn({ testDirectory, random = false, fastFail = true, tests = [] }) {
        for (const testFile of tests) {
            this.info[testFile] = {
                status: ''
            };
            this.testFiles.push(path_1.default.join(testDirectory, testFile));
        }
        this.settings['random'] = random;
        this.settings['fastFail'] = fastFail;
    }
    // fix this
    async [executeQueueSymbol](queue) {
        if (!queue || !queue.length) {
            return;
        }
        for (const describe of queue) {
            this.print(describe, 'blue');
            for (const block of describe.children) {
                if (block.type === 'test' || block.type === 'assertion') {
                    try {
                        const result = await block.testBody();
                        if (block.type === 'assertion') {
                            if (!result) {
                                throw new errors_1.TestError('Assertion failure', 'placeholder');
                            }
                        }
                        block.status = 'success';
                        this.print(block, 'white');
                    }
                    catch (error) {
                        block.status = 'failure';
                        this.print(block, 'white');
                        this.emit('testFailure', error);
                    }
                }
                else {
                    await this[executeQueueSymbol]([block]);
                }
            }
        }
    }
    async *cruise() {
        if (!this.testFiles.length) {
            console.log('No test files provided');
            return;
        }
        for (const testFile of this.testFiles) {
            require(testFile);
            if (!this.exploreQueue.length) {
                console.log('No tests to run');
                return;
            }
            await this[executeQueueSymbol](this.exploreQueue);
            const file = testFile.split('/').at(-1);
            this.sanitizeTree(this.exploreQueue);
            yield {
                info: this.info[file],
                testHierarchy: this.exploreQueue
            };
            this.flush();
        }
    }
    async dive() {
        if (!this.testFiles.length) {
            console.log('No test files provided');
            return;
        }
        if (this.exploreQueue.length) {
            throw new Error('Finish executing test before starting another in the same proccess');
        }
        for (const testFile of this.testFiles) {
            require(testFile);
            if (!this.exploreQueue.length) {
                console.log('No tests to run');
                return;
            }
            if (this.exploreQueue.length > 1) {
                console.log((0, tools_2.highlight)(this.exploreQueue[1].description, 'red'));
                throw new Error('Only 1 outer Describe statement is allowed');
            }
            await this[executeQueueSymbol](this.exploreQueue);
            this.flush();
        }
    }
    sanitizeTree(queue) {
        if (!queue || !queue.length) {
            return;
        }
        for (const block of queue) {
            if (block.type === 'explore') {
                this.sanitizeTree(block.children);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete block.testBody;
            }
        }
    }
    verboseLog(node, color) {
        this.logWithIndent((0, tools_2.highlight)(node.description, color), node.nestingLevel);
    }
    quietLog(node) {
        const symbol = node.status === 'success' ? tools_1.COLORS.green + '✓' + tools_1.COLORS.reset : tools_1.COLORS.red + '✗' + tools_1.COLORS.reset;
        process.stdout.write(symbol);
    }
}
exports.Otter = Otter;
