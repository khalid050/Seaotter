"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otter = void 0;
const path_1 = __importDefault(require("path"));
const library_1 = require("./library");
const tools_1 = require("./tools");
const errors_1 = require("./errors");
const execQueue = Symbol('executeQueue');
class Otter extends library_1.Library {
    constructor() {
        super();
        this.testFiles = [];
        this.settings = {};
        this.logMode = 'verbose';
        if ((process.env.TEST_OPTIONS)) {
            const testOptions = JSON.parse(process.env.TEST_OPTIONS);
            this.logMode = testOptions.verbose === 'true' ? 'verbose' : 'silent';
        }
        if (process.env.TEST_FILES) {
            this.tests = process.env.TEST_FILES.split(',');
        }
        this.tests = [];
        this.testFiles = [];
        this.settings = {};
        this.currentTestFile = '';
        this.info = {};
        this[execQueue] = this[execQueue].bind(this);
        this.print = this.logMode === 'verbose' ? this.verboseLog : this.quietLog;
    }
    wadeIn({ testDirectory, random = false, fastFail = true, tests = this.tests }) {
        for (const testFile of tests) {
            this.info[testFile] = {
                status: 'pending',
                numTestsFailed: 0,
                numTestsPassed: 0,
                failedTests: [],
                testTime: 0
            };
            this.testFiles.push(path_1.default.join(testDirectory, testFile));
        }
        this.settings['random'] = random;
        this.settings['fastFail'] = fastFail;
    }
    async [execQueue](queue) {
        if (!queue || !queue.length) {
            return;
        }
        for (const explore of queue) {
            this.print(explore, 'blue');
            for (const block of explore.children) {
                if (block.type === 'skippedTest') {
                    return;
                }
                if (block.type === 'test') {
                    await this.runTest(block);
                }
                else if (block.type === 'assertion') {
                    this.runAssertion(block);
                }
                else if (block.type === 'explore') {
                    await this[execQueue]([block]);
                }
            }
        }
    }
    runAssertion(block) {
        const result = block.testBody();
        if (result) {
            this.print(block, 'white');
        }
        else {
            block.status = 'failure';
            this.print(block, 'red');
            this.info[this.currentTestFile].failedTests.push(block);
            if (this.settings.fastFail) {
                throw new errors_1.TestError('Assert failure', this.currentTestFile);
            }
        }
    }
    async runTest(testBlock) {
        try {
            this.runBeforeEach();
            await testBlock.testBody();
            this.print(testBlock, 'white');
            this.runAfterEach();
        }
        catch (error) {
            this.print(testBlock, 'red');
            testBlock.status = 'failure';
            this.info[this.currentTestFile].failedTests.push(testBlock);
            if (this.settings.fastFail) {
                throw new errors_1.TestError('Test failed', this.currentTestFile);
            }
        }
    }
    async *cruise() {
        if (!this.testFiles.length) {
            console.log('No test files provided');
            return;
        }
        for (const testFile of this.testFiles) {
            this.currentTestFile = path_1.default.basename(testFile);
            require(testFile);
            if (!this.exploreQueue.length) {
                console.log('No tests to run');
                return;
            }
            await this[execQueue](this.exploreQueue);
            this.sanitizeTree(this.exploreQueue);
            yield {
                info: this.info[this.currentTestFile],
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
        const startTime = new Date();
        for (const testFile of this.testFiles) {
            this.currentTestFile = path_1.default.basename(testFile);
            require(testFile);
            if (!this.exploreQueue.length) {
                console.log('No tests to run');
                return;
            }
            if (this.exploreQueue.length > 1) {
                console.log((0, tools_1.highlight)(this.exploreQueue[1].description, 'red'));
                throw new Error('Only 1 outer Describe statement is allowed');
            }
            try {
                this.runBeforeAll();
                await this[execQueue](this.exploreQueue);
            }
            catch (error) {
                // handle this
                console.log(error);
            }
            finally {
                this.runAfterAll();
                this.flush();
                const info = this.info[this.currentTestFile];
                info.status = info.failedTests.length ? 'failure' : 'success';
            }
        }
        const endTime = new Date();
        const { status } = this.info[this.currentTestFile];
        const color = status === 'success' ? 'green' : 'red';
        const testTime = endTime.getTime() - startTime.getTime();
        this.info[this.currentTestFile].testTime = testTime;
        console.log(`\n\nStatus: ${(0, tools_1.highlight)(status, color)}`);
        console.log(`Tests finished in ${testTime} milliseconds`);
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
        this.logWithIndent((0, tools_1.highlight)(node.description, color), node.nestingLevel);
    }
    quietLog(node) {
        if (node.type === 'explore')
            return;
        const symbol = node.status === 'success' ? tools_1.COLORS.green + '✓' + tools_1.COLORS.reset : tools_1.COLORS.red + '✗' + tools_1.COLORS.reset;
        process.stdout.write(symbol);
    }
}
exports.Otter = Otter;
