const checkers = ["typescript"];
const plugins = [
  "@stryker-mutator/jest-runner",
  "@stryker-mutator/typescript-checker",
];

if (process.env.STRYKER__ALL_MUTATIONS !== "true") {
  checkers.push("git-checker");
  plugins.push("stryker-git-checker");
}

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  concurrency: 4,
  checkers,
  tsconfigFile: "tsconfig.json",
  mutate: ["src/**/*.ts?(x)"],
  mutator: "typescript",
  disableBail: true,
  plugins,
};
