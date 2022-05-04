import { Rule } from "../../lib/rule/rule";
import { makeRangeRule } from "../../lib/matcher/makeRangeRule";
import { makeSymbolRule } from "../../lib/matcher/makeSymbolRule";
import { key, as, or, and, maybe, skip, lazy, repeat, priority } from "../../lib/rule/rules";
import { makeValueRule } from "../../lib/matcher/makeValuelRule";
 

const space = makeSymbolRule("SPACE", " ");
const newLine = makeSymbolRule("NEW_LINE", "\n");

const plus = makeSymbolRule("PLUS", "+");
const minus = makeSymbolRule("MINUS", "-");
const mul = makeSymbolRule("MUL", "*");

const dot = makeSymbolRule("DOT", ".");

const eq = makeSymbolRule("EQ", "=");
const divm = makeValueRule("DIVM", "//");

const operator = as("OPERATOR", or(
  priority(1, plus), 
  priority(1, minus), 
  priority(2, mul), 
  priority(2, divm)
));

const set = makeValueRule("SET", "set");
const digest = makeRangeRule("0", "9", "DIGEST");
const az = makeRangeRule("a", "z", "AZ");
const positiveInt = repeat(digest);
const posWithFloat = as("POS_DOUBLE_NUM", or(and(positiveInt, dot, positiveInt), positiveInt));

const number = as("NUMBER", and(maybe(minus), posWithFloat));


const TRUE = makeValueRule("TRUE", "true");
const FALSE = makeValueRule("FALSE", "false");
const BOOLEAN = as("BOOLEAN", or(TRUE, FALSE));


const empty = or(space, newLine);

const _____ = skip(maybe(repeat(empty)));


// prettier-ignore
const BIN_EXP: Rule = as(
  "BIN_EXP",
  and(
    _____,
    key("left", number),
    _____,
    key("operator", operator),
    _____,
    key("right", or(
      lazy(() => BIN_EXP),
      number
    )),
    _____
  )
);

const VAR: Rule = as(
  "VAR",
  and(
    _____,
    skip(set),
    _____,
    key("name", az),
    _____,
    key("operation", eq),
    _____,
    key("value", or(BIN_EXP, number, BOOLEAN)), 
    _____
  )
);


// prettier-ignore
export const grammar = as(
  "ROOT",
  and(key("body", repeat(VAR))),
  false
);