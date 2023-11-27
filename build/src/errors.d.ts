declare class TestError<T> extends Error {
    testName: string;
    reportErrorData?: T;
    constructor(message: string, testName: string, reportErrorData?: T);
}
export { TestError };
