import path from 'path';
import { Library } from './library';
import { COLORS, Color, highlight } from './tools';
import { AssertionNode, Children, ExploreQueue, Nodes, TestNode } from './types';
import { TestError } from './errors';

const execQueue = Symbol('executeQueue');
type Init = { testDirectory: string, random?: boolean, fastFail?: boolean, tests: string[], tags?: string[] }

class Otter extends Library {
  private testFiles: string[] = [];
  private settings: Record<string, unknown> = {};
  private currentTestFile: string;
  info: {
    [file: string]: {
      status: 'pending' | 'success' | 'failure',
      numTestsFailed: 0,
      numTestsPassed: number,
      failedTests: Array<unknown>
      testTime: number
    }
  };

  private logMode: 'verbose' | 'silent' = 'verbose';
  print: (node: Nodes, color: Color) => void;

  constructor() {
    super();
    this.testFiles = [];
    this.settings = {};
    this.currentTestFile = '';
    this.info = {};
    this[execQueue] = this[execQueue].bind(this);
    this.print = this.logMode === 'verbose' ? this.verboseLog : this.quietLog;
  }

  wadeIn({ testDirectory, random = false, fastFail = true, tests = [] }: Init) {
    for (const testFile of tests) {
      this.info[testFile] = {
        status: 'pending',
        numTestsFailed: 0,
        numTestsPassed: 0,
        failedTests: [],
        testTime: 0
      };

      this.testFiles.push(path.join(testDirectory, testFile));
    }

    this.settings['random'] = random;
    this.settings['fastFail'] = fastFail;
  }

  private async [execQueue](queue: ExploreQueue) {
    if (!queue || !queue.length) {
      return;
    }

    for (const explore of queue) {
      this.print(explore, 'blue');
      for (const block of explore.children) {
        if (block.type === 'skippedTest') {
          return;
        }

        if (block.type === 'test') {
          await this.runTest(block);
        } else if (block.type === 'assertion') {
          this.runAssertion(block);
        } else if (block.type === 'explore') {
          await this[execQueue]([block]);
        }
      }
    }
  }

  private runAssertion(block: AssertionNode) {
    const result = block.testBody();
    if (result) {
      this.print(block, 'white');
    } else {
      block.status = 'failure';
      this.print(block, 'red');
      this.info[this.currentTestFile].failedTests.push(block);
      if (this.settings.fastFail) {
        throw new TestError('Assert failure', this.currentTestFile);
      }
    }
  }

  private async runTest(testBlock: TestNode) {
    try {
      this.runBeforeEach();
      await testBlock.testBody();
      this.print(testBlock, 'white');
      this.runAfterEach();
    } catch (error) {
      this.print(testBlock, 'red');
      testBlock.status = 'failure';
      this.info[this.currentTestFile].failedTests.push(testBlock);
      if (this.settings.fastFail) {
        throw new TestError('Test failed', this.currentTestFile);
      }
    }
  }

  async *cruise() {
    if (!this.testFiles.length) {
      console.log('No test files provided');
      return;
    }

    for (const testFile of this.testFiles) {
      this.currentTestFile = path.basename(testFile);
      require(testFile);
      if (!this.exploreQueue.length) {
        console.log('No tests to run');
        return;
      }

      await this[execQueue](this.exploreQueue);
      this.sanitizeTree(this.exploreQueue);

      yield {
        info: this.info[this.currentTestFile],
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

    const startTime = new Date();
    for (const testFile of this.testFiles) {
      this.currentTestFile = path.basename(testFile);
      require(testFile);
      if (!this.exploreQueue.length) {
        console.log('No tests to run');
        return;
      }

      if (this.exploreQueue.length > 1) {
        console.log(highlight(this.exploreQueue[1].description, 'red'));
        throw new Error('Only 1 outer Describe statement is allowed');
      }

      try {
        this.runBeforeAll();
        await this[execQueue](this.exploreQueue);
      } catch (error) {
        // handle this
        console.log(error);
      } finally {
        this.runAfterAll();
        this.flush();
        const info = this.info[this.currentTestFile];
        info.status = info.failedTests.length ? 'failure' : 'success';
      }
    }

    const endTime = new Date();
    const { status } = this.info[this.currentTestFile];

    const color: Color = status === 'success' ? 'green' : 'red';
    const testTime = endTime.getTime() - startTime.getTime();
    this.info[this.currentTestFile].testTime = testTime;

    console.log(`\n\nStatus: ${highlight(status, color)}`);
    console.log(`Tests finished in ${testTime} milliseconds`);
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
    if (node.type === 'explore') return;
    const symbol = node.status === 'success' ? COLORS.green + '✓' + COLORS.reset : COLORS.red + '✗' + COLORS.reset;
    process.stdout.write(symbol);
  }
}

export { Otter };