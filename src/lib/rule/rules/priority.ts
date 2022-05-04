import { isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const priority =
  <R extends Rule>(priority: number, rule: R) =>
  (code: string): RuleResult => {
    const res = rule(code);
    if (isOk(res)) {
      res.priority = priority;
    }

    return res;
  };
