/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'stream';
import { ExploreBody, ExploreNode, ExploreQueue, TestBody } from './types';
declare class Library extends EventEmitter {
    protected exploreQueue: ExploreQueue;
    protected exploreStack: ExploreNode[];
    private currentExplore;
    private beforeAllCallbacks;
    private beforeEachCallbacks;
    private afterEachCallbacks;
    private afterAllCallbacks;
    constructor();
    explore(description: TemplateStringsArray, ...values: string[]): (exploreBody: ExploreBody) => {
        setMetadata: (metadata: Record<string, unknown>) => void;
    };
    private setMetadata;
    /**
     *
     * @param description Description of your test
     * @param values
     * @returns test body as a callback function. You may optionally paramaterize the callback by providing an argument after the callback
     */
    test(description: TemplateStringsArray, ...values: string[]): (testBody: TestBody, ...args: unknown[]) => {
        setMetadata: (metadata: Record<string, unknown>) => void;
    };
    skip(description: TemplateStringsArray, ...values: string[]): () => void;
    expect<T extends (number | string)>(assertion: TemplateStringsArray, ...values: T[]): void;
    private getTestBody;
    private toEqual;
    private toBeGreaterThan;
    private toBeLessThan;
    private toNotEqual;
    protected logWithIndent(message: string, nestingLevel: number): void;
    private peek;
    protected flush(): void;
    /**
     * @param expression Anything that evaluates to a boolean
     * @param cb Callback to run when if the expression evaluates to true
     * @returns undefined
     */
    when(expression: boolean, cb: () => unknown): unknown;
    beforeEach(callback: () => void): void;
    afterEach(callback: () => void): void;
    beforeAll(callback: () => void): void;
    afterAll(callback: () => void): void;
    runBeforeEach(): void;
    runAfterEach(): void;
    runBeforeAll(): void;
    runAfterAll(): void;
}
export { Library, };
