; Declarations and proof structure
[
  "theory" "configuration" "begin" "end"
  "builtins" "function" "functions" "equations" "predicate" "predicates"
  "macros" "options" "heuristic" "tactic" "presort" "prio" "deprio"
  "rule" "variants" "modulo" "restriction" "axiom" "test"
  "lemma" "diffLemma" "equivLemma" "diffEquivLemma" "export"
  "account" "accounts" "for" "by" "case" "next" "qed"
  "let" "in" "process"
] @keyword

["All" "∀" "Ex" "∃" "all-traces" "exists-trace"] @keyword
["if" "then" "else" "lookup" "as"] @keyword.control.conditional
["new" "out" "event" "insert" "delete" "lock" "unlock"] @keyword

["#ifdef" "#else" "#endif" "#define" "#include"] @keyword.directive
(define (ident) @constant)
(theory theory_name: (ident) @namespace)
(built_in) @constant.builtin

; Declaration names and calls. A syntactic call need not be a builtin.
(function_untyped function_identifier: (ident) @function)
(function_typed function_identifier: (ident) @function)
(simple_rule rule_identifier: (ident) @function)
(lemma lemma_identifier: (ident) @function)
(diff_lemma lemma_identifier: (ident) @function)
(accountability_lemma lemma_identifier: (ident) @function)
(restriction restriction_identifier: (ident) @function)
(case_test test_identifier: (ident) @function)
(predicate predicate_identifier: (ident) @function)
(macro macro_identifier: (ident) @function)
(let let_identifier: (ident) @function)
(predefined_process process_identifier: (ident) @function)
(nary_app function_identifier: (ident) @function)
(binary_app function_identifier: (ident) @function)
(nullary_fun function_identifier: (ident) @function)
(predicate_ref predicate_identifier: (ident) @function)
(linear_fact fact_identifier: (ident) @function)
(persistent_fact fact_identifier: (ident) @function)

; Types, variables, and attributes
["msg" "pub" "fresh" "node" "nat" "ANY"] @type.builtin
(custom_var variable_type: (ident) @type)
(function_typed function_type: (ident) @type)
(temporal_var) @variable
(fresh_var) @variable
(pub_var) @variable
(nat_var) @variable
(msg_var_or_nullary_fun) @variable
(function_attribute) @attribute
(rule_attr "no_derivcheck" @attribute)
(rule_attr "issapicrule" @attribute)
["role" "color=" "colour="] @attribute
(rule_extended_attribute extended_attribute_name: (xattribute_ident) @attribute)
(lemma_attr) @attribute
(diff_lemma_attr) @attribute
(fact_annote) @attribute
(option) @attribute

; Proof methods and tactic filters
(proof_method) @keyword
(solved) @keyword
(mirrored) @keyword
(function_name) @function.builtin
(standard_proof_method_ranking) @constant
(post_ranking) @constant
(atom) @constant.builtin

; Operators and punctuation (ASCII and Unicode spellings)
[
  "&" "∧" "|" "∨" "||" "∥" "not" "¬"
  "=" "==>" "⇒" "<=>" "⇔" "<" ">" "(<)" "<<" "⊏"
  "+" "++" "%+" "*" "^" "XOR" "⊕"
  "!" "@" "#" "$" "~" "%" "last" "_restrict"
  "-->" "~~>" "▶"
] @operator
["(" ")" "[" "]" "{" "}" "--[" "]->"] @punctuation.bracket
["," ";" ":" "." "/"] @punctuation.delimiter

; Quoted names and opaque text are not logical formulas.
(pub_name) @string
(fresh_name) @string
(nat_name) @constant.numeric.integer
(natural) @constant.numeric.integer
(natural_subscript) @constant.numeric.integer
(hexcolor) @constant
(path) @string
(commandline) @string
(param) @string
(export_query) @string
(rule_role role_identifier: (ident) @string)

(single_comment) @comment.line
(multi_comment) @comment.block
(formal_comment) @comment.block
