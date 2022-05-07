import { isOk } from "../result/ok";
import { Rule } from "../rule";

export const as =
  <R extends Rule, T extends string>(type: T, rule: R, up = true) =>
  (code: string) => {
    let res = rule(code);
    const len = isOk(res) ? res.length : undefined;

    if (up && isOk(res) && Array.isArray(res.value)) {
      if (res.value.length === 1) {
        res = res.value[0];
      } else if (
        res.value.every((t) => isOk(t) && isOk(res) && Array.isArray(res.value) && t.type === res.value?.[0].type)
      ) {
        res.length = res.value.reduce((a, b) => a + b.length, 0);
        res.value = res.value.map((_) => _.value).join("");
      }
    }

    let hasValueKey = false;
    const value =
      isOk(res) &&
      res.value &&
      (Array.isArray(res.value) ? res.value : [res.value]).filter?.((_) => {
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

    if (isOk(res) && Array.isArray(value) && value.length > 0 && !hasValueKey) {
      delete res.value;
    }

    if (isOk(res)) {
      res.length = len;
    }

    res.type = type;
    return res as ReturnType<R>;
  };
