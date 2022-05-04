import { RuleResult } from "../rule/result/result";
import { RuleTypes } from "../rule/ruleTypes";

export const makeValueRule =
  <T extends string, U extends RuleTypes>(type: U, value: T) =>
  (code: string): RuleResult => {
    return code.substring(0, value.length) === value
      ? {
          value,
          type,
          length: value.length,
          status: "OK",
        }
      : {
          type,
          error: "No",
          status: "ERROR",
        };
  };
