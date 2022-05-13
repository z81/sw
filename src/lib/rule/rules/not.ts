import { isOk } from "../result/ok";
import { Rule } from "../rule";
import { Ctx } from "../context";
export const not =
  <T extends Rule>(rule: T) =>
  (code: string, ctx: Ctx) => {
    const res = rule(code, ctx);

    if (isOk(res)) {
      return {
        error: "NOT failed",
        type: "NOT",
        status: "ERROR"
      } as const;
    }

    return {
      value: code[0],
      type: "NOT",
      length: 1,
      status: "OK",
    } as const;
  };
