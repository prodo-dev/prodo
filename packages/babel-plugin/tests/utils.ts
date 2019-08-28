import * as _ from "lodash";

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
