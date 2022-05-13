import { Ctx } from '../rule/context';

export const makeSymbolRule =
  <T extends string, U extends string>(type: U, symbol: T) =>
  ([codeSym]: string, ctx: Ctx) => {
    const isOk = codeSym === symbol;

    if (isOk) {
      if (symbol === '\n') {
        ctx.lineOffset = 0;
        ctx.lines.add(ctx.offset);
      }

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
