export async function simulateDelay(output: string | number, delay: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      // console.log(output);
      resolve(true);
    }, delay);
  });
}