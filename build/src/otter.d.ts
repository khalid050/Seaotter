import { Library } from './library';
import { Color } from './tools';
import { ExploreQueue, Nodes } from './types';
declare const execQueue: unique symbol;
type Init = {
    testDirectory: string;
    random?: boolean;
    fastFail?: boolean;
    tests: string[];
    tags?: string[];
};
declare class Otter extends Library {
    private testFiles;
    private settings;
    private currentTestFile;
    info: {
        [file: string]: {
            status: 'pending' | 'success' | 'failure';
            numTestsFailed: 0;
            numTestsPassed: number;
            failedTests: Array<unknown>;
            testTime: number;
        };
    };
    private logMode;
    print: (node: Nodes, color: Color) => void;
    constructor();
    wadeIn({ testDirectory, random, fastFail, tests }: Init): void;
    private [execQueue];
    private runAssertion;
    private runTest;
    cruise(): AsyncGenerator<{
        info: {
            status: "pending" | "success" | "failure";
            numTestsFailed: 0;
            numTestsPassed: number;
            failedTests: unknown[];
            testTime: number;
        };
        testHierarchy: ExploreQueue;
    }, void, unknown>;
    dive(): Promise<void>;
    private sanitizeTree;
    private verboseLog;
    private quietLog;
}
export { Otter };
