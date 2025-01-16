import { createThemeFiles } from "./themeGenerator";

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-theme") {
    try {
      const { typescript, scss } = await createThemeFiles(msg.whiteLabelName);

      figma.ui.postMessage({
        type: "generation-complete",
        files: {
          typescript,
          scss,
        },
      });
    } catch (error) {
      figma.ui.postMessage({
        type: "generation-error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }
};
