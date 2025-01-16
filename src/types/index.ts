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
  lighter?: string;
  light?: string;
  default?: string;
  dark?: string;
  darker?: string;
};

export type SemanticColors = {
  positive: ThemeColor;
  warning: ThemeColor;
  negative: ThemeColor;
  neutral: ThemeColor;
};

export type StatusColors = {
  open: ThemeColor;
  done: ThemeColor;
  progress: ThemeColor;
  closed: ThemeColor;
  error: ThemeColor;
};

export type ThemeColors = {
  primary: ThemeColor;
  accent: ThemeColor;
  semantic: SemanticColors;
  status: StatusColors;
};
