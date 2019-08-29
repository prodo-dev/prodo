import * as _ from "lodash";

/*
 * Trims and indents a multiline string so that it can be easily
 * embedded into code. For example, in
 *
 * ```
 * const test = () => {
 *   const anotherIndent = () => {
 *     const string = multiline`
 *       {
 *         "foo": "foo",
 *         "bar": {
 *           "buzz": "buzz"
 *         }
 *       }
 *     `;
 *   };
 * };
 * ```
 *
 * the variable `string` will have value equal to
 *
 * ```
 * {
 *   "foo": "foo",
 *   "bar": {
 *     "buzz": "buzz"
 *   }
 * }
 * ```
 *
 * instead of
 *
 * ```
 *
 *         {
 *           "foo": "foo",
 *           "bar": {
 *             "buzz": "buzz"
 *           }
 *         }
 *
 * ```
 */
export function multiline(
  strings: TemplateStringsArray,
  ...expressions: string[]
): string {
  const indent = _.min(
    _.flatMap(strings, (str: string, index: number): number[] => {
      const newLines = str
        .split("\n")
        .slice(1)
        .filter(line => line.length > 0);
      if (
        index === strings.length - 1 &&
        /^\s*$/.test(newLines[newLines.length - 1])
      ) {
        newLines.length = newLines.length - 1;
      }
      return newLines
        .map(line => line.match(/^ */))
        .filter(match => match != null)
        .map((match: any) => match[0].length);
    }),
  );
  const indentRegExp = indent && new RegExp(`\\n {0,${indent}}`, "g");
  const dedentedStrings = indentRegExp
    ? strings.map(str => str.replace(indentRegExp, "\n"))
    : strings;
  let str = "";
  for (let i = 0; i < strings.length; i++) {
    str += dedentedStrings[i];
    if (i < expressions.length) {
      str += expressions[i];
    }
  }
  str = str.replace(/(^\n)|(\n*$)/g, "");
  return str;
}
