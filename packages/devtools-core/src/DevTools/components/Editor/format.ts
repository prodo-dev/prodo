import * as path from "path-browserify";

type ParserType = "babel" | "json";

const prettierOptions = {
  singleQuote: false,
  trailingCommna: true,
  printWidth: 40,
};

export const format = async (
  value: string,
  parser: ParserType = "babel",
): Promise<string> => {
  const babylon = await import("prettier/parser-babylon");
  const prettier = await import("prettier/standalone");

  try {
    const text = prettier.format(value, {
      parser,
      plugins: [babylon],
      ...prettierOptions,
    });

    return text;
  } catch (e) {
    return value;
  }
};

export const getFormatType = (filename: string) => {
  const extToModes = {
    json: "json",
  };

  const ext = path.extname(filename).replace(".", "");
  return extToModes[ext] || "babel";
};
