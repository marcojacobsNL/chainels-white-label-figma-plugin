import {
  FigmaColors,
  ThemeColors,
  ThemeColor,
  SemanticColors,
  StatusColors,
} from "../../types";
import { colorDataTransformer } from "../utils/colorDataTransformer";
import { capitilizeFirstLetter } from "../utils/capitilizeFirstLetter";

export async function generateScss(
  figmaColors: FigmaColors,
  whiteLabelName: string
) {
  // Sort colors to ensure we process them in the right order
  const sortedColors = [...figmaColors.colors].sort((a, b) => {
    const [aCat, aSubCat, aVariant] = a.name.split("/");
    const [bCat, bSubCat, bVariant] = b.name.split("/");

    // Primary and accent colors first
    if (aCat === "primary" && bCat !== "primary") return -1;
    if (bCat === "primary" && aCat !== "primary") return 1;
    if (aCat === "accent" && bCat !== "accent") return -1;
    if (bCat === "accent" && aCat !== "accent") return 1;

    // Then sort by variant (default first)
    if (aVariant === "default") return -1;
    if (bVariant === "default") return 1;

    return a.name.localeCompare(b.name);
  });

  let transformedData = {};

  for (const color of sortedColors) {
    const hexValue = color.values.hex;
    transformedData = colorDataTransformer(color.name, hexValue);
  }

  return createTemplate(transformedData as ThemeColors, whiteLabelName);
}

function generateColorMap(colorVariants: ThemeColor, name: string): string {
  if (Object.keys(colorVariants).length === 0) return "";

  const entries = Object.entries(colorVariants) as [keyof ThemeColor, string][];
  return `
  $${name}: (
    ${entries.map(([tint, value]) => `'${tint}': ${value}`).join(",\n    ")}
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
  (
    Object.entries(transformedData.semantic) as [
      keyof SemanticColors,
      ThemeColor
    ][]
  ).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorMap(colorVariants, colorName);
  });

  // Handle status colors
  (
    Object.entries(transformedData.status) as [keyof StatusColors, ThemeColor][]
  ).forEach(([key, colorVariants]) => {
    if (Object.keys(colorVariants).length === 0) return;

    const colorName = `${whiteLabelName}${capitilizeFirstLetter(key)}`;
    colorTemplate += generateColorMap(colorVariants, colorName);
  });

  return colorTemplate;
}
