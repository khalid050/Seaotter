import { spawnSync } from 'child_process';
import { program } from 'commander';

export function setupCLI() {
  program
    .version('1.0.0')
    .description('A CLI to run tests for the seaotter framework')
    .argument('<test...>')
    .action(async (files, options) => {
      const { TEST_DIR, TEST_ENTRY } = process.env;

      if (!TEST_DIR) {
        console.error('TEST_DIR environment variable not set.');
        process.exit(1);
      }
      if (!TEST_ENTRY) {
        console.error('TEST_ENTRY environment variable not set.');
        process.exit(1);
      }

      const tests = files.map((file: string) => !file.includes('.js') ? file += '.js' : file);
      process.env.TEST_FILES = tests;

      try {
        const args = [TEST_ENTRY as string];
        process.env.TEST_OPTIONS = JSON.stringify(options);

        const result = spawnSync('node', args, { stdio: 'inherit' });
        if (result.status !== 0) {
          console.error(`Error running ${TEST_ENTRY}.`);
          process.exit(result.status || 1);
        }

      } catch (error) {
        console.error(`Error running ${TEST_ENTRY}:`, error);
        process.exit(1);
      }
    })

    .option('-v, --verbose <value>', 'Log test output', 'true');

  program.parse(process.argv);
}
