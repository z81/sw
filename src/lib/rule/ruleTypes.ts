export type TypeAliases =
  | "PLUS"
  | "MINUS"
  | "MUL"
  | "NEW_LINE"
  | "SPACE"
  | "OPERATOR"
  | "DIGEST"
  | "NUMBER"
  | "ROOT"
  | "DOT"
  | "POS_DOUBLE_NUM"
  | "EXP"
  | "BIN_EXP"
  | "SET"
  | "AZ"
  | "EQ"
  | "DIVM";

export type BaseTypes = "AND" | "OR" | "MAYBE" | "REPEAT";

export type RuleTypes = BaseTypes | TypeAliases;
