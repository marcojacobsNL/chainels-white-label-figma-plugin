import { createColorTint } from "./createColorTint";

let transformedData = {
  primary: {},
  accent: {},
  positive: {},
  warning: {},
  negative: {},
  neutral: {},
  open: {},
  done: {},
  progress: {},
  closed: {},
  error: {},
};

export function colorDataTransformer(color: string, hexValue: string) {
  const variants = color.split("/");

  const colorTint = createColorTint({
    variants,
    hexValue,
  });

  if (variants.includes("primary")) {
    transformedData.primary = {
      ...transformedData.primary,
      ...colorTint,
    };
  }
  // ... rest of the variants

  return transformedData;
}
