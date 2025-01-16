const { exec } = require("child_process");
const nodemon = require("nodemon");

// Watch TypeScript files
nodemon({
  watch: ["src/**/*"],
  ext: "ts,tsx",
  exec: "npm run build:ts",
})
  .on("start", function () {
    console.log("TypeScript compilation started");
  })
  .on("restart", function (files) {
    console.log("TypeScript files changed. Recompiling...");
  })
  .on("quit", function () {
    console.log("TypeScript watch stopped");
    process.exit();
  });

// Watch dist folder for changes and run esbuild
nodemon({
  watch: ["dist/plugin/index.js"],
  ext: "js",
  exec: "esbuild dist/plugin/index.js --bundle --outfile=dist/plugin/bundle.js --platform=browser --format=iife --global-name=figmaPlugin && mv dist/plugin/bundle.js dist/plugin/index.js",
})
  .on("start", function () {
    console.log("esbuild bundling started");
  })
  .on("restart", function (files) {
    console.log("JavaScript files changed. Rebundling...");
  })
  .on("quit", function () {
    console.log("esbuild watch stopped");
    process.exit();
  });
