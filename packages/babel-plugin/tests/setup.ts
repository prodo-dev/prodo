import matchers from "expect/build/matchers";
import * as prettier from "prettier";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTheSameASTAs(expected: string): R;
    }
  }
}

const removeBlankLines = (str: string) =>
  str
    .split("\n")
    .filter(line => line.length > 0)
    .join("\n");

expect.extend({
  toHaveTheSameASTAs(received, expected) {
    return matchers.toEqual(
      prettier.format(removeBlankLines(received), { parser: "babel" }),
      prettier.format(removeBlankLines(expected), { parser: "babel" }),
    );
  },
});
