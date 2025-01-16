export type Color = {
  hex: string;
  hexa: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  alpha: number;
};

export type FigmaColors = {
  colors: {
    name: string;
    values: Color;
  }[];
};

export type ThemeColor = {
  darker: string;
  dark: string;
  default: string;
  light: string;
  lighter: string;
};
