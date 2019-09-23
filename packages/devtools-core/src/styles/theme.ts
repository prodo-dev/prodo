export type Color = string;
export type Font = string;
export type Size = string;

export interface Theme {
  colors: {
    bg: Color;
    fg: Color;
    accent: Color;
    error: Color;
    errorBg: Color;
  };
  fonts: {
    text: Font;
    code: Font;
  };
  fontSizes: {
    title: Size;
    subtitle: Size;
    normal: Size;
    code: Size;
    detail: Size;
  };
}

export const darkTheme: Theme = {
  colors: {
    bg: "#282c34",
    fg: "#f8f8f2",
    accent: "#00e3a0",
    error: "#9f3a38",
    errorBg: "#fff6f6",
  },
  fonts: {
    text: '-apple-system, "Segoe UI", "Ubuntu", "Helvetica", sans-serif',
    code: '"Source Code Pro", "Menlo", "Consolas", monospace',
  },
  fontSizes: {
    title: "18pt",
    subtitle: "14pt",
    normal: "11pt",
    code: "13px",
    detail: "9pt",
  },
};

export default darkTheme;
