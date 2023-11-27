import { Library } from './library';
import { Color } from './tools';
import { ExploreQueue, Nodes } from './types';
declare const executeQueueSymbol: unique symbol;
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
    info: Record<string, {
        status: string;
    }>;
    private logMode;
    print: (node: Nodes, color: Color) => void;
    constructor();
    wadeIn({ testDirectory, random, fastFail, tests }: Init): void;
    private [executeQueueSymbol];
    cruise(): AsyncGenerator<{
        info: {
            status: string;
        };
        testHierarchy: ExploreQueue;
    }, void, unknown>;
    dive(): Promise<void>;
    private sanitizeTree;
    private verboseLog;
    private quietLog;
}
export { Otter };
