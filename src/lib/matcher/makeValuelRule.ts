import { Ctx } from '../rule/context';

export const makeValueRule =
  <T extends string, U extends string>(type: U, value: T) =>
  (code: string, ctx: Ctx) => {
    if (code.substring(0, value.length) === value) {
      ctx.offset += value.length;
      ctx.lineOffset += value.length;

      return {
        value,
        type,
        length: value.length,
        status: 'OK' as const,
      };
    }

    return {
      type,
      error: 'No',
      status: 'ERROR' as const,
    };
  };
