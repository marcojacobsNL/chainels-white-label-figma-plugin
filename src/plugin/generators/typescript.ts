import { FigmaColors, ThemeColor } from "../../types";
import { GetColorName } from "hex-color-to-color-name";
import { colorDataTransformer } from "../utils/colorDataTransformer";
import { capitilizeFirstLetter } from "../utils/capitilizeFirstLetter";

export async function generateTypescript(
  figmaColors: FigmaColors,
  whiteLabelName: string
) {
  let transformedData = {};

  for (const color of figmaColors.colors) {
    const hexValue = color.values.hex;
    transformedData = colorDataTransformer(color.name, hexValue);
  }

  return createTemplate(transformedData, whiteLabelName);
}

async function createTemplate(
  transformedData: {
    [key: string]: ThemeColor;
  },
  whiteLabelName: string
) {
  let colorTemplate = ``;
  let themeVariablesTemplate = ``;

  Object.keys(transformedData).forEach((key) => {
    const colorVariants = transformedData[key as keyof typeof transformedData];

    if (Object.keys(colorVariants).length === 0) return;
    if (!colorVariants.default) throw new Error("No default color found");

    const whiteLabelColorName = `${whiteLabelName}${capitilizeFirstLetter(
      GetColorName(colorVariants.default)
    )}`;

    themeVariablesTemplate += `themeVariables.colors.${key} = ${whiteLabelColorName};`;

    if (colorTemplate.includes(whiteLabelColorName)) return;

    colorTemplate += `
    export const ${whiteLabelColorName} = {
      ${Object.keys(colorVariants).map((tint) => {
        return `${tint}: "${
          colorVariants[tint as keyof typeof colorVariants]
        }"`;
      })}
    };
    `;
  });

  return `
    import { Theme } from '@emotion/react';

    ${colorTemplate}

    function ${whiteLabelName}Theme(themeVariables: Theme): Theme {
      ${themeVariablesTemplate}
    
      return themeVariables;
    }

    export default ${whiteLabelName}Theme;
  `;
}
