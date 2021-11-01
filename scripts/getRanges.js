const { execSync } = require("child_process");
const { parseDiffs } = require("stryker-git-checker/dist/helpers/diff-parser");

const gitDiffCommand = `git diff --color=never ${
  process.env.STRYKER__GIT_COMPARISON ?? "--cached"
}`;

const diffOut = execSync(gitDiffCommand).toString();
const files = [...parseDiffs(diffOut, "").entries()]
  .filter(
    ([filename]) =>
      filename.startsWith("src/") &&
      (filename.endsWith(".ts") || filename.endsWith(".tsx"))
  )
  .map(([filename, lines]) =>
    [...lines.entries()].reduce((acc, [line]) => {
      if (acc === filename) {
        return `${acc}:${line}-${line + 1}`;
      } else if (acc.endsWith(`-${line}`)) {
        const chunks = acc.split("-");
        chunks[chunks.length - 1] = (line + 1).toString();
        return chunks.join("-");
      } else {
        return `${acc},${filename}:${line}-${line + 1}`;
      }
    }, filename)
  )
  .join();

console.log(files || "/dev/null");
