/* eslint-disable @typescript-eslint/no-explicit-any */
import { Otter } from './otter';
import config from './config';

const otter = new Otter();
const { explore, test, expect } = otter;

(global as any).otter = otter;
(global as any).explore = explore;
(global as any).test = test;
(global as any).expect = expect;

(async function () {
  otter.wadeIn(config);
  otter.on('testFailure', (error) => {
    console.log({ error });
  });

  await otter.dive();

  // // second approach
  // for await (const test of otter.cruise()) {
  //   console.log({ test });
  // }
})();
