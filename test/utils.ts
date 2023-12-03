export async function simulateDelay(output: string | number, delay: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      // console.log(output);
      resolve(true);
    }, delay);
  });
}

export function runThisExplore(heading: string, { a, b }: { a: number, b: number }) {
  explore`${heading}`(() => {
    test`THIS IS A TEST 1`(() => {
      console.log({ a });
    });
    test`THIS IS A TEST 2`(() => {
      console.log({ b });
    });
  });
}

export function runThisTest({ a, b }: { a: number, b: number }) {
  otter.when(a < b, () => {
    test`running`(() => {
      // console.log('running');
    });
  });
}