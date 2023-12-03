"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
const stream_1 = require("stream");
const tools_1 = require("./tools");
// remove the event emitter from here
class Library extends stream_1.EventEmitter {
    constructor() {
        super();
        this.exploreQueue = []; // todo: change to linked list?
        this.exploreStack = [];
        this.currentExplore = null;
        this.beforeAllCallbacks = [];
        this.beforeEachCallbacks = [];
        this.afterEachCallbacks = [];
        this.afterAllCallbacks = [];
        this.explore = this.explore.bind(this);
        this.test = this.test.bind(this);
        this.expect = this.expect.bind(this);
        this.when = this.when.bind(this);
        this.skip = this.skip.bind(this);
    }
    explore(description, ...values) {
        values = values.map((tag) => (0, tools_1.highlight)(tag, 'yellow'));
        const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
        const exploreNode = {
            type: 'explore',
            description: concatenatedDescription,
            children: [],
            tags: [],
            nestingLevel: this.exploreStack.length,
            metadata: null
        };
        if (this.currentExplore) {
            this.currentExplore.children.push(exploreNode);
        }
        else {
            this.exploreQueue.push(exploreNode);
        }
        this.exploreStack.push(exploreNode);
        this.currentExplore = exploreNode;
        return (exploreBody) => {
            exploreBody();
            this.exploreStack.pop();
            this.currentExplore = this.peek() || null;
            return {
                setMetadata: this.setMetadata.bind(this, exploreNode)
            };
        };
    }
    setMetadata(exploreNode, metadata) {
        exploreNode.metadata = metadata;
    }
    /**
     *
     * @param description Description of your test
     * @param values
     * @returns test body as a callback function. You may optionally paramaterize the callback by providing an argument after the callback
     */
    test(description, ...values) {
        return (testBody, ...args) => {
            const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
            const testNode = {
                type: 'test',
                description: concatenatedDescription,
                testBody: testBody.bind(this, ...args),
                nestingLevel: this.exploreStack.length,
                status: 'success',
                metadata: null
            };
            if (this.currentExplore) {
                this.currentExplore.children.push(testNode);
            }
            else {
                throw new Error('Nested test statements are not allowed');
            }
            return {
                setMetadata: this.setMetadata.bind(this, testNode)
            };
        };
    }
    skip(description, ...values) {
        if (!this.currentExplore) {
            console.log('error');
            throw new Error('Test must be inside a Explore statement');
        }
        return () => {
            const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
            const skippedTestNode = {
                type: 'skippedTest',
                description: concatenatedDescription,
                nestingLevel: this.exploreStack.length,
                status: 'skipped'
            };
            if (this.currentExplore) {
                this.currentExplore.children.push(skippedTestNode);
            }
        };
    }
    // forEach(description: TemplateStringsArray, ...values: string[]) {
    //   const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
    //   return (arr: unknown[]) => {
    //     arr.forEach((element, index) => {
    //     });
    //   };
    // }
    expect(assertion, ...values) {
        const concatenatedAssertion = `expect ${values[0]}${assertion[1]}${values[1]}`;
        const trimmedAssertion = assertion[1].trim();
        const testBody = this.getTestBody(trimmedAssertion, values);
        const assertionNode = {
            type: 'assertion',
            description: concatenatedAssertion,
            nestingLevel: this.exploreStack.length,
            status: 'success',
            testBody: testBody
        };
        if (this.currentExplore) {
            this.currentExplore.children.push(assertionNode);
        }
        else {
            if (!this.currentExplore) {
                throw new Error('Expect must be inside an Explore or Test statement');
            }
        }
    }
    getTestBody(assertionType, args) {
        return this[assertionType].bind(this, ...args);
    }
    toEqual(a, b) {
        return a === b;
    }
    toBeGreaterThan(a, b) {
        return a > b;
    }
    toBeLessThan(a, b) {
        return a < b;
    }
    toNotEqual(a, b) {
        return a !== b;
    }
    logWithIndent(message, nestingLevel) {
        const indentation = '  '.repeat(nestingLevel);
        process.stdout.write(`${indentation}${message}\n`);
    }
    peek() {
        return this.exploreStack[this.exploreStack.length - 1];
    }
    flush() {
        this.exploreQueue = [];
        this.exploreStack = [];
    }
    /**
     * @param expression Anything that evaluates to a boolean
     * @param cb Callback to run when if the expression evaluates to true
     * @returns undefined
     */
    when(expression, cb) {
        if (typeof expression !== 'boolean') {
            throw new Error('Argument result must be of type boolean');
        }
        if (expression) {
            return cb();
        }
    }
    beforeEach(callback) {
        this.beforeEachCallbacks.push(callback);
    }
    afterEach(callback) {
        this.afterEachCallbacks.push(callback);
    }
    beforeAll(callback) {
        this.beforeAllCallbacks.push(callback);
    }
    afterAll(callback) {
        this.afterAllCallbacks.push(callback);
    }
    runBeforeEach() {
        this.beforeEachCallbacks.forEach((callback) => callback());
    }
    runAfterEach() {
        this.afterEachCallbacks.forEach((callback) => callback());
    }
    runBeforeAll() {
        this.beforeAllCallbacks.forEach((callback) => callback());
    }
    runAfterAll() {
        this.afterAllCallbacks.forEach((callback) => callback());
    }
}
exports.Library = Library;
