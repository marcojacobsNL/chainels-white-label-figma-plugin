import { FigmaColors } from "../types";
import { generateTypescript } from "./generators/typescript";
import { generateScss } from "./generators/scss";

export async function createThemeFiles(whiteLabelName: string) {
  // Get all color styles
  const colorStyles = figma.getLocalPaintStyles();

  // Transform Figma color styles to our expected format
  const figmaColors: FigmaColors = {
    colors: colorStyles.map((style) => {
      const paint = style.paints[0] as SolidPaint;
      const { r, g, b } = paint.color;

      // Convert RGB to HEX
      const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

      return {
        name: style.name,
        values: {
          hex,
          hexa: hex + "ff",
          rgb: `rgb(${Math.round(r * 255)}, ${Math.round(
            g * 255
          )}, ${Math.round(b * 255)})`,
          rgba: `rgba(${Math.round(r * 255)}, ${Math.round(
            g * 255
          )}, ${Math.round(b * 255)}, 1)`,
          hsl: "",
          hsla: "",
          alpha: 1,
        },
      };
    }),
  };

  const typescript = await generateTypescript(figmaColors, whiteLabelName);
  const scss = await generateScss(figmaColors, whiteLabelName);

  return {
    typescript,
    scss,
  };
}
