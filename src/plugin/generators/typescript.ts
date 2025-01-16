import { ThemeColors, ThemeColor } from "../../types";
import { capitilizeFirstLetter } from "../utils/capitilizeFirstLetter";

export async function generateTypescript(
  transformedData: ThemeColors,
  whiteLabelName: string
) {
  return createTemplate(transformedData, whiteLabelName);
}

function generateColorExport(colorVariants: ThemeColor, name: string): string {
  if (Object.keys(colorVariants).length === 0) return "";

  const entries = Object.entries(colorVariants) as [keyof ThemeColor, string][];
  return `
export const ${name} = {
  ${entries.map(([tint, value]) => `${tint}: "${value}"`).join(",\n  ")}
};`;
}

async function createTemplate(
  transformedData: ThemeColors,
  whiteLabelName: string
): Promise<string> {
  let colorTemplate = "";
  let themeVariablesTemplate = "";

  // Handle primary and accent colors
  ["primary", "accent"].forEach((category) => {
    const colorVariants =
      transformedData[
        category as keyof Pick<ThemeColors, "primary" | "accent">
      ];
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(category)}`;
    colorTemplate += generateColorExport(colorVariants, colorName);
    themeVariablesTemplate += `  themeVariables.colors.${category} = ${colorName};\n`;
  });

  // Handle semantic colors
  Object.entries(transformedData.semantic).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorExport(colorVariants, colorName);
    themeVariablesTemplate += `  themeVariables.colors.semantic.${key} = ${colorName};\n`;
  });

  // Handle status colors
  Object.entries(transformedData.status).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorExport(colorVariants, colorName);
    themeVariablesTemplate += `  themeVariables.colors.status.${key} = ${colorName};\n`;
  });

  return `import { Theme } from '@emotion/react';
${colorTemplate}

export function ${whiteLabelName}Theme(themeVariables: Theme): Theme {
${themeVariablesTemplate}
  return themeVariables;
}

export default ${whiteLabelName}Theme;`;
}
