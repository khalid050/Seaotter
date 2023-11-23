import path from 'path';
import { Library } from './library';
import { COLORS, Color } from './tools';
import { highlight } from './tools';
import { Children, ExploreQueue, Nodes } from './types';
import { TestError } from './errors';
// import { TestError } from './errors';

const executeQueueSymbol = Symbol('executeQueue');
type Init = { testDirectory: string, random?: boolean, fastFail?: boolean, tests: string[], tags?: string[] }

class Otter extends Library {
  private testFiles: string[] = [];
  private settings: Record<string, unknown> = {};
  info: Record<string, {
    status: string
  }>;

  private logMode: 'verbose' | 'silent' = 'silent';
  // eslint-disable-next-line no-unused-vars
  print: (node: Nodes, color: Color) => void;

  constructor() {
    super();
    this.testFiles = [];
    this.settings = {};
    this[executeQueueSymbol] = this[executeQueueSymbol].bind(this);
    this.info = {

    };

    this.print = this.logMode === 'verbose' ? this.verboseLog : this.quietLog;
  }

  wadeIn({ testDirectory, random = false, fastFail = true, tests = [] }: Init) {
    for (const testFile of tests) {
      this.info[testFile] = {
        status: ''
      };

      this.testFiles.push(path.join(testDirectory, testFile));
    }

    this.settings['random'] = random;
    this.settings['fastFail'] = fastFail;
  }

  // fix this
  private async [executeQueueSymbol](queue: ExploreQueue) {
    if (!queue || !queue.length) {
      return;
    }

    for (const describe of queue) {
      this.print(describe, 'blue');
      for (const block of describe.children) {
        if (block.type === 'test' || block.type === 'assertion') {
          try {
            const result = await block.testBody();
            if (block.type === 'assertion') {
              if (!result) {
                throw new TestError('Assertion failure', 'placeholder');
              }
            }

            block.status = 'success';
            this.print(block, 'white');
          } catch (error) {
            block.status = 'failure';
            this.print(block, 'white');
            this.emit('testFailure', error);
          }
        } else {
          await this[executeQueueSymbol]([block]);
        }
      }
    }
  }

  async *cruise() {
    if (!this.testFiles.length) {
      console.log('No test files provided');
      return;
    }

    for (const testFile of this.testFiles) {
      require(testFile);
      if (!this.exploreQueue.length) {
        console.log('No tests to run');
        return;
      }

      await this[executeQueueSymbol](this.exploreQueue);
      const file = testFile.split('/').at(-1) as string;
      this.sanitizeTree(this.exploreQueue);

      yield {
        info: this.info[file],
        testHierarchy: this.exploreQueue
      };

      this.flush();
    }
  }

  async dive() {
    if (!this.testFiles.length) {
      console.log('No test files provided');
      return;
    }

    if (this.exploreQueue.length) {
      throw new Error('Finish executing test before starting another in the same proccess');
    }

    for (const testFile of this.testFiles) {
      require(testFile);
      if (!this.exploreQueue.length) {
        console.log('No tests to run');
        return;
      }

      if (this.exploreQueue.length > 1) {
        console.log(highlight(this.exploreQueue[1].description, 'red'));
        throw new Error('Only 1 outer Describe statement is allowed');
      }

      await this[executeQueueSymbol](this.exploreQueue);
      this.flush();
    }
  }

  private sanitizeTree(queue: ExploreQueue | Children) {
    if (!queue || !queue.length) {
      return;
    }

    for (const block of queue) {
      if (block.type === 'explore') {
        this.sanitizeTree(block.children);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (block as any).testBody;
      }
    }
  }

  private verboseLog(node: Nodes, color: Color) {
    this.logWithIndent(highlight(node.description, color), node.nestingLevel);
  }

  private quietLog(node: Nodes) {
    const symbol = node.status === 'success' ? COLORS.green + '✓' + COLORS.reset : COLORS.red + '✗' + COLORS.reset;
    process.stdout.write(symbol);
  }
}

export { Otter };