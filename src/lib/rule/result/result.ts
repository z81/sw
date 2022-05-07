import { Ok } from "./ok";
import { Error } from "./error";

export type RuleResult<T extends string = string, V extends unknown = unknown, E extends unknown = unknown> =
  | Ok<V, T>
  | Error<E, T>;


  
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
export type GetRuleRusult<T> = Exclude<{ [k in keyof T]: ReturnType<T[k]> }[keyof T], number | Function>;