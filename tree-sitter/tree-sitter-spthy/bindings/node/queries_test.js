const assert = require("node:assert/strict");
const { readFileSync, readdirSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const Parser = require("tree-sitter");
const language = require(".");
const queryDirectory = join(__dirname, "../../queries");

for (const file of readdirSync(queryDirectory).filter(file => file.endsWith(".scm"))) {
  test(`${file} compiles and captures syntax`, () => {
    const query = new Parser.Query(language, readFileSync(join(queryDirectory, file), "utf8"));
    const parser = new Parser();
    parser.setLanguage(language);
    const tree = parser.parse(`theory Example
begin
functions: user_function/1
// A definition and a call
let Worker(x) = out(user_function(x))
process: Worker('hello')
lemma example: "T" by sorry
end`);
    assert.equal(tree.rootNode.hasError, false);
    const captures = query.captures(tree.rootNode);
    assert.ok(captures.length > 0);
    if (file === "highlights.scm") {
      assert.ok(captures.some(c => c.name === "function" && c.node.text === "user_function"));
      assert.ok(!captures.some(c => c.name === "function.builtin" && c.node.text === "user_function"));
      assert.ok(captures.some(c => c.name === "function" && c.node.text === "Worker"));
    }
  });
}
