import { isOk } from "../result/ok";
import { RuleResult } from "../result/result";
import { Rule } from "../rule";
import { RuleTypes } from "../ruleTypes";

export const as =
  <R extends Rule, T extends RuleTypes>(type: T, rule: R, up = true) =>
  (code: string): RuleResult => {
    let res = rule(code);
    if (up && isOk(res) && Array.isArray(res.value)) {
      if (res.value.length === 1) {
        res = res.value[0];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else if (res.value.every((t) => isOk(t) && t.type === res.value?.[0].type)) {
        res.length = res.value.reduce((a, b) => a + b.length, 0);
        res.value = res.value.map((_) => _.value).join("");
      }
    }

    let hasValueKey = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = res.value && (Array.isArray(res.value) ? res.value : [res.value]).filter?.((_) => {
      if (_.key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res[_.key] = _;
        if (_.key === "value") {
          hasValueKey = true;
        }
        delete _.key;
        return true;
      }
      return false;
    });

 
    if (Array.isArray(value) && value.length > 0 && !hasValueKey) {
      // res.value = value.join("");
    // } else if (value?.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete res.value;
    }

    res.type = type;
    return res;
  };
