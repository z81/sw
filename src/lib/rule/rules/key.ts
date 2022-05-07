import { isOk } from "../result/ok";
import { Rule } from "../rule";

export const key =
  <R extends Rule, T extends string>(type: T, rule: R) =>
  (code: string) => {
    const res = rule(code);
    if (isOk(res)) {
      res.key = type;
    }

    return res as ReturnType<R>;
  };
