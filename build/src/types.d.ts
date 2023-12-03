export type ExploreQueue = ExploreNode[];
export type Status = 'success' | 'failure' | 'pending' | 'disabled' | 'fastFail';
export type ExploreNode = {
    type: 'explore';
    description: string;
    tags: `#${string}`[];
    nestingLevel: number;
    children: Children;
    metadata: Metadata;
};
export type TestNode = {
    type: 'test';
    description: string;
    testBody: TestBody;
    nestingLevel: number;
    status: Status;
    metadata: Metadata;
};
export type SkippedTestNode = {
    type: 'skippedTest';
    description: string;
    nestingLevel: number;
    status: 'skipped';
};
export type AssertionNode = {
    type: 'assertion';
    description: string;
    nestingLevel: number;
    status: Status;
    testBody: () => boolean;
};
export type TestBody = (...args: unknown[]) => Promise<void> | void;
export type ExploreBody = () => void;
export type Nodes = ExploreNode | TestNode | AssertionNode | SkippedTestNode;
export type Children = Nodes[];
export type Assertions = {
    toEqual: 'toEqual';
    toNotEqual: 'toNotEqual';
    toBeGreaterThan: 'toBeGreaterThan';
    toBeLessThan: 'toBeLessThan';
};
export type AssertionFunc = <T>(a: T, b: T) => boolean;
type Metadata = Record<string, unknown> | null;
export {};
