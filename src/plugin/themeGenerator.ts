import { colorDataTransformer } from "./utils/colorDataTransformer";
import { transformedData } from "./utils/colorDataTransformer";

// More efficient RGB to HEX conversion
const RGB2HEX = (r: number, g: number, b: number) =>
  "#" +
  ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

export async function generateTheme() {
  console.log("=== Starting Theme Generation ===");
  const colorStyles = await figma.getLocalPaintStyles();

  console.log("\nAll Figma Color Styles:");
  colorStyles.forEach((style) => {
    console.log(`- ${style.name} (${style.paints.length} paints)`);
  });

  // Process each color style
  const colorCollection = colorStyles
    .map((style) => {
      console.log("\n=== Processing Style ===");
      console.log(`Name: ${style.name}`);
      console.log(`Description: ${style.description}`);

      if (!style.paints.length || style.paints[0].type !== "SOLID") {
        console.warn(`⚠️ Skipping style ${style.name} - not a solid color`);
        return null;
      }

      const paint = style.paints[0] as SolidPaint;
      console.log("Paint:", JSON.stringify(paint, null, 2));

      // Handle both direct colors and variable aliases
      let color = paint.color;
      if (paint.boundVariables?.color?.type === "VARIABLE_ALIAS") {
        console.log("Found variable color:", paint.boundVariables.color);
        // Try to get the resolved color value
        const variable = figma.variables.getVariableById(
          paint.boundVariables.color.id
        );
        if (variable) {
          console.log("Variable found:", variable.name);
          // Get the first available mode's value
          const modes =
            figma.variables.getVariableCollectionById(
              variable.variableCollectionId
            )?.modes || [];
          if (modes.length > 0) {
            const resolvedValue = variable.valuesByMode[modes[0].modeId];
            if (
              typeof resolvedValue === "object" &&
              "r" in resolvedValue &&
              "g" in resolvedValue &&
              "b" in resolvedValue
            ) {
              console.log("Resolved color value:", resolvedValue);
              color = resolvedValue;
            }
          }
        }
      }

      // Get RGB values in decimal (0-255 range)
      const r = Math.round(color.r * 255);
      const g = Math.round(color.g * 255);
      const b = Math.round(color.b * 255);
      const opacity = paint.opacity ?? 1;

      // Generate color values in different formats
      const hex = RGB2HEX(r, g, b);
      const rgb = `rgb(${r}, ${g}, ${b})`;
      const rgba = opacity !== 1 ? `rgba(${r}, ${g}, ${b}, ${opacity})` : rgb;

      console.log("Color Values:");
      console.log(`- Raw RGB: r=${color.r}, g=${color.g}, b=${color.b}`);
      console.log(`- Decimal RGB: r=${r}, g=${g}, b=${b}`);
      console.log(`- HEX: ${hex}`);
      console.log(`- RGB: ${rgb}`);
      console.log(`- RGBA: ${rgba}`);
      console.log(`- Opacity: ${opacity}`);

      const colorData = {
        type: paint.type,
        name: style.name,
        rgb,
        rgba,
        hex,
        opacity,
        variableId: paint.boundVariables?.color?.id,
      };

      // Transform the color data
      const result = colorDataTransformer(style.name, hex);
      console.log("Transformed Result:", JSON.stringify(result, null, 2));

      return colorData;
    })
    .filter(Boolean); // Remove null values from skipped styles

  // Log the final transformed data
  console.log("\n=== Final Results ===");
  console.log("Color Collection:", JSON.stringify(colorCollection, null, 2));
  console.log("Transformed Data:", JSON.stringify(transformedData, null, 2));

  return {
    colorCollection,
    transformedData,
  };
}
