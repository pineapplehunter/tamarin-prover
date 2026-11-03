/// <reference types="node" />

const assert = require("node:assert");
const { test } = require("node:test");

test("can load grammar", () => {
  const parser = new (require("tree-sitter"))();
  assert.doesNotThrow(() => parser.setLanguage(require(".")));
  const tree = parser.parse("theory Example\nbegin\n/* outer /* nested */ comment */\nrule Empty: [] --> []\nend // EOF");
  assert.strictEqual(tree.rootNode.hasError, false);
  assert.strictEqual(tree.rootNode.descendantsOfType("multi_comment").length, 1);
  assert.strictEqual(tree.rootNode.descendantsOfType("single_comment").length, 1);
});
