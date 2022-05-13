import { Ctx } from '../rule/context';

export const makeRangeRule =
  <R extends string | number, T extends string>(start: R, end: R, type: T) =>
  ([symbol]: string, ctx: Ctx) => {
    if (symbol >= start && symbol <= end) {
      ctx.offset++;
      ctx.lineOffset++;

      return {
        value: symbol,
        type,
        length: 1,
        status: 'OK' as const,
      };
    }

    return {
      type,
      error: 'No',
      status: 'ERROR' as const,
    };
  };
