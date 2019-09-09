import { ESLintUtils, TSESLint } from "@typescript-eslint/experimental-utils";
import * as path from "path";

const parser = "@typescript-eslint/parser";

type RuleTesterConfig = Omit<TSESLint.RuleTesterConfig, "parser"> & {
  parser: typeof parser;
};
class RuleTester extends TSESLint.RuleTester {
  private filename: string | undefined = undefined;

  constructor(options: RuleTesterConfig) {
    super({
      ...options,
      parser: require.resolve(options.parser),
    });

    if (options.parserOptions && options.parserOptions.project) {
      this.filename = path.join(getFixturesRootDir(), "file.ts");
    }
  }

  public run<TMessageIds extends string, TOptions extends Readonly<unknown[]>>(
    name: string,
    rule: TSESLint.RuleModule<TMessageIds, TOptions>,
    tests: TSESLint.RunTests<TMessageIds, TOptions>,
  ): void {
    const errorMessage = `Do not set the parser at the test level unless you want to use a parser other than ${parser}`;

    if (this.filename) {
      tests.valid = tests.valid.map(test => {
        if (typeof test === "string") {
          return {
            code: test,
            filename: this.filename,
          };
        }
        return test;
      });
    }

    tests.valid.forEach(test => {
      if (typeof test !== "string") {
        if (test.parser === parser) {
          throw new Error(errorMessage);
        }
        if (!test.filename) {
          test.filename = this.filename;
        }
      }
    });
    tests.invalid.forEach(test => {
      if (test.parser === parser) {
        throw new Error(errorMessage);
      }
      if (!test.filename) {
        test.filename = this.filename;
      }
    });

    super.run(name, rule, tests);
  }
}

function getFixturesRootDir(): string {
  return path.join(process.cwd(), "tests/fixtures/");
}

const { batchedSingleLineTests } = ESLintUtils;

export { RuleTester, getFixturesRootDir, batchedSingleLineTests };
