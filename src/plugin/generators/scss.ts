import { ThemeColors, ThemeColor } from "../../types";
import { capitilizeFirstLetter } from "../utils/capitilizeFirstLetter";

export async function generateScss(
  transformedData: ThemeColors,
  whiteLabelName: string
) {
  return createTemplate(transformedData, whiteLabelName);
}

function generateColorMap(colorVariants: ThemeColor, name: string): string {
  if (Object.keys(colorVariants).length === 0) return "";

  const entries = Object.entries(colorVariants) as [keyof ThemeColor, string][];
  return `
$${name}: (
  ${entries.map(([tint, value]) => `'${tint}': ${value}`).join(",\n  ")}
);`;
}

async function createTemplate(
  transformedData: ThemeColors,
  whiteLabelName: string
): Promise<string> {
  let colorTemplate = `// ${whiteLabelName} Theme Colors\n`;

  // Handle primary and accent colors
  ["primary", "accent"].forEach((category) => {
    const colorVariants =
      transformedData[
        category as keyof Pick<ThemeColors, "primary" | "accent">
      ];
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(category)}`;
    colorTemplate += generateColorMap(colorVariants, colorName);
  });

  // Handle semantic colors
  Object.entries(transformedData.semantic).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorMap(colorVariants, colorName);
  });

  // Handle status colors
  Object.entries(transformedData.status).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorMap(colorVariants, colorName);
  });

  return colorTemplate;
}
