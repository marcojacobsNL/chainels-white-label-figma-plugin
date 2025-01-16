import {
  SemanticColors,
  StatusColors,
  ThemeColor,
  ThemeColors,
} from "../../types";

const createInitialData = (): ThemeColors => ({
  primary: {} as ThemeColor,
  accent: {} as ThemeColor,
  semantic: {
    positive: {} as ThemeColor,
    warning: {} as ThemeColor,
    negative: {} as ThemeColor,
    neutral: {} as ThemeColor,
  },
  status: {
    open: {} as ThemeColor,
    done: {} as ThemeColor,
    progress: {} as ThemeColor,
    closed: {} as ThemeColor,
    error: {} as ThemeColor,
  },
});

let transformedData = createInitialData();

export function colorDataTransformer(color: string, hexValue: string) {
  const variants = color.split("/");
  const [category, subcategory, variant] = variants;

  if (!category) return transformedData;

  // Reset the data if we're starting with a new primary color
  if (category === "primary" && variant === "default") {
    transformedData = createInitialData();
  }

  const colorTint = {
    [variant || "default"]: hexValue,
  };

  if (category === "semantic" && subcategory) {
    const semanticKey = subcategory as keyof SemanticColors;
    transformedData.semantic[semanticKey] = {
      ...transformedData.semantic[semanticKey],
      ...colorTint,
    };
  } else if (category === "status" && subcategory) {
    const statusKey = subcategory as keyof StatusColors;
    transformedData.status[statusKey] = {
      ...transformedData.status[statusKey],
      ...colorTint,
    };
  } else if (category === "primary" || category === "accent") {
    transformedData[category] = {
      ...transformedData[category],
      ...colorTint,
    };
  }

  return transformedData;
}
