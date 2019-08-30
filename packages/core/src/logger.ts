const verbosityLevels = {
  debug: 1,
  info: 2,
  log: 3,
  warn: 4,
  error: 5,
};

const logLevel = verbosityLevels.debug;

const printWithVerbosity = (verbosity: number, ...values: any[]) => {
  if (logLevel <= verbosity && process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-console
    console.log(...values);
  }
};

const createPrinter = (verbosity: number) => (...values: any[]) =>
  printWithVerbosity(verbosity, ...values);

export default {
  debug: createPrinter(verbosityLevels.debug),
  info: createPrinter(verbosityLevels.info),
  log: createPrinter(verbosityLevels.log),
  warn: createPrinter(verbosityLevels.warn),
  error: createPrinter(verbosityLevels.error),
};
