export type ExploreQueue = ExploreNode[];
export type Status = 'success' | 'failure' | 'pending' | 'disabled' | 'fastFail';
export type ExploreNode = {
    type: 'explore';
    description: string;
    tags: `#${string}`[];
    nestingLevel: number;
    children: Children;
    status: Status;
};
export type TestNode = {
    type: 'test';
    description: string;
    testBody: TestBody;
    nestingLevel: number;
    status: Status;
};
export type AssertionNode = {
    type: 'assertion';
    description: string;
    nestingLevel: number;
    status: Status;
    testBody: () => boolean;
};
export type TestBody = () => Promise<void> | void;
export type ExploreBody = () => void;
export type Nodes = ExploreNode | TestNode | AssertionNode;
export type Children = Nodes[];
export type Assertions = {
    toEqual: 'toEqual';
    toNotEqual: 'toNotEqual';
    toBeGreaterThan: 'toBeGreaterThan';
    toBeLessThan: 'toBeLessThan';
};
export type AssertionFunc = <T>(a: T, b: T) => boolean;
