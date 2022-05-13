import { isOk } from "../result/ok";
import { Rule } from "../rule";
import { Ctx } from "../context";

export const key =
  <R extends Rule, T extends string>(type: T, rule: R) =>
  (code: string, ctx: Ctx) => {
    const res = rule(code, ctx);
    if (isOk(res)) {
      res.key = type;
    }

    return res as ReturnType<R>;
  };
