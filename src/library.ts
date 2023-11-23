import { EventEmitter } from 'stream';
import { highlight } from './tools';
import { AssertionNode, Assertions, ExploreBody, ExploreNode, ExploreQueue, TestBody, TestNode } from './types';

// remove the event emitter from here
class Library extends EventEmitter {
  protected exploreQueue: ExploreQueue = []; // todo: change to linked list?
  protected exploreStack: ExploreNode[] = [];
  private currentExplore: ExploreNode | null = null;

  constructor() {
    super();
    this.explore = this.explore.bind(this);
    this.test = this.test.bind(this);
    this.expect = this.expect.bind(this);
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
      status: 'success'
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
    };
  }

  test(description: TemplateStringsArray, ...values: string[]) {
    if (!this.currentExplore) {
      console.log('error');
      throw new Error('Test must be inside a Explore statement');
    }

    return (testBody: TestBody) => {
      const concatenatedDescription = description.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
      const testNode: TestNode = {
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

  expect<T extends (number | string)>(assertion: TemplateStringsArray, ...values: T[]) {
    const concatenatedAssertion = `expect ${values[0]}${assertion[1]}${values[1]}`;
    const trimmedAssertion = assertion[1].trim() as keyof Assertions;
    const testBody = this.getTestBody(trimmedAssertion, values);

    const assertionNode: AssertionNode = {
      type: 'assertion',
      description: concatenatedAssertion,
      nestingLevel: this.exploreStack.length,
      status: 'pending',
      testBody: testBody
    };

    if (this.currentExplore) {
      this.currentExplore.children.push(assertionNode);
    } else {
      // not tested yet
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
    return a < b;
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
  }
}

export {
  Library,
};
