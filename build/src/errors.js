"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestError = void 0;
class TestError extends Error {
    constructor(message, testName, reportErrorData) {
        super(message);
        this.name = 'TestError';
        this.testName = testName;
        this.reportErrorData = reportErrorData;
    }
}
exports.TestError = TestError;
