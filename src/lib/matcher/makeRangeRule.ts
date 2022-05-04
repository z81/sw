import { RuleResult } from "../rule/result/result";
import { RuleTypes } from "../rule/ruleTypes";

export const makeRangeRule =
  <R extends string | number, T extends RuleTypes>(start: R, end: R, type: T) =>
  ([symbol]: string): RuleResult => {
    return symbol >= start && symbol <= end
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK",
        }
      : {
          type,
          error: "No",
          status: "ERROR",
        };
  };