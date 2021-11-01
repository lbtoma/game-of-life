const checkers = ["typescript"];
const plugins = [
  "@stryker-mutator/jest-runner",
  "@stryker-mutator/typescript-checker",
];

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  concurrency: process.env.STRYKER__SINGLE_PROCESS !== "true" ? 7 : 1,
  checkers,
  tsconfigFile: "tsconfig.json",
  mutate: ["src/**/*.ts?(x)"],
  disableBail: true,
  plugins,
};
