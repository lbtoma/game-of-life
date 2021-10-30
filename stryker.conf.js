/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  concurrency: 4,
  checkers: [
    "typescript",
    // "git-checker"
  ],
  tsconfigFile: "tsconfig.json",
  mutate: ["src/**/*.ts?(x)"],
  mutator: "typescript",
  disableBail: true,
  plugins: [
    "@stryker-mutator/jest-runner",
    "@stryker-mutator/typescript-checker",
    // "stryker-git-checker"
  ],
};
