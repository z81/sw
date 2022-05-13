import { isOk } from '../result/ok';
import { Error } from '../result/error';
import { Rule } from '../rule';
import { GetRuleRusult } from '../result/result';
import { Ctx } from '../context';

export const or =
  <T extends Rule[]>(...rules: T) =>
  (code: string, ctx: Ctx) => {
    const errors: Error[] = [];

    for (const rule of rules) {
      const res = rule(code, ctx);
      if (isOk(res)) {
        return res as GetRuleRusult<T>;
      }
      errors.push(res);
    }

    return {
      type: 'OR',
      status: 'ERROR',
      error: `
Error on line ${ctx.lines.size}:${ctx.lineOffset}
Excepted some ${errors.map((e) => e.type)} found "${code.substring(0, 10)}"`,
    } as const;
  };
