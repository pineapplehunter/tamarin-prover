const assert = require("node:assert/strict");
const { test } = require("node:test");
const Parser = require("tree-sitter");
const language = require(".");

function parser() {
  const result = new Parser();
  result.setLanguage(language);
  return result;
}

function theory(body) {
  return `theory Example\nbegin\n${body}\nend`;
}

test("opaque strings preserve whitespace and comment-like text", () => {
  const tree = parser().parse(theory(`export queries: " // text\n /* not a comment */ \\"quoted\\" "
rule R: [] --> [Out(' /* literal */ ')]`));
  assert.equal(tree.rootNode.hasError, false);
  assert.equal(tree.rootNode.descendantsOfType("single_comment").length, 0);
  assert.equal(tree.rootNode.descendantsOfType("multi_comment").length, 0);
  assert.equal(tree.rootNode.descendantsOfType("pub_name")[0].text, "' /* literal */ '");
});

for (const newline of ["\n", "\r\n"]) {
  test(`comments across ${JSON.stringify(newline)} and EOF`, () => {
    const source = ["/* a /* b */ c */", "theory Example // header", "begin", "end // EOF"].join(newline);
    const tree = parser().parse(source);
    assert.equal(tree.rootNode.hasError, false);
    assert.equal(tree.rootNode.descendantsOfType("multi_comment").length, 1);
    assert.equal(tree.rootNode.descendantsOfType("single_comment").length, 2);
  });
}

for (const source of [
  "theory Example begin rule R: [] --> []", // missing end
  "theory Example begin /* unterminated",
  theory("rule R: [] --> [lowercase(x)]"),
  theory("table t(bitstring)."), // ProVerif, not SAPIC+
  theory("process: get t(x) in 0"),
]) {
  test(`rejects malformed or unsupported input: ${source}`, () => {
    assert.equal(parser().parse(source).rootNode.hasError, true);
  });
}

test("recovery retains the declaration after a malformed rule", () => {
  const tree = parser().parse(theory('rule Broken: [In(] --> []\nlemma after: "T"'));
  assert.equal(tree.rootNode.hasError, true);
  const lemmas = tree.rootNode.descendantsOfType("lemma").filter(node => node.isNamed);
  assert.equal(lemmas.length, 1);
  assert.equal(lemmas[0].childForFieldName("lemma_identifier").text, "after");
});

test("incremental parsing agrees with a fresh parse after a process edit", () => {
  const p = parser();
  const source = theory("let P = 0\nlet Q = 0\nprocess: out('x'); P | Q");
  const tree = p.parse(source);
  const index = source.indexOf("P | Q");
  const prefix = source.slice(0, index).split("\n");
  const position = { row: prefix.length - 1, column: prefix.at(-1).length };
  tree.edit({
    startIndex: index, oldEndIndex: index, newEndIndex: index + 1,
    startPosition: position, oldEndPosition: position,
    newEndPosition: { row: position.row, column: position.column + 1 },
  });
  const edited = source.slice(0, index) + "!" + source.slice(index);
  const incremental = p.parse(edited, tree);
  const fresh = parser().parse(edited);
  assert.equal(incremental.rootNode.hasError, false);
  assert.equal(incremental.rootNode.toString(), fresh.rootNode.toString());
  const replication = incremental.rootNode.descendantsOfType("replication")[0];
  assert.equal(replication.childForFieldName("body").type, "deterministic_choice");
});
