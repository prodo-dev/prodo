import { RuleTester } from "eslint";
import * as path from "path";

const getFixturesRootDir = (): string => {
  return path.join(process.cwd(), "tests/fixtures/");
};

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    tsconfigRootDir: getFixturesRootDir(),
    project: "./tsconfig.json",
  },
});

const defaultTsFile = path.join(getFixturesRootDir(), "file.ts");
const defaultTsxFile = path.join(getFixturesRootDir(), "file.tsx");

export { RuleTester, defaultTsFile, defaultTsxFile };
