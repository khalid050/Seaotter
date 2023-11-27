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
        this.explore = this.explore.bind(this);
        this.test = this.test.bind(this);
        this.expect = this.expect.bind(this);
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
            status: 'success'
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
        };
    }
    test(description, ...values) {
        if (!this.currentExplore) {
            console.log('error');
            throw new Error('Test must be inside a Explore statement');
        }
        return (testBody) => {
            const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
            const testNode = {
                type: 'test',
                description: concatenatedDescription,
                testBody: testBody,
                nestingLevel: this.exploreStack.length,
                status: 'pending'
            };
            if (this.currentExplore) {
                this.currentExplore.children.push(testNode);
            }
        };
    }
    expect(assertion, ...values) {
        const concatenatedAssertion = `expect ${values[0]}${assertion[1]}${values[1]}`;
        const trimmedAssertion = assertion[1].trim();
        const testBody = this.getTestBody(trimmedAssertion, values);
        const assertionNode = {
            type: 'assertion',
            description: concatenatedAssertion,
            nestingLevel: this.exploreStack.length,
            status: 'pending',
            testBody: testBody
        };
        if (this.currentExplore) {
            this.currentExplore.children.push(assertionNode);
        }
        else {
            // not tested yet
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
        return a < b;
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
    }
}
exports.Library = Library;
