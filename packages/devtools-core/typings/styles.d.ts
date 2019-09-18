export type Color = string;
export type Font = string;
export type Size = string;

export interface Theme {
  colors: {
    bg: Color;
    fg: Color;
    accent: Color;
  };
}
