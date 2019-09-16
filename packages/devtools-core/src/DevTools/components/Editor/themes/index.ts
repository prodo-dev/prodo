import * as Color from "color";
import * as monaco from "monaco-editor";
import theme from "./one-dark";

// TODO: de-duplicate
export const jsonColors = {
  jsonName: "#98c379",
  jsonString: "#ba79c3",
  jsonNumber: "#d19a66",
  jsonBoolean: "#56b6c2",
};

const sanitizeColor = (color: string) => {
  if (/#......$/.test(color) || /#........$/.test(color)) {
    return color;
  }

  try {
    return new Color(color).hex();
  } catch (e) {
    return "#FF0000";
  }
};

const colorsAllowed = ({
  foreground,
  background,
}: {
  foreground: string;
  background: string;
}) => {
  if (foreground === "inherit" || background === "inherit") {
    return false;
  }

  return true;
};

const customColors = {
  "value.string.quoted.double.json": jsonColors.jsonString,
};

const getTheme = (theme: any): monaco.editor.IStandaloneThemeData => {
  const { tokenColors = [], colors = {} } = theme;
  const rules = tokenColors
    .filter(t => t.settings && t.scope && colorsAllowed(t.settings))
    .reduce((acc, token) => {
      const settings = {
        foreground: sanitizeColor(token.settings.foreground),
        background: sanitizeColor(token.settings.background),
        fontStyle: token.settings.fontStyle,
      };

      const scope =
        typeof token.scope === "string"
          ? token.scope.split(",").map(a => a.trim())
          : token.scope;

      scope.map(s =>
        acc.push({
          token: s,
          ...settings,
        }),
      );

      return acc;
    }, []);

  Object.keys(customColors).map(c => {
    const settings = {
      foreground: customColors[c],
      background: "#FF0000",
    };
    rules.push({
      token: c,
      ...settings,
    });
  });

  const newColors = colors;
  Object.keys(colors).forEach(c => {
    if (newColors[c]) {
      return c;
    }

    delete newColors[c];

    return c;
  });

  return {
    base: getBase(theme.type),
    inherit: true,
    colors: newColors,
    rules,
  };
};

const getBase = (type: string): monaco.editor.BuiltinTheme => {
  if (type === "dark") {
    return "vs-dark";
  }

  if (type === "hc") {
    return "hc-black";
  }

  return "vs";
};

export default getTheme(theme);
