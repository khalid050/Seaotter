class TestError<T> extends Error {
  public testName: string;
  public reportErrorData?: T;

  constructor(message: string, testName: string, reportErrorData?: T) {
    super(message);
    this.name = 'TestError';
    this.testName = testName;
    this.reportErrorData = reportErrorData;
  }
}

export {
  TestError
};