import { isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";

export const skip =
  <R extends Rule>(rule: R) =>
  (code: string): RuleResult => {
    const res = rule(code);
    if (isOk(res)) {
      res.skip = true;
    }

    return res;
  };
