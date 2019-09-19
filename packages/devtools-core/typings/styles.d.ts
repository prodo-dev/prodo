export type Color = string;
export type Font = string;
export type Size = string;

export interface Theme {
  colors: {
    bg: Color;
    fg: Color;
    accent: Color;
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
