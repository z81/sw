import { makeRangeRule } from "../../lib/matcher/makeRangeRule";
import { makeSymbolRule } from "../../lib/matcher/makeSymbolRule";
import { key, as, or, and, maybe, skip, lazy, repeat, not } from "../../lib/rule/rules";
import { makeValueRule } from "../../lib/matcher/makeValuelRule";
import { Rule } from "../../lib/rule/rule";

const SPACE = makeSymbolRule("SPACE", " ");
const NEW_LINE = makeSymbolRule("NEW_LINE", "\n");

const PLUS = makeSymbolRule("PLUS", "+");
const MINUS = makeSymbolRule("MINUS", "-");
const MUL = makeSymbolRule("MUL", "*");
// const PIPE = makeValueRule("PIPE", "|>");

const BRACKET_OPEN = makeSymbolRule("BRACKET_OPEN", "(");
const BRACKET_CLOSE = makeSymbolRule("BRACKET_CLOSE", ")");

const DOT = makeSymbolRule("DOT", ".");

const SET = makeValueRule("SET", "set");
const DIGEST = makeRangeRule("0", "9", "DIGEST");
const AZ = or(makeRangeRule("a", "z", "AZ"), makeRangeRule("A", "Z", "AZ"));

const EQ = makeSymbolRule("EQ", "=");
const DIVM = makeValueRule("DIVM", "//");

const T_BR_LEFT = makeValueRule("T_BR_LEFT", "<");
const T_BR_RIGHT = makeValueRule("T_BR_RIGHT", ">");
const Q_BR_LEFT = makeValueRule("Q_BR_LEFT", "[");
const Q_BR_RIGHT = makeValueRule("Q_BR_RIGHT", "]");


const SINGLE_QUOTE = makeValueRule("SINGLE_QUOTE", "'");
const DOUBLE_QUOTE = makeValueRule("DOUBLE_QUOTE", "\"");
const BACK_QUOTE = makeValueRule("BACK_QUOTE", "`");

const BACK_SLASH = makeValueRule("BACK_SLASH", "\\");

const COMMA = makeValueRule("COMMA", ",");

const TRUE = makeValueRule("TRUE", "true");
const FALSE = makeValueRule("FALSE", "false");

const IF = makeValueRule("IF", "if");
const THEN = makeValueRule("THEN", "then");
const ELSE = makeValueRule("ELSE", "else");

const FOR = makeValueRule("FOR", "for");
const OF = makeValueRule("OF", "of");

const SCOPE_START = makeSymbolRule("SCOPE_START", "{");
const SCOPE_END = makeSymbolRule("SCOPE_END", "}");


const OPERATOR = as("OPERATOR", or(PLUS, MINUS, MUL, DIVM, T_BR_LEFT, T_BR_RIGHT));

const POS_INT = repeat(DIGEST);
const POS_FLOAT = as("POS_DOUBLE_NUM", or(and(POS_INT, DOT, POS_INT), POS_INT));
const NUMBER = as("NUMBER", and(maybe(MINUS), POS_FLOAT));

const EMPTY = or(SPACE, NEW_LINE);

const _ = skip(maybe(repeat(EMPTY)));

const SCOPE = as("SCOPE", and(
  _, SCOPE_START,
  _, key("body", lazy((): Rule => ROOT)),
  _, SCOPE_END,
  _,
));

const EXP_LAZY = lazy((): Rule => EXP);

const FUNCTION_CALL_ARGS = and(
  _,
  EXP_LAZY,
  _,
  COMMA,
  _,
);

const FUNCTION_CALL = as("FUNCTION_CALL", and(
  _,
  key("name", lazy((): Rule => VAR_NAME)),
  _,
  BRACKET_OPEN,
  _,
  key("args", or(
    and(repeat(FUNCTION_CALL_ARGS), EXP_LAZY),
    EXP_LAZY
  )),
  _,
  BRACKET_CLOSE,
  _,
));

const QUOTE = or(SINGLE_QUOTE, DOUBLE_QUOTE, BACK_QUOTE);

// prettier-ignore
const STRING = and(
  QUOTE,
  repeat(
    or(
      and(BACK_SLASH, QUOTE),
      not(QUOTE)
    )
  ),
  QUOTE
);

const BOOLEAN = as("BOOLEAN", or(TRUE, FALSE));

//
const IF_STAT = as(
  "IF",
  and(
    _,
    IF,
    _,
    key(
      "condition",
      lazy(() => EXP)
    ),
    _,
    key("then", or(
        and(
          skip(THEN),
          _,
          lazy(() => EXP)
        ),
        SCOPE
      )
    ),
    _,
    key(
      "else",
      maybe(
        and(
          skip(ELSE),
          _,
          lazy(() => EXP),
          _
        )
      )
    ),
    _,
  )
);

// prettier-ignore
const BIN_EXP = as(
  "BIN_EXP",
  and(
    _,
    key("left", NUMBER),
    _,
    key("operator", OPERATOR),
    _,
    key("right", lazy((): Rule => EXP)),
    _
  )
);

const LITERAL = or(NUMBER, STRING, BOOLEAN);

const EXP = or(
  BIN_EXP,
  LITERAL,
  lazy((): Rule => IF_STAT),
  lazy((): Rule => ARRAY),
  lazy((): Rule => FUNCTION_CALL),
  lazy((): Rule => VAR_NAME),
);

const VAR_NAME = repeat(or(AZ, DIGEST));

// prettier-ignore
const FORR = as("FOR", and(
  _, FOR, _, key("to", VAR_NAME), _, OF, _, key("from", VAR_NAME),
  _, key("body", SCOPE),
  _
));

// prettier-ignore
const ARRAY_ITEMS = and(
    _,
    EXP,
    _,
    COMMA,
    _,
);

// prettier-ignore
const ARRAY = as("ARRAY",
  and(
    _,
    Q_BR_LEFT,
    _,
    key("items", or(and(repeat(ARRAY_ITEMS), EXP), EXP)),
    _,
    Q_BR_RIGHT,
    _
  )
);

// prettier-ignore
const VAR = as(
  "VAR",
  and(
    _,
    skip(SET),
    _,
    key("name", VAR_NAME),
    _,
    key("operation", EQ),
    _,
    key("value", EXP),
    _
  )
);

const ALL = or(VAR, IF_STAT, FORR, FUNCTION_CALL, EXP);

const ROOT = repeat(ALL);

// prettier-ignore
export const grammar = as(
  "ROOT",
  and(key("body", repeat(ALL, true))),
  false
);
