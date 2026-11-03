#!/usr/bin/env node
// A Nix shell supplies TREE_SITTER; otherwise use the pinned npm CLI.
const { spawnSync } = require("node:child_process");
const { join } = require("node:path");
const executable = process.env.TREE_SITTER || join(
  require.resolve("tree-sitter-cli/package.json"), "..",
  process.platform === "win32" ? "tree-sitter.exe" : "tree-sitter"
);
const result = spawnSync(executable, process.argv.slice(2), { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
