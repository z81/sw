import { isOk } from "../result/ok";
import { Rule } from "../rule";
import { Ctx } from "../context";

export const skip =
  <R extends Rule>(rule: R) =>
  (code: string, ctx: Ctx) => {
    const res = rule(code, ctx);
    if (isOk(res)) {
      res.skip = true;
    }

    return res as never;
  };
