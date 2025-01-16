export function createColorTint({
  variants,
  hexValue,
}: {
  variants: string[];
  hexValue: string;
}): { [key: string]: string } | {} {
  if (variants.includes("darker")) {
    return {
      darker: hexValue,
    };
  }
  if (variants.includes("dark")) {
    return {
      dark: hexValue,
    };
  }
  if (variants.includes("default")) {
    return {
      default: hexValue,
    };
  }
  if (variants.includes("light")) {
    return {
      light: hexValue,
    };
  }
  if (variants.includes("lighter")) {
    return {
      lighter: hexValue,
    };
  }

  return {};
}
