import matchers from "expect/build/matchers";
import * as prettier from "prettier";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTheSameASTAs(expected: string): R;
    }
  }
}

expect.extend({
  toHaveTheSameASTAs(received, expected) {
    return matchers.toEqual(
      prettier.format(received, { parser: "babel" }),
      prettier.format(expected, { parser: "babel" }),
    );
  },
});
