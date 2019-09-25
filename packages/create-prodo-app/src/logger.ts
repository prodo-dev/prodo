export enum VerbosityLevel {
  debug = 4,
  info = 3,
  warn = 2,
  error = 1,
}

class Logger {
  private verbosity: VerbosityLevel = VerbosityLevel.info;

  public setVerbosity(verbosity: VerbosityLevel) {
    this.verbosity = verbosity;
  }

  public debug(...args: any[]) {
    this.logWithVerbosity(VerbosityLevel.debug, ...args);
  }

  public info(...args: any[]) {
    this.logWithVerbosity(VerbosityLevel.info, ...args);
  }

  public log(...args: any[]) {
    this.info(...args);
  }

  public warn(...args: any[]) {
    this.logWithVerbosity(VerbosityLevel.warn, ...args);
  }

  public error(...args: any[]) {
    this.logWithVerbosity(VerbosityLevel.error, ...args);
  }

  private logWithVerbosity(level: VerbosityLevel, ...args: any[]) {
    if (level <= this.verbosity) {
      // tslint:disable-next-line:no-console
      console.log(...args);
    }
  }
}

export default new Logger();
