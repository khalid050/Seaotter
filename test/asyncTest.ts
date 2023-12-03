// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runThisTest, simulateDelay } from './utils';

const tag = '#Regression';

otter.explore`This is my first Describe ${tag}`(() => {
  otter.test`first test`(async () => {
    // console.log('A');
    await simulateDelay('B', 150);
    await simulateDelay('C', 300);
  });


  otter.test`second test`(async () => {
    // console.log('D');
    await simulateDelay('E', 450);
    await simulateDelay('F', 100);
  });

  otter.explore`nested describe`(() => {
    test`nested test`(() => {
      // console.log('logging nested test');
    });
  });

  const a = 10;
  const b = 20;
  expect`${a} toNotEqual ${b}`;

  runThisTest({ a: 2, b: 3 });

  // otter.when(a < b, () => {
  //   test`Log the output diff`(() => {
  //     // console.log({ a, b });
  //   });
  // });
});
