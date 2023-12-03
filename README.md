<h1>Sea Otter</h1>

[![Project Status: Pre-Alpha](https://img.shields.io/badge/Project%20Status-Pre--Alpha-red.svg)](https://shields.io/#your-badge)
[![npm version](https://badge.fury.io/js/seaotter.svg)](https://badge.fury.io/js/seaotter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<h2> Getting started</h2>
🌊 Dive into testing with SeaOtter
<p>

<h2>Step 1: Create a configuration object with details about your test environment. Here's an example:
</h2>

1) `npm i -D seaotter`
2) Get the accompanying vscode extension for a superior experience (not yet published)

```javascript
const config = {
  testDirectory: "/Absolute/Path/To/Test/Directory",
  fastFail: true,
  random: false,
  tests: ["asyncTest.js"],
};
```

Adjust the testDirectory to the absolute path of your test directory. Specify the tests you want to run in the tests array. Set fastFail to true for quicker test termination on the first failure, and toggle random to shuffle test execution order.

<h2>Step 2: Write a test</h2>

```javascript
otter.explore`Create new User ${ MyTag }`(() => {
  otter.test`Login with valid credentials`(async () => {
    await simulateLogin("validUsername", "validPassword");
    await verifyOnHomePage();
  });

  test`Login with invalid credentials`(async () => {
    await simulateLogin(
      "invalidUsername",
      "invalidPassword"
    );

  const a = 10;
  const b = 20;
  const c = 5;
  
  expect`${a} toEqual ${a}`;
  expect`${a} toBeGreaterThan ${b}`;
  expect`${c} toBeLessThan ${a}`;
});
```

<h2>Step 3: Run your tests </h1>

```javascript
import { otter } from "seaotter";
import config from "./config";

otter.wadeIn(config);

(async function () {
  await otter.dive();
})();
```

This method offers a straightforward way to run your tests.

<h3>Custom Test Execution using Generator (Alternative Approach)</h3>

If you prefer more control over the test execution process, you can have the otter cruise through a generator.
This approach allows you to perform additional processing after each test and before the next one begins.
The generator provides valuable metadata about each test so that you can customize your workflow!

```javascript
(async function () {
  for await (const test of otter.cruise()) {
    // do something with metadata
  }
})();

```
If running the former way, and running tests in quiet mode you can listen for the failure events

```javascript
   otter.on('testFailure', (error) => {
     doSomething(error)
   });
```


<h2>Using the CLI</h2>
You'll need to setup some env variables

```bash
npm i -g seaotter
```

```bash
export TEST_DIR="/absolute/path/to/test/dir"

# This is where your dive/cruise methods are used
export TEST_ENTRY="/absolute/path/to/entry"

otter <test(s)>
```
