import { isOk } from "../result/ok";
import { Rule } from "../rule";

export const skip =
  <R extends Rule>(rule: R) =>
  (code: string) => {
    const res = rule(code);
    if (isOk(res)) {
      res.skip = true;
    }

    return res as never;
  };
