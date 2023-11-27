/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'stream';
import { ExploreBody, ExploreNode, ExploreQueue, TestBody } from './types';
declare class Library extends EventEmitter {
    protected exploreQueue: ExploreQueue;
    protected exploreStack: ExploreNode[];
    private currentExplore;
    constructor();
    explore(description: TemplateStringsArray, ...values: string[]): (exploreBody: ExploreBody) => void;
    test(description: TemplateStringsArray, ...values: string[]): (testBody: TestBody) => void;
    expect<T extends (number | string)>(assertion: TemplateStringsArray, ...values: T[]): void;
    private getTestBody;
    private toEqual;
    private toBeGreaterThan;
    private toBeLessThan;
    private toNotEqual;
    protected logWithIndent(message: string, nestingLevel: number): void;
    private peek;
    protected flush(): void;
}
export { Library, };
