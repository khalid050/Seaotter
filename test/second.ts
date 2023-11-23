import { simulateDelay } from './utils';

const Test_Types: TestTypes = {
  DISABLE: '#disable',
  REGRESSION: '#regression',
};

type TestTypes = Record<string, `#${string}`>
const { REGRESSION } = Test_Types;

otter.explore`This is my first Describe ${REGRESSION}`(() => {
  otter.test`first test`(async () => {
    await simulateDelay('A', 150);
    await simulateDelay('B', 300);
  });

  otter.test`second test`(async () => {
    await simulateDelay('C', 450);
    await simulateDelay('D', 100);
  });

  const a = 10;
  const b = 20;

  otter.expect`${a} toBeLessThan ${b}`;
  otter.expect`${b} toBeLessThan ${b}`;
});
