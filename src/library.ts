import { EventEmitter } from 'stream';
import { highlight } from './tools';
import { AssertionNode, Assertions, ExploreBody, ExploreNode, ExploreQueue, SkippedTestNode, TestBody, TestNode } from './types';

// remove the event emitter from here
class Library extends EventEmitter {
  protected exploreQueue: ExploreQueue = []; // todo: change to linked list?
  protected exploreStack: ExploreNode[] = [];
  private currentExplore: ExploreNode | null = null;
  private beforeAllCallbacks: (() => void)[] = [];
  private beforeEachCallbacks: (() => void)[] = [];
  private afterEachCallbacks: (() => void)[] = [];
  private afterAllCallbacks: (() => void)[] = [];

  constructor() {
    super();
    this.explore = this.explore.bind(this);
    this.test = this.test.bind(this);
    this.expect = this.expect.bind(this);
    this.when = this.when.bind(this);
    this.skip = this.skip.bind(this);
  }

  explore(description: TemplateStringsArray, ...values: string[]) {
    values = values.map((tag) => highlight(tag, 'yellow'));
    const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');

    const exploreNode: ExploreNode = {
      type: 'explore',
      description: concatenatedDescription,
      children: [],
      tags: [],
      nestingLevel: this.exploreStack.length,
      metadata: null
    };

    if (this.currentExplore) {
      this.currentExplore.children.push(exploreNode);
    } else {
      this.exploreQueue.push(exploreNode);
    }

    this.exploreStack.push(exploreNode);
    this.currentExplore = exploreNode;

    return (exploreBody: ExploreBody) => {
      exploreBody();
      this.exploreStack.pop();
      this.currentExplore = this.peek() || null;
      return {
        setMetadata: this.setMetadata.bind(this, exploreNode)
      };
    };
  }

  private setMetadata(exploreNode: ExploreNode | TestNode, metadata: Record<string, unknown>) {
    exploreNode.metadata = metadata;
  }

  /**
   *
   * @param description Description of your test
   * @param values
   * @returns test body as a callback function. You may optionally paramaterize the callback by providing an argument after the callback
   */
  test(description: TemplateStringsArray, ...values: string[]) {
    return (testBody: TestBody, ...args: unknown[]) => {
      const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');

      const testNode: TestNode = {
        type: 'test',
        description: concatenatedDescription,
        testBody: testBody.bind(this, ...args),
        nestingLevel: this.exploreStack.length,
        status: 'success',
        metadata: null
      };

      if (this.currentExplore) {
        this.currentExplore.children.push(testNode);
      } else {
        throw new Error('Nested test statements are not allowed');
      }

      return {
        setMetadata: this.setMetadata.bind(this, testNode)
      };
    };
  }

  skip(description: TemplateStringsArray, ...values: string[]) {
    if (!this.currentExplore) {
      console.log('error');
      throw new Error('Test must be inside a Explore statement');
    }

    return () => {
      const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
      const skippedTestNode: SkippedTestNode = {
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

  expect<T extends (number | string)>(assertion: TemplateStringsArray, ...values: T[]) {
    const concatenatedAssertion = `expect ${values[0]}${assertion[1]}${values[1]}`;
    const trimmedAssertion = assertion[1].trim() as keyof Assertions;
    const testBody = this.getTestBody(trimmedAssertion, values);

    const assertionNode: AssertionNode = {
      type: 'assertion',
      description: concatenatedAssertion,
      nestingLevel: this.exploreStack.length,
      status: 'success',
      testBody: testBody
    };

    if (this.currentExplore) {
      this.currentExplore.children.push(assertionNode);
    } else {
      if (!this.currentExplore) {
        throw new Error('Expect must be inside an Explore or Test statement');
      }
    }
  }

  private getTestBody<T>(assertionType: keyof Assertions, args: T[]) {
    return this[assertionType].bind(this, ...args);
  }

  private toEqual<T extends number | string>(a: T, b: T): boolean {
    return a === b;
  }

  private toBeGreaterThan(a: number, b: number): boolean {
    return a > b;
  }

  private toBeLessThan<T extends number>(a: T, b: T): boolean {
    return a < b;
  }

  private toNotEqual<T extends number>(a: T, b: T): boolean {
    return a !== b;
  }

  protected logWithIndent(message: string, nestingLevel: number) {
    const indentation = '  '.repeat(nestingLevel);
    process.stdout.write(`${indentation}${message}\n`);
  }

  private peek() {
    return this.exploreStack[this.exploreStack.length - 1];
  }

  protected flush() {
    this.exploreQueue = [];
    this.exploreStack = [];
  }

  /**
   * @param expression Anything that evaluates to a boolean
   * @param cb Callback to run when if the expression evaluates to true
   * @returns undefined
   */
  when(expression: boolean, cb: () => unknown) {
    if (typeof expression !== 'boolean') {
      throw new Error('Argument result must be of type boolean');
    }

    if (expression) {
      return cb();
    }
  }

  beforeEach(callback: () => void): void {
    this.beforeEachCallbacks.push(callback);
  }

  afterEach(callback: () => void): void {
    this.afterEachCallbacks.push(callback);
  }

  beforeAll(callback: () => void): void {
    this.beforeAllCallbacks.push(callback);
  }

  afterAll(callback: () => void): void {
    this.afterAllCallbacks.push(callback);
  }

  runBeforeEach(): void {
    this.beforeEachCallbacks.forEach((callback) => callback());
  }

  runAfterEach(): void {
    this.afterEachCallbacks.forEach((callback) => callback());
  }

  runBeforeAll(): void {
    this.beforeAllCallbacks.forEach((callback) => callback());
  }

  runAfterAll(): void {
    this.afterAllCallbacks.forEach((callback) => callback());
  }
}

export {
  Library,
};
