import { RuleResult } from "../rule/result/result";
import { RuleTypes } from "../rule/ruleTypes";

export const makeSymbolRule =
  <T extends string, U extends RuleTypes>(type: U, symbol: T, priority = 0) =>
  ([codeSym]: string): RuleResult => {
    return codeSym === symbol
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK"
        }
      : {
          type,
          error: "No",
          status: "ERROR",
        };
  };
